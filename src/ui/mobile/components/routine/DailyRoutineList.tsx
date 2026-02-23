import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { TimeSlotSection } from './TimeSlotSection';
import { Typography } from '@ui/shared/components/Typography';
import { GlassCard } from '@ui/shared/components/GlassCard';
import { Button } from '@ui/shared/components/Button';
import { useRoutineStore } from '@core/stores/routineStore';
import { useBloomStore } from '@core/stores/bloomStore';
import { groupByTimeSlot, TIME_SLOT_ORDER, getCompletionRate, getTodayKey } from '@core/utils/routine';
import { useThemeColors } from '@theme/index';
import { spacing } from '@theme/spacing';
import { haptics } from '@platform/haptics';
import type { RoutineData } from '@core/types';

interface DailyRoutineListProps {
  onAddRoutine?: () => void;
  onRoutinePress?: (routine: RoutineData) => void;
  compact?: boolean;
}

export function DailyRoutineList({
  onAddRoutine,
  onRoutinePress,
  compact = false,
}: DailyRoutineListProps) {
  const colors = useThemeColors();
  const rawRoutines = useRoutineStore((s) => s.routines);
  const rawLogs = useRoutineStore((s) => s.logs);
  const completeRoutine = useRoutineStore((s) => s.completeRoutine);
  const uncompleteRoutine = useRoutineStore((s) => s.uncompleteRoutine);
  const bloomCompleteRoutine = useBloomStore((s) => s.completeRoutine);

  const routines = useMemo(
    () => rawRoutines.filter((r) => r.isActive).sort((a, b) => a.sortOrder - b.sortOrder),
    [rawRoutines],
  );

  const completedSet = useMemo(() => {
    const today = getTodayKey();
    return new Set(rawLogs.filter((l) => l.dateKey === today).map((l) => l.routineId));
  }, [rawLogs]);

  const groups = useMemo(() => groupByTimeSlot(routines), [routines]);

  const completionRate = useMemo(() => {
    const total = routines.length;
    const completed = routines.filter((r) => completedSet.has(r.id)).length;
    return getCompletionRate(completed, total);
  }, [routines, completedSet]);

  const handleToggle = useCallback(
    (id: string) => {
      haptics.light();
      if (completedSet.has(id)) {
        uncompleteRoutine(id);
      } else {
        completeRoutine(id);
        bloomCompleteRoutine();
      }
    },
    [completedSet, completeRoutine, uncompleteRoutine, bloomCompleteRoutine],
  );

  if (routines.length === 0) {
    return (
      <GlassCard>
        <View style={styles.emptyState}>
          <Typography variant="h1" style={{ textAlign: 'center' }}>
            ✨
          </Typography>
          <Typography
            variant="body"
            color="secondary"
            style={{ textAlign: 'center', marginTop: spacing.md }}
          >
            아직 등록된 루틴이 없습니다
          </Typography>
          <Typography
            variant="caption"
            color="tertiary"
            style={{ textAlign: 'center', marginTop: spacing.xs }}
          >
            루틴을 추가하고 Bloom을 키워보세요
          </Typography>
          {onAddRoutine && (
            <Button
              title="루틴 추가하기"
              onPress={onAddRoutine}
              style={{ marginTop: spacing.lg, minWidth: 200 }}
            />
          )}
        </View>
      </GlassCard>
    );
  }

  return (
    <View>
      {!compact && (
        <View style={styles.summaryRow}>
          <Typography variant="body" style={{ fontWeight: '600' }}>
            오늘의 루틴
          </Typography>
          <View style={styles.rateBadge}>
            <Typography
              variant="caption"
              style={{ color: completionRate === 100 ? '#66BB6A' : colors.text, fontWeight: '600' }}
            >
              {completionRate}%
            </Typography>
          </View>
        </View>
      )}

      {!compact && (
        <View style={[styles.progressTrack, { backgroundColor: colors.card }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: completionRate === 100 ? '#66BB6A' : colors.primary,
                width: `${completionRate}%`,
              },
            ]}
          />
        </View>
      )}

      {TIME_SLOT_ORDER.map((slot) => (
        <TimeSlotSection
          key={slot}
          slot={slot}
          routines={groups[slot]}
          completedIds={completedSet}
          onToggleComplete={handleToggle}
          onRoutinePress={onRoutinePress}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  rateBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});
