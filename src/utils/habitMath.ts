import { Habit, PeriodStats, HabitConsistencyMetric } from '../types/habit';

/**
 * Format date as YYYY-MM-DD using local time
 */
export function toDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse YYYY-MM-DD into a Date object anchored at 12:00:00 (noon)
 * to avoid daylight saving time boundary shifts.
 */
export function parseDateString(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

/**
 * Friendly date format: e.g. "Saturday, Oct 10" or "Saturday, October 10, 2026"
 */
export function formatDateDisplay(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
  const date = parseDateString(dateStr);
  return date.toLocaleDateString('en-US', options || {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Category metadata: labels, icons, default accent colors
 */
export const CATEGORY_META: Record<string, { label: string; emoji: string; color: string }> = {
  study: { label: 'Study & Academics', emoji: '📚', color: '#6366f1' },
  health: { label: 'Health & Wellness', emoji: '🧘', color: '#10b981' },
  fitness: { label: 'Fitness & Sports', emoji: '💪', color: '#f59e0b' },
  personal: { label: 'Personal Growth', emoji: '🌱', color: '#8b5cf6' },
  work: { label: 'Work & Projects', emoji: '💼', color: '#3b82f6' },
  reading: { label: 'Reading & Knowledge', emoji: '📖', color: '#ec4899' },
  other: { label: 'Other Routines', emoji: '🎯', color: '#64748b' },
};

/**
 * Determines if a habit is scheduled for a given dateStr.
 * Respects cadence (daily, weekdays, weekends, custom).
 * Respects habit status (paused, archived) unless allowInactive is true.
 * Respects creation date (not scheduled before createdAt).
 */
export function isHabitScheduledForDate(
  habit: Habit,
  dateStr: string,
  options?: { allowInactive?: boolean }
): boolean {
  if (!habit) return false;

  // Not scheduled before creation date
  if (habit.createdAt && dateStr < habit.createdAt) {
    return false;
  }

  // Active status check unless bypassed for historical streak calculation
  if (!options?.allowInactive) {
    if (habit.status === 'archived' || habit.status === 'paused') {
      return false;
    }
  }

  const date = parseDateString(dateStr);
  const dayOfWeek = date.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

  switch (habit.frequency) {
    case 'daily':
      return true;
    case 'weekdays':
      return dayOfWeek >= 1 && dayOfWeek <= 5;
    case 'weekends':
      return dayOfWeek === 0 || dayOfWeek === 6;
    case 'custom':
      return Array.isArray(habit.customDays) && habit.customDays.includes(dayOfWeek);
    default:
      return true;
  }
}

/**
 * Checks if a habit is completed on dateStr.
 */
export function isHabitCompletedOnDate(habit: Habit, dateStr: string): boolean {
  if (!habit || !habit.completions) return false;
  const count = habit.completions[dateStr] || 0;
  const target = habit.targetCount || 1;
  return count >= target;
}

/**
 * Gets progress count for habit on dateStr.
 */
export function getHabitProgressOnDate(habit: Habit, dateStr: string): { count: number; target: number; completed: boolean } {
  const count = (habit && habit.completions && habit.completions[dateStr]) || 0;
  const target = (habit && habit.targetCount) || 1;
  return {
    count,
    target,
    completed: count >= target,
  };
}

/**
 * Calculate streaks strictly from saved records.
 * Rules:
 * - Unscheduled days do NOT break or penalize streaks.
 * - Today's scheduled day doesn't break yesterday's streak if not completed yet.
 * - Current streak and all-time best streak are calculated.
 */
export function calculateStreaks(habit: Habit, referenceDateStr: string = toDateString()): {
  currentStreak: number;
  bestStreak: number;
  totalCompletions: number;
} {
  if (!habit || !habit.completions) {
    return { currentStreak: 0, bestStreak: 0, totalCompletions: 0 };
  }

  const completionDates = Object.keys(habit.completions).filter(
    (d) => isHabitCompletedOnDate(habit, d)
  );
  const totalCompletions = completionDates.length;

  if (totalCompletions === 0) {
    return { currentStreak: 0, bestStreak: 0, totalCompletions: 0 };
  }

  // 1. Current Streak calculation:
  // Count backward from reference date.
  let currentStreak = 0;
  const refDate = parseDateString(referenceDateStr);
  const todayIsScheduled = isHabitScheduledForDate(habit, referenceDateStr, { allowInactive: true });
  const todayIsCompleted = isHabitCompletedOnDate(habit, referenceDateStr);

  let scanDate = new Date(refDate);

  if (todayIsScheduled && todayIsCompleted) {
    currentStreak = 1;
    scanDate.setDate(scanDate.getDate() - 1);
  } else if (!todayIsScheduled) {
    // If today is an unscheduled day, look back from yesterday
    scanDate.setDate(scanDate.getDate() - 1);
  } else {
    // Today is scheduled but not completed yet; look back from yesterday to see ongoing streak
    scanDate.setDate(scanDate.getDate() - 1);
  }

  // Scan backwards
  let daysScanned = 0;
  const maxScan = 365;

  while (daysScanned < maxScan) {
    const curDateStr = toDateString(scanDate);
    if (habit.createdAt && curDateStr < habit.createdAt) {
      break;
    }

    const scheduled = isHabitScheduledForDate(habit, curDateStr, { allowInactive: true });
    if (scheduled) {
      const completed = isHabitCompletedOnDate(habit, curDateStr);
      if (completed) {
        currentStreak++;
      } else {
        // Streak broken on a scheduled missed day
        break;
      }
    }
    // If not scheduled, bypass without penalty
    scanDate.setDate(scanDate.getDate() - 1);
    daysScanned++;
  }

  // 2. Best Streak calculation:
  // Walk chronologically from creation date up to reference date.
  let bestStreak = currentStreak;
  let runningStreak = 0;

  const startDate = habit.createdAt ? parseDateString(habit.createdAt) : parseDateString(completionDates.sort()[0]);
  const walkDate = new Date(startDate);

  while (walkDate <= refDate) {
    const curDateStr = toDateString(walkDate);
    const scheduled = isHabitScheduledForDate(habit, curDateStr, { allowInactive: true });

    if (scheduled) {
      const completed = isHabitCompletedOnDate(habit, curDateStr);
      if (completed) {
        runningStreak++;
        if (runningStreak > bestStreak) {
          bestStreak = runningStreak;
        }
      } else {
        runningStreak = 0;
      }
    }
    walkDate.setDate(walkDate.getDate() + 1);
  }

  return {
    currentStreak,
    bestStreak,
    totalCompletions,
  };
}

/**
 * Calculates period stats (e.g. 7 days or 30 days) from real habits and actual schedules.
 * Never counts unscheduled days as missed.
 */
export function calculatePeriodStats(
  habits: Habit[],
  periodDays: number,
  referenceDateStr: string = toDateString()
): PeriodStats {
  const refDate = parseDateString(referenceDateStr);
  const dailyBreakdown: PeriodStats['dailyBreakdown'] = [];

  let totalScheduled = 0;
  let totalCompleted = 0;
  let fullyCompletedDays = 0;
  let scheduledDaysCount = 0;

  // Build dates list in chronological order
  const dates: string[] = [];
  for (let i = periodDays - 1; i >= 0; i--) {
    const d = new Date(refDate);
    d.setDate(d.getDate() - i);
    dates.push(toDateString(d));
  }

  const startDate = dates[0] || referenceDateStr;
  const endDate = dates[dates.length - 1] || referenceDateStr;

  dates.forEach((dateStr) => {
    const dObj = parseDateString(dateStr);
    let dayScheduled = 0;
    let dayCompleted = 0;

    habits.forEach((habit) => {
      // Check scheduling allowing inactive if completions exist on that date
      const scheduled = isHabitScheduledForDate(habit, dateStr, { allowInactive: true });
      if (scheduled) {
        dayScheduled++;
        if (isHabitCompletedOnDate(habit, dateStr)) {
          dayCompleted++;
        }
      }
    });

    totalScheduled += dayScheduled;
    totalCompleted += dayCompleted;

    if (dayScheduled > 0) {
      scheduledDaysCount++;
      if (dayCompleted >= dayScheduled) {
        fullyCompletedDays++;
      }
    }

    const rate = dayScheduled > 0 ? Math.round((dayCompleted / dayScheduled) * 100) : 0;

    dailyBreakdown.push({
      dateStr,
      dayLabel: dObj.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' }),
      dayOfWeek: dObj.getDay(),
      scheduledCount: dayScheduled,
      completedCount: dayCompleted,
      rate,
    });
  });

  const completionRate = totalScheduled > 0 ? Math.round((totalCompleted / totalScheduled) * 100) : 0;
  const hasSufficientData = totalScheduled >= Math.min(3, periodDays);

  return {
    periodDays,
    startDate,
    endDate,
    totalScheduled,
    totalCompleted,
    completionRate,
    fullyCompletedDays,
    scheduledDaysCount,
    hasSufficientData,
    dailyBreakdown,
  };
}

/**
 * Calculates consistency breakdown metrics for each habit across the past 30 days.
 */
export function calculateHabitConsistency(
  habits: Habit[],
  referenceDateStr: string = toDateString()
): HabitConsistencyMetric[] {
  const refDate = parseDateString(referenceDateStr);
  const periodDays = 30;

  return habits.map((habit) => {
    let scheduledDays = 0;
    let completedDays = 0;

    for (let i = periodDays - 1; i >= 0; i--) {
      const d = new Date(refDate);
      d.setDate(d.getDate() - i);
      const dateStr = toDateString(d);

      if (isHabitScheduledForDate(habit, dateStr, { allowInactive: true })) {
        scheduledDays++;
        if (isHabitCompletedOnDate(habit, dateStr)) {
          completedDays++;
        }
      }
    }

    const consistencyRate = scheduledDays > 0 ? Math.round((completedDays / scheduledDays) * 100) : 0;
    const { currentStreak, bestStreak } = calculateStreaks(habit, referenceDateStr);

    let statusLabel: HabitConsistencyMetric['statusLabel'] = 'Starting Out';
    if (scheduledDays < 3) {
      statusLabel = 'Starting Out';
    } else if (consistencyRate >= 80) {
      statusLabel = 'High Consistency';
    } else if (consistencyRate >= 50) {
      statusLabel = 'Building Habit';
    } else {
      statusLabel = 'Needs Attention';
    }

    return {
      habitId: habit.id,
      habitTitle: habit.title,
      emoji: habit.emoji,
      color: habit.color,
      category: habit.category,
      frequency: habit.frequency,
      status: habit.status,
      scheduledDays,
      completedDays,
      consistencyRate,
      currentStreak,
      bestStreak,
      statusLabel,
    };
  });
}

/**
 * Curated Student Starter Dataset (Optional demo data)
 */
export function getStudentSampleHabits(): Habit[] {
  const today = toDateString();
  const past = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return toDateString(d);
  };

  return [
    {
      id: 'sample-study-revision',
      title: 'Review Class Notes & Revision',
      description: 'Spend 25 minutes reviewing key lecture topics and summary cards.',
      category: 'study',
      frequency: 'weekdays',
      customDays: [1, 2, 3, 4, 5],
      targetCount: 1,
      targetUnit: 'session',
      timeOfDay: 'afternoon',
      priority: 'high',
      color: '#6366f1',
      emoji: '📚',
      createdAt: past(10),
      status: 'active',
      completions: {
        [past(4)]: 1,
        [past(3)]: 1,
        [past(2)]: 1,
        [past(1)]: 1,
        [today]: 1,
      },
    },
    {
      id: 'sample-hydration',
      title: 'Drink 2 Litres of Water',
      description: 'Stay focused and hydrated throughout study hours.',
      category: 'health',
      frequency: 'daily',
      customDays: [0, 1, 2, 3, 4, 5, 6],
      targetCount: 4,
      targetUnit: 'glasses (500ml)',
      timeOfDay: 'anytime',
      priority: 'medium',
      color: '#10b981',
      emoji: '💧',
      createdAt: past(14),
      status: 'active',
      completions: {
        [past(6)]: 4,
        [past(5)]: 4,
        [past(4)]: 3,
        [past(3)]: 4,
        [past(2)]: 4,
        [past(1)]: 4,
      },
    },
    {
      id: 'sample-reading',
      title: 'Active Reading / Articles',
      description: 'Read 15 pages of textbook or non-fiction book.',
      category: 'reading',
      frequency: 'daily',
      customDays: [0, 1, 2, 3, 4, 5, 6],
      targetCount: 15,
      targetUnit: 'pages',
      timeOfDay: 'evening',
      priority: 'medium',
      color: '#ec4899',
      emoji: '📖',
      createdAt: past(7),
      status: 'active',
      completions: {
        [past(2)]: 15,
        [past(1)]: 15,
      },
    },
  ];
}
