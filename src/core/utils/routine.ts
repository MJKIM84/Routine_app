import type { TimeSlot, RoutineCategory, RoutineData } from '@core/types';
import { TIME_SLOTS } from '@config/constants';

/** Get current time slot based on hour */
export function getCurrentTimeSlot(): TimeSlot {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

/** Get today's date key (YYYY-MM-DD) */
export function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Format a date key to Korean-style display */
export function formatDateKey(dateKey: string): string {
  const [y, m, d] = dateKey.split('-');
  return `${Number(m)}월 ${Number(d)}일`;
}

/** Get the label for a time slot */
export function getTimeSlotLabel(slot: TimeSlot): string {
  return TIME_SLOTS[slot].label;
}

/** Get icon for time slot */
export function getTimeSlotIcon(slot: TimeSlot): string {
  const icons: Record<TimeSlot, string> = {
    morning: '🌅',
    afternoon: '☀️',
    evening: '🌇',
    night: '🌙',
  };
  return icons[slot];
}

/** Get icon for category */
export function getCategoryIcon(category: RoutineCategory): string {
  const icons: Record<RoutineCategory, string> = {
    exercise: '🏃',
    sleep: '😴',
    meditation: '🧘',
    diet: '🥗',
    water: '💧',
    skincare: '✨',
    journal: '📝',
    custom: '⚡',
  };
  return icons[category];
}

/** Get label for category */
export function getCategoryLabel(category: RoutineCategory): string {
  const labels: Record<RoutineCategory, string> = {
    exercise: '운동',
    sleep: '수면',
    meditation: '명상',
    diet: '식단',
    water: '수분 섭취',
    skincare: '스킨케어',
    journal: '일기',
    custom: '기타',
  };
  return labels[category];
}

/** Calculate daily completion rate */
export function getCompletionRate(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

/** Order time slots in daily order */
export const TIME_SLOT_ORDER: TimeSlot[] = ['morning', 'afternoon', 'evening', 'night'];

/** Group routines by time slot */
export function groupByTimeSlot(routines: RoutineData[]): Record<TimeSlot, RoutineData[]> {
  const groups: Record<TimeSlot, RoutineData[]> = {
    morning: [],
    afternoon: [],
    evening: [],
    night: [],
  };

  for (const routine of routines) {
    groups[routine.timeSlot].push(routine);
  }

  // Sort within each group by sortOrder
  for (const slot of TIME_SLOT_ORDER) {
    groups[slot].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  return groups;
}

/** Default colors for routines */
export const ROUTINE_COLORS = [
  '#1A6B3C', // Sage Green
  '#5C6BC0', // Indigo
  '#EF5350', // Red
  '#FF7043', // Deep Orange
  '#AB47BC', // Purple
  '#26A69A', // Teal
  '#42A5F5', // Blue
  '#FFB300', // Amber
  '#EC407A', // Pink
  '#66BB6A', // Green
];

/** Get default color for category */
export function getDefaultColorForCategory(category: RoutineCategory): string {
  const colorMap: Record<RoutineCategory, string> = {
    exercise: '#EF5350',
    sleep: '#5C6BC0',
    meditation: '#AB47BC',
    diet: '#66BB6A',
    water: '#42A5F5',
    skincare: '#EC407A',
    journal: '#FFB300',
    custom: '#26A69A',
  };
  return colorMap[category];
}
