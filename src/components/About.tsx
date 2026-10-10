import React from 'react';
import {
  BookOpen,
  Shield,
  Keyboard,
  Sparkles,
  FileText,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface AboutProps {
  onOpenDocs: () => void;
}

export const About: React.FC<AboutProps> = ({ onOpenDocs }) => {
  return (
    <div className="space-y-6 animate-fadeIn pb-12 max-w-4xl">
      {/* Hero Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles size={13} />
            <span>TRAX Philosophy</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            About TRAX
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            A fast, distraction-free habit tracker created for students and busy people balancing academics, routines, and life.
          </p>
        </div>

        <button
          onClick={onOpenDocs}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all shrink-0"
        >
          <FileText size={15} />
          <span>View YIIC Assignments</span>
        </button>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Principle 1 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
            01
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            The 2-Minute Rule
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            When starting a new study or fitness routine, scale it down until it takes two minutes or less. Consistency comes before optimization.
          </p>
        </div>

        {/* Principle 2 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
            02
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Habit Stacking
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Attach new routines to established anchors. For example: <em>"After I sit down with my morning tea, I will review yesterday's chemistry formula card."</em>
          </p>
        </div>

        {/* Principle 3 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm">
            03
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Never Miss Twice
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Life happens, exam schedules shift, and days get missed. What separates successful routines from abandoned ones is recovering on the very next scheduled cycle.
          </p>
        </div>
      </div>

      {/* Privacy Guarantee */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white">
          <Shield size={18} className="text-emerald-500" />
          <h3 className="text-sm font-bold">Privacy & Student Respect Guarantee</h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          TRAX is designed to protect your focus and your data. It does not contain behavioral tracking scripts, third-party analytics pixels, intrusive ads, or locked subscription tiers. All data is saved strictly in your browser's private storage, with full JSON and CSV export capabilities.
        </p>
      </div>

      {/* Keyboard Shortcuts Reference */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white">
          <Keyboard size={18} className="text-indigo-500" />
          <h3 className="text-sm font-bold">Keyboard Navigation Shortcuts</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {[
            { key: '1 – 6', desc: 'Jump to Section' },
            { key: 'N', desc: 'Create New Habit' },
            { key: 'T', desc: 'Toggle Day/Night Theme' },
            { key: 'Esc', desc: 'Close Open Dialogs' },
          ].map((item) => (
            <div key={item.key} className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <kbd className="text-xs font-mono font-bold bg-white dark:bg-slate-700 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 shadow-2xs">
                {item.key}
              </kbd>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
