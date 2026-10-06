import React from 'react';
import confetti from 'canvas-confetti';
import {
  Flame,
  Trophy,
  Check,
  CheckCircle2,
  MoreVertical,
  Trash2,
  Edit2,
} from 'lucide-react';
import { Habit, HabitStats } from '../types';
import { HabitIcon } from './HabitIcon';
import { COLOR_SCHEMES } from '../utils/themeUtils';

interface HabitCardProps {
  habit: Habit;
  stats: HabitStats;
  onToggleToday: (habitId: string) => void;
  onToggleDay: (habitId: string, dateStr: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  stats,
  onToggleToday,
  onToggleDay,
  onEdit,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const colorScheme = COLOR_SCHEMES[habit.color] || COLOR_SCHEMES.sky;

  const handleCheckInClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!stats.isCompletedToday) {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.75 },
          colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899'],
        });
      } catch {
        // Safe fallback
      }
    }
    onToggleToday(habit.id);
  };

  return (
    <div
      className={`border rounded-2xl p-5 transition-all duration-200 relative group shadow-xs ${
        stats.isCompletedToday
          ? 'bg-gradient-to-b from-white to-emerald-50/20 dark:from-slate-900 dark:to-emerald-950/20 border-emerald-200 dark:border-emerald-800/70 ring-1 ring-emerald-100 dark:ring-emerald-950'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Card Header: Icon, Name, Category & Actions */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${colorScheme.iconBg}`}
          >
            <HabitIcon name={habit.iconName} className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-bold text-slate-900 dark:text-white truncate leading-snug">
              {habit.name}
            </h3>
            {/* Zero-pill metadata */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span>{habit.category}</span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
              <span>{habit.targetDaysPerWeek} days/wk</span>
            </div>
          </div>
        </div>

        {/* Action Menu (Edit / Delete) */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            aria-label="Habit options"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-9 z-30 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1 text-xs font-medium text-slate-700 dark:text-slate-200">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onEdit(habit);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Edit Habit</span>
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDelete(habit.id);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 text-rose-600 dark:text-rose-400 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {habit.notes && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 line-clamp-1 italic">
          &ldquo;{habit.notes}&rdquo;
        </p>
      )}

      {/* Streak Information Row */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
        {/* Current Streak */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2.5 flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              stats.currentStreak > 0
                ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/70 dark:text-amber-400'
                : 'bg-slate-200/70 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
            }`}
          >
            <Flame
              className={`w-4 h-4 ${
                stats.currentStreak > 0 ? 'fill-amber-500 text-amber-600 dark:fill-amber-400 dark:text-amber-400' : ''
              }`}
            />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-none">
              Current Streak
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
              <span className="font-mono tabular-nums text-amber-600 dark:text-amber-400 font-bold">
                {stats.currentStreak}
              </span>{' '}
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                {stats.currentStreak === 1 ? 'day' : 'days'}
              </span>
            </div>
          </div>
        </div>

        {/* Longest Streak */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2.5 flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              stats.longestStreak > 0
                ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400'
                : 'bg-slate-200/70 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
            }`}
          >
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-none">
              Longest Streak
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
              <span className="font-mono tabular-nums text-indigo-600 dark:text-indigo-400 font-bold">
                {stats.longestStreak}
              </span>{' '}
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                {stats.longestStreak === 1 ? 'day' : 'days'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Progress Section (Monday to Sunday) */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Weekly Progress</span>
          <div className="flex items-center gap-1 font-mono text-xs">
            <span className="font-bold text-slate-900 dark:text-white tabular-nums">
              {stats.weeklyCompletedCount}/7
            </span>
            <span className="text-slate-400 dark:text-slate-500">({stats.weeklyPercentage}%)</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden mb-3">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              stats.weeklyPercentage >= 100
                ? 'bg-emerald-500'
                : colorScheme.barColor
            }`}
            style={{ width: `${stats.weeklyPercentage}%` }}
          />
        </div>

        {/* Monday to Sunday Day Dots / Buttons */}
        <div className="grid grid-cols-7 gap-1 pt-1">
          {stats.weeklyDays.map((day) => {
            const isClickable = !day.isFuture;
            return (
              <button
                key={day.dateStr}
                type="button"
                disabled={!isClickable}
                onClick={() => onToggleDay(habit.id, day.dateStr)}
                title={`${day.dayName} (${day.dateStr}): ${
                  day.isCompleted ? 'Completed' : isClickable ? 'Click to toggle' : 'Upcoming'
                }`}
                className={`flex flex-col items-center justify-center py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                  day.isToday ? 'ring-2 ring-slate-900 dark:ring-amber-400 ring-offset-1 dark:ring-offset-slate-900 font-bold' : ''
                } ${
                  day.isCompleted
                    ? 'bg-emerald-500 dark:bg-emerald-600 text-white shadow-xs'
                    : isClickable
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300'
                    : 'bg-slate-50 dark:bg-slate-800/40 text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-60'
                }`}
              >
                <span className="text-[10px] uppercase font-semibold leading-none">
                  {day.shortDay}
                </span>
                <span className="text-[11px] font-mono tabular-nums leading-tight mt-1">
                  {day.isCompleted ? '✓' : day.dayNumber}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Action: Daily Check-In Button */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800">
        {stats.isCompletedToday ? (
          <button
            onClick={handleCheckInClick}
            className="w-full h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 active:scale-[0.99] transition-all cursor-pointer group/btn"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Completed Today</span>
            <span className="text-[11px] text-emerald-600/70 dark:text-emerald-400/70 font-normal ml-1">
              (Click to undo)
            </span>
          </button>
        ) : (
          <button
            onClick={handleCheckInClick}
            className="w-full h-11 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-slate-950 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-[0.99] transition-all shadow-xs shadow-slate-900/10 cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Check In for Today</span>
          </button>
        )}
      </div>
    </div>
  );
};
