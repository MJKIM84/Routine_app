import type { RoutineCategory, TimeSlot, FrequencyType } from '@core/types';

export interface RoutineTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: RoutineCategory;
  timeSlot: TimeSlot;
  durationMinutes: number;
  color: string;
  frequencyType: FrequencyType;
  frequencyValue: string;
}

export const ROUTINE_TEMPLATES: RoutineTemplate[] = [
  // Morning routines
  {
    id: 'tpl_morning_water',
    title: '기상 후 물 마시기',
    description: '일어나자마자 물 한 잔으로 몸을 깨워요',
    icon: '💧',
    category: 'water',
    timeSlot: 'morning',
    durationMinutes: 1,
    color: '#42A5F5',
    frequencyType: 'daily',
    frequencyValue: '1',
  },
  {
    id: 'tpl_morning_stretch',
    title: '아침 스트레칭',
    description: '10분 스트레칭으로 하루를 시작해요',
    icon: '🧘',
    category: 'exercise',
    timeSlot: 'morning',
    durationMinutes: 10,
    color: '#EF5350',
    frequencyType: 'daily',
    frequencyValue: '1',
  },
  {
    id: 'tpl_morning_meditation',
    title: '아침 명상',
    description: '5분 마음 챙김 명상으로 하루를 준비해요',
    icon: '🧘',
    category: 'meditation',
    timeSlot: 'morning',
    durationMinutes: 5,
    color: '#AB47BC',
    frequencyType: 'daily',
    frequencyValue: '1',
  },
  {
    id: 'tpl_morning_skincare',
    title: '아침 스킨케어',
    description: '세안 후 기초 스킨케어를 해요',
    icon: '✨',
    category: 'skincare',
    timeSlot: 'morning',
    durationMinutes: 5,
    color: '#EC407A',
    frequencyType: 'daily',
    frequencyValue: '1',
  },
  // Afternoon routines
  {
    id: 'tpl_lunch_walk',
    title: '점심 후 산책',
    description: '식후 15분 산책으로 소화를 도와요',
    icon: '🚶',
    category: 'exercise',
    timeSlot: 'afternoon',
    durationMinutes: 15,
    color: '#66BB6A',
    frequencyType: 'daily',
    frequencyValue: '1',
  },
  {
    id: 'tpl_afternoon_water',
    title: '오후 수분 섭취',
    description: '오후에 물 한 잔 더 마셔요',
    icon: '💧',
    category: 'water',
    timeSlot: 'afternoon',
    durationMinutes: 1,
    color: '#42A5F5',
    frequencyType: 'daily',
    frequencyValue: '1',
  },
  // Evening routines
  {
    id: 'tpl_evening_exercise',
    title: '저녁 운동',
    description: '30분 운동으로 체력을 키워요',
    icon: '🏃',
    category: 'exercise',
    timeSlot: 'evening',
    durationMinutes: 30,
    color: '#EF5350',
    frequencyType: 'daily',
    frequencyValue: '1',
  },
  {
    id: 'tpl_evening_journal',
    title: '감사 일기',
    description: '오늘 감사한 3가지를 적어봐요',
    icon: '📝',
    category: 'journal',
    timeSlot: 'evening',
    durationMinutes: 5,
    color: '#FFB300',
    frequencyType: 'daily',
    frequencyValue: '1',
  },
  // Night routines
  {
    id: 'tpl_night_skincare',
    title: '저녁 스킨케어',
    description: '자기 전 스킨케어 루틴을 해요',
    icon: '✨',
    category: 'skincare',
    timeSlot: 'night',
    durationMinutes: 10,
    color: '#EC407A',
    frequencyType: 'daily',
    frequencyValue: '1',
  },
  {
    id: 'tpl_night_no_phone',
    title: '취침 30분 전 핸드폰 끄기',
    description: '블루라이트 차단으로 수면의 질을 높여요',
    icon: '📱',
    category: 'sleep',
    timeSlot: 'night',
    durationMinutes: 30,
    color: '#5C6BC0',
    frequencyType: 'daily',
    frequencyValue: '1',
  },
  {
    id: 'tpl_night_meditation',
    title: '수면 명상',
    description: '편안한 명상으로 깊은 잠에 들어요',
    icon: '🌙',
    category: 'meditation',
    timeSlot: 'night',
    durationMinutes: 10,
    color: '#AB47BC',
    frequencyType: 'daily',
    frequencyValue: '1',
  },
];

/** Get templates grouped by time slot */
export function getTemplatesByTimeSlot(): Record<string, RoutineTemplate[]> {
  const groups: Record<string, RoutineTemplate[]> = {};
  for (const t of ROUTINE_TEMPLATES) {
    if (!groups[t.timeSlot]) groups[t.timeSlot] = [];
    groups[t.timeSlot].push(t);
  }
  return groups;
}
