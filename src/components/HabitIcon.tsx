import React from 'react';
import {
  Droplets,
  BookOpen,
  Dumbbell,
  Sparkles,
  Moon,
  Brain,
  Flame,
  Heart,
  Coffee,
  Smile,
  Clock,
  Target,
  Activity,
  CheckCircle2,
  Footprints,
  LucideIcon,
} from 'lucide-react';

interface HabitIconProps {
  name: string;
  className?: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  droplet: Droplets,
  water: Droplets,
  'book-open': BookOpen,
  book: BookOpen,
  dumbbell: Dumbbell,
  fitness: Dumbbell,
  exercise: Dumbbell,
  sparkles: Sparkles,
  read: Sparkles,
  moon: Moon,
  sleep: Moon,
  brain: Brain,
  study: BookOpen,
  heart: Heart,
  coffee: Coffee,
  smile: Smile,
  clock: Clock,
  target: Target,
  activity: Activity,
  steps: Footprints,
  flame: Flame,
};

export const HabitIcon: React.FC<HabitIconProps> = ({ name, className = 'w-5 h-5' }) => {
  const IconComponent = ICON_MAP[name.toLowerCase()] || CheckCircle2;
  return <IconComponent className={className} />;
};

export const AVAILABLE_ICONS = [
  { id: 'droplet', label: 'Water', icon: Droplets },
  { id: 'book-open', label: 'Study/Book', icon: BookOpen },
  { id: 'dumbbell', label: 'Exercise', icon: Dumbbell },
  { id: 'sparkles', label: 'Mindset', icon: Sparkles },
  { id: 'moon', label: 'Sleep', icon: Moon },
  { id: 'brain', label: 'Brain', icon: Brain },
  { id: 'heart', label: 'Health', icon: Heart },
  { id: 'steps', label: 'Walking', icon: Footprints },
  { id: 'coffee', label: 'Break/Coffee', icon: Coffee },
  { id: 'target', label: 'Goal', icon: Target },
];
