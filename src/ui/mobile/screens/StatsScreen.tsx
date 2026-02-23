import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { SafeLayout } from '@ui/shared/layouts/SafeLayout';
import { GlassCard } from '@ui/shared/components/GlassCard';
import { Typography } from '@ui/shared/components/Typography';
import { useRoutineStore } from '@core/stores/routineStore';
import { calculateAnalytics } from '@core/services/analyticsService';
import { useThemeColors } from '@theme/index';
import { spacing, borderRadius } from '@theme/spacing';

export function StatsScreen() {
  const colors = useThemeColors();
  const rawRoutines = useRoutineStore((s) => s.routines);
  const rawLogs = useRoutineStore((s) => s.logs);

  const analytics = useMemo(
    () => calculateAnalytics(rawRoutines, rawLogs),
    [rawRoutines, rawLogs],
  );

  return (
    <SafeLayout>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Typography variant="h2">통계</Typography>
          <Typography variant="caption" color="secondary">
            나의 루틴 분석 리포트
          </Typography>
        </View>

        {/* Overview cards */}
        <View style={styles.overviewGrid}>
          <StatCard
            label="오늘 완료율"
            value={`${analytics.todayRate}%`}
            sub={`${analytics.todayCompleted}/${analytics.todayTotal}`}
            color={colors.primary}
          />
          <StatCard
            label="주간 평균"
            value={`${analytics.weeklyAvgRate}%`}
            sub="최근 7일"
            color={colors.accent}
          />
        </View>

        <View style={styles.overviewGrid}>
          <StatCard
            label="연속 스트릭"
            value={`${analytics.currentStreak}`}
            sub={`최고: ${analytics.longestStreak}일`}
            color="#FF6B35"
          />
          <StatCard
            label="총 완료"
            value={`${analytics.totalCompletions}`}
            sub="누적"
            color="#8B5CF6"
          />
        </View>

        {/* Weekly trend chart */}
        <GlassCard style={styles.chartCard}>
          <Typography variant="h3" style={styles.sectionTitle}>
            📊 주간 트렌드
          </Typography>
          <View style={styles.barChart}>
            {analytics.weeklyTrend.map((day) => (
              <View key={day.dateKey} style={styles.barColumn}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        backgroundColor: day.rate > 0 ? colors.primary : colors.cardBorder,
                        height: `${Math.max(day.rate, 4)}%`,
                      },
                    ]}
                  />
                </View>
                <Typography variant="caption" color="tertiary" style={styles.barLabel}>
                  {getDayLabel(day.dateKey)}
                </Typography>
                <Typography variant="caption" style={{ color: colors.primary, fontSize: 10 }}>
                  {day.rate > 0 ? `${day.rate}%` : ''}
                </Typography>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Category breakdown */}
        {analytics.categoryStats.length > 0 && (
          <GlassCard style={styles.sectionCard}>
            <Typography variant="h3" style={styles.sectionTitle}>
              🏷️ 카테고리별 완료율
            </Typography>
            {analytics.categoryStats.map((cat) => (
              <View key={cat.category} style={styles.categoryRow}>
                <View style={styles.categoryInfo}>
                  <Typography variant="body" style={{ fontWeight: '600' }}>
                    {cat.label}
                  </Typography>
                  <Typography variant="caption" color="secondary">
                    {cat.completedCount}/{cat.count}개
                  </Typography>
                </View>
                <View style={styles.categoryBarContainer}>
                  <View style={[styles.categoryBarTrack, { backgroundColor: colors.cardBorder }]}>
                    <View
                      style={[
                        styles.categoryBarFill,
                        { backgroundColor: colors.primary, width: `${cat.rate}%` },
                      ]}
                    />
                  </View>
                  <Typography variant="caption" style={{ color: colors.primary, fontWeight: '600', width: 40, textAlign: 'right' }}>
                    {cat.rate}%
                  </Typography>
                </View>
              </View>
            ))}
          </GlassCard>
        )}

        {/* Time slot analysis */}
        {analytics.timeSlotStats.length > 0 && (
          <GlassCard style={styles.sectionCard}>
            <Typography variant="h3" style={styles.sectionTitle}>
              ⏰ 시간대별 분석
            </Typography>
            <View style={styles.timeSlotGrid}>
              {analytics.timeSlotStats.map((slot) => (
                <View
                  key={slot.timeSlot}
                  style={[styles.timeSlotItem, { backgroundColor: colors.primary + '08' }]}
                >
                  <Typography variant="body">
                    {getSlotEmoji(slot.timeSlot)}
                  </Typography>
                  <Typography variant="caption" style={{ fontWeight: '600', marginTop: 2 }}>
                    {slot.label}
                  </Typography>
                  <Typography variant="h3" style={{ color: colors.primary, marginTop: spacing.xs }}>
                    {slot.rate}%
                  </Typography>
                  <Typography variant="caption" color="tertiary">
                    {slot.completedCount}/{slot.count}개
                  </Typography>
                </View>
              ))}
            </View>
          </GlassCard>
        )}

        {/* Insights */}
        {analytics.insights.length > 0 && (
          <GlassCard style={styles.sectionCard}>
            <Typography variant="h3" style={styles.sectionTitle}>
              💡 인사이트
            </Typography>
            {analytics.insights.map((insight, i) => (
              <View
                key={i}
                style={[styles.insightItem, { backgroundColor: colors.primary + '06' }]}
              >
                <Typography variant="body" style={{ lineHeight: 22 }}>
                  {insight}
                </Typography>
              </View>
            ))}
          </GlassCard>
        )}

        {/* Monthly summary */}
        <GlassCard style={styles.monthlyCard}>
          <View style={styles.monthlyHeader}>
            <Typography variant="h3">📅 월간 요약</Typography>
          </View>
          <View style={styles.monthlyGrid}>
            <View style={styles.monthlyItem}>
              <Typography variant="h2" style={{ color: colors.primary, textAlign: 'center' }}>
                {analytics.monthlyAvgRate}%
              </Typography>
              <Typography variant="caption" color="secondary" style={{ textAlign: 'center' }}>
                월 평균 완료율
              </Typography>
            </View>
            <View style={[styles.monthlyDivider, { backgroundColor: colors.cardBorder }]} />
            <View style={styles.monthlyItem}>
              <Typography variant="h2" style={{ color: colors.accent, textAlign: 'center' }}>
                {analytics.totalCompletions}
              </Typography>
              <Typography variant="caption" color="secondary" style={{ textAlign: 'center' }}>
                이번 달 완료
              </Typography>
            </View>
          </View>
        </GlassCard>

        <View style={{ height: Platform.OS === 'ios' ? 100 : 80 }} />
      </ScrollView>
    </SafeLayout>
  );
}

