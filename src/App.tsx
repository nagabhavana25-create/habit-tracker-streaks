import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Flame,
  Search,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Habit, HabitStats } from './types';
import { INITIAL_HABITS, getInitialCheckIns } from './data/defaultHabits';
import {
  getTodayKey,
  calculateStreaks,
  calculateWeeklyStats,
} from './utils/dateUtils';
import { Navbar } from './components/Navbar';
import { DashboardStats } from './components/DashboardStats';
import { HabitCard } from './components/HabitCard';
import { AddHabitModal } from './components/AddHabitModal';
import { EditHabitModal } from './components/EditHabitModal';
import { WeeklyMatrix } from './components/WeeklyMatrix';

const STORAGE_KEY_HABITS = 'habit_tracker_habits_v1';
const STORAGE_KEY_CHECKINS = 'habit_tracker_checkins_v1';
const STORAGE_KEY_THEME = 'habit_tracker_theme_v1';

export default function App() {
  // Theme state: defaults to dark mode per user request!
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
      if (savedTheme !== null) {
        return savedTheme === 'dark';
      }
      return true; // Default to Dark Mode
    } catch {
      return true;
    }
  });

  // Apply dark mode class to html tag
  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem(STORAGE_KEY_THEME, 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem(STORAGE_KEY_THEME, 'light');
      }
    } catch (e) {
      console.error('Error toggling theme:', e);
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Initialize habits from localStorage or defaults
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HABITS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_HABITS;
  });

  // Initialize check-ins from localStorage or defaults
  const [checkIns, setCheckIns] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHECKINS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return getInitialCheckIns();
  });

  // Navigation & Modals
  const [activeView, setActiveView] = useState<'dashboard' | 'matrix'>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  // Filters
  const [filterType, setFilterType] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Save to localStorage on state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(habits));
    } catch (e) {
      console.error('Failed to save habits to localStorage:', e);
    }
  }, [habits]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHECKINS, JSON.stringify(checkIns));
    } catch (e) {
      console.error('Failed to save check-ins to localStorage:', e);
    }
  }, [checkIns]);

  // Live real-time date (automatically updates daily on Oct 10 and every day)
  const todayKey = getTodayKey();

  // Compute stats dynamically for every habit from actual check-in data
  const habitStatsMap = useMemo(() => {
    const map = new Map<string, HabitStats>();

    for (const habit of habits) {
      const habitCheckins = checkIns[habit.id] || [];
      const streakInfo = calculateStreaks(habitCheckins);
      const weeklyInfo = calculateWeeklyStats(habitCheckins, habit.targetDaysPerWeek);

      map.set(habit.id, {
        currentStreak: streakInfo.currentStreak,
        longestStreak: streakInfo.longestStreak,
        isCompletedToday: weeklyInfo.isCompletedToday,
        weeklyCompletedCount: weeklyInfo.completedCount,
        weeklyTarget: weeklyInfo.targetCount,
        weeklyPercentage: weeklyInfo.percentage,
        weeklyDays: weeklyInfo.days,
        totalCompletions: habitCheckins.length,
      });
    }

    return map;
  }, [habits, checkIns]);

  // Overall aggregate stats
  const totalHabitsCount = habits.length;
  let completedTodayCount = 0;
  let bestActiveStreak = 0;
  let bestHabitName = '';
  let totalCheckInsCount = 0;

  for (const habit of habits) {
    const stats = habitStatsMap.get(habit.id);
    if (stats) {
      if (stats.isCompletedToday) completedTodayCount++;
      if (stats.currentStreak > bestActiveStreak) {
        bestActiveStreak = stats.currentStreak;
        bestHabitName = habit.name;
      }
      totalCheckInsCount += stats.totalCompletions;
    }
  }

  // Toggle check-in for TODAY
  const handleToggleToday = (habitId: string) => {
    setCheckIns((prev) => {
      const currentDates = prev[habitId] || [];
      const isAlreadyChecked = currentDates.includes(todayKey);

      let updatedDates: string[];
      if (isAlreadyChecked) {
        updatedDates = currentDates.filter((d) => d !== todayKey);
      } else {
        updatedDates = [...currentDates, todayKey];
      }

      return {
        ...prev,
        [habitId]: updatedDates,
      };
    });
  };

  // Toggle check-in for any given date in the week
  const handleToggleDay = (habitId: string, dateStr: string) => {
    if (dateStr > todayKey) return;

    setCheckIns((prev) => {
      const currentDates = prev[habitId] || [];
      const isAlreadyChecked = currentDates.includes(dateStr);

      let updatedDates: string[];
      if (isAlreadyChecked) {
        updatedDates = currentDates.filter((d) => d !== dateStr);
      } else {
        updatedDates = [...currentDates, dateStr];
      }

      return {
        ...prev,
        [habitId]: updatedDates,
      };
    });
  };

  // Add new habit
  const handleAddHabit = (newHabitData: Omit<Habit, 'id'>) => {
    const newId = `habit-${Date.now()}`;
    const newHabit: Habit = {
      ...newHabitData,
      id: newId,
    };
    setHabits((prev) => [newHabit, ...prev]);
    setCheckIns((prev) => ({
      ...prev,
      [newId]: [],
    }));
  };

  // Update existing habit
  const handleUpdateHabit = (updatedHabit: Habit) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === updatedHabit.id ? updatedHabit : h))
    );
  };

  // Delete habit
  const handleDeleteHabit = (habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    setCheckIns((prev) => {
      const copy = { ...prev };
      delete copy[habitId];
      return copy;
    });
  };

  // Reset to demo data
  const handleResetToDemoData = () => {
    if (
      window.confirm(
        'Reset all habits and check-ins to default demo data? This is great for demonstrating streaks and progress.'
      )
    ) {
      setHabits(INITIAL_HABITS);
      setCheckIns(getInitialCheckIns());
    }
  };

  // Unique categories for filtering
  const allCategories = useMemo(() => {
    const set = new Set<string>();
    habits.forEach((h) => {
      if (h.category) set.add(h.category);
    });
    return Array.from(set);
  }, [habits]);

  // Filtered habits list
  const filteredHabits = useMemo(() => {
    return habits.filter((habit) => {
      const stats = habitStatsMap.get(habit.id);
      const isCompleted = stats?.isCompletedToday ?? false;

      if (filterType === 'pending' && isCompleted) return false;
      if (filterType === 'completed' && !isCompleted) return false;

      if (selectedCategory !== 'all' && habit.category !== selectedCategory) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = habit.name.toLowerCase().includes(query);
        const matchesCat = habit.category.toLowerCase().includes(query);
        const matchesNotes = habit.notes?.toLowerCase().includes(query) ?? false;
        if (!matchesName && !matchesCat && !matchesNotes) return false;
      }

      return true;
    });
  }, [habits, habitStatsMap, filterType, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased selection:bg-amber-100 selection:text-amber-900 dark:selection:bg-amber-900 dark:selection:text-amber-100 transition-colors">
      {/* Top Bar Navigation */}
      <Navbar
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onResetData={handleResetToDemoData}
        activeView={activeView}
        setActiveView={setActiveView}
        totalHabitsCount={totalHabitsCount}
        completedTodayCount={completedTodayCount}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Dashboard Overview Cards */}
        <DashboardStats
          totalHabits={totalHabitsCount}
          completedTodayCount={completedTodayCount}
          bestActiveStreak={bestActiveStreak}
          bestHabitName={bestHabitName}
          totalCheckInsCount={totalCheckInsCount}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />

        {/* View Switcher Content */}
        {activeView === 'matrix' ? (
          <WeeklyMatrix
            habits={habits}
            habitStatsMap={habitStatsMap}
            onToggleDay={handleToggleDay}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        ) : (
          <div className="space-y-5">
            {/* Controls Bar: Filters & Search */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors">
              {/* Left: Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    filterType === 'all'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All ({totalHabitsCount})
                </button>
                <button
                  onClick={() => setFilterType('pending')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    filterType === 'pending'
                      ? 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-400 shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Pending ({totalHabitsCount - completedTodayCount})
                </button>
                <button
                  onClick={() => setFilterType('completed')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    filterType === 'completed'
                      ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Completed Today ({completedTodayCount})
                </button>
              </div>

              {/* Right: Search & Category selector */}
              <div className="flex items-center gap-2">
                {allCategories.length > 1 && (
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-2.5 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-amber-400"
                  >
                    <option value="all">All Categories</option>
                    {allCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                )}

                <div className="relative flex-1 sm:w-56">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search habits..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-amber-400 focus:bg-white dark:focus:bg-slate-800 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Habits Cards Grid */}
            {filteredHabits.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredHabits.map((habit) => {
                  const stats = habitStatsMap.get(habit.id)!;
                  return (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      stats={stats}
                      onToggleToday={handleToggleToday}
                      onToggleDay={handleToggleDay}
                      onEdit={(h) => setEditingHabit(h)}
                      onDelete={handleDeleteHabit}
                    />
                  );
                })}
              </div>
            ) : (
              /* Empty state */
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center shadow-xs transition-colors">
                <CheckCircle2 className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2.5" />
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  {habits.length === 0
                    ? 'No habits created yet'
                    : 'No habits match your filter'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  {habits.length === 0
                    ? 'Start tracking your habits and watching your streaks grow!'
                    : 'Try clearing your search query or selecting a different filter.'}
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  {habits.length === 0 ? (
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-slate-950 rounded-xl text-xs font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add First Habit</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setFilterType('all');
                        setSelectedCategory('all');
                        setSearchQuery('');
                      }}
                      className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Academic / Student Project Explanation Card */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                How Daily Streaks &amp; Weekly Progress Work
              </h4>
              <p>
                <strong>Streak Calculation:</strong> Your current streak increases by 1 for each consecutive day you check in. If you completed a habit yesterday, your streak remains active awaiting today&apos;s check-in. If a day is missed without a check-in, the current streak resets to 0. Longest streak keeps track of your personal all-time consecutive record.
              </p>
              <p>
                <strong>Weekly Progress:</strong> Automatically calculates your completion count from Monday to Sunday (e.g. 5/7 days = 71%). All check-ins and streaks are computed from real timestamped data stored securely in your browser&apos;s LocalStorage.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 mt-12 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">Habit Tracker with Streaks</span>
            <span aria-hidden="true">·</span>
            <span>Local Storage Powered</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
            <a
              href="/habit-tracker-with-streaks.zip"
              download="habit-tracker-with-streaks.zip"
              className="text-amber-600 dark:text-amber-400 font-medium hover:underline transition-colors"
            >
              Download Source Code (.ZIP)
            </a>
            <span aria-hidden="true">·</span>
            <button
              onClick={handleResetToDemoData}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Reset Sample Data
            </button>
            <span aria-hidden="true">·</span>
            <span>Mon – Sun Weekly Cycle</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddHabitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddHabit={handleAddHabit}
      />

      <EditHabitModal
        habit={editingHabit}
        isOpen={!!editingHabit}
        onClose={() => setEditingHabit(null)}
        onUpdateHabit={handleUpdateHabit}
        onDeleteHabit={handleDeleteHabit}
      />
    </div>
  );
}
