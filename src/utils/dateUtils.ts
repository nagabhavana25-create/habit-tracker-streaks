import { DayStatus } from '../types';

/**
 * Format a Date object to 'YYYY-MM-DD' in local time
 */
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get today's date formatted as 'YYYY-MM-DD'
 * Can accept an optional reference date.
 */
export function getTodayKey(refDate: Date = new Date()): string {
  return formatDateKey(refDate);
}

/**
 * Format a date string or Date into friendly readable format
 * e.g. "Tuesday, October 6, 2026" or "Saturday, October 10, 2026"
 */
export function formatFullDisplayDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Format date for sub-headers: e.g. "Oct 6" or "Oct 10"
 */
export function formatShortDisplayDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * Generates an array of 7 days representing Monday through Sunday
 * for the week containing referenceDate (defaults to today / refDate).
 */
export function getMondayToSundayWeek(refDate: Date = new Date()): {
  date: Date;
  dateStr: string;
  dayName: string;
  shortDay: string;
  dayNumber: number;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
}[] {
  const target = new Date(refDate);
  target.setHours(12, 0, 0, 0); // avoid DST border issues

  const todayKey = getTodayKey(refDate);
  const dayOfWeek = target.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
  // Distance from Monday (Monday = 0, Sunday = 6)
  const distanceToMonday = (dayOfWeek + 6) % 7;

  const monday = new Date(target);
  monday.setDate(target.getDate() - distanceToMonday);

  const shortNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const fullNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const week = [];
  for (let i = 0; i < 7; i++) {
    const current = new Date(monday);
    current.setDate(monday.getDate() + i);
    const dateStr = formatDateKey(current);

    const isToday = dateStr === todayKey;
    const isPast = dateStr < todayKey;
    const isFuture = dateStr > todayKey;

    week.push({
      date: current,
      dateStr,
      dayName: fullNames[i],
      shortDay: shortNames[i],
      dayNumber: current.getDate(),
      isToday,
      isPast,
      isFuture,
    });
  }

  return week;
}

/**
 * Calculate current streak and longest streak from check-in dates.
 * 
 * Rules:
 * 1. Current streak increases when checked in on consecutive days.
 * 2. If checked in today, streak includes today + consecutive previous days.
 * 3. If NOT checked in today yet, but yesterday was checked in, the streak is alive (counted through yesterday).
 * 4. If neither today nor yesterday is checked in, the streak resets to 0.
 * 5. Longest streak is the maximum consecutive streak achieved historically.
 */
export function calculateStreaks(
  completedDates: string[],
  refDate: Date = new Date()
): { currentStreak: number; longestStreak: number } {
  if (!completedDates || completedDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const todayKey = getTodayKey(refDate);
  const uniqueDates = Array.from(new Set(completedDates)).sort();
  const dateSet = new Set(uniqueDates);

  // Helper to get string for (reference date - N days)
  const getDateNDaysAgo = (n: number): string => {
    const d = new Date(refDate);
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() - n);
    return formatDateKey(d);
  };

  // 1. Calculate Current Streak
  let currentStreak = 0;
  const isTodayCompleted = dateSet.has(todayKey);
  const yesterdayKey = getDateNDaysAgo(1);
  const isYesterdayCompleted = dateSet.has(yesterdayKey);

  if (isTodayCompleted) {
    // Starts with today (1) and counts backwards
    currentStreak = 1;
    let daysAgo = 1;
    while (dateSet.has(getDateNDaysAgo(daysAgo))) {
      currentStreak++;
      daysAgo++;
    }
  } else if (isYesterdayCompleted) {
    // User hasn't completed today yet, but completed yesterday
    // Streak is intact through yesterday!
    currentStreak = 1;
    let daysAgo = 2;
    while (dateSet.has(getDateNDaysAgo(daysAgo))) {
      currentStreak++;
      daysAgo++;
    }
  } else {
    // Neither today nor yesterday was completed -> streak broken / reset to 0
    currentStreak = 0;
  }

  // 2. Calculate Longest Streak historically
  let longestStreak = 0;
  if (uniqueDates.length > 0) {
    // Convert YYYY-MM-DD into integer day numbers (epoch days)
    const dayNumbers = uniqueDates.map((dateStr) => {
      const [y, m, d] = dateStr.split('-').map(Number);
      const utcDate = Date.UTC(y, m - 1, d);
      return Math.floor(utcDate / (1000 * 60 * 60 * 24));
    });

    let currentRun = 1;
    longestStreak = 1;

    for (let i = 1; i < dayNumbers.length; i++) {
      if (dayNumbers[i] === dayNumbers[i - 1] + 1) {
        currentRun++;
      } else if (dayNumbers[i] > dayNumbers[i - 1] + 1) {
        currentRun = 1;
      }
      if (currentRun > longestStreak) {
        longestStreak = currentRun;
      }
    }
  }

  // Ensure longest streak is at least current streak
  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }

  return { currentStreak, longestStreak };
}

/**
 * Calculates weekly progress stats for Monday - Sunday
 */
export function calculateWeeklyStats(
  completedDates: string[],
  targetDaysPerWeek: number = 7,
  refDate: Date = new Date()
): {
  completedCount: number;
  targetCount: number;
  percentage: number;
  days: DayStatus[];
  isCompletedToday: boolean;
} {
  const todayKey = getTodayKey(refDate);
  const dateSet = new Set(completedDates || []);
  const weekDays = getMondayToSundayWeek(refDate);

  let completedCount = 0;
  const days: DayStatus[] = weekDays.map((w) => {
    const isCompleted = dateSet.has(w.dateStr);
    if (isCompleted) {
      completedCount++;
    }
    return {
      dateStr: w.dateStr,
      dayName: w.dayName,
      shortDay: w.shortDay,
      dayNumber: w.dayNumber,
      isToday: w.isToday,
      isPast: w.isPast,
      isFuture: w.isFuture,
      isCompleted,
    };
  });

  const targetCount = targetDaysPerWeek || 7;
  const percentage = Math.min(100, Math.round((completedCount / targetCount) * 100));

  return {
    completedCount,
    targetCount,
    percentage,
    days,
    isCompletedToday: dateSet.has(todayKey),
  };
}
