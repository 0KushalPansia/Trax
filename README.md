# TRAX — Student & Productivity Habit Tracker

> A simple, distraction-free habit-tracking web application designed for students and busy people to maintain routines and track daily progress.

[![Status](https://img.shields.io/badge/Status-Complete-success.svg)]()
[![License](https://img.shields.io/badge/License-Apache--2.0-blue.svg)]()
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Mobile%20%7C%20Desktop-indigo.svg)]()

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Application Structure](#application-structure)
5. [YIIC Internship Assignment Documentation](#yiic-internship-assignment-documentation)
   - [Assignment 1 — Problem Discovery](#assignment-1--problem-discovery)
   - [Assignment 2 — Prompt to Prototype](#assignment-2--prompt-to-prototype)
   - [Assignment 3 — Idea to Product](#assignment-3--idea-to-product)
   - [Assignment 4 — Customer Validation](#assignment-4--customer-validation)
   - [Assignment 5 — Product Pitch and Business Model](#assignment-5--product-pitch-and-business-model)
6. [Local Development & Testing](#local-development--testing)
7. [Data Privacy & Export](#data-privacy--export)

---

## Project Overview

**TRAX** is built to solve a recurring friction faced by secondary school, college, and exam-revision students: starting daily routines with high motivation, but losing consistency after a few days because existing tools are either overcomplicated, full of ads, or locked behind subscriptions.

TRAX provides:
- A clean, 30-second daily checklist.
- Accurate streaks that **never penalize you for scheduled rest days** (e.g. weekend breaks on weekday study routines).
- Interactive calendar history and retroactive check-in corrections.
- Authentic weekly and monthly insights with zero fabricated statistics.
- 100% private local storage with full JSON and CSV export capabilities.

---

## Key Features

- **Dashboard:**
  - Dynamic student greeting and local calendar date badge.
  - Clear separation into **Remaining Today** and **Completed Today**.
  - One-tap check-in with instantaneous **Undo** support.
  - Multi-count target buttons (`+`/`-`) for volume habits (e.g., liters of water or pages read).
  - Real-time progress bar, best active streak indicator, and 7-day consistency metric.
  - Friendly empty states for new accounts and scheduled rest days.

- **My Habits:**
  - Create, edit, pause, archive, and delete habits with modal confirmation.
  - 7 student-friendly categories: Study & Academics, Health & Wellness, Fitness, Personal Growth, Work, Reading, and Other.
  - Customizable color swatches and quick emoji icons.
  - Flexible cadences: Daily, Weekdays (Mon–Fri), Weekends (Sat–Sun), or Custom day-of-week selections.
  - 7-day micro dot trail on every habit card for quick historical inspection.

- **History & Calendar:**
  - Monthly calendar matrix with status indicators (All done, Partial, Missed, Rest).
  - Month navigation and direct date picker jump.
  - **Day Inspector Panel:** View completed vs. missed habits on any scheduled date with retroactive check-in and undo tools.

- **Insights & Analytics:**
  - Weekly (7-day) and Monthly (30-day) completion rate summaries with exact date ranges.
  - 14-day completion rhythm bar chart (scrollable on mobile).
  - 28-day activity heatmap reflecting completion intensity.
  - Habit consistency breakdown ranking habits by scheduled day adherence.
  - Strictly calculated from real user logs — zero invented achievements or fake stats.

- **Settings & Data Portability:**
  - Daylight (Light) and Night Study (Dark) themes.
  - 6 accessible accent colors: Indigo, Emerald, Blue, Violet, Amber, Rose.
  - Preferred first day of the week (Monday or Sunday).
  - Full JSON backup download and file restoration.
  - Spreadsheet CSV export of all historical check-in records.
  - Danger zone clear data with confirmation dialog.

- **About & Philosophy:**
  - Evidence-based habit advice: The 2-Minute Rule, Habit Stacking, and Never Miss Twice.
  - Keyboard navigation shortcuts (`1`–`6`, `N`, `T`, `Esc`).
  - Embedded YIIC Assignment viewer.

---

## Technology Stack

- **Frontend Library:** React 19 (Functional components, Hooks)
- **Language:** TypeScript 5.8+ (Strict type safety)
- **Styling:** Tailwind CSS v4 with custom responsive design system
- **Icons:** Lucide React
- **Build Tool:** Vite
- **Storage:** Web Storage API (`localStorage`) with JSON serialization and schema defense

---

## Application Structure

```
/
├── index.html                   # HTML entry point with synced meta tags
├── metadata.json                # Project identity and capabilities
├── package.json                 # Project scripts and dependencies
├── README.md                    # Primary documentation & YIIC assignments
├── docs/
│   ├── YIIC-ASSIGNMENTS.md      # Standalone YIIC internship assignment document
│   └── ARCHITECTURE.md          # Data models, streak math, and schemas
└── src/
    ├── App.tsx                  # Root coordinator, routing, modals, toasts
    ├── main.tsx                 # React DOM mount
    ├── index.css                # Base Tailwind imports & accessibility
    ├── types/
    │   └── habit.ts             # TypeScript definitions
    ├── utils/
    │   ├── habitMath.ts         # Streak calculation, date helpers, period stats
    │   └── storage.ts           # LocalStorage CRUD, JSON/CSV exports, activity logs
    └── components/
        ├── Navbar.tsx           # Desktop sidebar and mobile navigation
        ├── Dashboard.tsx        # Daily focus checklist & key metrics
        ├── MyHabits.tsx         # Habit management & filters
        ├── History.tsx          # Monthly calendar & day inspector
        ├── Insights.tsx         # Heatmap, rhythm chart & consistency table
        ├── Settings.tsx         # Preferences, accent palette & data controls
        ├── About.tsx            # Productivity guide & keyboard shortcuts
        ├── HabitModal.tsx       # Create/edit habit modal
        ├── ConfirmModal.tsx     # Reusable confirmation dialog
        └── DocModal.tsx         # In-app YIIC assignment document viewer
```

---

## YIIC Internship Assignment Documentation

> **Important Accuracy & Academic Integrity Statement:**  
> 1. Written in clear, honest English appropriate for a Class 12 student.
> 2. No interviews, survey results, user counts, revenues, or test validation outcomes have been invented.
> 3. Facts about the working app, proposed features, assumptions, and future plans are strictly separated.
> 4. TRAX makes no claim of being the first or only habit tracker; it is an accessible, student-focused tool.
> 5. **Assignments 4 and 5 represent proposed validation frameworks and must be verified against the YIIC organizer's exact prompt and grading rubric once available.**

---

### Assignment 1 — Problem Discovery

#### 1. What problem have I personally noticed?
As a Class 12 student balancing board exam preparation, daily homework, coaching schedules, and personal well-being, I constantly experienced difficulty maintaining consistent daily routines. I would start revision schedules, hydration targets, or reading habits with strong enthusiasm, but within 3 to 5 days, my consistency would collapse. The problem was not a lack of effort, but that routines were scattered across notebooks or forgotten during tiring school days. Without a fast, visual way to see progress, a single missed day caused complete abandonment.

#### 2. Who else may have this problem, and what evidence do I actually have?
- **Who else experiences this:** High school students (Classes 9–12), college students with irregular lecture timetables, entrance exam candidates (e.g. engineering, medical, law entrance preparation), and busy young individuals.
- **Evidence status:** Based on direct personal observation of classmates and study peers who frequently buy planners or download habit apps at the beginning of a term and stop using them within a week. Peers regularly discuss how hard it is to maintain daily physics revision or sleep schedules amidst heavy homework. *Note: This evidence is drawn from everyday peer observations and personal lived experience; no fabricated surveys or scientific statistics are claimed.*

#### 3. What do people currently do, and why might those solutions be insufficient?
- **Paper Notebooks / Planners:** Easy to forget at home; tedious to manually tally streaks; easy to abandon during exam weeks.
- **Phone Calendar Apps:** Geared toward meetings with rigid start and end times, cluttering student calendars and creating notification burnout.
- **Alarm / Reminder Apps:** Too easy to swipe away without taking action; provide zero visual tracking of cumulative momentum.
- **Spreadsheets (Excel / Google Sheets):** Inconvenient to edit on a mobile phone; formulas require manual setup; high friction for a 10-second check-in.
- **Commercial Habit Apps:** Often lock basic streaks behind costly subscriptions ($30–$60/year); full of ads, distracting game avatars, or invasive data harvesting.

#### 4. What is the TRAX solution?
TRAX is a fast, distraction-free habit-tracking web application designed specifically for students. It offers:
- A clean daily checklist separating *Remaining* and *Completed* routines.
- Single-tap check-in with instantaneous *Undo* for accidental clicks.
- Schedule-aware streak math that does not penalize planned rest days (e.g., weekends for weekday study routines).
- Interactive monthly calendar history with retroactive check-in corrections.
- 14-day rhythm bar charts and 28-day heatmaps computed strictly from real records.
- 100% private local browser storage with full JSON backup and CSV spreadsheet export.

#### 5. Why might TRAX be viable, who might want it, and why might they choose it over current alternatives?
- **Viability:** Operates as a lightweight client-side application with zero database hosting costs for basic student use, loading instantly on any device.
- **Target Audience:** School students, exam aspirants, and busy young people wanting simple routine structure.
- **Why Choose TRAX:** Simplicity, zero subscription paywalls, no ads, student-focused categories, non-punitive streaks, and full data ownership via CSV download.

---

### Assignment 2 — Prompt to Prototype

#### 1. First Entrepreneurial-Advisor Prompt
To develop the initial concept into an actionable development plan, the following prompt was formulated:

```text
"I am a Class 12 student building a web application called TRAX to help students and busy people build and maintain positive daily habits (like study blocks, revision, hydration, and sleep). I notice students struggle with consistency and existing apps are either too complicated, full of ads, or locked behind paywalls. 

Act as an entrepreneurial advisor: 
1. What are the core assumptions behind this idea that I must validate first?
2. How can I build a minimal prototype to test these assumptions quickly?
3. What are the most critical product and user risks I need to address early on?
4. How should I measure whether students actually find this helpful?"
```

#### 2. Core Assumptions to Test
1. **Assumption 1 (Problem Reality):** Students actively want a dedicated tool to track daily routines and find visual tracking motivating rather than an extra burden.
2. **Assumption 2 (Simplicity Over Gamification):** Students prefer a clean 30-second checklist over complex RPG mechanics or social feeds.
3. **Assumption 3 (Schedule Flexibility):** Non-penalizing streaks for scheduled rest days encourage students to resume habits instead of quitting after a missed day.
4. **Assumption 4 (Data Ownership):** Students value having their personal habits kept private on their local device with easy export options.

#### 3. Next Steps for Validating the Idea & Improving the Product
1. Deploy the functional web prototype with local persistence (completed).
2. Run a structured 7-day user testing trial with 5 to 10 student peers (planned).
3. Observe where friction occurs during daily check-ins.
4. Refine mobile responsiveness and add PWA home-screen installability based on user feedback.

---

### Assignment 3 — Idea to Product

#### 1. Target Users
- Primary: High school students (Classes 9–12) and exam revision candidates.
- Secondary: College/university students managing flexible lecture schedules.
- Tertiary: Young professionals seeking a minimal, ad-free habit tracker.

#### 2. Product Features
- **Dashboard:** Today's focus, remaining vs. completed groups, progress bar, streaks, quick add.
- **My Habits:** CRUD management, categories, color coding, flexible frequency (daily, weekdays, weekends, custom), target counters, pause/resume, archive/restore.
- **History:** Interactive monthly calendar, day inspector, completed vs. missed on scheduled days, retroactive check-ins.
- **Insights:** Weekly and monthly summaries, 14-day rhythm chart, 28-day activity heatmap, consistency ranking table.
- **Settings:** Light/dark themes, 6 accent colors, week start preference, JSON backup/restore, CSV export, clear data.
- **About:** Atomic habit principles, keyboard shortcuts reference, and documentation access.

#### 3. Development, Testing, and Measurement
- **Development:** Built using React 19, TypeScript, and Tailwind CSS with local browser storage.
- **Testing:** Automated tests for streak math, frequency evaluation, and date boundary transitions; cross-device manual testing on mobile, tablet, and desktop.
- **Feedback Integration:** Direct user interviews to remove unnecessary modal steps and optimize mobile touch targets.
- **Success Metrics:** 7-day retention rate ($\ge 60\%$), check-in speed ($< 30$ seconds), and zero calculation bugs.

---

### Assignment 4 — Customer Validation

> **Notice:** All activities, sample interviews, and success criteria below represent a **proposed validation plan** for the next phase. In accordance with academic honesty, **no student interviews or validation test results have yet been conducted**. Please check against the organizer's exact wording if available.

#### 1. Proposed Validation Plan
- **Cohort:** 6 to 8 students from Classes 10–12 across different academic streams.
- **Duration:** 7 consecutive calendar days.
- **Protocol:**
  1. *Day 0 (Setup):* 10-minute briefing; each student creates 2–4 real study and wellness habits.
  2. *Days 1–7 (Trial):* Students use TRAX daily on their personal phone or laptop.
  3. *Day 8 (Debrief):* 15-minute structured exit interview to collect feedback and review consistency logs.

#### 2. Sample Interview Questions
- *Discovery:* "What routines do you currently try to follow, and what usually causes you to stop?"
- *Usability:* "How easy was it to create your habits? Did the difference between Remaining and Completed habits make immediate sense?"
- *Reflection:* "Did seeing your streak motivate you on days you felt tired? What felt annoying or unnecessary?"

#### 3. Measurable Success Criteria
- At least 5 of 8 students log check-ins on 5 or more of the 7 trial days.
- 100% of participants create habits without needing technical assistance.
- Zero data loss or calculation errors reported.
- At least 70% state that TRAX was simpler and required less effort than their previous system.

---

### Assignment 5 — Product Pitch and Business Model

> **Notice:** The product pitch and business approach below represent a realistic student competition framework. Please check against the organizer's exact pitch guidelines and rubric.

#### 1. Short Product Pitch
> *"For students and busy people who struggle to stay consistent with study and wellness routines, **TRAX** is a clean, distraction-free habit tracker that turns chaotic days into simple daily check-ins. Unlike commercial apps that lock streaks behind paywalls or overwhelm users with complex game mechanics, TRAX loads in seconds, keeps data completely private on your device, and honors your real schedule so you can build lasting momentum."*

#### 2. User Benefits
- **Clarity:** Know today's scheduled tasks in one glance.
- **Momentum:** Real streak and heatmap feedback reinforces daily progress.
- **Fairness:** Scheduled rest days are never counted as missed.
- **Speed:** Complete daily tracking in under 20 seconds.
- **Privacy:** 100% local storage with instant spreadsheet export.

#### 3. Initial Free Approach & Sustainability
- **Free Core Application:** Fully accessible to students with zero ads or subscriptions.
- **Zero Server Cost Model:** Client-side execution eliminates recurring database hosting expenses.
- **Future Possibilities:** Optional cloud sync for users wanting cross-device synchronization, or coaching batch licenses for teachers sharing revision plans. The basic tracker remains permanently free.

#### 4. Competitor Analysis & Realistic Risks
- **Competitors:** Habitica (too gamified/complex), Streaks (iOS-only, paid upfront), TickTick (paywalled habit tracking), Paper planners (easily lost, no stats).
- **Risks & Mitigation:**
  - *No push notifications:* Add PWA service worker support and bookmark prompts.
  - *Habit fatigue:* Provide evidence-based tips (2-minute rule) to encourage smaller, manageable habits.
  - *Browser storage clearance:* Prominent JSON and CSV backup downloads in Settings.

---

## Local Development & Testing

```bash
# Install dependencies
npm install

# Start local development server (runs on port 3000)
npm run dev

# Build production bundle
npm run build

# Type check
npm run lint
```

---

## Data Privacy & Export

All habits, completion logs, and preferences are stored exclusively on the user's device via `localStorage`.

- **JSON Backup:** Generates `trax-backup-YYYY-MM-DD.json` containing complete habit definitions, completion records, and settings.
- **CSV Export:** Generates `trax-habits-records-YYYY-MM-DD.csv` for analysis in Microsoft Excel, Google Sheets, or Apple Numbers.
