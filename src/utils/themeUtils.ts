import { HabitColor } from '../types';

export interface ColorScheme {
  bgLight: string;
  badgeBg: string;
  badgeText: string;
  accent: string;
  barColor: string;
  dotActive: string;
  borderHover: string;
  iconBg: string;
  iconText: string;
}

export const COLOR_SCHEMES: Record<HabitColor, ColorScheme> = {
  emerald: {
    bgLight: 'bg-emerald-50/50 dark:bg-emerald-950/20',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    accent: 'emerald',
    barColor: 'bg-emerald-500 dark:bg-emerald-400',
    dotActive: 'bg-emerald-500 text-white dark:bg-emerald-500',
    borderHover: 'hover:border-emerald-300 dark:hover:border-emerald-700',
    iconBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300',
    iconText: 'text-emerald-600 dark:text-emerald-400',
  },
  sky: {
    bgLight: 'bg-sky-50/50 dark:bg-sky-950/20',
    badgeBg: 'bg-sky-50 dark:bg-sky-950/40',
    badgeText: 'text-sky-700 dark:text-sky-300',
    accent: 'sky',
    barColor: 'bg-sky-500 dark:bg-sky-400',
    dotActive: 'bg-sky-500 text-white dark:bg-sky-500',
    borderHover: 'hover:border-sky-300 dark:hover:border-sky-700',
    iconBg: 'bg-sky-100 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300',
    iconText: 'text-sky-600 dark:text-sky-400',
  },
  indigo: {
    bgLight: 'bg-indigo-50/50 dark:bg-indigo-950/20',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/40',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    accent: 'indigo',
    barColor: 'bg-indigo-500 dark:bg-indigo-400',
    dotActive: 'bg-indigo-500 text-white dark:bg-indigo-500',
    borderHover: 'hover:border-indigo-300 dark:hover:border-indigo-700',
    iconBg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300',
    iconText: 'text-indigo-600 dark:text-indigo-400',
  },
  amber: {
    bgLight: 'bg-amber-50/50 dark:bg-amber-950/20',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40',
    badgeText: 'text-amber-800 dark:text-amber-300',
    accent: 'amber',
    barColor: 'bg-amber-500 dark:bg-amber-400',
    dotActive: 'bg-amber-500 text-white dark:bg-amber-500',
    borderHover: 'hover:border-amber-300 dark:hover:border-amber-700',
    iconBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300',
    iconText: 'text-amber-600 dark:text-amber-400',
  },
  rose: {
    bgLight: 'bg-rose-50/50 dark:bg-rose-950/20',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/40',
    badgeText: 'text-rose-700 dark:text-rose-300',
    accent: 'rose',
    barColor: 'bg-rose-500 dark:bg-rose-400',
    dotActive: 'bg-rose-500 text-white dark:bg-rose-500',
    borderHover: 'hover:border-rose-300 dark:hover:border-rose-700',
    iconBg: 'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300',
    iconText: 'text-rose-600 dark:text-rose-400',
  },
  teal: {
    bgLight: 'bg-teal-50/50 dark:bg-teal-950/20',
    badgeBg: 'bg-teal-50 dark:bg-teal-950/40',
    badgeText: 'text-teal-700 dark:text-teal-300',
    accent: 'teal',
    barColor: 'bg-teal-500 dark:bg-teal-400',
    dotActive: 'bg-teal-500 text-white dark:bg-teal-500',
    borderHover: 'hover:border-teal-300 dark:hover:border-teal-700',
    iconBg: 'bg-teal-100 text-teal-700 dark:bg-teal-950/70 dark:text-teal-300',
    iconText: 'text-teal-600 dark:text-teal-400',
  },
  violet: {
    bgLight: 'bg-violet-50/50 dark:bg-violet-950/20',
    badgeBg: 'bg-violet-50 dark:bg-violet-950/40',
    badgeText: 'text-violet-700 dark:text-violet-300',
    accent: 'violet',
    barColor: 'bg-violet-500 dark:bg-violet-400',
    dotActive: 'bg-violet-500 text-white dark:bg-violet-500',
    borderHover: 'hover:border-violet-300 dark:hover:border-violet-700',
    iconBg: 'bg-violet-100 text-violet-700 dark:bg-violet-950/70 dark:text-violet-300',
    iconText: 'text-violet-600 dark:text-violet-400',
  },
};

export const COLOR_OPTIONS: { id: HabitColor; label: string; bgClass: string }[] = [
  { id: 'sky', label: 'Sky Blue', bgClass: 'bg-sky-500' },
  { id: 'emerald', label: 'Emerald', bgClass: 'bg-emerald-500' },
  { id: 'indigo', label: 'Indigo', bgClass: 'bg-indigo-500' },
  { id: 'amber', label: 'Amber', bgClass: 'bg-amber-500' },
  { id: 'rose', label: 'Rose', bgClass: 'bg-rose-500' },
  { id: 'teal', label: 'Teal', bgClass: 'bg-teal-500' },
  { id: 'violet', label: 'Violet', bgClass: 'bg-violet-500' },
];
