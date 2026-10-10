import React from 'react';
import {
  CheckCircle2,
  Circle,
  Flame,
  Plus,
  Sparkles,
  RotateCcw,
  Calendar,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { Habit } from '../types/habit';
import {
  toDateString,
  formatDateDisplay,
  isHabitScheduledForDate,
  isHabitCompletedOnDate,
  getHabitProgressOnDate,
  calculateStreaks,
  calculatePeriodStats,
  CATEGORY_META,
} from '../utils/habitMath';

interface DashboardProps {
  habits: Habit[];
  onToggleHabit: (habitId: string, dateStr: string) => void;
  onIncrementHabit: (habitId: string, dateStr: string, delta: number) => void;
  onOpenNewHabit: () => void;
  onNavigateToHabits: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  habits,
  onToggleHabit,
  onIncrementHabit,
  onOpenNewHabit,
  onNavigateToHabits,
}) => {
  const todayStr = toDateString();
  const todayFormatted = formatDateDisplay(todayStr, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Time of day greeting
  const hour = new Date().getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
  else if (hour >= 17) greeting = 'Good evening';

  // Active habits scheduled for today
  const activeHabits = habits.filter((h) => h.status === 'active');
  const todayHabits = activeHabits.filter((h) => isHabitScheduledForDate(h, todayStr));

  // Partition into remaining and completed
  const remainingHabits = todayHabits.filter((h) => !isHabitCompletedOnDate(h, todayStr));
  const completedHabits = todayHabits.filter((h) => isHabitCompletedOnDate(h, todayStr));

  const totalToday = todayHabits.length;
  const completedToday = completedHabits.length;
  const todayPercentage = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  // Key metrics
  let bestActiveStreak = 0;
  let bestStreakHabitTitle = '';
  activeHabits.forEach((h) => {
    const { currentStreak } = calculateStreaks(h, todayStr);
    if (currentStreak > bestActiveStreak) {
      bestActiveStreak = currentStreak;
      bestStreakHabitTitle = h.title;
    }
  });

  const weeklyStats = calculatePeriodStats(habits, 7, todayStr);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner & Date Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-2">
            <Calendar size={13} />
            <span>{todayFormatted}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {greeting}, Scholar
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build personal momentum through consistent, atomic daily actions.
          </p>
        </div>

        <button
          onClick={onOpenNewHabit}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.98] shrink-0"
        >
          <Plus size={16} />
          <span>New Habit</span>
        </button>
      </div>

      {/* Real-Time Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Metric 1: Today's Completion */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-1.5">
            <span>Today's Progress</span>
            <CheckCircle2 size={16} className="text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {todayPercentage}%
            </span>
            <span className="text-xs text-slate-400 font-medium">
              ({completedToday}/{totalToday})
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${todayPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Metric 2: Best Active Streak */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-1.5">
            <span>Best Active Streak</span>
            <Flame size={16} className="text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {bestActiveStreak}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {bestActiveStreak === 1 ? 'day' : 'days'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-2">
            {bestStreakHabitTitle || 'Start your first streak today'}
          </p>
        </div>

        {/* Metric 3: 7-Day Consistency */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-1.5">
            <span>7-Day Consistency</span>
            <TrendingUp size={16} className="text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {weeklyStats.totalScheduled > 0 ? `${weeklyStats.completionRate}%` : '--'}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              ({weeklyStats.totalCompleted}/{weeklyStats.totalScheduled})
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            {weeklyStats.totalScheduled > 0
              ? `${weeklyStats.fullyCompletedDays} all-done days`
              : 'No scheduled tasks yet'}
          </p>
        </div>

        {/* Metric 4: Active Habits Total */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-1.5">
            <span>Active Habits</span>
            <Sparkles size={16} className="text-violet-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {activeHabits.length}
            </span>
            <span className="text-xs text-slate-400 font-medium">routines</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            {totalToday} scheduled today
          </p>
        </div>
      </div>

      {/* Main Checklist Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Today's Focus Checklist
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Check off routines as you complete them throughout your day.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
            {completedToday} of {totalToday} Done
          </span>
        </div>

        {/* Empty States */}
        {activeHabits.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
              <Sparkles size={24} />
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No habits created yet
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Get started by creating your first study, wellness, or focus habit. TRAX tracks your routines without noise or subscriptions.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenNewHabit}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
              >
                Create Your First Habit
              </button>
            </div>
          </div>
        ) : todayHabits.length === 0 ? (
          <div className="text-center py-10 px-4 space-y-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
              <AlertCircle size={20} />
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Scheduled Rest Day
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              You have active habits, but none are scheduled for today ({todayFormatted}). Enjoy your rest day or view your full list in My Habits.
            </p>
            <div className="pt-1">
              <button
                onClick={onNavigateToHabits}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                View My Habits
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* All-Done Celebration Banner */}
            {totalToday > 0 && remainingHabits.length === 0 && (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-3 animate-fadeIn">
                <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    All habits completed for today! 🎉
                  </h4>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    Excellent consistency. Your streaks are updated and your routine is intact.
                  </p>
                </div>
              </div>
            )}

            {/* Remaining Habits List */}
            {remainingHabits.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>Remaining</span>
                  <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] flex items-center justify-center text-slate-600 dark:text-slate-300">
                    {remainingHabits.length}
                  </span>
                </h4>
                <div className="space-y-2">
                  {remainingHabits.map((habit) => {
                    const { count, target } = getHabitProgressOnDate(habit, todayStr);
                    const { currentStreak } = calculateStreaks(habit, todayStr);
                    const meta = CATEGORY_META[habit.category] || CATEGORY_META.other;

                    return (
                      <div
                        key={habit.id}
                        className="group flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-850 transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {/* Toggle or multi-count check button */}
                          <button
                            onClick={() => onToggleHabit(habit.id, todayStr)}
                            className="w-7 h-7 rounded-lg border border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-400 hover:border-indigo-600 hover:text-indigo-600 dark:hover:border-indigo-400 transition-colors shrink-0"
                            aria-label={`Mark ${habit.title} completed`}
                          >
                            <Circle size={17} />
                          </button>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-base shrink-0">{habit.emoji}</span>
                              <h5 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                {habit.title}
                              </h5>
                              {habit.priority === 'high' && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 shrink-0">
                                  Core
                                </span>
                              )}
                            </div>
                            {habit.description && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                {habit.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Controls & Streaks */}
                        <div className="flex items-center gap-3 shrink-0 ml-3">
                          {/* Streak badge */}
                          {currentStreak > 0 && (
                            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                              <Flame size={12} />
                              {currentStreak}d
                            </span>
                          )}

                          {/* Target counter for multi-count goals */}
                          {target > 1 && (
                            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg text-xs">
                              <button
                                onClick={() => onIncrementHabit(habit.id, todayStr, -1)}
                                disabled={count <= 0}
                                className="w-5 h-5 rounded flex items-center justify-center text-slate-500 hover:text-slate-800 disabled:opacity-30"
                              >
                                -
                              </button>
                              <span className="font-semibold text-slate-800 dark:text-slate-200 min-w-[32px] text-center">
                                {count}/{target}
                              </span>
                              <button
                                onClick={() => onIncrementHabit(habit.id, todayStr, 1)}
                                className="w-5 h-5 rounded flex items-center justify-center text-slate-500 hover:text-slate-800"
                              >
                                +
                              </button>
                            </div>
                          )}

                          {/* Quick single-check trigger */}
                          <button
                            onClick={() => onToggleHabit(habit.id, todayStr)}
                            className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-indigo-400 text-xs font-semibold transition-all"
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Completed Habits List */}
            {completedHabits.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>Completed Today</span>
                  <span className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[10px] flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">
                    {completedHabits.length}
                  </span>
                </h4>
                <div className="space-y-2">
                  {completedHabits.map((habit) => {
                    const { currentStreak } = calculateStreaks(habit, todayStr);

                    return (
                      <div
                        key={habit.id}
                        className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/40 opacity-90 transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <button
                            onClick={() => onToggleHabit(habit.id, todayStr)}
                            className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs"
                            aria-label={`Undo completion for ${habit.title}`}
                          >
                            <CheckCircle2 size={17} />
                          </button>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-base shrink-0">{habit.emoji}</span>
                              <h5 className="text-sm font-semibold text-slate-700 dark:text-slate-300 line-through truncate">
                                {habit.title}
                              </h5>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 ml-3">
                          {currentStreak > 0 && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                              <Flame size={12} />
                              {currentStreak}d
                            </span>
                          )}

                          <button
                            onClick={() => onToggleHabit(habit.id, todayStr)}
                            title="Undo completion"
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium flex items-center gap-1"
                          >
                            <RotateCcw size={12} />
                            <span>Undo</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
