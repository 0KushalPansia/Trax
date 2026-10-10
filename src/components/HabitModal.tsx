import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Habit, HabitCategory, HabitFrequency, HabitStatus } from '../types/habit';
import { CATEGORY_META, toDateString } from '../utils/habitMath';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habitData: Partial<Habit>) => void;
  editingHabit?: Habit | null;
}

const SWATCH_COLORS = [
  '#6366f1', // Indigo
  '#059669', // Emerald
  '#2563eb', // Blue
  '#7c3aed', // Violet
  '#d97706', // Amber
  '#ea580c', // Orange
  '#e11d48', // Rose
  '#db2777', // Pink
  '#0284c7', // Sky
  '#475569', // Slate
];

const EMOJI_OPTIONS = ['📚', '🧘', '💪', '🌱', '💼', '📖', '🎯', '💧', '🏃', '⏰', '🧠', '🎨', '🥗', '🚶'];

const DAYS_OF_WEEK = [
  { day: 1, label: 'Mon' },
  { day: 2, label: 'Tue' },
  { day: 3, label: 'Wed' },
  { day: 4, label: 'Thu' },
  { day: 5, label: 'Fri' },
  { day: 6, label: 'Sat' },
  { day: 0, label: 'Sun' },
];

export const HabitModal: React.FC<HabitModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingHabit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HabitCategory>('study');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [customDays, setCustomDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [targetCount, setTargetCount] = useState(1);
  const [targetUnit, setTargetUnit] = useState('times');
  const [timeOfDay, setTimeOfDay] = useState<'anytime' | 'morning' | 'afternoon' | 'evening'>('anytime');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [color, setColor] = useState('#6366f1');
  const [emoji, setEmoji] = useState('📚');
  const [status, setStatus] = useState<HabitStatus>('active');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingHabit) {
      setTitle(editingHabit.title);
      setDescription(editingHabit.description || '');
      setCategory(editingHabit.category);
      setFrequency(editingHabit.frequency);
      setCustomDays(editingHabit.customDays || [1, 2, 3, 4, 5]);
      setTargetCount(editingHabit.targetCount || 1);
      setTargetUnit(editingHabit.targetUnit || 'times');
      setTimeOfDay(editingHabit.timeOfDay || 'anytime');
      setPriority(editingHabit.priority || 'medium');
      setColor(editingHabit.color || '#6366f1');
      setEmoji(editingHabit.emoji || '📚');
      setStatus(editingHabit.status || 'active');
    } else {
      // Defaults for new habit
      setTitle('');
      setDescription('');
      setCategory('study');
      setFrequency('daily');
      setCustomDays([1, 2, 3, 4, 5]);
      setTargetCount(1);
      setTargetUnit('times');
      setTimeOfDay('anytime');
      setPriority('medium');
      setColor('#6366f1');
      setEmoji('📚');
      setStatus('active');
    }
    setError('');
  }, [editingHabit, isOpen]);

  if (!isOpen) return null;

  const handleCustomDayToggle = (dayNum: number) => {
    if (customDays.includes(dayNum)) {
      if (customDays.length === 1) {
        setError('At least one day must be selected for custom schedules.');
        return;
      }
      setCustomDays(customDays.filter((d) => d !== dayNum));
    } else {
      setCustomDays([...customDays, dayNum]);
    }
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Habit name is required.');
      return;
    }
    if (frequency === 'custom' && customDays.length === 0) {
      setError('Please select at least one day of the week.');
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      category,
      frequency,
      customDays,
      targetCount: Math.max(1, targetCount),
      targetUnit: targetUnit.trim() || 'times',
      timeOfDay,
      priority,
      color,
      emoji,
      status,
      createdAt: editingHabit?.createdAt || toDateString(),
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{emoji}</span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {editingHabit ? 'Edit Habit' : 'Create New Habit'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-medium border border-rose-200 dark:border-rose-900">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="habit-title" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Habit Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="habit-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Read 20 mins, Revise chemistry formulas"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="habit-desc" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Motivation or Instructions (Optional)
            </label>
            <input
              id="habit-desc"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Focus on active recall and practice problems"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="habit-category" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                id="habit-category"
                value={category}
                onChange={(e) => {
                  const cat = e.target.value as HabitCategory;
                  setCategory(cat);
                  setEmoji(CATEGORY_META[cat]?.emoji || '🎯');
                  setColor(CATEGORY_META[cat]?.color || '#6366f1');
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                {Object.entries(CATEGORY_META).map(([key, meta]) => (
                  <option key={key} value={key}>
                    {meta.emoji} {meta.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="habit-status" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Status
              </label>
              <select
                id="habit-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as HabitStatus)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="active">Active (On Schedule)</option>
                <option value="paused">Paused (On Hold)</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Frequency Cadence */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Frequency Schedule
            </label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {(['daily', 'weekdays', 'weekends', 'custom'] as HabitFrequency[]).map((f) => (
                <button
                  type="button"
                  key={f}
                  onClick={() => setFrequency(f)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium capitalize border transition-all ${
                    frequency === f
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {frequency === 'custom' && (
              <div className="flex gap-1.5 justify-between pt-1">
                {DAYS_OF_WEEK.map(({ day, label }) => {
                  const isSelected = customDays.includes(day);
                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => handleCustomDayToggle(day)}
                      className={`flex-1 py-1 rounded-md text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Target count & unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="habit-target-count" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Daily Target Goal
              </label>
              <input
                id="habit-target-count"
                type="number"
                min="1"
                max="999"
                value={targetCount}
                onChange={(e) => setTargetCount(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="habit-target-unit" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Unit of Measure
              </label>
              <input
                id="habit-target-unit"
                type="text"
                value={targetUnit}
                onChange={(e) => setTargetUnit(e.target.value)}
                placeholder="times, mins, pages, glasses"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Time of Day & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="habit-time-of-day" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Time Preference
              </label>
              <select
                id="habit-time-of-day"
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="anytime">Anytime</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
            </div>
            <div>
              <label htmlFor="habit-priority" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Priority
              </label>
              <select
                id="habit-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority (Exam/Core)</option>
              </select>
            </div>
          </div>

          {/* Emoji & Color Customization */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Icon & Colour
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  type="button"
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center border transition-all ${
                    emoji === e
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 scale-105'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {SWATCH_COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white shadow-xs transition-transform hover:scale-110"
                >
                  {color === c && <Check size={12} strokeWidth={3} />}
                </button>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              {editingHabit ? 'Save Changes' : 'Create Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
