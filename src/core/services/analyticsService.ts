/**
 * Analytics Service
 * 루틴 데이터에서 통계, 트렌드, 인사이트를 계산하는 서비스.
 */

import type { RoutineData, RoutineLogData, TimeSlot, RoutineCategory } from '@core/types';
import { getTimeSlotLabel, getCategoryLabel } from '@core/utils/routine';

// ─── Types ──────────────────────────────────────────────
export interface DailyStats {
  dateKey: string;
  completedCount: number;
  totalCount: number;
  rate: number; // 0-100
}

export interface WeeklyStats {
  weekLabel: string;
  days: DailyStats[];
  avgRate: number;
  totalCompleted: number;
}

export interface CategoryStats {
  category: string;
  label: string;
  count: number;
  completedCount: number;
  rate: number;
}

export interface TimeSlotStats {
  timeSlot: TimeSlot;
  label: string;
  count: number;
  completedCount: number;
  rate: number;
}

export interface StreakInfo {
  current: number;
  longest: number;
  lastActiveDate: string;
}

export interface AnalyticsOverview {
  todayRate: number;
  todayCompleted: number;
  todayTotal: number;
  weeklyAvgRate: number;
  monthlyAvgRate: number;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  weeklyTrend: DailyStats[];
  categoryStats: CategoryStats[];
  timeSlotStats: TimeSlotStats[];
  insights: string[];
}

// ─── Helpers ────────────────────────────────────────────
function getDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getDayLabel(dateKey: string): string {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const d = new Date(dateKey + 'T00:00:00');
  return days[d.getDay()];
}

function getLast7Days(): string[] {
  const result: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    result.push(getDateKey(d));
  }
  return result;
}

function getLast30Days(): string[] {
  const result: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    result.push(getDateKey(d));
  }
  return result;
}

// ─── Main Analytics Calculator ──────────────────────────
export function calculateAnalytics(
  routines: RoutineData[],
  logs: RoutineLogData[],
): AnalyticsOverview {
  const activeRoutines = routines.filter((r) => r.isActive);
  const todayKey = getDateKey(new Date());

  // Build lookup: dateKey → Set<routineId>
  const logsByDate = new Map<string, Set<string>>();
  for (const log of logs) {
    const set = logsByDate.get(log.dateKey) ?? new Set();
    set.add(log.routineId);
    logsByDate.set(log.dateKey, set);
  }

  // Today stats
  const todaySet = logsByDate.get(todayKey) ?? new Set();
  const todayCompleted = activeRoutines.filter((r) => todaySet.has(r.id)).length;
  const todayTotal = activeRoutines.length;
  const todayRate = todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 0;

  // Weekly trend (last 7 days)
  const last7 = getLast7Days();
  const weeklyTrend: DailyStats[] = last7.map((dateKey) => {
    const set = logsByDate.get(dateKey) ?? new Set();
    const completed = activeRoutines.filter((r) => set.has(r.id)).length;
    return {
      dateKey,
      completedCount: completed,
      totalCount: todayTotal,
      rate: todayTotal > 0 ? Math.round((completed / todayTotal) * 100) : 0,
    };
  });

  const weeklyAvgRate =
    weeklyTrend.length > 0
      ? Math.round(weeklyTrend.reduce((sum, d) => sum + d.rate, 0) / weeklyTrend.length)
      : 0;

  // Monthly average
  const last30 = getLast30Days();
  const monthlyRates = last30.map((dateKey) => {
    const set = logsByDate.get(dateKey) ?? new Set();
    const completed = activeRoutines.filter((r) => set.has(r.id)).length;
    return todayTotal > 0 ? (completed / todayTotal) * 100 : 0;
  });
  const monthlyAvgRate =
    monthlyRates.length > 0
      ? Math.round(monthlyRates.reduce((a, b) => a + b, 0) / monthlyRates.length)
      : 0;

  // Streak
  const streak = calculateStreak(activeRoutines, logsByDate);

  // Category stats
  const categoryMap = new Map<string, { total: number; completed: number }>();
  for (const r of activeRoutines) {
    const cat = r.category;
    const entry = categoryMap.get(cat) ?? { total: 0, completed: 0 };
    entry.total++;
    if (todaySet.has(r.id)) entry.completed++;
    categoryMap.set(cat, entry);
  }
  const categoryStats: CategoryStats[] = Array.from(categoryMap.entries()).map(
    ([category, { total, completed }]) => ({
      category,
      label: getCategoryLabel(category as RoutineCategory),
      count: total,
      completedCount: completed,
      rate: total > 0 ? Math.round((completed / total) * 100) : 0,
    }),
  );

  // Time slot stats
  const slotMap = new Map<TimeSlot, { total: number; completed: number }>();
  for (const r of activeRoutines) {
    const slot = r.timeSlot;
    const entry = slotMap.get(slot) ?? { total: 0, completed: 0 };
    entry.total++;
    if (todaySet.has(r.id)) entry.completed++;
    slotMap.set(slot, entry);
  }
  const timeSlotStats: TimeSlotStats[] = Array.from(slotMap.entries()).map(
    ([timeSlot, { total, completed }]) => ({
      timeSlot,
      label: getTimeSlotLabel(timeSlot),
      count: total,
      completedCount: completed,
      rate: total > 0 ? Math.round((completed / total) * 100) : 0,
    }),
  );

  // Insights
  const insights = generateInsights({
    todayRate,
    weeklyAvgRate,
    streak: streak.current,
    categoryStats,
    timeSlotStats,
    totalRoutines: todayTotal,
  });

  return {
    todayRate,
    todayCompleted,
    todayTotal,
    weeklyAvgRate,
    monthlyAvgRate,
    currentStreak: streak.current,
    longestStreak: streak.longest,
    totalCompletions: logs.length,
    weeklyTrend,
    categoryStats,
    timeSlotStats,
    insights,
  };
}

