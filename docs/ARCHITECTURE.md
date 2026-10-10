# TRAX Technical Architecture & Code Reference

## 1. Overview
TRAX is a client-side Single Page Application (SPA) designed to provide fast, reliable, distraction-free habit tracking for students. It requires zero server infrastructure for core daily usage, running directly in modern web browsers with local storage persistence.

## 2. Directory Structure

```
/
├── index.html                   # HTML5 Entry Point (Synced metadata & tags)
├── metadata.json                # AI Studio Application Metadata
├── package.json                 # Dependencies & Build Scripts
├── tsconfig.json                # TypeScript Configuration
├── vite.config.ts               # Vite Configuration
├── docs/
│   ├── YIIC-ASSIGNMENTS.md      # Full YIIC Internship Assignments 1–5 documentation
│   └── ARCHITECTURE.md          # Technical documentation and data schemas
└── src/
    ├── main.tsx                 # React DOM Root Entry
    ├── App.tsx                  # Main Coordinator, State, Routing & Modals
    ├── index.css                # Tailwind CSS v4 & Accessible Base Styles
    ├── types/
    │   └── habit.ts             # TypeScript Interfaces (Habit, Settings, Stats)
    ├── utils/
    │   ├── habitMath.ts         # Streak logic, Date helpers & Period statistics
    │   └── storage.ts           # LocalStorage Engine, CSV/JSON Export & Audit Logs
    └── components/
        ├── Navbar.tsx           # Responsive Desktop Sidebar & Mobile Nav
        ├── Dashboard.tsx        # Daily checklist, today metrics & progress bar
        ├── MyHabits.tsx         # Full CRUD, categories, filters & 7-day dot trail
        ├── History.tsx          # Interactive month calendar & day inspector
        ├── Insights.tsx         # 7/30-day stats, 14-day rhythm bar, 28-day heatmap
        ├── Settings.tsx         # Themes, accent colors, schedule prefs & data export
        ├── About.tsx            # Productivity guide & keyboard shortcuts
        ├── HabitModal.tsx       # Reusable habit create/edit modal
        ├── ConfirmModal.tsx     # Reusable accessible confirmation dialog
        └── DocModal.tsx         # In-app viewer for YIIC Assignment documentation
```

## 3. Data Models

### Habit Schema (`src/types/habit.ts`)
```typescript
export interface Habit {
  id: string;                               // Unique identifier (UUID/timestamp)
  title: string;                            // Name of the habit (e.g., "Review Notes")
  description: string;                      // Optional notes or motivation
  category: HabitCategory;                  // 'study' | 'health' | 'fitness' | 'personal' | 'work' | 'reading' | 'other'
  frequency: HabitFrequency;                // 'daily' | 'weekdays' | 'weekends' | 'custom'
  customDays: number[];                     // [0..6] (0 = Sunday, 1 = Monday, etc.)
  targetCount: number;                      // Numerical daily goal (e.g. 20)
  targetUnit: string;                       // Unit of measure (e.g. "mins", "pages")
  timeOfDay: 'anytime' | 'morning' | 'afternoon' | 'evening';
  priority: 'low' | 'medium' | 'high';
  color: string;                            // Hex color accent
  emoji: string;                            // Visual emoji identifier
  createdAt: string;                        // YYYY-MM-DD
  status: HabitStatus;                      // 'active' | 'paused' | 'archived'
  completions: Record<string, number>;      // Key: "YYYY-MM-DD", Value: count
}
```

## 4. Key Calculation Algorithms

### Schedule Evaluation (`isHabitScheduledForDate`)
- Compares date against `habit.createdAt`; habits are never scheduled before their creation.
- Respects `status`: paused and archived habits are excluded from daily checklists.
- Evaluates frequency:
  - `daily`: Scheduled all 7 days.
  - `weekdays`: Scheduled Monday through Friday (`dayOfWeek >= 1 && dayOfWeek <= 5`).
  - `weekends`: Scheduled Saturday and Sunday (`dayOfWeek === 0 || dayOfWeek === 6`).
  - `custom`: Evaluates against `habit.customDays.includes(dayOfWeek)`.

### Streak Calculation (`calculateStreaks`)
- **No Penalty on Unscheduled Days:** A weekday-only habit continues its streak across Saturday and Sunday.
- **Active Current Day Grace:** If today is scheduled but not completed yet, the streak looks back from yesterday so an ongoing streak is not prematurely broken.
- **Strict Verification:** Streaks are calculated chronologically from actual saved completion entries. Zero completions strictly return a 0 streak.

### Period Statistics (`calculatePeriodStats`)
- Generates chronological daily breakdowns for 7, 14, or 30-day periods.
- Rest days are cleanly flagged as un-scheduled; only scheduled days factor into the denominator of completion percentages.
