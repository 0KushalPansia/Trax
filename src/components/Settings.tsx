import React, { useState } from 'react';
import {
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Check,
  Moon,
  Sun,
  ShieldCheck,
  User,
  Clock,
  Sparkles,
  FileSpreadsheet,
  FileCode,
  AlertTriangle,
} from 'lucide-react';
import { UserSettings, AccentColor } from '../types/habit';
import { ACCENT_PALETTE, StorageService } from '../utils/storage';
import { getStudentSampleHabits } from '../utils/habitMath';

interface SettingsProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onLoadSampleData: () => void;
  onClearAllData: () => void;
  onTriggerToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const Settings: React.FC<SettingsProps> = ({
  settings,
  onUpdateSettings,
  onLoadSampleData,
  onClearAllData,
  onTriggerToast,
}) => {
  const [displayName, setDisplayName] = useState(settings.displayName || 'Student Scholar');
  const [reminderTime, setReminderTime] = useState(settings.reminderTime || '20:00');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({ displayName: displayName.trim(), reminderTime });
    onTriggerToast('Profile and preferences updated successfully', 'success');
  };

  const handleExportJson = () => {
    try {
      const jsonStr = StorageService.exportAsJson();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const today = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = `trax-backup-${today}.json`;
      a.click();
      URL.revokeObjectURL(url);
      onTriggerToast('JSON backup exported successfully', 'success');
    } catch (e: any) {
      onTriggerToast('Export failed: ' + e.message, 'error');
    }
  };

  const handleExportCsv = () => {
    try {
      const csvStr = StorageService.exportAsCsv();
      const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const today = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = `trax-habits-records-${today}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      onTriggerToast('Spreadsheet CSV records exported successfully', 'success');
    } catch (e: any) {
      onTriggerToast('CSV Export failed: ' + e.message, 'error');
    }
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = StorageService.importFromJson(content);
      if (res.success) {
        onTriggerToast(`Successfully restored ${res.count} habits from backup!`, 'success');
        window.location.reload();
      } else {
        onTriggerToast('Import failed: ' + (res.error || 'Invalid file'), 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 max-w-4xl">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Settings & Preferences
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Customize themes, manage schedule preferences, and export full habit records.
        </p>
      </div>

      {/* Visual Appearance & Theme */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Appearance & Theming
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Choose light or dark mode and your personal accent color.
          </p>
        </div>

        {/* Theme Mode Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onUpdateSettings({ theme: 'light' })}
            className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
              settings.theme === 'light'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Sun size={18} />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold">Daylight Mode (Light)</div>
              <div className="text-[11px] text-slate-500">Bright and clean daytime focus</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onUpdateSettings({ theme: 'dark' })}
            className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
              settings.theme === 'dark'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-950 text-indigo-400 flex items-center justify-center shrink-0">
              <Moon size={18} />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold">Night Study (Dark)</div>
              <div className="text-[11px] text-slate-500">Reduced eye strain for late-night study</div>
            </div>
          </button>
        </div>

        {/* Accent Color Palette */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Accessible Accent Color
          </label>
          <div className="flex flex-wrap gap-2.5">
            {ACCENT_PALETTE.map((pal) => {
              const isSelected = settings.accentColor === pal.id;
              return (
                <button
                  type="button"
                  key={pal.id}
                  onClick={() => onUpdateSettings({ accentColor: pal.id })}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                    isSelected
                      ? 'border-slate-800 dark:border-white ring-2 ring-slate-400/30 font-bold'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 flex items-center justify-center text-white"
                    style={{ backgroundColor: pal.hex }}
                  >
                    {isSelected && <Check size={10} strokeWidth={3} />}
                  </span>
                  <span>{pal.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Routine & Schedule Preferences */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Schedule & Cadence Settings
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Align calendar headers and focus modes with your academic timetable.
          </p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Week Start Day */}
            <div>
              <label htmlFor="pref-weekstart" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Preferred First Day of the Week
              </label>
              <select
                id="pref-weekstart"
                value={settings.weekStart}
                onChange={(e) => onUpdateSettings({ weekStart: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="monday">Monday (Academic Standard)</option>
                <option value="sunday">Sunday</option>
              </select>
            </div>

            {/* Display Name */}
            <div>
              <label htmlFor="pref-displayname" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Student Name / Greeting
              </label>
              <input
                id="pref-displayname"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Scholar, Maya, Alex"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Reminder Time */}
            <div>
              <label htmlFor="pref-reminder" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                <span>Daily Routine Target Time</span>
                <span className="text-[10px] text-slate-400 font-normal">Preference</span>
              </label>
              <input
                id="pref-reminder"
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Note: This is stored as your daily study preference. TRAX does not send intrusive push notifications without real permissions.
              </p>
            </div>

            {/* Student Focus Mode toggle */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Student Focus Mode
              </label>
              <div
                onClick={() => onUpdateSettings({ studentFocusMode: !settings.studentFocusMode })}
                className="cursor-pointer p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-800 hover:bg-slate-50"
              >
                <div className="text-[11px] text-slate-600 dark:text-slate-300">
                  Prioritize high-priority academic tasks at the top
                </div>
                <div
                  className={`w-9 h-5 rounded-full transition-colors flex items-center p-0.5 ${
                    settings.studentFocusMode ? 'bg-indigo-600 justify-end' : 'bg-slate-300 dark:bg-slate-600 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-xs"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              Save Profile Preferences
            </button>
          </div>
        </form>
      </div>

      {/* Data Controls & Portability */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-500" />
            <span>Data Ownership & Exports</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Your data is stored 100% locally on your device. Export at any time with zero vendor lock-in.
          </p>
        </div>

        {/* Explanations of Exports */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* JSON Export Card */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-1">
                <FileCode size={16} className="text-indigo-500" />
                <span>Full JSON Backup</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                Includes all habit definitions, cadence rules, categories, colors, targets, complete completion history, and personal settings. Use this to restore your data on any device.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportJson}
              className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all"
            >
              <Download size={13} />
              <span>Download JSON Backup</span>
            </button>
          </div>

          {/* CSV Export Card */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-1">
                <FileSpreadsheet size={16} className="text-emerald-500" />
                <span>Spreadsheet Records (CSV)</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                Exports tabular rows of every recorded check-in date, habit name, category, status, and completion count for analysis in Excel, Numbers, or Google Sheets.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportCsv}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <Download size={13} />
              <span>Download CSV Records</span>
            </button>
          </div>
        </div>

        {/* Restore Backup */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
          <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
            <Upload size={16} className="text-slate-400 shrink-0" />
            <span>Restore habits from a previous TRAX JSON backup:</span>
          </div>
          <label className="cursor-pointer px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 shrink-0">
            <span>Select JSON File</span>
            <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
          </label>
        </div>

        {/* Demo / Sample Data */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              Optional Student Sample Dataset
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Load realistic student habits (Lecture Notes Revision, Hydration, Active Reading) to explore TRAX features.
            </p>
          </div>
          <button
            type="button"
            onClick={onLoadSampleData}
            className="px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950/50 shrink-0"
          >
            Load Sample Habits
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-rose-200 dark:border-rose-950 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
          <AlertTriangle size={18} />
          <h3 className="text-sm font-bold">Danger Zone</h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Permanently clear all habit definitions, completion records, streaks, and preferences from this browser. This action cannot be undone unless you have a JSON backup.
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={onClearAllData}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-all"
          >
            Clear All Stored Data
          </button>
        </div>
      </div>
    </div>
  );
};