// ─── Streak Calculator ──────────────────────────────────
function calculateStreak(
  activeRoutines: RoutineData[],
  logsByDate: Map<string, Set<string>>,
): StreakInfo {
  const total = activeRoutines.length;
  if (total === 0) return { current: 0, longest: 0, lastActiveDate: '' };

  let current = 0;
  let longest = 0;
  let tempStreak = 0;
  let lastActive = '';

  // Check last 365 days
  for (let i = 0; i < 365; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = getDateKey(d);
    const set = logsByDate.get(key) ?? new Set();
    const completed = activeRoutines.filter((r) => set.has(r.id)).length;
    const rate = completed / total;

    if (rate >= 0.5) {
      // Consider 50%+ as "active day"
      tempStreak++;
      if (i === 0 || (i === 1 && current === 0)) {
        current = tempStreak;
      }
      if (!lastActive) lastActive = key;
    } else {
      longest = Math.max(longest, tempStreak);
      tempStreak = 0;
    }
  }
  longest = Math.max(longest, tempStreak);

  return { current, longest, lastActiveDate: lastActive };
}

// ─── Insight Generator ──────────────────────────────────
function generateInsights(data: {
  todayRate: number;
  weeklyAvgRate: number;
  streak: number;
  categoryStats: CategoryStats[];
  timeSlotStats: TimeSlotStats[];
  totalRoutines: number;
}): string[] {
  const insights: string[] = [];

  if (data.totalRoutines === 0) {
    insights.push('루틴을 추가하면 통계와 인사이트를 확인할 수 있어요!');
    return insights;
  }

  if (data.todayRate === 100) {
    insights.push('🎉 오늘 모든 루틴을 완료했어요! 대단해요!');
  } else if (data.todayRate >= 70) {
    insights.push('👍 오늘 거의 다 완료했어요! 조금만 더 힘내봐요.');
  } else if (data.todayRate > 0) {
    insights.push('💪 좋은 시작이에요! 하나씩 완료해봐요.');
  }

  if (data.streak >= 7) {
    insights.push(`🔥 ${data.streak}일 연속 달성 중! 꾸준함이 빛나요.`);
  } else if (data.streak >= 3) {
    insights.push(`✨ ${data.streak}일 연속! 습관이 만들어지고 있어요.`);
  }

  if (data.weeklyAvgRate > 0 && data.todayRate > data.weeklyAvgRate) {
    insights.push('📈 오늘은 주간 평균보다 좋은 성과를 보이고 있어요!');
  }

  // Best time slot
  if (data.timeSlotStats.length > 0) {
    const bestSlot = data.timeSlotStats.reduce(
      (best, cur) => (cur.rate > best.rate ? cur : best),
      data.timeSlotStats[0],
    );
    if (bestSlot && bestSlot.rate > 0) {
      insights.push(`⏰ ${bestSlot.label} 시간대 완료율이 가장 높아요 (${bestSlot.rate}%).`);
    }
  }

  // Best category
  if (data.categoryStats.length > 0) {
    const bestCat = data.categoryStats.reduce(
      (best, cur) => (cur.rate > best.rate ? cur : best),
      data.categoryStats[0],
    );
    if (bestCat && bestCat.rate > 0) {
      insights.push(`🏷️ ${bestCat.label} 카테고리를 가장 잘 수행하고 있어요.`);
    }
  }

  return insights.slice(0, 4); // Max 4 insights
}
