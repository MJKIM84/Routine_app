/**
 * Retention Service
 * 사용자 리텐션을 위한 전략적 알림, 넛지, 재참여 로직.
 * 실제 푸시 알림은 expo-notifications와 연동 필요.
 */

import { useRoutineStore } from '@core/stores/routineStore';
import { useBloomStore } from '@core/stores/bloomStore';
import { getTodayKey } from '@core/utils/routine';

// ─── Types ──────────────────────────────────────────────
export type NudgeType =
  | 'morning_reminder'
  | 'streak_at_risk'
  | 'bloom_needs_care'
  | 'weekly_report'
  | 'milestone_celebration'
  | 'comeback'
  | 'time_slot_reminder';

export interface Nudge {
  type: NudgeType;
  title: string;
  body: string;
  emoji: string;
  priority: 'low' | 'medium' | 'high';
}

export interface RetentionMetrics {
  daysActive: number;
  lastActiveDate: string;
  daysSinceLastActive: number;
  isAtRisk: boolean;
  riskLevel: 'none' | 'low' | 'medium' | 'high';
}

// ─── Nudge Templates ────────────────────────────────────
const MORNING_MESSAGES = [
  { title: '좋은 아침이에요! 🌅', body: '오늘의 루틴을 시작해볼까요?' },
  { title: '새로운 하루의 시작! ☀️', body: '어제보다 나은 오늘을 만들어봐요.' },
  { title: '루틴 시간이에요! 🌱', body: 'Bloom이 당신을 기다리고 있어요.' },
];

const STREAK_RISK_MESSAGES = [
  { title: '스트릭이 위험해요! 🔥', body: '오늘 루틴을 완료하면 연속 기록이 유지돼요.' },
  { title: '아직 늦지 않았어요! ⏰', body: '지금 시작하면 스트릭을 지킬 수 있어요.' },
];

const BLOOM_CARE_MESSAGES = [
  { title: 'Bloom이 목마릅니다 💧', body: '루틴을 완료해서 Bloom에게 물을 주세요.' },
  { title: 'Bloom이 당신을 그리워해요 🌱', body: '오늘 루틴으로 Bloom을 돌봐주세요.' },
];

const MILESTONE_MESSAGES: Record<number, { title: string; body: string }> = {
  3: { title: '3일 연속 달성! 🎉', body: '습관이 만들어지기 시작했어요!' },
  7: { title: '1주일 연속! 🏆', body: '대단해요! 첫 번째 주를 완벽히 마무리했어요.' },
  14: { title: '2주 연속 달성! 🌟', body: '이미 습관이 되어가고 있어요!' },
  21: { title: '21일! 습관 형성 완료! 💪', body: '이제 당신의 일부가 되었어요.' },
  30: { title: '한 달 달성! 🎊', body: '30일간의 꾸준함, 정말 대단해요!' },
  50: { title: '50일 돌파! 🚀', body: '절반의 100일, 계속 가보자구요!' },
  100: { title: '100일 달성! 🏅', body: '전설적인 꾸준함이에요!' },
};

const COMEBACK_MESSAGES = [
  { title: '다시 만나서 반가워요! 👋', body: 'Bloom이 기다리고 있었어요. 오늘부터 다시 시작해봐요.' },
  { title: '괜찮아요, 다시 시작하면 돼요! 💛', body: '완벽하지 않아도 괜찮아요. 한 걸음만 내딛어봐요.' },
];

