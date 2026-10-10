import React, { useState } from 'react';
import { X, BookOpen, FileText, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';

interface DocModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocModal: React.FC<DocModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'a1' | 'a2' | 'a3' | 'a4' | 'a5'>('a1');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyText = () => {
    // Copies active tab text
    const textElem = document.getElementById('yiic-content-area');
    if (textElem) {
      navigator.clipboard.writeText(textElem.innerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <FileText size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                YIIC Internship Assignment Documentation
              </h2>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Project TRAX • Class 12 / Student Level
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5"
            >
              {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy Section'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 bg-slate-50/50 dark:bg-slate-850/50 overflow-x-auto shrink-0">
          {[
            { id: 'a1', label: '1. Problem Discovery' },
            { id: 'a2', label: '2. Prompt to Prototype' },
            { id: 'a3', label: '3. Idea to Product' },
            { id: 'a4', label: '4. Customer Validation' },
            { id: 'a5', label: '5. Pitch & Business Model' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div id="yiic-content-area" className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-700 dark:text-slate-300 flex-1">
          {activeTab === 'a1' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900 text-indigo-900 dark:text-indigo-200 font-medium">
                <strong>Assignment 1: Problem Discovery</strong> — Answering the five core questions on identifying the personal and student routine tracking friction.
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    1. What problem have I personally noticed?
                  </h4>
                  <p>
                    As a student balancing school coursework, exam revision, extracurricular activities, and personal well-being, I constantly struggled to maintain daily habits. I would enthusiastically begin positive routines—such as reviewing formulas every afternoon, reading 15 pages before bed, or drinking enough water—only to lose consistency after 3 or 4 days. The core issue was not a lack of good intentions, but the absence of a simple, friction-free way to track daily actions and visualize actual momentum without wasting study time setting up complicated apps.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    2. Who else may have this problem, and what evidence do I actually have?
                  </h4>
                  <p>
                    Other school students, exam aspirants (preparing for board exams or entrance tests), and busy young people juggling tight schedules face this exact issue.
                    <br /><br />
                    <em>Evidence status:</em> Based on personal observation of classmates and informal conversations with peers who regularly mention buying planners or downloading habit apps on January 1st or at the start of a semester, only to abandon them within a week because they felt like an extra chore. Note: This evidence comes from direct peer interactions and personal experience; no fabricated surveys or scientific statistics are claimed.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    3. What do people currently do, and why might those solutions be insufficient?
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 mt-1">
                    <li><strong>Paper notebooks / diaries:</strong> Easy to misplace, bulky to carry everywhere, tedious to calculate streaks or progress over time, and easy to neglect when busy.</li>
                    <li><strong>Phone calendars:</strong> Geared toward events with rigid start/end times rather than flexible daily routines; causes notification fatigue.</li>
                    <li><strong>Basic alarm/reminder apps:</strong> Very easy to swipe away and ignore; provide zero visual tracking of consistency or historical momentum.</li>
                    <li><strong>Spreadsheets (Excel / Google Sheets):</strong> Difficult to use on a phone, require manual formula maintenance, and create high friction just to record a 10-second check-in.</li>
                    <li><strong>Commercial habit apps:</strong> Often lock essential features behind costly monthly subscriptions, push intrusive ads, demand complex setups, or introduce overwhelming gamification.</li>
                  </ul>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    4. What is the TRAX solution?
                  </h4>
                  <p>
                    TRAX is a fast, distraction-free habit-tracking web application designed specifically for students and busy people. It provides:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 mt-1">
                    <li>A clean daily checklist separating remaining and completed tasks.</li>
                    <li>One-tap check-ins with an instant undo option for mistakes.</li>
                    <li>Schedule-aware streak calculations that never penalize users for scheduled rest days (e.g., weekend breaks on weekday study routines).</li>
                    <li>An interactive monthly calendar history and transparent 14-day and 28-day consistency insights.</li>
                    <li>Privacy-first local storage with full JSON and CSV export capabilities, working on desktop, tablet, and mobile browsers with zero ads or subscriptions.</li>
                  </ul>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    5. Why might TRAX be viable, who might want it, and why might they choose it over current alternatives?
                  </h4>
                  <p>
                    <strong>Viability:</strong> Built using standard web technologies with lightweight client-side execution, TRAX incurs zero server upkeep costs for standard local use and loads instantaneously on any modern browser.
                    <br /><br />
                    <strong>Audience:</strong> High school and college students, exam revision groups, and busy young adults who want quick routine structure.
                    <br /><br />
                    <strong>Why choose TRAX:</strong> Speed, complete data privacy, no forced account sign-ups, no ads, student-tailored categories (Study, Health, Fitness, Reading), and non-punitive streak logic that respects student study schedules.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'a2' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900 text-indigo-900 dark:text-indigo-200 font-medium">
                <strong>Assignment 2: Prompt to Prototype</strong> — The first entrepreneurial-advisor prompt, assumptions to test, and validation roadmap.
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    First Entrepreneurial-Advisor Prompt
                  </h4>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-800 dark:text-slate-200 select-all">
                    "I am a Class 12 student building a web application called TRAX to help students and busy people build and maintain positive daily habits (like study blocks, revision, hydration, and sleep). I notice students struggle with consistency and existing apps are either too complicated, full of ads, or locked behind paywalls. Act as an entrepreneurial advisor: What are the core assumptions behind this idea, how can I build a minimal prototype to test them, and what are the most critical risks I need to address first?"
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    Core Assumptions to Test
                  </h4>
                  <ul className="list-disc pl-4 space-y-1">
                    <li><strong>Assumption 1 (Problem Value):</strong> Students actively want to track their daily habits and believe visual records improve consistency.</li>
                    <li><strong>Assumption 2 (Simplicity Preference):</strong> Students prefer a rapid 30-second daily checklist over heavy gamification, social feeds, or complex RPG systems.</li>
                    <li><strong>Assumption 3 (Schedule Flexibility):</strong> Non-penalizing streak calculations for scheduled rest days encourage students to keep going rather than quitting after a single missed day.</li>
                    <li><strong>Assumption 4 (Data Ownership):</strong> Students value having full ownership of their data (exportable to CSV/JSON) without compulsory cloud accounts or tracking.</li>
                  </ul>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    Next Steps for Validating the Idea & Improving the Product
                  </h4>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Build and deploy the lightweight web prototype (completed).</li>
                    <li>Conduct structured testing with 5–10 students over a 7-day period (planned).</li>
                    <li>Observe if students remember to check in daily and note where friction occurs.</li>
                    <li>Refine mobile ergonomics and custom cadences based on direct user feedback.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'a3' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900 text-indigo-900 dark:text-indigo-200 font-medium">
                <strong>Assignment 3: Idea to Product</strong> — Product architecture, features, testing methods, feedback loops, and metrics.
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    Target Users
                  </h4>
                  <p>
                    Primary users are high school students (Classes 9–12), college students, and exam revision candidates with multi-subject schedules. Secondary users are young professionals and busy individuals seeking a calm routine manager.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    Product Features
                  </h4>
                  <ul className="list-disc pl-4 space-y-1">
                    <li><strong>Dashboard:</strong> Today's scheduled habits, completion percentage, progress track, remaining vs. completed groups, active streaks, and quick add.</li>
                    <li><strong>My Habits:</strong> CRUD operations, categories, frequency (daily, weekdays, weekends, custom), daily targets, pause/resume, and archive/restore with full history preservation.</li>
                    <li><strong>History:</strong> Monthly calendar matrix with completion indicators, day inspector, and retroactive check-in/undo.</li>
                    <li><strong>Insights:</strong> 7-day and 30-day summaries, 14-day rhythm bar chart, 28-day heatmap, consistency rankings, and category breakdown.</li>
                    <li><strong>Settings:</strong> Light/dark theme, accessible accent colors, week start (Mon/Sun), JSON backup & restore, CSV export, and clear data controls.</li>
                    <li><strong>About:</strong> Evidence-based habit stacking advice, keyboard shortcuts, and documentation.</li>
                  </ul>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    How the App Was Developed & Tested
                  </h4>
                  <p>
                    Developed as a modern React SPA using TypeScript, Tailwind CSS, Lucide icons, and local browser storage. Automated unit tests verify streak mathematics, schedule logic, date boundaries across midnight/DST, and data import/export.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    Feedback Loops & Measuring Success
                  </h4>
                  <p>
                    Feedback will be gathered through 1-on-1 user interviews and observation sessions. Success will be evaluated using:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 mt-1">
                    <li><strong>7-Day Retention:</strong> Percentage of trial users who continue logging in after one week (Target: ≥ 60%).</li>
                    <li><strong>Check-in Velocity:</strong> Ability to open the app and mark habits complete in under 30 seconds.</li>
                    <li><strong>Qualitative Satisfaction:</strong> User rating on whether TRAX felt lighter and clearer than previous planners.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'a4' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 font-medium flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span><strong>Status Notice:</strong> All activities, interviews, and metrics below represent a PROPOSED validation plan for the next phase. No interviews or results have yet been conducted. Check against organizer's exact wording if available.</span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    Proposed Validation Plan (5–10 Students)
                  </h4>
                  <p>
                    <strong>Target Participant Cohort:</strong> 6 to 8 students across Class 11, Class 12, and early university.
                    <br />
                    <strong>Duration:</strong> 7 consecutive calendar days of daily usage.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    Sample Interview Questions
                  </h4>
                  <div className="space-y-2 mt-1">
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200">Phase 1: Pre-Test Discovery</strong>
                      <ul className="list-disc pl-4 space-y-0.5">
                        <li>"How do you currently try to track your study or wellness routines?"</li>
                        <li>"What usually causes you to stop following a routine after a few days?"</li>
                      </ul>
                    </div>
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200">Phase 2: During Testing Observation</strong>
                      <ul className="list-disc pl-4 space-y-0.5">
                        <li>"How easy was it to create your first 2 or 3 habits on your phone?"</li>
                        <li>"Did the difference between Remaining and Completed habits make sense immediately?"</li>
                      </ul>
                    </div>
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200">Phase 3: Post-Test Reflection</strong>
                      <ul className="list-disc pl-4 space-y-0.5">
                        <li>"Did seeing your streaks and consistency heatmap motivate you to continue?"</li>
                        <li>"What felt annoying, confusing, or unnecessary during your 7 days of use?"</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    Measurable Validation Criteria
                  </h4>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>At least 5 of 8 testers log check-ins on 5 or more out of the 7 trial days.</li>
                    <li>Zero participants encounter critical data loss or calculation bugs.</li>
                    <li>At least 75% report that TRAX required less daily effort than their previous system.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'a5' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 font-medium flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span><strong>Status Notice:</strong> This section outlines a realistic student product pitch and conceptual model. Must be verified against the YIIC organizer's exact guidelines and rubric.</span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    Short Product Pitch
                  </h4>
                  <p className="italic bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    "For students and busy people who struggle to stay consistent with study and wellness routines, TRAX is a clean, distraction-free habit tracker that turns chaotic days into simple daily check-ins. Unlike commercial apps that lock streaks behind paywalls or overwhelm users with complex gamification, TRAX loads in seconds, keeps data private on your device, and honors your real schedule so you can build lasting momentum."
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    Clear User Benefits
                  </h4>
                  <ul className="list-disc pl-4 space-y-1">
                    <li><strong>Clarity:</strong> Know exactly what habits are scheduled for today in one glance.</li>
                    <li><strong>Momentum:</strong> Realistic streak and heatmap tracking reinforces daily progress.</li>
                    <li><strong>No Pressure:</strong> Rest days on custom schedules are never counted as missed.</li>
                    <li><strong>Zero Friction:</strong> Check off daily items in under 30 seconds on phone or laptop.</li>
                  </ul>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    Initial Free Approach & Sustainability
                  </h4>
                  <p>
                    TRAX is initially offered completely free and open-access to build organic trust among students. Because all core data processing and storage happen on the client's browser, there are zero hosting database costs for the base application. In the future, optional paid features could include multi-device cloud synchronization or encrypted study group leaderboards, but core daily tracking will remain permanently free.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                    Competitors, Realistic Risks & Next Steps
                  </h4>
                  <div className="space-y-2 mt-1">
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200">Competitors:</strong> Habitica, Streaks, TickTick, paper planners, and Google Calendar. TRAX competes on simplicity, zero ad clutter, and student schedule respect.
                    </div>
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200">Key Risks:</strong> Users forgetting to open the browser if push notifications are absent; habit fatigue after initial enthusiasm.
                    </div>
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200">Next Steps:</strong> Complete pilot testing with student peers, package as a Progressive Web App (PWA) with home screen installability, and refine weekly email/calendar digests.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400">
            Also available in README.md & docs/YIIC-ASSIGNMENTS.md
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
