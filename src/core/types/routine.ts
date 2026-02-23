export type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'night';

export type RoutineCategory =
  | 'exercise'
  | 'sleep'
  | 'meditation'
  | 'diet'
  | 'water'
  | 'skincare'
  | 'journal'
  | 'custom';

export type FrequencyType = 'daily' | 'specific_days' | 'weekly_count' | 'monthly_count';

export interface RoutineData {
  id: string;
  title: string;
  description?: string;
  icon: string;
  color: string;
  category: RoutineCategory;
  timeSlot: TimeSlot;
  scheduledTime?: string;
  frequencyType: FrequencyType;
  frequencyValue: string;
  durationMinutes?: number;
  reminderEnabled: boolean;
  reminderMinutesBefore: number;
  sortOrder: number;
  isActive: boolean;
  isFromTemplate: boolean;
  templateId?: string;
}

export interface RoutineLogData {
  id: string;
  routineId: string;
  completedAt: number;
  dateKey: string;
  moodScore?: number;
  note?: string;
}