// ─── Nudge Generator ────────────────────────────────────
export function generateNudges(): Nudge[] {
  const routineState = useRoutineStore.getState();
  const bloomState = useBloomStore.getState();
  const todayKey = getTodayKey();
  const nudges: Nudge[] = [];

  const active = routineState.routines.filter((r) => r.isActive);
  const todayLogs = routineState.logs.filter((l) => l.dateKey === todayKey);
  const completedIds = new Set(todayLogs.map((l) => l.routineId));
  const completedCount = active.filter((r) => completedIds.has(r.id)).length;
  const pendingCount = active.length - completedCount;

  // Morning reminder (if nothing done yet)
  if (completedCount === 0 && active.length > 0) {
    const msg = MORNING_MESSAGES[Math.floor(Math.random() * MORNING_MESSAGES.length)];
    nudges.push({
      type: 'morning_reminder',
      title: msg.title,
      body: msg.body,
      emoji: '🌅',
      priority: 'medium',
    });
  }

  // Streak at risk (some done but not all, evening time)
  const hour = new Date().getHours();
  if (pendingCount > 0 && completedCount > 0 && hour >= 18) {
    const msg = STREAK_RISK_MESSAGES[Math.floor(Math.random() * STREAK_RISK_MESSAGES.length)];
    nudges.push({
      type: 'streak_at_risk',
      title: msg.title,
      body: `${pendingCount}개 루틴이 남았어요. ${msg.body}`,
      emoji: '🔥',
      priority: 'high',
    });
  }

  // Bloom health low
  if (bloomState.health < 40) {
    const msg = BLOOM_CARE_MESSAGES[Math.floor(Math.random() * BLOOM_CARE_MESSAGES.length)];
    nudges.push({
      type: 'bloom_needs_care',
      title: msg.title,
      body: msg.body,
      emoji: '🌱',
      priority: 'medium',
    });
  }

  return nudges;
}

// ─── Milestone Checker ──────────────────────────────────
export function checkMilestone(streakDays: number): Nudge | null {
  const milestone = MILESTONE_MESSAGES[streakDays];
  if (!milestone) return null;

  return {
    type: 'milestone_celebration',
    title: milestone.title,
    body: milestone.body,
    emoji: '🎉',
    priority: 'low',
  };
}

// ─── Comeback Detection ─────────────────────────────────
export function generateComebackNudge(daysSinceLastActive: number): Nudge | null {
  if (daysSinceLastActive < 3) return null;

  const msg = COMEBACK_MESSAGES[Math.floor(Math.random() * COMEBACK_MESSAGES.length)];
  return {
    type: 'comeback',
    title: msg.title,
    body: msg.body,
    emoji: '👋',
    priority: 'high',
  };
}

// ─── Retention Metrics ──────────────────────────────────
export function calculateRetentionMetrics(): RetentionMetrics {
  const state = useRoutineStore.getState();
  const logs = state.logs;

  if (logs.length === 0) {
    return {
      daysActive: 0,
      lastActiveDate: '',
      daysSinceLastActive: 999,
      isAtRisk: false,
      riskLevel: 'none',
    };
  }

  // Unique active dates
  const activeDates = new Set(logs.map((l) => l.dateKey));
  const daysActive = activeDates.size;

  // Last active date
  const sortedDates = Array.from(activeDates).sort();
  const lastActiveDate = sortedDates[sortedDates.length - 1];
  const lastActive = new Date(lastActiveDate + 'T00:00:00');
  const daysSince = Math.floor((Date.now() - lastActive.getTime()) / 86400000);

  // Risk assessment
  let riskLevel: RetentionMetrics['riskLevel'] = 'none';
  if (daysSince >= 7) riskLevel = 'high';
  else if (daysSince >= 3) riskLevel = 'medium';
  else if (daysSince >= 2) riskLevel = 'low';

  return {
    daysActive,
    lastActiveDate,
    daysSinceLastActive: daysSince,
    isAtRisk: riskLevel !== 'none',
    riskLevel,
  };
}

// ─── Notification Schedule Planner ──────────────────────
export interface ScheduledNotification {
  title: string;
  body: string;
  scheduledTime: string; // HH:mm format
  daysOfWeek: number[]; // 0=Sun, 1=Mon, etc.
  enabled: boolean;
}

export function getDefaultNotificationSchedule(): ScheduledNotification[] {
  return [
    {
      title: '좋은 아침이에요! 🌅',
      body: '오늘의 루틴을 확인해보세요.',
      scheduledTime: '07:30',
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      enabled: true,
    },
    {
      title: '점심 시간 루틴 ☀️',
      body: '오후 루틴을 시작할 시간이에요.',
      scheduledTime: '12:00',
      daysOfWeek: [1, 2, 3, 4, 5],
      enabled: false,
    },
    {
      title: '저녁 루틴 리마인더 🌇',
      body: '오늘의 루틴을 마무리해볼까요?',
      scheduledTime: '20:00',
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      enabled: true,
    },
    {
      title: '주간 리포트 📊',
      body: '이번 주 루틴 성과를 확인해보세요!',
      scheduledTime: '10:00',
      daysOfWeek: [0], // Sunday only
      enabled: true,
    },
  ];
}
