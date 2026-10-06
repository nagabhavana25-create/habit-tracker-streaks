# Habit Tracker with Streaks

A web-based **Habit Tracker with Streaks** that helps users track their daily habits, maintain streaks, and monitor weekly progress.

## Live Demo

[Open Habit Tracker with Streaks](https://habit-tracker-with-streaks.ai.studio/)

## Problem Statement

People often start daily habits but find it difficult to maintain consistency and track their progress.

This project provides a simple habit tracking system where users can record daily check-ins, calculate their current and longest streaks, and view their weekly progress.

## Key Features

* Add new habits
* Daily habit check-ins
* Current streak calculation
* Longest streak calculation
* Weekly progress bars
* Monday to Sunday weekly tracking
* Habit completion status
* Dashboard with total habits and completed habits
* Weekly progress visualization
* Weekly habit matrix
* Edit and delete habits
* Sample habits for demonstration
* Light and dark mode
* Local storage for saving habit data
* Responsive user interface

## How It Works

1. The user adds a habit.
2. The habit appears on the dashboard.
3. The user completes the habit using the daily check-in button.
4. The application stores the check-in date.
5. The system calculates the current streak from consecutive completed days.
6. The longest streak is calculated from the user's previous check-ins.
7. Weekly progress is calculated from Monday to Sunday.
8. The dashboard displays the habit progress and streak information.

## Streak Calculation

The application calculates streaks using the actual habit check-in dates.

* **Current Streak:** Number of consecutive days the habit has been completed.
* **Longest Streak:** Highest number of consecutive completed days achieved.
* **Weekly Progress:** Number of completed days out of 7 days.

For example, if a habit is completed on 5 days in a week, the weekly progress is displayed as **5/7**.

## Weekly Progress

The application provides a weekly progress bar and a Monday-to-Sunday weekly matrix.

This allows users to easily see which days they completed each habit.

## Technology Used

* React
* TypeScript
* Vite
* HTML
* CSS
* Local Storage
* Lucide Icons
* GitHub
* Google AI Studio

## Project Structure

```text
habit-tracker-with-streaks/
├── index.html
├── metadata.json
├── package.json
├── README.md
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── components/
    │   ├── AddHabitModal.tsx
    │   ├── DashboardStats.tsx
    │   ├── EditHabitModal.tsx
    │   ├── HabitCard.tsx
    │   ├── HabitIcon.tsx
    │   ├── Navbar.tsx
    │   └── WeeklyMatrix.tsx
    ├── data/
    │   └── defaultHabits.ts
    ├── utils/
    │   ├── dateUtils.ts
    │   └── themeUtils.ts
    ├── App.tsx
    ├── index.css
    ├── main.tsx
    └── types.ts
```

## Project Modules

### Dashboard

Displays the current date, total number of habits, completed habits, and overall progress.

### Add Habit

Allows users to create new habits and select from available habit presets.

### Daily Check-In

Allows users to mark a habit as completed for the current day.

### Streaks

Displays the current streak and longest streak for each habit.

### Weekly Progress

Displays the number of completed days during the current Monday-to-Sunday week using progress bars.

### Weekly Matrix

Provides a visual view of habit completion for each day of the week.

### Edit Habit

Allows users to edit or delete existing habits.

### Local Storage

Stores habit and check-in data in the browser so the data remains available after refreshing the page.

## Example Habits

The application includes sample habits such as:

* Drink Water
* Exercise
* Read Book
* Study
* Sleep Early

Users can also create their own habits.

## Project Purpose

This project demonstrates how a web application can be used to track daily habits and calculate useful progress information such as streaks and weekly completion.

It provides an interactive dashboard that makes habit progress easy to understand.

## Future Scope

* User login and authentication
* Cloud database integration
* Notifications and reminders
* Monthly and yearly progress reports
* Habit achievement badges
* Synchronized user accounts
* Advanced habit statistics
* Mobile application support

- Mobile application support
