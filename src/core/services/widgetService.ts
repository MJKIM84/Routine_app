/**
 * Widget Data Service
 * 네이티브 위젯에 전달할 데이터를 준비하는 서비스.
 * 실제 위젯 연동은 iOS WidgetKit / Android AppWidget으로 별도 구현 필요.
 */

import { useRoutineStore } from '@core/stores/routineStore';
import { useBloomStore } from '@core/stores/bloomStore';
import { getTodayKey, getTimeSlotIcon, getCurrentTimeSlot } from '@core/utils/routine';
import type { RoutineData } from '@core/types';

// ─── Widget Data Types ──────────────────────────────────
export interface WidgetRoutineItem {
  id: string;
  title: string;
  icon: string;
  color: string;
  isCompleted: boolean;
  timeSlot: string;
}

export interface DailyProgressWidgetData {
  completedCount: number;
  totalCount: number;
  percentage: number;
  currentStreak: number;
  nextRoutine: WidgetRoutineItem | null;
  bloomEmoji: string;
  bloomHealth: number;
}

export interface RoutineListWidgetData {
  routines: WidgetRoutineItem[];
  completedCount: number;
  totalCount: number;
}

export interface BloomWidgetData {
  name: string;
  emoji: string;
  health: number;
  growthStage: number;
  waterDrops: number;
}

export type WidgetSize = 'small' | 'medium' | 'large';
export type WidgetType = 'daily_progress' | 'routine_list' | 'bloom' | 'motivation';

export interface WidgetConfig {
  type: WidgetType;
  size: WidgetSize;
  label: string;
  description: string;
  icon: string;
}

// ─── Available Widget Configurations ────────────────────
export const AVAILABLE_WIDGETS: WidgetConfig[] = [
  {
    type: 'daily_progress',
    size: 'small',
    label: '오늘의 진행률',
    description: '오늘 완료한 루틴 수와 진행률을 한눈에',
    icon: '📊',
  },
  {
    type: 'routine_list',
    size: 'medium',
    label: '루틴 목록',
    description: '오늘 해야 할 루틴 체크리스트',
    icon: '✅',
  },
  {
    type: 'bloom',
    size: 'small',
    label: 'Bloom 상태',
    description: 'Bloom 컴패니언의 건강 상태',
    icon: '🌱',
  },
  {
    type: 'motivation',
    size: 'small',
    label: '동기부여 카드',
    description: '매일 새로운 동기부여 메시지',
    icon: '💪',
  },
];

// ─── Motivation Quotes ──────────────────────────────────
const MOTIVATION_QUOTES = [
  { text: '작은 습관이 큰 변화를 만듭니다', author: '제임스 클리어' },
  { text: '오늘 하루도 최선을 다해봐요', author: 'RoutineFlow' },
  { text: '꾸준함이 재능을 이깁니다', author: '앤절라 더크워스' },
  { text: '시작이 반이다', author: '한국 속담' },
  { text: '어제보다 나은 오늘을 만들어가요', author: 'RoutineFlow' },
  { text: '습관의 힘을 믿으세요', author: '찰스 두히그' },
  { text: '완벽하지 않아도 괜찮아요. 꾸준하면 돼요.', author: 'RoutineFlow' },
];

export function getDailyMotivation(): { text: string; author: string } {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
  );
  return MOTIVATION_QUOTES[dayOfYear % MOTIVATION_QUOTES.length];
}

// ─── Data Builders ──────────────────────────────────────
const BLOOM_STAGE_EMOJIS = ['🌱', '🌿', '🌳', '🌸', '🌺'];

export function buildDailyProgressData(): DailyProgressWidgetData {
  const state = useRoutineStore.getState();
  const bloomState = useBloomStore.getState();
  const todayKey = getTodayKey();

  const activeRoutines = state.routines.filter((r) => r.isActive);
  const completedIds = new Set(
    state.logs.filter((l) => l.dateKey === todayKey).map((l) => l.routineId),
  );

  const completedCount = activeRoutines.filter((r) => completedIds.has(r.id)).length;
  const totalCount = activeRoutines.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Find next incomplete routine
  const currentSlot = getCurrentTimeSlot();
  const incomplete = activeRoutines.find(
    (r) => !completedIds.has(r.id) && r.timeSlot === currentSlot,
  ) || activeRoutines.find((r) => !completedIds.has(r.id));

  const nextRoutine = incomplete
    ? {
        id: incomplete.id,
        title: incomplete.title,
        icon: incomplete.icon,
        color: incomplete.color,
        isCompleted: false,
        timeSlot: incomplete.timeSlot,
      }
    : null;

  return {
    completedCount,
    totalCount,
    percentage,
    currentStreak: 0, // would come from streak service
    nextRoutine,
    bloomEmoji: BLOOM_STAGE_EMOJIS[bloomState.growthStage] || '🌱',
    bloomHealth: bloomState.health,
  };
}

export function buildRoutineListData(): RoutineListWidgetData {
  const state = useRoutineStore.getState();
  const todayKey = getTodayKey();

  const activeRoutines = state.routines.filter((r) => r.isActive);
  const completedIds = new Set(
    state.logs.filter((l) => l.dateKey === todayKey).map((l) => l.routineId),
  );

  const routines: WidgetRoutineItem[] = activeRoutines.map((r) => ({
    id: r.id,
    title: r.title,
    icon: r.icon,
    color: r.color,
    isCompleted: completedIds.has(r.id),
    timeSlot: getTimeSlotIcon(r.timeSlot),
  }));

  return {
    routines,
    completedCount: routines.filter((r) => r.isCompleted).length,
    totalCount: routines.length,
  };
}

export function buildBloomWidgetData(): BloomWidgetData {
  const bloomState = useBloomStore.getState();
  return {
    name: bloomState.name,
    emoji: BLOOM_STAGE_EMOJIS[bloomState.growthStage] || '🌱',
    health: bloomState.health,
    growthStage: bloomState.growthStage,
    waterDrops: bloomState.waterDrops,
  };
}
