import React from 'react';
import { Flame, Trophy, Check, Plus, Calendar } from 'lucide-react';
import { Habit, HabitStats } from '../types';
import { HabitIcon } from './HabitIcon';
import { COLOR_SCHEMES } from '../utils/themeUtils';

interface WeeklyMatrixProps {
  habits: Habit[];
  habitStatsMap: Map<string, HabitStats>;
  onToggleDay: (habitId: string, dateStr: string) => void;
  onOpenAddModal: () => void;
}

export const WeeklyMatrix: React.FC<WeeklyMatrixProps> = ({
  habits,
  habitStatsMap,
  onToggleDay,
  onOpenAddModal,
}) => {
  if (habits.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-xs transition-colors">
        <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800 dark:text-white">No habits added yet</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          Add your first habit to view the full Monday to Sunday matrix!
        </p>
        <button
          onClick={onOpenAddModal}
          className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-slate-950 rounded-xl text-xs font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Habit</span>
        </button>
      </div>
    );
  }

  const sampleStats = habitStatsMap.get(habits[0].id);
  const weekDays = sampleStats ? sampleStats.weeklyDays : [];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden transition-colors">
      {/* Header bar */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Weekly Progress Matrix (Monday – Sunday)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Complete overview of daily check-ins across the current week. Click any day to toggle check-in status.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <span className="inline-block w-3 h-3 rounded bg-emerald-500" />
          <span>Completed</span>
          <span className="inline-block w-3 h-3 rounded bg-slate-100 dark:bg-slate-800 ml-2" />
          <span>Pending</span>
        </div>
      </div>

      {/* Table container with horizontal scroll */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              <th className="py-3 px-4 w-[240px]">Habit Name</th>
              {weekDays.map((d) => (
                <th
                  key={d.dateStr}
                  className={`py-3 px-2 text-center ${
                    d.isToday ? 'bg-amber-50/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-bold' : ''
                  }`}
                >
                  <div className="leading-tight">{d.shortDay}</div>
                  <div className="font-mono text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                    {d.dayNumber}
                  </div>
                </th>
              ))}
              <th className="py-3 px-3 text-center">Score</th>
              <th className="py-3 px-3 text-center">Current</th>
              <th className="py-3 px-3 text-center">Record</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {habits.map((habit) => {
              const stats = habitStatsMap.get(habit.id);
              const colorScheme = COLOR_SCHEMES[habit.color] || COLOR_SCHEMES.sky;

              return (
                <tr key={habit.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  {/* Habit info column */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colorScheme.iconBg}`}
                      >
                        <HabitIcon name={habit.iconName} className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 dark:text-white truncate">
                          {habit.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {habit.category}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 7 Days (Monday to Sunday) */}
                  {stats?.weeklyDays.map((day) => {
                    const isClickable = !day.isFuture;
                    return (
                      <td
                        key={day.dateStr}
                        className={`py-3 px-2 text-center ${
                          day.isToday ? 'bg-amber-50/40 dark:bg-amber-950/20' : ''
                        }`}
                      >
                        <button
                          type="button"
                          disabled={!isClickable}
                          onClick={() => onToggleDay(habit.id, day.dateStr)}
                          title={`${habit.name} on ${day.dayName} (${day.dateStr})`}
                          className={`w-7 h-7 mx-auto rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                            day.isCompleted
                              ? 'bg-emerald-500 dark:bg-emerald-600 text-white shadow-2xs hover:bg-emerald-600'
                              : isClickable
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-400 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-400'
                              : 'bg-slate-50 dark:bg-slate-800/30 text-slate-200 dark:text-slate-700 cursor-not-allowed'
                          }`}
                        >
                          {day.isCompleted ? (
                            <Check className="w-4 h-4 stroke-[2.5]" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                          )}
                        </button>
                      </td>
                    );
                  })}

                  {/* Weekly Score (e.g. 5/7) */}
                  <td className="py-3 px-3 text-center font-mono tabular-nums font-semibold text-slate-800 dark:text-slate-200">
                    {stats?.weeklyCompletedCount || 0}/7
                  </td>

                  {/* Current Streak */}
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center gap-1 font-mono tabular-nums text-amber-600 dark:text-amber-400 font-bold">
                      <Flame className="w-3.5 h-3.5 fill-amber-500 dark:fill-amber-400 text-amber-600 dark:text-amber-400" />
                      <span>{stats?.currentStreak || 0}</span>
                    </span>
                  </td>

                  {/* Longest Streak */}
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center gap-1 font-mono tabular-nums text-indigo-600 dark:text-indigo-400 font-semibold">
                      <Trophy className="w-3.5 h-3.5" />
                      <span>{stats?.longestStreak || 0}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
