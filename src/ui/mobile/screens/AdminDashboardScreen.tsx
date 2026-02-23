import React, { useMemo, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeLayout } from '@ui/shared/layouts/SafeLayout';
import { GlassCard } from '@ui/shared/components/GlassCard';
import { Typography } from '@ui/shared/components/Typography';
import {
  getAdminDashboard,
  formatCurrency,
  formatNumber,
  formatPercent,
  type DailyMetric,
} from '@core/services/adminService';
import { useThemeColors } from '@theme/index';
import { spacing, borderRadius } from '@theme/spacing';

export function AdminDashboardScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const dashboard = useMemo(() => getAdminDashboard(), []);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <SafeLayout>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
          <Typography variant="h3">← </Typography>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Typography variant="h2">어드민</Typography>
          <Typography variant="caption" color="secondary">운영 대시보드</Typography>
        </View>
        <View style={[styles.liveBadge, { backgroundColor: '#22C55E20' }]}>
          <View style={[styles.liveDot, { backgroundColor: '#22C55E' }]} />
          <Typography variant="caption" style={{ color: '#22C55E', fontWeight: '600' }}>
            LIVE
          </Typography>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ── App Metrics ────────────────────────── */}
        <Typography variant="h3" style={styles.sectionTitle}>
          📱 사용자 지표
        </Typography>
        <View style={styles.metricsGrid}>
          <MetricCard label="전체 사용자" value={formatNumber(dashboard.app.totalUsers)} color={colors.primary} />
          <MetricCard label="오늘 활성" value={formatNumber(dashboard.app.activeUsersToday)} color="#22C55E" />
          <MetricCard label="주간 활성" value={formatNumber(dashboard.app.activeUsersWeek)} color={colors.accent} />
          <MetricCard label="월간 활성" value={formatNumber(dashboard.app.activeUsersMonth)} color="#8B5CF6" />
        </View>

        <View style={styles.metricsGrid}>
          <MetricCard label="오늘 가입" value={`+${dashboard.app.newUsersToday}`} color="#22C55E" />
          <MetricCard label="주간 가입" value={`+${dashboard.app.newUsersWeek}`} color="#22C55E" />
          <MetricCard label="7일 리텐션" value={formatPercent(dashboard.app.retentionRate7d)} color={colors.primary} />
          <MetricCard label="이탈률" value={formatPercent(dashboard.app.churnRate)} color="#EF4444" />
        </View>

        {/* ── Revenue ────────────────────────────── */}
        <Typography variant="h3" style={styles.sectionTitle}>
          💰 매출 지표
        </Typography>
        <GlassCard style={styles.revenueCard}>
          <View style={styles.revenueHeader}>
            <View>
              <Typography variant="caption" color="secondary">MRR (월 반복 매출)</Typography>
              <Typography variant="h1" style={{ color: '#22C55E' }}>
                {formatCurrency(dashboard.revenue.mrr)}
              </Typography>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Typography variant="caption" color="secondary">총 매출</Typography>
              <Typography variant="h3">{formatCurrency(dashboard.revenue.totalRevenue)}</Typography>
            </View>
          </View>

          <View style={[styles.revenueDivider, { backgroundColor: colors.cardBorder }]} />

          <View style={styles.revenueStats}>
            <View style={styles.revenueStat}>
              <Typography variant="h3" style={{ color: colors.primary }}>
                {dashboard.revenue.premiumUsers}
              </Typography>
              <Typography variant="caption" color="secondary">Premium</Typography>
            </View>
            <View style={styles.revenueStat}>
              <Typography variant="h3" style={{ color: colors.accent }}>
                {dashboard.revenue.premiumPlusUsers}
              </Typography>
              <Typography variant="caption" color="secondary">Premium+</Typography>
            </View>
            <View style={styles.revenueStat}>
              <Typography variant="h3" style={{ color: '#22C55E' }}>
                {formatPercent(dashboard.revenue.conversionRate)}
              </Typography>
              <Typography variant="caption" color="secondary">전환율</Typography>
            </View>
            <View style={styles.revenueStat}>
              <Typography variant="h3" style={{ color: '#8B5CF6' }}>
                {formatPercent(dashboard.revenue.trialToPayingRate)}
              </Typography>
              <Typography variant="caption" color="secondary">Trial→유료</Typography>
            </View>
          </View>
        </GlassCard>

        {/* ── Engagement ────────────────────────── */}
        <Typography variant="h3" style={styles.sectionTitle}>
          🎯 참여 지표
        </Typography>
        <View style={styles.metricsGrid}>
          <MetricCard
            label="평균 세션"
            value={`${dashboard.engagement.avgSessionDuration}분`}
            color={colors.primary}
          />
          <MetricCard
            label="평균 루틴 수"
            value={`${dashboard.engagement.avgRoutinesPerUser}개`}
            color={colors.accent}
          />
          <MetricCard
            label="완료율"
            value={formatPercent(dashboard.engagement.avgCompletionRate)}
            color="#22C55E"
          />
          <MetricCard
            label="일 로그인"
            value={`${dashboard.engagement.avgDailyLogins}회`}
            color="#8B5CF6"
          />
        </View>

        <GlassCard style={styles.engagementCard}>
          <View style={styles.engagementRow}>
            <EngagementItem
              label="인기 카테고리"
              value={dashboard.engagement.topCategory}
              emoji="🏆"
            />
            <EngagementItem
              label="인기 시간대"
              value={dashboard.engagement.topTimeSlot}
              emoji="⏰"
            />
            <EngagementItem
              label="Bloom 참여"
              value={formatPercent(dashboard.engagement.bloomEngagementRate)}
              emoji="🌱"
            />
            <EngagementItem
              label="코치 사용"
              value={formatPercent(dashboard.engagement.coachUsageRate)}
              emoji="🤖"
            />
          </View>
        </GlassCard>

        {/* ── DAU Mini Chart ────────────────────── */}
        <Typography variant="h3" style={styles.sectionTitle}>
          📈 DAU 추이 (14일)
        </Typography>
        <GlassCard style={styles.chartCard}>
          <MiniBarChart data={dashboard.growth.dailyActiveUsers} color={colors.primary} />
        </GlassCard>

        {/* ── Weekly Signups Mini Chart ──────────── */}
        <Typography variant="h3" style={styles.sectionTitle}>
          👥 주간 가입자 추이
        </Typography>
        <GlassCard style={styles.chartCard}>
          <MiniBarChart data={dashboard.growth.weeklySignups} color="#22C55E" />
        </GlassCard>

        <View style={{ height: Platform.OS === 'ios' ? 100 : 80 }} />
      </ScrollView>
    </SafeLayout>
  );
}

