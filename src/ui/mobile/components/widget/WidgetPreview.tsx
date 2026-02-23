import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '@ui/shared/components/Typography';
import { useThemeColors } from '@theme/index';
import { spacing, borderRadius } from '@theme/spacing';
import { useRoutineStore } from '@core/stores/routineStore';
import { useBloomStore } from '@core/stores/bloomStore';
import { getTodayKey } from '@core/utils/routine';
import {
  getDailyMotivation,
  type WidgetType,
} from '@core/services/widgetService';

const BLOOM_STAGE_EMOJIS = ['🌱', '🌿', '🌳', '🌸', '🌺'];

interface WidgetPreviewProps {
  type: WidgetType;
}

export function WidgetPreview({ type }: WidgetPreviewProps) {
  switch (type) {
    case 'daily_progress':
      return <DailyProgressWidget />;
    case 'routine_list':
      return <RoutineListWidget />;
    case 'bloom':
      return <BloomWidget />;
    case 'motivation':
      return <MotivationWidget />;
    default:
      return null;
  }
}

// ─── Daily Progress Widget ──────────────────────────────
function DailyProgressWidget() {
  const colors = useThemeColors();
  const rawRoutines = useRoutineStore((s) => s.routines);
  const rawLogs = useRoutineStore((s) => s.logs);

  const { completed, total, pct } = useMemo(() => {
    const active = rawRoutines.filter((r) => r.isActive);
    const todayKey = getTodayKey();
    const ids = new Set(rawLogs.filter((l) => l.dateKey === todayKey).map((l) => l.routineId));
    const done = active.filter((r) => ids.has(r.id)).length;
    return { completed: done, total: active.length, pct: active.length > 0 ? Math.round((done / active.length) * 100) : 0 };
  }, [rawRoutines, rawLogs]);

  return (
    <View style={[widgetStyles.small, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      <Typography variant="caption" color="secondary">오늘의 루틴</Typography>
      <View style={widgetStyles.progressCircleContainer}>
        <View style={[widgetStyles.progressCircle, { borderColor: colors.primary + '30' }]}>
          <Typography variant="h2" style={{ color: colors.primary }}>
            {pct}%
          </Typography>
        </View>
      </View>
      <Typography variant="caption" color="secondary">
        {completed}/{total} 완료
      </Typography>
    </View>
  );
}

// ─── Routine List Widget ────────────────────────────────
function RoutineListWidget() {
  const colors = useThemeColors();
  const rawRoutines = useRoutineStore((s) => s.routines);
  const rawLogs = useRoutineStore((s) => s.logs);

  const items = useMemo(() => {
    const active = rawRoutines.filter((r) => r.isActive).slice(0, 5);
    const todayKey = getTodayKey();
    const ids = new Set(rawLogs.filter((l) => l.dateKey === todayKey).map((l) => l.routineId));
    return active.map((r) => ({
      id: r.id,
      title: r.title,
      icon: r.icon,
      done: ids.has(r.id),
    }));
  }, [rawRoutines, rawLogs]);

  return (
    <View style={[widgetStyles.medium, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      <Typography variant="caption" color="secondary" style={{ marginBottom: spacing.sm }}>
        오늘의 루틴
      </Typography>
      {items.length === 0 ? (
        <Typography variant="caption" color="tertiary">
          등록된 루틴이 없어요
        </Typography>
      ) : (
        items.map((item) => (
          <View key={item.id} style={widgetStyles.listItem}>
            <Typography variant="body">
              {item.done ? '✅' : '⬜'}
            </Typography>
            <Typography variant="body" style={{ marginLeft: spacing.sm }}>
              {item.icon}
            </Typography>
            <Typography
              variant="caption"
              style={[
                { marginLeft: spacing.xs, flex: 1 },
                item.done && { textDecorationLine: 'line-through', opacity: 0.5 },
              ]}
            >
              {item.title}
            </Typography>
          </View>
        ))
      )}
    </View>
  );
}

// ─── Bloom Widget ───────────────────────────────────────
function BloomWidget() {
  const colors = useThemeColors();
  const bloomName = useBloomStore((s) => s.name);
  const health = useBloomStore((s) => s.health);
  const stage = useBloomStore((s) => s.growthStage);

  const emoji = BLOOM_STAGE_EMOJIS[stage] || '🌱';

  return (
    <View style={[widgetStyles.small, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      <Typography variant="h1" style={{ textAlign: 'center' }}>
        {emoji}
      </Typography>
      <Typography variant="caption" style={{ textAlign: 'center', fontWeight: '600', marginTop: spacing.xs }}>
        {bloomName}
      </Typography>
      <View style={[widgetStyles.healthBar, { backgroundColor: colors.cardBorder }]}>
        <View
          style={[
            widgetStyles.healthFill,
            {
              backgroundColor: health > 50 ? colors.primary : colors.accent,
              width: `${health}%`,
            },
          ]}
        />
      </View>
      <Typography variant="caption" color="tertiary" style={{ textAlign: 'center' }}>
        HP {health}%
      </Typography>
    </View>
  );
}

// ─── Motivation Widget ──────────────────────────────────
function MotivationWidget() {
  const colors = useThemeColors();
  const quote = useMemo(() => getDailyMotivation(), []);

  return (
    <View style={[widgetStyles.small, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      <Typography variant="h3" style={{ textAlign: 'center' }}>
        💪
      </Typography>
      <Typography
        variant="caption"
        style={{ textAlign: 'center', marginTop: spacing.sm, lineHeight: 18, fontStyle: 'italic' }}
      >
        {`"${quote.text}"`}
      </Typography>
      <Typography variant="caption" color="tertiary" style={{ textAlign: 'center', marginTop: spacing.xs }}>
        — {quote.author}
      </Typography>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────
const widgetStyles = StyleSheet.create({
  small: {
    width: 160,
    height: 160,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medium: {
    width: '100%',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.md,
  },
  progressCircleContainer: {
    marginVertical: spacing.sm,
  },
  progressCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  healthBar: {
    width: '80%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: spacing.xs,
  },
  healthFill: {
    height: '100%',
    borderRadius: 2,
  },
});
