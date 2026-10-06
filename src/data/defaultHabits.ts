import { Habit } from '../types';
import { formatDateKey } from '../utils/dateUtils';

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'habit-drink-water',
    name: 'Drink Water',
    category: 'Health',
    color: 'sky',
    iconName: 'droplet',
    targetDaysPerWeek: 7,
    createdAt: '2026-09-01',
    notes: 'Aim for 8 glasses (2-3 Litres) every day',
  },
  {
    id: 'habit-study',
    name: 'Study',
    category: 'Education',
    color: 'indigo',
    iconName: 'book-open',
    targetDaysPerWeek: 7,
    createdAt: '2026-09-01',
    notes: 'Focus session for web development or college course',
  },
  {
    id: 'habit-exercise',
    name: 'Exercise',
    category: 'Fitness',
    color: 'emerald',
    iconName: 'dumbbell',
    targetDaysPerWeek: 7,
    createdAt: '2026-09-01',
    notes: 'Morning workout, jogging, or gym session',
  },
  {
    id: 'habit-read-book',
    name: 'Read Book',
    category: 'Mindset',
    color: 'amber',
    iconName: 'sparkles',
    targetDaysPerWeek: 7,
    createdAt: '2026-09-01',
    notes: 'Read at least 15-20 pages of a non-fiction or fiction book',
  },
  {
    id: 'habit-sleep-early',
    name: 'Sleep Early',
    category: 'Routine',
    color: 'violet',
    iconName: 'moon',
    targetDaysPerWeek: 7,
    createdAt: '2026-09-01',
    notes: 'Lights off and screens away before 11:00 PM',
  },
];

/**
 * Generates dynamic initial check-in records relative to current date (today)
 * so that streaks and weekly progress bars are calculated from real check-in data!
 */
export function getInitialCheckIns(): Record<string, string[]> {
  const getDateOffset = (offsetDays: number): string => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() - offsetDays);
    return formatDateKey(d);
  };

  return {
    // Drink Water: checked in today, yesterday, -2, -3, -4, -5, -6 (Active 7-day streak!)
    'habit-drink-water': [
      getDateOffset(0), // today
      getDateOffset(1), // yesterday
      getDateOffset(2),
      getDateOffset(3),
      getDateOffset(4),
      getDateOffset(5),
      getDateOffset(6),
      getDateOffset(8),
      getDateOffset(9),
      getDateOffset(10),
    ],

    // Study: checked in yesterday, -2, -3, -4 (Active 4-day streak, pending today!)
    'habit-study': [
      getDateOffset(1),
      getDateOffset(2),
      getDateOffset(3),
      getDateOffset(4),
      getDateOffset(6),
      getDateOffset(7),
      getDateOffset(8),
    ],

    // Exercise: checked in today, yesterday, -2 (Active 3-day streak!)
    'habit-exercise': [
      getDateOffset(0), // today
      getDateOffset(1),
      getDateOffset(2),
      getDateOffset(5),
      getDateOffset(6),
      getDateOffset(7),
    ],

    // Read Book: checked in today, -2, -3 (Streak 1, missed yesterday)
    'habit-read-book': [
      getDateOffset(0), // today
      getDateOffset(2),
      getDateOffset(3),
      getDateOffset(5),
      getDateOffset(6),
    ],

    // Sleep Early: checked in yesterday, -2, -3 (Active 3-day streak, pending today!)
    'habit-sleep-early': [
      getDateOffset(1),
      getDateOffset(2),
      getDateOffset(3),
      getDateOffset(5),
      getDateOffset(6),
      getDateOffset(7),
    ],
  };
}
