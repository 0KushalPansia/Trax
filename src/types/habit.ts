export type HabitCategory =
  | 'study'
  | 'health'
  | 'fitness'
  | 'personal'
  | 'work'
  | 'reading'
  | 'other';

export type HabitStatus = 'active' | 'paused' | 'archived';

export type HabitFrequency = 'daily' | 'weekdays' | 'weekends' | 'custom';

export interface Habit {
  id: string;
  title: string;
  description: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  customDays: number[]; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  targetCount: number;
  targetUnit: string;
  timeOfDay: 'anytime' | 'morning' | 'afternoon' | 'evening';
  priority: 'low' | 'medium' | 'high';
  color: string;
  emoji: string;
  createdAt: string; // YYYY-MM-DD
  status: HabitStatus;
  completions: Record<string, number>; // dateStr (YYYY-MM-DD) -> count
}

export type AccentColor = 'indigo' | 'emerald' | 'blue' | 'violet' | 'amber' | 'rose';

export interface UserSettings {
  theme: 'light' | 'dark';
  accentColor: AccentColor;
  weekStart: 'monday' | 'sunday';
  studentFocusMode: boolean;
  reminderTime: string; // e.g. "20:00"
  displayName: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: 'create' | 'edit' | 'complete' | 'undo' | 'archive' | 'pause' | 'restore' | 'delete';
  habitTitle: string;
  details?: string;
}

export interface PeriodStats {
  periodDays: number;
  startDate: string;
  endDate: string;
  totalScheduled: number;
  totalCompleted: number;
  completionRate: number; // 0 - 100
  fullyCompletedDays: number;
  scheduledDaysCount: number;
  hasSufficientData: boolean;
  dailyBreakdown: Array<{
    dateStr: string;
    dayLabel: string;
    dayOfWeek: number;
    scheduledCount: number;
    completedCount: number;
    rate: number;
  }>;
}

export interface HabitConsistencyMetric {
  habitId: string;
  habitTitle: string;
  emoji: string;
  color: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  status: HabitStatus;
  scheduledDays: number;
  completedDays: number;
  consistencyRate: number; // 0 - 100
  currentStreak: number;
  bestStreak: number;
  statusLabel: 'High Consistency' | 'Building Habit' | 'Needs Attention' | 'Starting Out';
}
