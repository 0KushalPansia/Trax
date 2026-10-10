import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  RotateCcw,
  PlusCircle,
  Clock,
} from 'lucide-react';
import { Habit, ActivityLog } from '../types/habit';
import {
  toDateString,
  formatDateDisplay,
  parseDateString,
  isHabitScheduledForDate,
  isHabitCompletedOnDate,
  CATEGORY_META,
} from '../utils/habitMath';

interface HistoryProps {
  habits: Habit[];
  activityLogs: ActivityLog[];
  onToggleHabitOnDate: (habitId: string, dateStr: string) => void;
  weekStartMonday?: boolean;
}

export const History: React.FC<HistoryProps> = ({
  habits,
  activityLogs,
  onToggleHabitOnDate,
  weekStartMonday = true,
}) => {
  const todayStr = toDateString();
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);

  // Current calendar view month/year
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth()); // 0 - 11

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleGoToday = () => {
    const now = new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    setSelectedDateStr(todayStr);
  };

  // Build calendar matrix
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  let startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun, 1 = Mon ...
  if (weekStartMonday) {
    // Convert 0 (Sun) to 6, 1 (Mon) to 0, etc.
    startDayOfWeek = (startDayOfWeek + 6) % 7;
  }

  const calendarDays: Array<{ dateStr: string; dayNum: number; isCurrentMonth: boolean }> = [];

  // Leading empty slots
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push({ dateStr: '', dayNum: 0, isCurrentMonth: false });
  }

  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    const mStr = String(viewMonth + 1).padStart(2, '0');
    const dStr = String(d).padStart(2, '0');
    const dateStr = `${viewYear}-${mStr}-${dStr}`;
    calendarDays.push({ dateStr, dayNum: d, isCurrentMonth: true });
  }

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const weekHeaders = weekStartMonday
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Day Inspector data for selectedDateStr
  const scheduledOnSelected: Habit[] = [];
  const completedOnSelected: Habit[] = [];
  const missedOnSelected: Habit[] = [];

  habits.forEach((habit) => {
    const isScheduled = isHabitScheduledForDate(habit, selectedDateStr, { allowInactive: true });
    if (isScheduled) {
      scheduledOnSelected.push(habit);
      if (isHabitCompletedOnDate(habit, selectedDateStr)) {
        completedOnSelected.push(habit);
      } else {
        missedOnSelected.push(habit);
      }
    }
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            History & Calendar
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse completion records by day, inspect missed habits, and make retroactive check-ins.
          </p>
        </div>

        {/* Date Jump Control */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDateStr}
            onChange={(e) => {
              if (e.target.value) {
                setSelectedDateStr(e.target.value);
                const d = parseDateString(e.target.value);
                setViewYear(d.getFullYear());
                setViewMonth(d.getMonth());
              }
            }}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium"
          />
          <button
            onClick={handleGoToday}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
          >
            Today
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid (2 cols on large) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarIcon size={17} className="text-indigo-600 dark:text-indigo-400" />
              <span>{monthLabel}</span>
            </h3>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevMonth}
                aria-label="Previous month"
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNextMonth}
                aria-label="Next month"
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {weekHeaders.map((h) => (
              <span key={h} className="text-[11px] font-bold text-slate-400 uppercase py-1">
                {h}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarDays.map((cell, idx) => {
              if (!cell.isCurrentMonth) {
                return <div key={`empty-${idx}`} className="h-16 rounded-xl bg-transparent"></div>;
              }

              const isSelected = cell.dateStr === selectedDateStr;
              const isToday = cell.dateStr === todayStr;

              // Calculate scheduled and completed count for this cell
              let sched = 0;
              let comp = 0;
              habits.forEach((h) => {
                if (isHabitScheduledForDate(h, cell.dateStr, { allowInactive: true })) {
                  sched++;
                  if (isHabitCompletedOnDate(h, cell.dateStr)) {
                    comp++;
                  }
                }
              });

              let statusColor = 'text-slate-300 dark:text-slate-600';
              let badgeBg = '';
              if (sched > 0) {
                if (comp >= sched) {
                  statusColor = 'bg-emerald-500 text-white';
                  badgeBg = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400';
                } else if (comp > 0) {
                  statusColor = 'bg-amber-500 text-white';
                  badgeBg = 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400';
                } else {
                  statusColor = 'bg-rose-400 text-white';
                  badgeBg = 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400';
                }
              }

              return (
                <button
                  type="button"
                  key={cell.dateStr}
                  onClick={() => setSelectedDateStr(cell.dateStr)}
                  className={`h-16 p-1.5 rounded-xl border flex flex-col justify-between items-center transition-all ${
                    isSelected
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-950/30'
                      : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-850'
                  }`}
                >
                  <div className="w-full flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold ${
                        isToday
                          ? 'w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[11px]'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {cell.dayNum}
                    </span>
                    {sched > 0 && (
                      <span className={`text-[9px] px-1 rounded font-mono font-medium ${badgeBg}`}>
                        {comp}/{sched}
                      </span>
                    )}
                  </div>

                  {/* Dot status */}
                  <div className="flex items-center gap-1">
                    {sched === 0 ? (
                      <span className="text-[10px] text-slate-300 dark:text-slate-600">·</span>
                    ) : (
                      <span className={`w-2 h-2 rounded-full ${statusColor}`}></span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> All Done
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Partial
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span> Missed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-slate-400">·</span> Rest Day
              </span>
            </div>
            <span>Click any day to inspect</span>
          </div>
        </div>

        {/* Day Inspector Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
              Day Inspector Panel
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {formatDateDisplay(selectedDateStr, {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {scheduledOnSelected.length} habit{scheduledOnSelected.length === 1 ? '' : 's'} scheduled for this day
            </p>
          </div>

          {scheduledOnSelected.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No habits were scheduled for this calendar date.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Completed on Date */}
              <div>
                <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>✓ Completed ({completedOnSelected.length})</span>
                </h4>
                {completedOnSelected.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">None completed on this date</p>
                ) : (
                  <div className="space-y-1.5">
                    {completedOnSelected.map((habit) => (
                      <div
                        key={habit.id}
                        className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-sm shrink-0">{habit.emoji}</span>
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {habit.title}
                          </span>
                        </div>
                        <button
                          onClick={() => onToggleHabitOnDate(habit.id, selectedDateStr)}
                          title="Undo this completion record"
                          className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 flex items-center gap-1 shrink-0"
                        >
                          <RotateCcw size={10} />
                          <span>Undo</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Missed on Date */}
              <div>
                <h4 className="text-xs font-bold text-rose-500 dark:text-rose-400 uppercase tracking-wider mb-2">
                  ○ Missed on Scheduled Day ({missedOnSelected.length})
                </h4>
                {missedOnSelected.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">All scheduled habits were completed!</p>
                ) : (
                  <div className="space-y-1.5">
                    {missedOnSelected.map((habit) => (
                      <div
                        key={habit.id}
                        className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-850 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-sm shrink-0">{habit.emoji}</span>
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                            {habit.title}
                          </span>
                        </div>
                        <button
                          onClick={() => onToggleHabitOnDate(habit.id, selectedDateStr)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-indigo-400 text-[10px] font-semibold flex items-center gap-1 transition-colors shrink-0"
                        >
                          <PlusCircle size={11} />
                          <span>Check In</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Activity Log preview */}
          {activityLogs.length > 0 && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Clock size={12} />
                <span>Recent Activity Feed</span>
              </h4>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {activityLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="text-[11px] text-slate-500 dark:text-slate-400 flex items-baseline justify-between gap-2">
                    <span className="truncate">
                      <strong className="text-slate-700 dark:text-slate-300 capitalize">{log.action}:</strong> {log.habitTitle}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
