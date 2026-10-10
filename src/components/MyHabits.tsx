import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Pause,
  Play,
  Archive,
  RotateCcw,
  Trash2,
  Flame,
  CheckCircle2,
  Circle,
  Sparkles,
} from 'lucide-react';
import { Habit, HabitCategory, HabitStatus } from '../types/habit';
import {
  toDateString,
  CATEGORY_META,
  calculateStreaks,
  isHabitScheduledForDate,
  isHabitCompletedOnDate,
  parseDateString,
} from '../utils/habitMath';

interface MyHabitsProps {
  habits: Habit[];
  onOpenNewHabit: () => void;
  onEditHabit: (habit: Habit) => void;
  onToggleStatus: (habit: Habit, newStatus: HabitStatus) => void;
  onRequestDelete: (habit: Habit) => void;
  onToggleHabitToday: (habitId: string) => void;
}

export const MyHabits: React.FC<MyHabitsProps> = ({
  habits,
  onOpenNewHabit,
  onEditHabit,
  onToggleStatus,
  onRequestDelete,
  onToggleHabitToday,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<HabitStatus | 'all'>('active');
  const [sortBy, setSortBy] = useState<'recent' | 'streak' | 'alphabetical'>('recent');

  const todayStr = toDateString();

  // Micro 7-day dot trail dates (last 7 days)
  const last7Days: string[] = [];
  const ref = parseDateString(todayStr);
  for (let i = 6; i >= 0; i--) {
    const d = new Date(ref);
    d.setDate(d.getDate() - i);
    last7Days.push(toDateString(d));
  }

  // Counts for tabs
  const countActive = habits.filter((h) => h.status === 'active').length;
  const countPaused = habits.filter((h) => h.status === 'paused').length;
  const countArchived = habits.filter((h) => h.status === 'archived').length;
  const countAll = habits.length;

  // Filter habits
  const filteredHabits = habits.filter((habit) => {
    // Status tab filter
    if (activeTab !== 'all' && habit.status !== activeTab) {
      return false;
    }
    // Category filter
    if (selectedCategory !== 'all' && habit.category !== selectedCategory) {
      return false;
    }
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = habit.title.toLowerCase().includes(q);
      const matchDesc = habit.description && habit.description.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }
    return true;
  });

  // Sort habits
  const sortedHabits = [...filteredHabits].sort((a, b) => {
    if (sortBy === 'streak') {
      const streakA = calculateStreaks(a, todayStr).currentStreak;
      const streakB = calculateStreaks(b, todayStr).currentStreak;
      return streakB - streakA;
    }
    if (sortBy === 'alphabetical') {
      return a.title.localeCompare(b.title);
    }
    // 'recent' by creation date
    return (b.createdAt || '').localeCompare(a.createdAt || '');
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            My Habits
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your daily cadences, pause inactive routines, and view streaks.
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

      {/* Controls Bar: Tabs, Search, Category, Sort */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
          {[
            { id: 'active', label: 'Active', count: countActive },
            { id: 'paused', label: 'Paused', count: countPaused },
            { id: 'archived', label: 'Archived', count: countArchived },
            { id: 'all', label: 'All Habits', count: countAll },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Filter & Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search habits..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              {Object.entries(CATEGORY_META).map(([key, meta]) => (
                <option key={key} value={key}>
                  {meta.emoji} {meta.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="recent">Sort by: Recently Created</option>
              <option value="streak">Sort by: Highest Streak</option>
              <option value="alphabetical">Sort by: Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Habit Cards Grid */}
      {sortedHabits.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center mb-3">
            <Sparkles size={24} />
          </div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No habits found
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            {searchQuery || selectedCategory !== 'all'
              ? 'Try adjusting your search query or category filter.'
              : 'You have no habits in this tab. Click "New Habit" to begin.'}
          </p>
          <div className="pt-4">
            <button
              onClick={onOpenNewHabit}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              Add New Habit
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedHabits.map((habit) => {
            const meta = CATEGORY_META[habit.category] || CATEGORY_META.other;
            const { currentStreak, bestStreak } = calculateStreaks(habit, todayStr);
            const isDoneToday = isHabitCompletedOnDate(habit, todayStr);
            const isScheduledToday = isHabitScheduledForDate(habit, todayStr);

            return (
              <div
                key={habit.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 p-5 shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Header of Card */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                        style={{ backgroundColor: `${habit.color}15`, color: habit.color }}
                      >
                        {habit.emoji}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {habit.title}
                          </h3>
                        </div>
                        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                          {meta.label} • {habit.frequency}
                        </span>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div className="shrink-0 flex items-center gap-1.5">
                      {habit.status === 'paused' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
                          Paused
                        </span>
                      )}
                      {habit.status === 'archived' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                          Archived
                        </span>
                      )}
                      {habit.priority === 'high' && habit.status === 'active' && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                          Core
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {habit.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3.5">
                      {habit.description}
                    </p>
                  )}

                  {/* 7-Day Micro Heatmap Dot Trail */}
                  <div className="my-3 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium mb-1.5">
                      <span>Past 7 Days History</span>
                      <span className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Flame size={11} />
                        Streak: {currentStreak}d (Best: {bestStreak}d)
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      {last7Days.map((dStr) => {
                        const isScheduled = isHabitScheduledForDate(habit, dStr, { allowInactive: true });
                        const isDone = isHabitCompletedOnDate(habit, dStr);
                        const isToday = dStr === todayStr;
                        const dayLabel = parseDateString(dStr).toLocaleDateString('en-US', { weekday: 'narrow' });

                        return (
                          <div key={dStr} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-[9px] text-slate-400">{dayLabel}</span>
                            <div
                              title={`${dStr}: ${
                                !isScheduled ? 'Rest day' : isDone ? 'Completed' : 'Missed'
                              }`}
                              className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] transition-all ${
                                !isScheduled
                                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600'
                                  : isDone
                                  ? 'bg-emerald-600 text-white font-bold'
                                  : 'bg-slate-200/60 dark:bg-slate-700/60 text-slate-400'
                              } ${isToday ? 'ring-2 ring-indigo-500' : ''}`}
                            >
                              {isDone ? '✓' : isScheduled ? '·' : '—'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 mt-2">
                  {/* Today check-in button if active and scheduled */}
                  {habit.status === 'active' && isScheduledToday ? (
                    <button
                      onClick={() => onToggleHabitToday(habit.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isDoneToday
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                      }`}
                    >
                      {isDoneToday ? (
                        <>
                          <CheckCircle2 size={13} />
                          <span>Done Today</span>
                        </>
                      ) : (
                        <>
                          <Circle size={13} />
                          <span>Check In</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">
                      {habit.status !== 'active'
                        ? habit.status === 'paused' ? 'Paused' : 'Archived'
                        : 'Unscheduled today'}
                    </span>
                  )}

                  {/* Management Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditHabit(habit)}
                      title="Edit Habit"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>

                    {/* Pause / Resume */}
                    {habit.status === 'active' ? (
                      <button
                        onClick={() => onToggleStatus(habit, 'paused')}
                        title="Pause Habit (Preserves past records)"
                        className="p-1.5 rounded-lg text-amber-500 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                      >
                        <Pause size={14} />
                      </button>
                    ) : habit.status === 'paused' ? (
                      <button
                        onClick={() => onToggleStatus(habit, 'active')}
                        title="Resume Habit"
                        className="p-1.5 rounded-lg text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                      >
                        <Play size={14} />
                      </button>
                    ) : null}

                    {/* Archive / Restore */}
                    {habit.status !== 'archived' ? (
                      <button
                        onClick={() => onToggleStatus(habit, 'archived')}
                        title="Archive Habit"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Archive size={14} />
                      </button>
                    ) : (
                      <button
                        onClick={() => onToggleStatus(habit, 'active')}
                        title="Restore to Active"
                        className="p-1.5 rounded-lg text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                      >
                        <RotateCcw size={14} />
                      </button>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => onRequestDelete(habit)}
                      title="Delete Habit"
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
