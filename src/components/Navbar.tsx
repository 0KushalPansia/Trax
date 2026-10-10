import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  BarChart3,
  Settings,
  Info,
  Plus,
  Sun,
  Moon,
  Sparkles,
  FileText,
} from 'lucide-react';
import { UserSettings } from '../types/habit';

export type NavSection = 'dashboard' | 'habits' | 'history' | 'insights' | 'settings' | 'about';

interface NavbarProps {
  currentSection: NavSection;
  onNavigate: (section: NavSection) => void;
  onOpenNewHabit: () => void;
  settings: UserSettings;
  onToggleTheme: () => void;
  onOpenDocs: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSection,
  onNavigate,
  onOpenNewHabit,
  settings,
  onToggleTheme,
  onOpenDocs,
}) => {
  const navItems: Array<{ id: NavSection; label: string; icon: React.ReactNode; keyNum: string }> = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, keyNum: '1' },
    { id: 'habits', label: 'My Habits', icon: <CheckSquare size={18} />, keyNum: '2' },
    { id: 'history', label: 'History', icon: <Calendar size={18} />, keyNum: '3' },
    { id: 'insights', label: 'Insights', icon: <BarChart3 size={18} />, keyNum: '4' },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} />, keyNum: '5' },
    { id: 'about', label: 'About TRAX', icon: <Info size={18} />, keyNum: '6' },
  ];

  return (
    <>
      {/* Desktop Sidebar (visible on md screens and up) */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0 select-none z-30 transition-colors">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black tracking-tighter text-lg shadow-sm">
              TX
            </div>
            <div>
              <h1 className="font-bold text-slate-900 dark:text-white tracking-tight leading-none text-base">
                TRAX
              </h1>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Student Habit Tracker
              </span>
            </div>
          </div>
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            title="Toggle theme (Shortcut: T)"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {settings.theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>

        {/* Quick New Habit Button */}
        <div className="p-4">
          <button
            onClick={onOpenNewHabit}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-sm transition-all active:scale-[0.98]"
          >
            <Plus size={16} />
            <span>New Habit</span>
            <kbd className="ml-auto text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white/90 font-mono">
              N
            </kbd>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                  {item.keyNum}
                </span>
              </button>
            );
          })}
        </nav>

        {/* YIIC Documentation Quick Launcher */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onOpenDocs}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <FileText size={15} className="text-indigo-500" />
            <span>YIIC Documentation</span>
            <span className="ml-auto text-[10px] bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded font-semibold">
              Docs
            </span>
          </button>
          <div className="mt-2 px-3 py-1.5 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
            <span>Offline-Ready</span>
            <span className="inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Local
            </span>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header (hidden on md and up) */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
            TX
          </div>
          <div>
            <h1 className="font-bold text-slate-900 dark:text-white leading-none text-sm">
              TRAX
            </h1>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              Habit Tracker
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDocs}
            aria-label="View YIIC Documentation"
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center gap-1 border border-slate-200 dark:border-slate-700"
          >
            <FileText size={14} className="text-indigo-500" />
            <span className="text-[11px] font-medium">Docs</span>
          </button>
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {settings.theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button
            onClick={onOpenNewHabit}
            aria-label="Create Habit"
            className="flex items-center gap-1 py-1.5 px-2.5 rounded-lg bg-indigo-600 text-white text-xs font-medium shadow-sm"
          >
            <Plus size={14} />
            <span>Add</span>
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (hidden on md and up) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-30 pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-6 h-14">
          {navItems.map((item) => {
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <span>{item.icon}</span>
                <span className="truncate max-w-[50px]">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
