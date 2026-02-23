export const APP_NAME = 'RoutineFlow';
export const APP_VERSION = '0.1.0';

export const ONBOARDING_DURATION_TARGET = 180; // 3분 (초)

export const AI_COACH_FREE_LIMIT = 3; // 무료 일일 AI 코칭 횟수
export const STREAK_RESTORE_PREMIUM_LIMIT = 2; // Premium 월간 스트릭 복원 횟수

export const BLOOM_MAX_HEALTH = 100;
export const BLOOM_GROWTH_PER_ROUTINE = 5;
export const BLOOM_WATER_PER_ROUTINE = 2;

export const TIME_SLOTS = {
  morning: { start: '05:00', end: '11:59', label: '아침' },
  afternoon: { start: '12:00', end: '16:59', label: '오후' },
  evening: { start: '17:00', end: '20:59', label: '저녁' },
  night: { start: '21:00', end: '04:59', label: '밤' },
} as const;
