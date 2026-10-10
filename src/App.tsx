import React, { useState, useEffect, useCallback } from 'react';
import { Habit, HabitStatus, UserSettings, ActivityLog } from './types/habit';
import { StorageService, DEFAULT_SETTINGS } from './utils/storage';
import {
  toDateString,
  getHabitProgressOnDate,
  getStudentSampleHabits,
} from './utils/habitMath';
import { Navbar, NavSection } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { MyHabits } from './components/MyHabits';
import { History } from './components/History';
import { Insights } from './components/Insights';
import { Settings } from './components/Settings';
import { About } from './components/About';
import { HabitModal } from './components/HabitModal';
import { ConfirmModal } from './components/ConfirmModal';
import { DocModal } from './components/DocModal';

export default function App() {
  const [currentSection, setCurrentSection] = useState<NavSection>('dashboard');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  // Modals state
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);

  // Confirm dialog state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    isDanger?: boolean;
    confirmLabel?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Toast state
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = useCallback((msg: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({ msg, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  }, []);

  // Initialize data on mount
  useEffect(() => {
    const loadedHabits = StorageService.getHabits();
    const loadedSettings = StorageService.getSettings();
    const loadedLogs = StorageService.getActivityLogs();

    setHabits(loadedHabits);
    setSettings(loadedSettings);
    setActivityLogs(loadedLogs);

    // Sync theme class
    if (loadedSettings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Update theme class whenever settings.theme changes
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    StorageService.saveSettings(settings);
  }, [settings]);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return;
      }

      if (e.key === 'Escape') {
        setIsHabitModalOpen(false);
        setIsDocModalOpen(false);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        return;
      }

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setEditingHabit(null);
        setIsHabitModalOpen(true);
        return;
      }

      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        setSettings((prev) => ({
          ...prev,
          theme: prev.theme === 'dark' ? 'light' : 'dark',
        }));
        return;
      }

      const keyToSection: Record<string, NavSection> = {
        '1': 'dashboard',
        '2': 'habits',
        '3': 'history',
        '4': 'insights',
        '5': 'settings',
        '6': 'about',
      };

      if (keyToSection[e.key]) {
        e.preventDefault();
        setCurrentSection(keyToSection[e.key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Habit operations
  const handleSaveHabit = (data: Partial<Habit>) => {
    let updated: Habit[];
    if (editingHabit) {
      // Update
      updated = habits.map((h) => {
        if (h.id === editingHabit.id) {
          return {
            ...h,
            ...data,
          } as Habit;
        }
        return h;
      });
      StorageService.logActivity('edit', data.title || editingHabit.title);
      showToast(`Updated "${data.title || editingHabit.title}"`, 'success');
    } else {
      // Create new
      const newHabit: Habit = {
        id: 'habit-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
        title: data.title || 'New Habit',
        description: data.description || '',
        category: data.category || 'study',
        frequency: data.frequency || 'daily',
        customDays: data.customDays || [1, 2, 3, 4, 5],
        targetCount: data.targetCount || 1,
        targetUnit: data.targetUnit || 'times',
        timeOfDay: data.timeOfDay || 'anytime',
        priority: data.priority || 'medium',
        color: data.color || '#6366f1',
        emoji: data.emoji || '📚',
        createdAt: toDateString(),
        status: data.status || 'active',
        completions: {},
      };
      updated = [newHabit, ...habits];
      StorageService.logActivity('create', newHabit.title);
      showToast(`Created new habit: "${newHabit.title}"`, 'success');
    }

    setHabits(updated);
    StorageService.saveHabits(updated);
    setActivityLogs(StorageService.getActivityLogs());
  };

  const handleToggleHabit = (habitId: string, dateStr: string) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    const { completed, target } = getHabitProgressOnDate(habit, dateStr);
    const updatedCompletions = { ...(habit.completions || {}) };

    if (completed) {
      // Undo completion
      delete updatedCompletions[dateStr];
      StorageService.logActivity('undo', habit.title, `Undid completion on ${dateStr}`);
      showToast(`Undid check-in for "${habit.title}"`, 'info');
    } else {
      // Mark as completed
      updatedCompletions[dateStr] = target;
      StorageService.logActivity('complete', habit.title, `Completed on ${dateStr}`);
      showToast(`Checked off "${habit.title}"! 🔥`, 'success');
    }

    const updated = habits.map((h) => (h.id === habitId ? { ...h, completions: updatedCompletions } : h));
    setHabits(updated);
    StorageService.saveHabits(updated);
    setActivityLogs(StorageService.getActivityLogs());
  };

  const handleIncrementHabit = (habitId: string, dateStr: string, delta: number) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    const { count } = getHabitProgressOnDate(habit, dateStr);
    const newCount = Math.max(0, count + delta);
    const updatedCompletions = { ...(habit.completions || {}) };

    if (newCount === 0) {
      delete updatedCompletions[dateStr];
    } else {
      updatedCompletions[dateStr] = newCount;
    }

    const updated = habits.map((h) => (h.id === habitId ? { ...h, completions: updatedCompletions } : h));
    setHabits(updated);
    StorageService.saveHabits(updated);
  };

  const handleToggleStatus = (habit: Habit, newStatus: HabitStatus) => {
    const updated = habits.map((h) => (h.id === habit.id ? { ...h, status: newStatus } : h));
    setHabits(updated);
    StorageService.saveHabits(updated);
    StorageService.logActivity(newStatus as any, habit.title);
    showToast(`Habit marked as ${newStatus}: "${habit.title}"`, 'info');
  };

  const handleDeleteHabit = (habit: Habit) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Habit Permanently?',
      message: `Are you sure you want to delete "${habit.title}"? All streak counts and historical records for this habit will be permanently deleted.`,
      isDanger: true,
      confirmLabel: 'Delete Habit',
      onConfirm: () => {
        const updated = habits.filter((h) => h.id !== habit.id);
        setHabits(updated);
        StorageService.saveHabits(updated);
        StorageService.logActivity('delete', habit.title);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast(`Deleted habit: "${habit.title}"`, 'info');
      },
    });
  };

  const handleLoadSampleData = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Load Student Sample Dataset?',
      message: 'This will add realistic student sample habits (Revision, Hydration, Reading) with historical records to explore TRAX features.',
      confirmLabel: 'Load Samples',
      onConfirm: () => {
        const samples = getStudentSampleHabits();
        const merged = [...samples, ...habits];
        setHabits(merged);
        StorageService.saveHabits(merged);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast('Sample student habits loaded!', 'success');
      },
    });
  };

  const handleClearAllData = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Clear All Stored Data?',
      message: 'Permanently remove all habits, completions, history, and settings from this browser? Export a JSON backup first if you want to keep your data.',
      isDanger: true,
      confirmLabel: 'Clear Everything',
      onConfirm: () => {
        StorageService.clearAllData();
        setHabits([]);
        setSettings(DEFAULT_SETTINGS);
        setActivityLogs([]);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        showToast('All stored data cleared', 'info');
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <Navbar
        currentSection={currentSection}
        onNavigate={(sec) => setCurrentSection(sec)}
        onOpenNewHabit={() => {
          setEditingHabit(null);
          setIsHabitModalOpen(true);
        }}
        settings={settings}
        onToggleTheme={() => {
          setSettings((prev) => ({
            ...prev,
            theme: prev.theme === 'dark' ? 'light' : 'dark',
          }));
        }}
        onOpenDocs={() => setIsDocModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full mb-16 md:mb-0">
        {currentSection === 'dashboard' && (
          <Dashboard
            habits={habits}
            onToggleHabit={handleToggleHabit}
            onIncrementHabit={handleIncrementHabit}
            onOpenNewHabit={() => {
              setEditingHabit(null);
              setIsHabitModalOpen(true);
            }}
            onNavigateToHabits={() => setCurrentSection('habits')}
          />
        )}

        {currentSection === 'habits' && (
          <MyHabits
            habits={habits}
            onOpenNewHabit={() => {
              setEditingHabit(null);
              setIsHabitModalOpen(true);
            }}
            onEditHabit={(h) => {
              setEditingHabit(h);
              setIsHabitModalOpen(true);
            }}
            onToggleStatus={handleToggleStatus}
            onRequestDelete={handleDeleteHabit}
            onToggleHabitToday={(id) => handleToggleHabit(id, toDateString())}
          />
        )}

        {currentSection === 'history' && (
          <History
            habits={habits}
            activityLogs={activityLogs}
            onToggleHabitOnDate={handleToggleHabit}
            weekStartMonday={settings.weekStart === 'monday'}
          />
        )}

        {currentSection === 'insights' && (
          <Insights
            habits={habits}
            onOpenNewHabit={() => {
              setEditingHabit(null);
              setIsHabitModalOpen(true);
            }}
            weekStartMonday={settings.weekStart === 'monday'}
          />
        )}

        {currentSection === 'settings' && (
          <Settings
            settings={settings}
            onUpdateSettings={(newSet) => setSettings((prev) => ({ ...prev, ...newSet }))}
            onLoadSampleData={handleLoadSampleData}
            onClearAllData={handleClearAllData}
            onTriggerToast={showToast}
          />
        )}

        {currentSection === 'about' && (
          <About onOpenDocs={() => setIsDocModalOpen(true)} />
        )}
      </main>

      {/* Reusable Habit Create/Edit Modal */}
      <HabitModal
        isOpen={isHabitModalOpen}
        onClose={() => {
          setIsHabitModalOpen(false);
          setEditingHabit(null);
        }}
        onSave={handleSaveHabit}
        editingHabit={editingHabit}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        isDanger={confirmModal.isDanger}
        confirmLabel={confirmModal.confirmLabel}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* YIIC Assignment Documentation Modal */}
      <DocModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
      />

      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-18 md:bottom-6 right-4 md:right-6 z-50 animate-slideUp">
          <div
            className={`px-4 py-2.5 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2 ${
              toast.type === 'success'
                ? 'bg-emerald-900/90 text-white border-emerald-700'
                : toast.type === 'error'
                ? 'bg-rose-900/90 text-white border-rose-700'
                : 'bg-slate-900/90 text-white border-slate-700'
            }`}
          >
            <span>{toast.msg}</span>
          </div>
        </div>
      )}
    </div>
  );
}
