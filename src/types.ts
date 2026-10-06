export type HabitColor = 'emerald' | 'amber' | 'sky' | 'indigo' | 'rose' | 'teal' | 'violet';

export interface Habit {
  id: string;
  name: string;
  category: string;
  color: HabitColor;
  iconName: string;
  targetDaysPerWeek: number; // default 7
  createdAt: string; // YYYY-MM-DD
  notes?: string;
}

export interface DayStatus {
  dateStr: string; // 'YYYY-MM-DD'
  dayName: string; // 'Monday', 'Tuesday', etc.
  shortDay: string; // 'M', 'T', 'W', etc.
  dayNumber: number; // 1-31
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  isCompleted: boolean;
}

export interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  isCompletedToday: boolean;
  weeklyCompletedCount: number;
  weeklyTarget: number;
  weeklyPercentage: number;
  weeklyDays: DayStatus[];
  totalCompletions: number;
}
