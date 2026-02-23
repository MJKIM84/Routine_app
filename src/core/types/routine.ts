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

export type RepeatType = 'once' | 'daily' | 'weekdays' | 'weekends' | 'specific_days' | 'interval';

export interface RoutineData {
  id: string;
  title: string;
  description?: string;
  icon: string;
  color: string;
  category: RoutineCategory;
  timeSlot: TimeSlot;
  scheduledTime?: string;          // HH:mm format
  frequencyType: FrequencyType;
  frequencyValue: string;          // days: "mon,tue,wed" or count: "3"
  durationMinutes?: number;        // Timer duration
  reminderEnabled: boolean;
  reminderMinutesBefore: number;   // 0 = at exact time
  repeatType?: RepeatType;         // How often this routine repeats
  repeatIntervalDays?: number;     // For 'interval' type: every N days
  sortOrder: number;
  isActive: boolean;
  isFromTemplate: boolean;
  templateId?: string;
  createdAt?: number;              // Timestamp
}

export interface RoutineLogData {
  id: string;
  routineId: string;
  completedAt: number;
  dateKey: string;
  durationSeconds?: number;        // Actual time spent (from timer)
  moodScore?: number;
  note?: string;
}
