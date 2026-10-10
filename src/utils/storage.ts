import { Habit, UserSettings, ActivityLog, AccentColor } from '../types/habit';
import { toDateString } from './habitMath';

const STORAGE_KEYS = {
  HABITS: 'trax_habits_v1',
  SETTINGS: 'trax_settings_v1',
  ACTIVITY_LOGS: 'trax_activity_logs_v1',
};

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'light',
  accentColor: 'indigo',
  weekStart: 'monday',
  studentFocusMode: true,
  reminderTime: '20:00',
  displayName: 'Student Scholar',
};

export const ACCENT_PALETTE: Array<{ id: AccentColor; label: string; hex: string }> = [
  { id: 'indigo', label: 'Indigo', hex: '#6366f1' },
  { id: 'emerald', label: 'Emerald', hex: '#059669' },
  { id: 'blue', label: 'Blue', hex: '#2563eb' },
  { id: 'violet', label: 'Violet', hex: '#7c3aed' },
  { id: 'amber', label: 'Amber', hex: '#d97706' },
  { id: 'rose', label: 'Rose', hex: '#e11d48' },
];

export const StorageService = {
  getHabits(): Habit[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HABITS);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Failed to load habits from localStorage', e);
      return [];
    }
  },

  saveHabits(habits: Habit[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
    } catch (e) {
      console.error('Failed to save habits to localStorage', e);
      throw new Error('Storage write failed. Your browser storage might be full.');
    }
  },

  getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) return DEFAULT_SETTINGS;
      const parsed = JSON.parse(data);
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  },

  getActivityLogs(): ActivityLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  },

  logActivity(action: ActivityLog['action'], habitTitle: string, details?: string): void {
    try {
      const logs = this.getActivityLogs();
      const newLog: ActivityLog = {
        id: 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
        timestamp: new Date().toISOString(),
        action,
        habitTitle,
        details,
      };
      // Keep last 100 logs
      const updated = [newLog, ...logs].slice(0, 100);
      localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(updated));
    } catch (e) {
      // Non-blocking
    }
  },

  exportAsJson(): string {
    const backup = {
      app: 'TRAX Habit Tracker',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      habits: this.getHabits(),
      settings: this.getSettings(),
      activityLogs: this.getActivityLogs(),
    };
    return JSON.stringify(backup, null, 2);
  },

  exportAsCsv(): string {
    const habits = this.getHabits();
    const headers = [
      'Habit ID',
      'Habit Title',
      'Category',
      'Frequency',
      'Status',
      'Target Count',
      'Target Unit',
      'Created Date',
      'Check-in Date',
      'Completed Count',
      'Status On Date',
    ];

    const rows: string[][] = [headers];

    habits.forEach((habit) => {
      const completionDates = Object.keys(habit.completions || {}).sort();

      if (completionDates.length === 0) {
        rows.push([
          `"${habit.id}"`,
          `"${habit.title.replace(/"/g, '""')}"`,
          `"${habit.category}"`,
          `"${habit.frequency}"`,
          `"${habit.status}"`,
          String(habit.targetCount || 1),
          `"${habit.targetUnit || 'times'}"`,
          `"${habit.createdAt || ''}"`,
          '""',
          '0',
          '"No completions recorded"',
        ]);
      } else {
        completionDates.forEach((dateStr) => {
          const count = habit.completions[dateStr] || 0;
          const isDone = count >= (habit.targetCount || 1);
          rows.push([
            `"${habit.id}"`,
            `"${habit.title.replace(/"/g, '""')}"`,
            `"${habit.category}"`,
            `"${habit.frequency}"`,
            `"${habit.status}"`,
            String(habit.targetCount || 1),
            `"${habit.targetUnit || 'times'}"`,
            `"${habit.createdAt || ''}"`,
            `"${dateStr}"`,
            String(count),
            `"${isDone ? 'Completed' : 'Partial'}"`,
          ]);
        });
      }
    });

    return rows.map((r) => r.join(',')).join('\n');
  },

  importFromJson(jsonContent: string): { success: boolean; count: number; error?: string } {
    try {
      const parsed = JSON.parse(jsonContent);
      if (!parsed || !Array.isArray(parsed.habits)) {
        return { success: false, count: 0, error: 'Invalid backup file format: missing habits array.' };
      }

      // Validate basic habit shape
      const validHabits: Habit[] = parsed.habits.filter(
        (h: any) => h && typeof h.id === 'string' && typeof h.title === 'string'
      );

      this.saveHabits(validHabits);

      if (parsed.settings && typeof parsed.settings === 'object') {
        this.saveSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
      }

      this.logActivity('restore', 'All Habits', `Restored ${validHabits.length} habits from backup`);
      return { success: true, count: validHabits.length };
    } catch (e: any) {
      return { success: false, count: 0, error: e.message || 'Corrupted or unreadable JSON' };
    }
  },

  clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.HABITS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITY_LOGS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  },
};
