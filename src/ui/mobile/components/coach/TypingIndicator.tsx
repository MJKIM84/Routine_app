import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  type SharedValue,
} from 'react-native-reanimated';
import { Typography } from '@ui/shared/components/Typography';
import { useThemeColors } from '@theme/index';
import { spacing, borderRadius } from '@theme/spacing';

export function TypingIndicator() {
  const colors = useThemeColors();
  const dot1 = useSharedValue(0.3);
  const dot2 = useSharedValue(0.3);
  const dot3 = useSharedValue(0.3);

  useEffect(() => {
    const animateDot = (sv: SharedValue<number>, delay: number) => {
      sv.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 400 }),
            withTiming(0.3, { duration: 400 }),
          ),
          -1,
          false,
        ),
      );
    };

    animateDot(dot1, 0);
    animateDot(dot2, 200);
    animateDot(dot3, 400);
  }, []);

  const dotStyle1 = useAnimatedStyle(() => ({ opacity: dot1.value }));
  const dotStyle2 = useAnimatedStyle(() => ({ opacity: dot2.value }));
  const dotStyle3 = useAnimatedStyle(() => ({ opacity: dot3.value }));

  return (
    <View style={styles.row}>
      <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
        <Typography variant="body" style={styles.avatarEmoji}>
          🌿
        </Typography>
      </View>
      <View style={[styles.bubble, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <View style={styles.dots}>
          <Animated.View style={[styles.dot, { backgroundColor: colors.textTertiary }, dotStyle1]} />
          <Animated.View style={[styles.dot, { backgroundColor: colors.textTertiary }, dotStyle2]} />
          <Animated.View style={[styles.dot, { backgroundColor: colors.textTertiary }, dotStyle3]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.base,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginBottom: 2,
  },
  avatarEmoji: {
    fontSize: 16,
  },
  bubble: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    height: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
