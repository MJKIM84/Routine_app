import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '@ui/shared/components/Typography';
import { RoutineCard } from './RoutineCard';
import { getTimeSlotLabel, getTimeSlotIcon } from '@core/utils/routine';
import { spacing } from '@theme/spacing';
import type { TimeSlot, RoutineData } from '@core/types';

interface TimeSlotSectionProps {
  slot: TimeSlot;
  routines: RoutineData[];
  completedIds: Set<string>;
  onToggleComplete: (id: string) => void;
  onRoutinePress?: (routine: RoutineData) => void;
  onRoutineLongPress?: (routine: RoutineData) => void;
}

export function TimeSlotSection({
  slot,
  routines,
  completedIds,
  onToggleComplete,
  onRoutinePress,
  onRoutineLongPress,
}: TimeSlotSectionProps) {
  if (routines.length === 0) return null;

  const allCompleted = routines.every((r) => completedIds.has(r.id));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="body" style={styles.icon}>
          {getTimeSlotIcon(slot)}
        </Typography>
        <Typography variant="body" style={styles.label}>
          {getTimeSlotLabel(slot)}
        </Typography>
        <Typography variant="caption" color="tertiary">
          {routines.filter((r) => completedIds.has(r.id)).length}/{routines.length}
        </Typography>
        {allCompleted && (
          <Typography variant="caption" style={styles.completeTag}>
            ✅
          </Typography>
        )}
      </View>

      {routines.map((routine) => (
        <RoutineCard
          key={routine.id}
          routine={routine}
          isCompleted={completedIds.has(routine.id)}
          onToggleComplete={onToggleComplete}
          onPress={onRoutinePress}
          onLongPress={onRoutineLongPress}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  icon: {
    marginRight: spacing.xs,
  },
  label: {
    flex: 1,
    fontWeight: '600',
  },
  completeTag: {
    marginLeft: spacing.xs,
  },
});