// ─── Sub-components ─────────────────────────────────────
function MetricCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  const colors = useThemeColors();
  return (
    <View style={[metricStyles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      <Typography variant="caption" color="secondary" style={{ fontSize: 10 }}>
        {label}
      </Typography>
      <Typography variant="h3" style={{ color, marginTop: 2 }}>
        {value}
      </Typography>
    </View>
  );
}

function EngagementItem({
  label,
  value,
  emoji,
}: {
  label: string;
  value: string;
  emoji: string;
}) {
  return (
    <View style={engStyles.item}>
      <Typography variant="body">{emoji}</Typography>
      <Typography variant="caption" color="secondary" style={{ marginTop: 2, fontSize: 10 }}>
        {label}
      </Typography>
      <Typography variant="caption" style={{ fontWeight: '700', marginTop: 1 }}>
        {value}
      </Typography>
    </View>
  );
}

function MiniBarChart({ data, color }: { data: DailyMetric[]; color: string }) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const colors = useThemeColors();

  return (
    <View>
      <View style={chartStyles.barRow}>
        {data.map((item, i) => (
          <View key={i} style={chartStyles.barCol}>
            <View style={chartStyles.barTrack}>
              <View
                style={[
                  chartStyles.barFill,
                  {
                    backgroundColor: color,
                    height: `${(item.value / maxVal) * 100}%`,
                  },
                ]}
              />
            </View>
            <Typography variant="caption" color="tertiary" style={{ fontSize: 8, marginTop: 2 }}>
              {item.date}
            </Typography>
          </View>
        ))}
      </View>
      <View style={[chartStyles.divider, { backgroundColor: colors.cardBorder }]} />
      <View style={chartStyles.legend}>
        <Typography variant="caption" color="tertiary">
          최소: {formatNumber(Math.min(...data.map((d) => d.value)))}
        </Typography>
        <Typography variant="caption" color="tertiary">
          최대: {formatNumber(Math.max(...data.map((d) => d.value)))}
        </Typography>
      </View>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  scrollContent: {
    paddingBottom: spacing['2xl'],
  },
  sectionTitle: {
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  revenueCard: {
    marginBottom: spacing.md,
  },
  revenueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  revenueDivider: {
    height: 1,
    marginVertical: spacing.md,
  },
  revenueStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  revenueStat: {
    alignItems: 'center',
  },
  engagementCard: {
    marginBottom: spacing.md,
  },
  engagementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartCard: {
    marginBottom: spacing.md,
  },
});

const metricStyles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    alignItems: 'center',
  },
});

const engStyles = StyleSheet.create({
  item: {
    flex: 1,
    alignItems: 'center',
  },
});

const chartStyles = StyleSheet.create({
  barRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 80,
    gap: 2,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
  },
  barTrack: {
    width: '80%',
    height: 60,
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 2,
    minHeight: 2,
  },
  divider: {
    height: 1,
    marginTop: spacing.sm,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
});
