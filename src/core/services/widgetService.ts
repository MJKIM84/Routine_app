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
  scheduledTime?: string;       // HH:mm format
  reminderEnabled: boolean;
  durationMinutes?: number;
  repeatLabel?: string;         // e.g. "매일", "평일", "주말"
}

export interface DailyProgressWidgetData {
  completedCount: number;
  totalCount: number;
  percentage: number;
  currentStreak: number;
  nextRoutine: WidgetRoutineItem | null;
  upcomingAlarms: WidgetAlarmItem[];
  bloomEmoji: string;
  bloomHealth: number;
}

export interface WidgetAlarmItem {
  routineId: string;
  routineTitle: string;
  routineIcon: string;
  routineColor: string;
  scheduledTime: string;        // HH:mm
  reminderMinutesBefore: number;
  alarmTime: string;            // Actual alarm time HH:mm (after offset)
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

export interface QuickActionResult {
  success: boolean;
  routineId: string;
  action: 'complete' | 'uncomplete' | 'start_timer';
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
    description: '오늘 완료한 루틴 수와 진행률, 다음 알람까지',
    icon: '📊',
  },
  {
    type: 'routine_list',
    size: 'medium',
    label: '루틴 목록',
    description: '오늘 해야 할 루틴 체크리스트 (탭하여 완료)',
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

// ─── Helpers ────────────────────────────────────────────
function getRepeatLabel(routine: RoutineData): string | undefined {
  switch (routine.repeatType) {
    case 'daily': return '매일';
    case 'weekdays': return '평일';
    case 'weekends': return '주말';
    case 'once': return '일회성';
    case 'interval': return routine.repeatIntervalDays ? `${routine.repeatIntervalDays}일 간격` : undefined;
    case 'specific_days': return '🔁';
    default: return undefined;
  }
}

function computeAlarmTime(scheduledTime: string, minutesBefore: number): string {
  const [h, m] = scheduledTime.split(':').map(Number);
  let alarmMinute = m - minutesBefore;
  let alarmHour = h;
  if (alarmMinute < 0) {
    alarmMinute += 60;
    alarmHour -= 1;
    if (alarmHour < 0) alarmHour = 23;
  }
  return `${String(alarmHour).padStart(2, '0')}:${String(alarmMinute).padStart(2, '0')}`;
}

function toWidgetRoutineItem(
  routine: RoutineData,
  isCompleted: boolean,
): WidgetRoutineItem {
  return {
    id: routine.id,
    title: routine.title,
    icon: routine.icon,
    color: routine.color,
    isCompleted,
    timeSlot: getTimeSlotIcon(routine.timeSlot),
    scheduledTime: routine.scheduledTime,
    reminderEnabled: routine.reminderEnabled,
    durationMinutes: routine.durationMinutes,
    repeatLabel: getRepeatLabel(routine),
  };
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

  // Find next incomplete routine (prioritize current time slot)
  const currentSlot = getCurrentTimeSlot();
  const incomplete = activeRoutines.find(
    (r) => !completedIds.has(r.id) && r.timeSlot === currentSlot,
  ) || activeRoutines.find((r) => !completedIds.has(r.id));

  const nextRoutine = incomplete
    ? toWidgetRoutineItem(incomplete, false)
    : null;

  // Build upcoming alarms (sorted by alarm time, only incomplete routines)
  const now = new Date();
  const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const upcomingAlarms: WidgetAlarmItem[] = activeRoutines
    .filter(r =>
      !completedIds.has(r.id) &&
      r.reminderEnabled &&
      r.scheduledTime
    )
    .map(r => {
      const alarmTime = computeAlarmTime(r.scheduledTime!, r.reminderMinutesBefore);
      return {
        routineId: r.id,
        routineTitle: r.title,
        routineIcon: r.icon,
        routineColor: r.color,
        scheduledTime: r.scheduledTime!,
        reminderMinutesBefore: r.reminderMinutesBefore,
        alarmTime,
      };
    })
    .filter(a => a.alarmTime >= currentTimeStr) // Only future alarms
    .sort((a, b) => a.alarmTime.localeCompare(b.alarmTime))
    .slice(0, 5); // Max 5 upcoming alarms

  return {
    completedCount,
    totalCount,
    percentage,
    currentStreak: 0, // would come from streak service
    nextRoutine,
    upcomingAlarms,
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

  const routines: WidgetRoutineItem[] = activeRoutines
    .sort((a, b) => {
      // Sort by scheduled time first, then sort order
      if (a.scheduledTime && b.scheduledTime) {
        return a.scheduledTime.localeCompare(b.scheduledTime);
      }
      if (a.scheduledTime) return -1;
      if (b.scheduledTime) return 1;
      return a.sortOrder - b.sortOrder;
    })
    .map((r) => toWidgetRoutineItem(r, completedIds.has(r.id)));

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

// ─── Quick Actions (Widget → App) ───────────────────────
/**
 * 위젯에서 루틴을 바로 완료 처리할 때 호출.
 * SharedDefaults나 Intent 등으로 위젯에서 앱으로 routineId를 전달하면
 * 이 함수를 호출하여 즉시 완료 처리한다.
 */
export function handleWidgetQuickComplete(routineId: string): QuickActionResult {
  const state = useRoutineStore.getState();
  const routine = state.routines.find(r => r.id === routineId);
  if (!routine) {
    return { success: false, routineId, action: 'complete' };
  }

  const todayKey = getTodayKey();
  const alreadyCompleted = state.logs.some(
    l => l.routineId === routineId && l.dateKey === todayKey,
  );

  if (alreadyCompleted) {
    // Uncomplete (toggle off)
    state.uncompleteRoutine(routineId);
    return { success: true, routineId, action: 'uncomplete' };
  } else {
    // Complete
    state.completeRoutine(routineId);
    return { success: true, routineId, action: 'complete' };
  }
}

/**
 * 위젯에서 바로 알람 정보를 가져올 때 사용.
 * SharedDefaults를 통해 위젯이 이 데이터를 읽어서
 * 다음 알람 시간 등을 표시할 수 있다.
 */
export function getNextAlarmInfo(): WidgetAlarmItem | null {
  const state = useRoutineStore.getState();
  const todayKey = getTodayKey();

  const completedIds = new Set(
    state.logs.filter(l => l.dateKey === todayKey).map(l => l.routineId),
  );

  const now = new Date();
  const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const alarmedRoutines = state.routines
    .filter(r =>
      r.isActive &&
      !completedIds.has(r.id) &&
      r.reminderEnabled &&
      r.scheduledTime
    )
    .map(r => {
      const alarmTime = computeAlarmTime(r.scheduledTime!, r.reminderMinutesBefore);
      return {
        routineId: r.id,
        routineTitle: r.title,
        routineIcon: r.icon,
        routineColor: r.color,
        scheduledTime: r.scheduledTime!,
        reminderMinutesBefore: r.reminderMinutesBefore,
        alarmTime,
      };
    })
    .filter(a => a.alarmTime >= currentTimeStr)
    .sort((a, b) => a.alarmTime.localeCompare(b.alarmTime));

  return alarmedRoutines[0] ?? null;
}

/**
 * 위젯이 표시할 전체 데이터를 JSON으로 직렬화.
 * SharedDefaults (iOS) 또는 SharedPreferences (Android)에 저장하면
 * 네이티브 위젯이 이 데이터를 읽어서 렌더링한다.
 */
export function serializeWidgetData(): string {
  return JSON.stringify({
    progress: buildDailyProgressData(),
    routines: buildRoutineListData(),
    bloom: buildBloomWidgetData(),
    motivation: getDailyMotivation(),
    nextAlarm: getNextAlarmInfo(),
    updatedAt: Date.now(),
  });
}
