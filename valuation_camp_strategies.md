# Valuation Camp Answer Script Division: Rules & Strategies

This document serves as a comprehensive reference for the business logic, rules, constraints, and strategies implemented across the two versions of the Valuation Camp Answer Script Division Application (`valuation-app` and `valuation-camp-2`).

## 1. Core Allocation Rules
- **Paper Constraints:** Each subject/paper is defined with a starting "False Number" (the first physical script number), a total count of available scripts, and a QP (Question Paper) Code.
- **Session-Based Division:** The valuation camp is broken down into specific dates and sessions (e.g., Forenoon - FN, Afternoon - AN, Discussion sessions).
- **Sequential False Numbers:** The application strictly enforces sequential false number distribution. As scripts are allocated to examiners, the system automatically calculates the `start` and `end` false numbers. 
  - *Strategy:* A global tracker runs through the allocations. If an examiner gets 15 scripts of "Paper A", the next examiner getting "Paper A" will automatically start at `previous_end + 1`. This completely eliminates manual numbering errors and overlaps.

## 2. Chief Examiner Strategy
- **Automated Chief Bundles:** Chief Examiners do not receive manual script assignments. Instead, their bundles are calculated dynamically per session.
  - *Logic:* The system aggregates all allocations given to a team's examiners in a specific session, groups them by paper, and calculates the total count and the overall minimum `start` and maximum `end` false numbers. This represents the master bundle the Chief must oversee for that session.

## 3. Team & Examiner Management
- **Examiner Swapping:** If an examiner is absent or replaced, the system allows for a "Swap" operation.
  - *Rule:* Swapping two examiners doesn't just swap their names on a UI row; it structurally transfers all associated allocations, false numbers, and session assignments to the new examiner. This ensures the physical sequence of bundles remains perfectly intact.
- **Strict Sorting (Camp 2):** To ensure physical bundles are generated in a predictable order, the logic sorts all allocations strictly by: `Session Order -> Team -> Examiner Order`.

## 4. Advanced Bundle Management (Camp 2 Enhancements)
- **Serial Numbering:** Every individual allocation (a specific paper given to a specific examiner in a specific session) is tagged with a unique, monotonically increasing `serial` number (e.g., Bundle #1, Bundle #2).
- **Printable Bundle Slips:** The system generates physical slips for each bundle that include the Serial #, Session, QP Code, Examiner Name, Chief Name, Paper Name, False Numbers range, and Total Scripts. These can be printed and physically stapled to the answer script bundles.

## 5. UI, Validation & State Persistence
- **Dashboard Monitoring:** A real-time dashboard tracks the total scripts used versus the remaining scripts for each paper. 
  - *Validation:* It visually flags (using colors/warnings) if a paper is over-allocated (negative remaining scripts) or under-allocated.
- **Offline-First Persistence:** 
  - The app seamlessly auto-saves all state (allocations, examiners, papers, sessions) to the browser's `localStorage`. (Using versioned keys like `valuation_allocations_camp2_v5`).
  - *File System API Backup:* Allows saving the state to a physical `.json` file and loading from it, creating a robust backup system without requiring a backend database.
- **Standalone Print Modes (Camp 2):** To prevent CSS conflicts when printing, the app utilizes URL parameters (e.g., `?print=daily`, `?print=slips`) to open dedicated, clean print layouts in a new tab.

## Summary of Evolution
**Camp 1** focused on calculating false numbers and rendering grid tables for master and daily overviews.
**Camp 2** evolved into a complete physical workflow manager by adding serial bundle tracking, standalone print slips, robust state handling, and strict predictable sorting.
