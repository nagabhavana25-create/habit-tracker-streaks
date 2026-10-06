import React from 'react';
import { Calendar, CheckCircle2, Flame, Trophy } from 'lucide-react';
import { formatFullDisplayDate, formatShortDisplayDate } from '../utils/dateUtils';

interface DashboardStatsProps {
  currentDate?: Date;
  totalHabits: number;
  completedTodayCount: number;
  bestActiveStreak: number;
  bestHabitName?: string;
  totalCheckInsCount: number;
  onOpenAddModal: () => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  currentDate = new Date(),
  totalHabits,
  completedTodayCount,
  bestActiveStreak,
  bestHabitName,
  totalCheckInsCount,
}) => {
  const todayFormatted = formatFullDisplayDate(currentDate);
  const percentage = totalHabits > 0 ? Math.round((completedTodayCount / totalHabits) * 100) : 0;
  const isAllCompleted = totalHabits > 0 && completedTodayCount === totalHabits;

  return (
    <div className="space-y-4">
      {/* Top Banner with Today's Date and Greeting */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Today&apos;s Date · {formatShortDisplayDate(currentDate)}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {todayFormatted}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
              {isAllCompleted
                ? "🎉 Amazing job! You have completed all your habits for today. Keep this momentum!"
                : completedTodayCount > 0
                ? `You've checked in ${completedTodayCount} of ${totalHabits} habits today. Keep building your daily streaks!`
                : "Ready to start your day? Complete your first habit below to keep your streaks alive!"}
            </p>
          </div>

          {/* Quick status ring / big percentage meter */}
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 rounded-xl p-3.5 sm:px-5 shrink-0 self-start sm:self-auto">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200 dark:text-slate-700"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={percentage === 100 ? "text-emerald-500" : "text-amber-500"}
                  strokeDasharray={`${percentage}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-xs font-bold text-slate-800 dark:text-slate-100 font-mono tabular-nums">
                {percentage}%
              </span>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Today&apos;s Completion</div>
              <div className="text-base font-bold text-slate-900 dark:text-white">
                <span className="font-mono tabular-nums text-emerald-600 dark:text-emerald-400">{completedTodayCount}</span>
                <span className="text-slate-400 dark:text-slate-500 font-normal"> / {totalHabits} Habits</span>
              </div>
            </div>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-medium">
            <span>Daily Goal Progress</span>
            <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300 font-semibold">{percentage}% Completed</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                percentage === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Metric 1: Total Habits */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 flex items-center gap-3.5 shadow-xs transition-colors">
          <div className="w-10 h-10 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Habits</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                {totalHabits}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">active routines</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Best Active Streak */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 flex items-center gap-3.5 shadow-xs transition-colors">
          <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Best Current Streak</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono tabular-nums">
                {bestActiveStreak}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {bestActiveStreak === 1 ? 'day' : 'days'}
                {bestHabitName ? ` (${bestHabitName})` : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Metric 3: Total Recorded Check-Ins */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 flex items-center gap-3.5 shadow-xs transition-colors">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Check-Ins</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                {totalCheckInsCount}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">lifetime completions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
