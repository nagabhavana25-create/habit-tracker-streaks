import React, { useState } from 'react';
import { X, Sparkles, Check } from 'lucide-react';
import { Habit, HabitColor } from '../types';
import { COLOR_OPTIONS } from '../utils/themeUtils';
import { AVAILABLE_ICONS } from './HabitIcon';
import { getTodayKey } from '../utils/dateUtils';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHabit: (habit: Omit<Habit, 'id'>) => void;
}

const PRESET_HABITS: {
  name: string;
  category: string;
  color: HabitColor;
  iconName: string;
  notes: string;
}[] = [
  {
    name: 'Drink Water',
    category: 'Health',
    color: 'sky',
    iconName: 'droplet',
    notes: 'Stay hydrated with at least 8 glasses daily',
  },
  {
    name: 'Exercise',
    category: 'Fitness',
    color: 'emerald',
    iconName: 'dumbbell',
    notes: '30 mins workout or stretching',
  },
  {
    name: 'Study',
    category: 'Education',
    color: 'indigo',
    iconName: 'book-open',
    notes: 'Focus on Web Tech revision or coursework',
  },
  {
    name: 'Read Book',
    category: 'Mindset',
    color: 'amber',
    iconName: 'sparkles',
    notes: 'Read at least 15 minutes before bed',
  },
  {
    name: 'Sleep Early',
    category: 'Routine',
    color: 'violet',
    iconName: 'moon',
    notes: 'Turn off screens by 10:30 PM',
  },
  {
    name: 'Meditate',
    category: 'Mindset',
    color: 'teal',
    iconName: 'brain',
    notes: '10 minutes mindfulness and calm breathing',
  },
];

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  isOpen,
  onClose,
  onAddHabit,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Personal');
  const [color, setColor] = useState<HabitColor>('emerald');
  const [iconName, setIconName] = useState('check');
  const [targetDays, setTargetDays] = useState(7);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSelectPreset = (preset: typeof PRESET_HABITS[0]) => {
    setName(preset.name);
    setCategory(preset.category);
    setColor(preset.color);
    setIconName(preset.iconName);
    setNotes(preset.notes);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a habit name.');
      return;
    }

    onAddHabit({
      name: name.trim(),
      category: category.trim() || 'General',
      color,
      iconName: iconName || 'check',
      targetDaysPerWeek: Number(targetDays) || 7,
      createdAt: getTodayKey(),
      notes: notes.trim() || undefined,
    });

    setName('');
    setNotes('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add New Habit</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create a new daily routine to track streaks and weekly progress.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {/* Quick Preset Suggestions */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Quick Suggestions:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_HABITS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-all cursor-pointer ${
                    name === preset.name
                      ? 'border-slate-900 bg-slate-900 text-white dark:border-amber-500 dark:bg-amber-500 dark:text-slate-950 font-medium'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Habit Name Input */}
          <div>
            <label htmlFor="habit-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Habit Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="habit-name"
              type="text"
              required
              placeholder="e.g. Drink Water, Study, Exercise..."
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-amber-400 transition-all"
              autoFocus
            />
            {error && <p className="text-xs text-rose-500 mt-1 font-medium">{error}</p>}
          </div>

          {/* Category & Target Days Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="habit-category" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                id="habit-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-amber-400"
              >
                <option value="Health">Health</option>
                <option value="Fitness">Fitness</option>
                <option value="Education">Education</option>
                <option value="Mindset">Mindset</option>
                <option value="Routine">Routine</option>
                <option value="Productivity">Productivity</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            <div>
              <label htmlFor="habit-target-days" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Weekly Target (Days)
              </label>
              <select
                id="habit-target-days"
                value={targetDays}
                onChange={(e) => setTargetDays(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-amber-400 font-mono"
              >
                <option value={7}>Every Day (7/7)</option>
                <option value={6}>6 Days / Week</option>
                <option value={5}>Weekdays (5/7)</option>
                <option value={4}>4 Days / Week</option>
                <option value={3}>3 Days / Week</option>
              </select>
            </div>
          </div>

          {/* Color Theme Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Color Theme
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {COLOR_OPTIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setColor(item.id)}
                  aria-label={item.label}
                  className={`w-7 h-7 rounded-full ${item.bgClass} flex items-center justify-center transition-transform cursor-pointer ${
                    color === item.id ? 'ring-3 ring-slate-900 dark:ring-amber-400 ring-offset-2 dark:ring-offset-slate-900 scale-110' : 'hover:scale-105'
                  }`}
                >
                  {color === item.id && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Icon
            </label>
            <div className="grid grid-cols-5 gap-2">
              {AVAILABLE_ICONS.map((item) => {
                const IconCmp = item.icon;
                const isSelected = iconName === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIconName(item.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white dark:border-amber-500 dark:bg-amber-500 dark:text-slate-950'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <IconCmp className="w-4 h-4" />
                    <span className="text-[10px] mt-1 truncate max-w-full font-medium">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Motivation/Notes */}
          <div>
            <label htmlFor="habit-notes" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Short Description / Goal (Optional)
            </label>
            <input
              id="habit-notes"
              type="text"
              placeholder="e.g. 8 glasses per day or 25 mins pomodoro"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-amber-400"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-slate-950 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              Create Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
