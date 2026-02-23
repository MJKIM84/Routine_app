/**
 * Admin Service
 * 관리자 대시보드에 표시할 데이터를 시뮬레이션하는 서비스.
 * 실제 운영 시에는 Supabase Edge Functions + Admin API로 대체.
 */

// ─── Types ──────────────────────────────────────────────
export interface AppMetrics {
  totalUsers: number;
  activeUsersToday: number;
  activeUsersWeek: number;
  activeUsersMonth: number;
  newUsersToday: number;
  newUsersWeek: number;
  retentionRate7d: number;
  retentionRate30d: number;
  churnRate: number;
}

export interface RevenueMetrics {
  mrr: number; // Monthly Recurring Revenue
  totalRevenue: number;
  premiumUsers: number;
  premiumPlusUsers: number;
  conversionRate: number;
  averageRevenuePerUser: number;
  trialToPayingRate: number;
}

export interface EngagementMetrics {
  avgSessionDuration: number; // minutes
  avgRoutinesPerUser: number;
  avgCompletionRate: number;
  avgDailyLogins: number;
  topCategory: string;
  topTimeSlot: string;
  bloomEngagementRate: number;
  coachUsageRate: number;
}

export interface GrowthMetrics {
  dailyActiveUsers: DailyMetric[];
  weeklySignups: DailyMetric[];
  revenueHistory: DailyMetric[];
}

export interface DailyMetric {
  date: string;
  value: number;
}

export interface AdminDashboard {
  app: AppMetrics;
  revenue: RevenueMetrics;
  engagement: EngagementMetrics;
  growth: GrowthMetrics;
  lastUpdated: number;
}

// ─── Mock Data Generator ────────────────────────────────
function generateDailyMetrics(days: number, min: number, max: number, trend: number = 0): DailyMetric[] {
  const result: DailyMetric[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateKey = `${d.getMonth() + 1}/${d.getDate()}`;
    const base = min + Math.random() * (max - min);
    const trendVal = trend * (days - i);
    result.push({
      date: dateKey,
      value: Math.round(base + trendVal),
    });
  }
  return result;
}

export function getAdminDashboard(): AdminDashboard {
  return {
    app: {
      totalUsers: 12847,
      activeUsersToday: 3421,
      activeUsersWeek: 8234,
      activeUsersMonth: 10562,
      newUsersToday: 127,
      newUsersWeek: 893,
      retentionRate7d: 68.5,
      retentionRate30d: 42.3,
      churnRate: 8.2,
    },
    revenue: {
      mrr: 4890000, // ₩4,890,000
      totalRevenue: 28340000,
      premiumUsers: 1847,
      premiumPlusUsers: 342,
      conversionRate: 17.0,
      averageRevenuePerUser: 380,
      trialToPayingRate: 23.5,
    },
    engagement: {
      avgSessionDuration: 8.4,
      avgRoutinesPerUser: 4.2,
      avgCompletionRate: 72.1,
      avgDailyLogins: 2.1,
      topCategory: '운동',
      topTimeSlot: '아침',
      bloomEngagementRate: 85.3,
      coachUsageRate: 34.7,
    },
    growth: {
      dailyActiveUsers: generateDailyMetrics(14, 2800, 3600, 15),
      weeklySignups: generateDailyMetrics(8, 600, 1000, 20),
      revenueHistory: generateDailyMetrics(12, 3500000, 5200000, 50000),
    },
    lastUpdated: Date.now(),
  };
}

// ─── Formatting Helpers ─────────────────────────────────
export function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `₩${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `₩${(amount / 1000).toFixed(0)}K`;
  }
  return `₩${amount}`;
}

export function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export function formatPercent(n: number): string {
  return `${n.toFixed(1)}%`;
}