// ─── Sub-components ─────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <GlassCard style={cardStyles.stat}>
      <Typography variant="caption" color="secondary">
        {label}
      </Typography>
      <Typography variant="h1" style={{ color, marginVertical: spacing.xs }}>
        {value}
      </Typography>
      <Typography variant="caption" color="tertiary">
        {sub}
      </Typography>
    </GlassCard>
  );
}

// ─── Helpers ────────────────────────────────────────────
function getDayLabel(dateKey: string): string {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const d = new Date(dateKey + 'T00:00:00');
  return days[d.getDay()];
}

function getSlotEmoji(slot: string): string {
  const map: Record<string, string> = {
    morning: '🌅',
    afternoon: '☀️',
    evening: '🌇',
    night: '🌙',
  };
  return map[slot] || '⏰';
}

// ─── Styles ─────────────────────────────────────────────
const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing['2xl'],
  },
  header: {
    paddingVertical: spacing.xl,
  },
  overviewGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  chartCard: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    gap: spacing.xs,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
  },
  barTrack: {
    width: '100%',
    height: 80,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  barFill: {
    width: '60%',
    borderRadius: 4,
    minHeight: 3,
  },
  barLabel: {
    marginTop: spacing.xs,
    fontSize: 11,
  },
  sectionCard: {
    marginBottom: spacing.lg,
  },
  categoryRow: {
    marginBottom: spacing.md,
  },
  categoryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  categoryBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  categoryBarTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  categoryBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  timeSlotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  timeSlotItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  insightItem: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  monthlyCard: {
    marginBottom: spacing.lg,
  },
  monthlyHeader: {
    marginBottom: spacing.md,
  },
  monthlyGrid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthlyItem: {
    flex: 1,
    paddingVertical: spacing.md,
  },
  monthlyDivider: {
    width: 1,
    height: 40,
  },
});

const cardStyles = StyleSheet.create({
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
});
