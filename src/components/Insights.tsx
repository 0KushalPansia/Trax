import React, { useState } from 'react';
import {
  TrendingUp,
  Calendar,
  Flame,
  Award,
  Sparkles,
  PieChart,
  BarChart2,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Habit } from '../types/habit';
import {
  toDateString,
  calculatePeriodStats,
  calculateHabitConsistency,
  calculateStreaks,
  CATEGORY_META,
  parseDateString,
  isHabitScheduledForDate,
  isHabitCompletedOnDate,
} from '../utils/habitMath';

interface InsightsProps {
  habits: Habit[];
  onOpenNewHabit: () => void;
  weekStartMonday?: boolean;
}

export const Insights: React.FC<InsightsProps> = ({
  habits,
  onOpenNewHabit,
  weekStartMonday = true,
}) => {
  const todayStr = toDateString();
  const [consistencySort, setConsistencySort] = useState<'rate' | 'streak' | 'scheduled'>('rate');

  // Period stats
  const weeklyStats = calculatePeriodStats(habits, 7, todayStr);
  const monthlyStats = calculatePeriodStats(habits, 30, todayStr);
  const rhythmStats = calculatePeriodStats(habits, 14, todayStr);

  // Consistency metrics
  const consistencyMetrics = calculateHabitConsistency(habits, todayStr);

  // Streaks across all habits
  let topActiveStreak = 0;
  let topActiveHabit = '';
  let topAllTimeStreak = 0;
  let topAllTimeHabit = '';

  habits.forEach((h) => {
    const { currentStreak, bestStreak } = calculateStreaks(h, todayStr);
    if (currentStreak > topActiveStreak) {
      topActiveStreak = currentStreak;
      topActiveHabit = h.title;
    }
    if (bestStreak > topAllTimeStreak) {
      topAllTimeStreak = bestStreak;
      topAllTimeHabit = h.title;
    }
  });

  // Category distribution
  const categoryCounts: Record<string, number> = {};
  habits.forEach((h) => {
    const completions = Object.keys(h.completions || {}).length;
    categoryCounts[h.category] = (categoryCounts[h.category] || 0) + completions;
  });

  const totalCompletionsAllTime = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

  // 28-Day Activity Heatmap Matrix
  const heatmapDays: string[] = [];
  const ref = parseDateString(todayStr);
  for (let i = 27; i >= 0; i--) {
    const d = new Date(ref);
    d.setDate(d.getDate() - i);
    heatmapDays.push(toDateString(d));
  }

  // Sort consistency table
  const sortedConsistency = [...consistencyMetrics].sort((a, b) => {
    if (consistencySort === 'rate') return b.consistencyRate - a.consistencyRate;
    if (consistencySort === 'streak') return b.currentStreak - a.currentStreak;
    return b.scheduledDays - a.scheduledDays;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Habit Insights & Consistency
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Evidence-based summaries calculated strictly from your saved check-in records.
        </p>
      </div>

      {habits.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center mb-3">
            <Sparkles size={24} />
          </div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No Habit Data Available
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            Create routines and check them off to view authentic consistency metrics, rhythm charts, and heatmaps.
          </p>
          <div className="pt-4">
            <button
              onClick={onOpenNewHabit}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              Create First Habit
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Weekly Summary */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Weekly Completion</span>
                <TrendingUp size={14} className="text-indigo-500" />
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {weeklyStats.totalScheduled > 0 ? `${weeklyStats.completionRate}%` : '--'}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  ({weeklyStats.totalCompleted}/{weeklyStats.totalScheduled})
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all"
                  style={{ width: `${weeklyStats.completionRate}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2.5">
                Past 7 Days ({weeklyStats.startDate} – {weeklyStats.endDate})
              </p>
            </div>

            {/* Card 2: Monthly Summary */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Monthly Completion</span>
                <Calendar size={14} className="text-emerald-500" />
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {monthlyStats.totalScheduled > 0 ? `${monthlyStats.completionRate}%` : '--'}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  ({monthlyStats.totalCompleted}/{monthlyStats.totalScheduled})
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all"
                  style={{ width: `${monthlyStats.completionRate}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2.5">
                Past 30 Days ({monthlyStats.startDate} – {monthlyStats.endDate})
              </p>
            </div>

            {/* Card 3: Best Active Streak */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Active Streak Record</span>
                <Flame size={14} className="text-amber-500" />
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {topActiveStreak}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {topActiveStreak === 1 ? 'consecutive day' : 'consecutive days'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-4">
                {topActiveHabit || 'No active streak yet'}
              </p>
            </div>

            {/* Card 4: All-Time Best Streak */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>All-Time Best Streak</span>
                <Award size={14} className="text-violet-500" />
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {topAllTimeStreak}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {topAllTimeStreak === 1 ? 'day record' : 'days record'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-4">
                {topAllTimeHabit || 'Log check-ins to set records'}
              </p>
            </div>
          </div>

          {/* 14-Day Completion Rhythm Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart2 size={16} className="text-indigo-600 dark:text-indigo-400" />
                  <span>14-Day Completion Rhythm</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Daily completion percentages over the past two weeks. Unscheduled rest days are skipped without penalty.
                </p>
              </div>
            </div>

            {/* Scrollable rhythm container for mobile readability */}
            <div className="overflow-x-auto pb-2">
              <div className="flex items-end justify-between gap-2 min-w-[580px] h-36 pt-4 px-2">
                {rhythmStats.dailyBreakdown.map((day) => {
                  const isScheduled = day.scheduledCount > 0;
                  const isFull = day.rate === 100;

                  return (
                    <div key={day.dateStr} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[10px] font-semibold text-slate-400">
                        {isScheduled ? `${day.rate}%` : '—'}
                      </span>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg h-24 flex items-end overflow-hidden p-0.5">
                        {isScheduled ? (
                          <div
                            style={{ height: `${Math.max(8, day.rate)}%` }}
                            className={`w-full rounded-t-md transition-all ${
                              isFull ? 'bg-emerald-500' : 'bg-indigo-600'
                            }`}
                            title={`${day.dateStr}: ${day.completedCount}/${day.scheduledCount} completed`}
                          ></div>
                        ) : (
                          <div
                            className="w-full h-1 bg-slate-300 dark:bg-slate-600 rounded-full"
                            title={`${day.dateStr}: Rest day (0 scheduled)`}
                          ></div>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                        {day.dayLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 28-Day Activity Heatmap */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                28-Day Consistency Heatmap
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Four-week matrix showing check-in completion intensity.
              </p>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {heatmapDays.map((dateStr) => {
                let sched = 0;
                let comp = 0;
                habits.forEach((h) => {
                  if (isHabitScheduledForDate(h, dateStr, { allowInactive: true })) {
                    sched++;
                    if (isHabitCompletedOnDate(h, dateStr)) comp++;
                  }
                });

                const rate = sched > 0 ? Math.round((comp / sched) * 100) : 0;
                let bgClass = 'bg-slate-100 dark:bg-slate-800 text-slate-400';

                if (sched > 0) {
                  if (comp === 0) bgClass = 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400';
                  else if (rate < 50) bgClass = 'bg-indigo-200 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300';
                  else if (rate < 100) bgClass = 'bg-indigo-400 text-white';
                  else bgClass = 'bg-emerald-600 text-white font-bold';
                }

                const d = parseDateString(dateStr);
                const dayNum = d.getDate();

                return (
                  <div
                    key={dateStr}
                    title={`${dateStr}: ${sched > 0 ? `${comp}/${sched} completed (${rate}%)` : 'Rest day'}`}
                    className={`h-11 rounded-xl p-1.5 flex flex-col justify-between items-center text-xs transition-transform hover:scale-105 cursor-default ${bgClass}`}
                  >
                    <span className="text-[10px] opacity-75">{dayNum}</span>
                    <span className="text-[10px] font-semibold">
                      {sched > 0 ? `${rate}%` : '·'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800 mt-4">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-600"></span> 100%
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-indigo-400"></span> 50-99%
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-indigo-200"></span> 1-49%
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-rose-100 dark:bg-rose-950"></span> Missed
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-slate-100 dark:bg-slate-800"></span> Rest
                </span>
              </div>
              <span className="text-[10px]">Past 4 Weeks</span>
            </div>
          </div>

          {/* Habit Consistency Breakdown Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Habit Consistency Breakdown (Past 30 Days)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Review which habits you have sustained consistently over scheduled days.
                </p>
              </div>

              {/* Sort Switcher */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setConsistencySort('rate')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    consistencySort === 'rate'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Consistency
                </button>
                <button
                  onClick={() => setConsistencySort('streak')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    consistencySort === 'streak'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Streak
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3">Habit</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Cadence</th>
                    <th className="py-2.5 px-3 text-center">30-Day Rate</th>
                    <th className="py-2.5 px-3 text-center">Current Streak</th>
                    <th className="py-2.5 px-3 text-center">Best</th>
                    <th className="py-2.5 px-3 text-right">Assessment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {sortedConsistency.map((item) => {
                    const meta = CATEGORY_META[item.category] || CATEGORY_META.other;

                    let badgeColor = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
                    if (item.statusLabel === 'High Consistency') {
                      badgeColor = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400';
                    } else if (item.statusLabel === 'Building Habit') {
                      badgeColor = 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400';
                    } else if (item.statusLabel === 'Needs Attention') {
                      badgeColor = 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400';
                    }

                    return (
                      <tr key={item.habitId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{item.emoji}</span>
                          <span className="truncate max-w-[180px]">{item.habitTitle}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                          {meta.label.split(' ')[0]}
                        </td>
                        <td className="py-3 px-3 text-slate-500 dark:text-slate-400 capitalize">
                          {item.frequency}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {item.scheduledDays > 0 ? `${item.consistencyRate}%` : '--'}
                          </span>
                          <span className="text-[10px] text-slate-400 ml-1">
                            ({item.completedDays}/{item.scheduledDays})
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-semibold text-amber-600 dark:text-amber-400">
                          {item.currentStreak}d 🔥
                        </td>
                        <td className="py-3 px-3 text-center text-slate-500 dark:text-slate-400 font-medium">
                          {item.bestStreak}d
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeColor}`}>
                            {item.statusLabel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
