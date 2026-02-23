import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { BloomCharacter } from './BloomCharacter';
import { BloomParticles } from './BloomParticles';
import { BloomStatusBar } from './BloomStatusBar';
import { Typography } from '@ui/shared/components/Typography';
import { GlassCard } from '@ui/shared/components/GlassCard';
import { useBloomStore } from '@core/stores/bloomStore';
import { getMoodMessage } from '@core/utils/bloom';
import { useThemeColors } from '@theme/index';
import { spacing } from '@theme/spacing';
import { haptics } from '@platform/haptics';

const BLOOM_SIZE = 180;

export function BloomView() {
  const colors = useThemeColors();
  const {
    name,
    growthStage,
    growthPoints,
    mood,
    health,
    waterDrops,
    isGrowing,
    showParticles,
    showLevelUp,
    resetAnimations,
    completeRoutine,
  } = useBloomStore();

  const tapScale = useSharedValue(1);

  const handleTap = useCallback(() => {
    haptics.light();
    tapScale.value = withSequence(
      withSpring(0.92, { damping: 15, stiffness: 400 }),
      withSpring(1, { damping: 10, stiffness: 300 }),
    );
  }, []);

  // Demo: double tap to simulate routine completion
  const handleDoubleTap = useCallback(() => {
    haptics.success();
    completeRoutine();
  }, [completeRoutine]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: tapScale.value }],
  }));

  const message = getMoodMessage(mood, name);

  return (
    <GlassCard style={styles.card}>
      <View style={styles.header}>
        <Typography variant="h3">{name}</Typography>
        {showLevelUp && (
          <View style={[styles.levelUpBadge, { backgroundColor: colors.primary }]}>
            <Typography variant="caption" color="inverse">
              Level Up! 🎉
            </Typography>
          </View>
        )}
      </View>

      <TouchableOpacity
        activeOpacity={1}
        onPress={handleTap}
        onLongPress={handleDoubleTap}
        delayLongPress={300}
        style={styles.characterContainer}
      >
        <Animated.View style={animatedStyle}>
          <View style={styles.characterWrapper}>
            <BloomCharacter
              stage={growthStage}
              mood={mood}
              health={health}
              size={BLOOM_SIZE}
              isGrowing={isGrowing}
            />
            <BloomParticles
              visible={showParticles}
              onComplete={resetAnimations}
              size={BLOOM_SIZE}
            />
          </View>
        </Animated.View>
      </TouchableOpacity>

      <Typography
        variant="body"
        color="secondary"
        style={styles.message}
      >
        {message}
      </Typography>

      <BloomStatusBar
        stage={growthStage}
        growthPoints={growthPoints}
        health={health}
        waterDrops={waterDrops}
      />

      <Typography
        variant="caption"
        color="tertiary"
        style={styles.hint}
      >
        길게 누르면 루틴 완료 (데모)
      </Typography>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  levelUpBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  characterContainer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  characterWrapper: {
    width: BLOOM_SIZE,
    height: BLOOM_SIZE,
    position: 'relative',
  },
  message: {
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  hint: {
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
