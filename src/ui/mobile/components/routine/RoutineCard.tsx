import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { Typography } from '@ui/shared/components/Typography';
import { useThemeColors } from '@theme/index';
import { spacing, borderRadius } from '@theme/spacing';
import { haptics } from '@platform/haptics';
import type { RoutineData } from '@core/types';

interface RoutineCardProps {
  routine: RoutineData;
  isCompleted: boolean;
  onToggleComplete: (id: string) => void;
  onPress?: (routine: RoutineData) => void;
  onLongPress?: (routine: RoutineData) => void;
  onStartTimer?: (routine: RoutineData) => void;
}

export function RoutineCard({
  routine,
  isCompleted,
  onToggleComplete,
  onPress,
  onLongPress,
  onStartTimer,
}: RoutineCardProps) {
  const colors = useThemeColors();
  const checkScale = useSharedValue(1);

  const handleToggle = useCallback(() => {
    haptics.light();
    checkScale.value = withSequence(
      withSpring(0.8, { damping: 15, stiffness: 400 }),
      withSpring(1, { damping: 10, stiffness: 300 }),
    );
    onToggleComplete(routine.id);
  }, [routine.id, onToggleComplete]);

  const handleStartTimer = useCallback(() => {
    haptics.medium();
    onStartTimer?.(routine);
  }, [routine, onStartTimer]);

  const checkAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const hasTimer = routine.durationMinutes != null && routine.durationMinutes > 0;
  const hasSchedule = !!routine.scheduledTime;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress?.(routine)}
      onLongPress={() => onLongPress?.(routine)}
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: isCompleted ? routine.color + '40' : colors.cardBorder,
        },
      ]}
    >
      {/* Check button */}
      <TouchableOpacity onPress={handleToggle} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Animated.View
          style={[
            styles.checkbox,
            checkAnimStyle,
            {
              borderColor: isCompleted ? routine.color : colors.textTertiary,
              backgroundColor: isCompleted ? routine.color : 'transparent',
            },
          ]}
        >
          {isCompleted && (
            <Typography variant="caption" color="inverse" style={styles.checkmark}>
              ✓
            </Typography>
          )}
        </Animated.View>
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Typography variant="body" style={styles.icon}>
            {routine.icon}
          </Typography>
          <Typography
            variant="body"
            style={[
              styles.title,
              isCompleted && { textDecorationLine: 'line-through', opacity: 0.6 },
            ]}
          >
            {routine.title}
          </Typography>
        </View>

        {/* Meta info row */}
        <View style={styles.metaRow}>
          {hasSchedule && (
            <View style={[styles.metaBadge, { backgroundColor: colors.primary + '15' }]}>
              <Typography variant="caption" style={{ color: colors.primary, fontSize: 11 }}>
                {routine.reminderEnabled ? '🔔' : '⏰'} {routine.scheduledTime}
              </Typography>
            </View>
          )}
          {hasTimer && (
            <View style={[styles.metaBadge, { backgroundColor: colors.textTertiary + '15' }]}>
              <Typography variant="caption" color="tertiary" style={{ fontSize: 11 }}>
                ⏱ {routine.durationMinutes}분
              </Typography>
            </View>
          )}
          {routine.repeatType && routine.repeatType !== 'daily' && (
            <View style={[styles.metaBadge, { backgroundColor: colors.accent + '15' }]}>
              <Typography variant="caption" style={{ fontSize: 11, color: colors.accent }}>
                {routine.repeatType === 'weekdays' ? '평일' :
                 routine.repeatType === 'weekends' ? '주말' :
                 routine.repeatType === 'once' ? '일회성' :
                 routine.repeatType === 'interval' ? `${routine.repeatIntervalDays}일 간격` :
                 routine.repeatType === 'specific_days' ? '🔁' : ''}
              </Typography>
            </View>
          )}
        </View>
      </View>

      {/* Play / Start timer button */}
      {hasTimer && !isCompleted && onStartTimer && (
        <TouchableOpacity
          onPress={handleStartTimer}
          style={[styles.playBtn, { backgroundColor: routine.color }]}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Typography variant="caption" style={{ color: '#fff', fontSize: 14 }}>▶</Typography>
        </TouchableOpacity>
      )}

      {/* Color indicator */}
      <View style={[styles.colorDot, { backgroundColor: routine.color }]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  checkmark: { fontSize: 14, fontWeight: '700', lineHeight: 18 },
  content: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  icon: { marginRight: spacing.xs, fontSize: 16 },
  title: { flex: 1 },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
    marginLeft: 22,
  },
  metaBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  playBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: spacing.sm,
  },
});
