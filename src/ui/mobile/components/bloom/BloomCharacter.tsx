import React, { useEffect } from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import {
  Canvas,
  Circle,
  Group,
  RoundedRect,
  LinearGradient,
  vec,
  BlurMask,
} from '@shopify/react-native-skia';
import {
  useSharedValue,
  withRepeat,
  withTiming,
  withSpring,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import type { BloomGrowthStage, BloomMood } from '@core/types';
import { getBloomColors, getBloomScale } from '@core/utils/bloom';

interface BloomCharacterProps {
  stage: BloomGrowthStage;
  mood: BloomMood;
  health: number;
  size?: number;
  isGrowing?: boolean;
}

export function BloomCharacter({
  stage,
  mood,
  health,
  size = 200,
  isGrowing = false,
}: BloomCharacterProps) {
  const colors = getBloomColors(stage);
  const scale = getBloomScale(stage);
  const cx = size / 2;
  const cy = size / 2;

  // Breathing animation — hooks must be called unconditionally
  const breathe = useSharedValue(1);
  const glow = useSharedValue(0.3);
  const bounce = useSharedValue(0);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    // Gentle breathing
    breathe.value = withRepeat(
      withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
    // Glow pulse
    glow.value = withRepeat(
      withTiming(0.6, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [breathe, glow]);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    if (isGrowing) {
      bounce.value = withSequence(
        withSpring(1.2, { damping: 4, stiffness: 200 }),
        withSpring(1, { damping: 8, stiffness: 150 }),
      );
    }
  }, [isGrowing, bounce]);

  // Web doesn't support Skia - use fallback
  if (Platform.OS === 'web') {
    return <BloomFallback stage={stage} mood={mood} size={size} />;
  }

  const bodyRadius = (size * 0.25) * scale;
  const headRadius = (size * 0.18) * scale;

  return (
    <Canvas style={{ width: size, height: size }}>
      {/* Glow effect */}
      <Circle cx={cx} cy={cy} r={bodyRadius * 1.8} color={colors.glow} opacity={0.15}>
        <BlurMask blur={20} style="normal" />
      </Circle>

      {/* Stem (stages 1+) */}
      {stage >= 1 && (
        <RoundedRect
          x={cx - 3}
          y={cy - bodyRadius * 0.5}
          width={6}
          height={bodyRadius * 1.2}
          r={3}
          color={colors.secondary}
        />
      )}

      {/* Leaves (stages 2+) */}
      {stage >= 2 && (
        <Group>
          <Circle cx={cx - bodyRadius * 0.6} cy={cy + bodyRadius * 0.2} r={bodyRadius * 0.3} color={colors.secondary} opacity={0.8} />
          <Circle cx={cx + bodyRadius * 0.6} cy={cy + bodyRadius * 0.2} r={bodyRadius * 0.3} color={colors.secondary} opacity={0.8} />
        </Group>
      )}

      {/* Main body */}
      <Circle cx={cx} cy={cy} r={bodyRadius}>
        <LinearGradient
          start={vec(cx - bodyRadius, cy - bodyRadius)}
          end={vec(cx + bodyRadius, cy + bodyRadius)}
          colors={[colors.secondary, colors.primary]}
        />
      </Circle>

      {/* Head highlight */}
      <Circle cx={cx} cy={cy - headRadius * 0.3} r={headRadius} color={colors.secondary} opacity={0.5}>
        <BlurMask blur={5} style="normal" />
      </Circle>

      {/* Eyes */}
      {renderEyes(cx, cy, bodyRadius, mood)}

      {/* Flower/Fruit (stages 3-4) */}
      {stage >= 3 && (
        <Group>
          {[0, 72, 144, 216, 288].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const petalDist = bodyRadius * 0.7;
            const px = cx + Math.cos(rad) * petalDist;
            const py = (cy - bodyRadius * 0.8) + Math.sin(rad) * petalDist;
            return (
              <Circle
                key={i}
                cx={px}
                cy={py}
                r={bodyRadius * 0.2}
                color={stage === 4 ? '#FFD54F' : '#FF8A80'}
                opacity={0.8}
              />
            );
          })}
        </Group>
      )}

      {/* Health indicator */}
      {health < 50 && (
        <Circle cx={cx} cy={cy} r={bodyRadius * 1.1} color="rgba(0,0,0,0.1)" opacity={(50 - health) / 100} />
      )}
    </Canvas>
  );
}

function renderEyes(cx: number, cy: number, radius: number, mood: BloomMood) {
  const eyeY = cy - radius * 0.1;
  const eyeSpacing = radius * 0.35;
  const eyeSize = radius * 0.08;

  switch (mood) {
    case 'happy':
    case 'excited':
      return (
        <Group>
          {/* Happy curved eyes (small arcs represented as small circles) */}
          <Circle cx={cx - eyeSpacing} cy={eyeY} r={eyeSize} color="#1A1A2E" />
          <Circle cx={cx + eyeSpacing} cy={eyeY} r={eyeSize} color="#1A1A2E" />
          {/* Smile */}
          <RoundedRect
            x={cx - radius * 0.15}
            y={eyeY + radius * 0.15}
            width={radius * 0.3}
            height={radius * 0.06}
            r={3}
            color="#1A1A2E"
            opacity={0.6}
          />
        </Group>
      );
    case 'sad':
      return (
        <Group>
          <Circle cx={cx - eyeSpacing} cy={eyeY} r={eyeSize * 1.2} color="#1A1A2E" opacity={0.7} />
          <Circle cx={cx + eyeSpacing} cy={eyeY} r={eyeSize * 1.2} color="#1A1A2E" opacity={0.7} />
          {/* Tear */}
          <Circle cx={cx - eyeSpacing} cy={eyeY + radius * 0.2} r={eyeSize * 0.6} color="#64B5F6" opacity={0.6} />
        </Group>
      );
    case 'sleepy':
      return (
        <Group>
          {/* Closed eyes (horizontal lines as thin rects) */}
          <RoundedRect
            x={cx - eyeSpacing - eyeSize}
            y={eyeY - 1}
            width={eyeSize * 2.5}
            height={2}
            r={1}
            color="#1A1A2E"
            opacity={0.6}
          />
          <RoundedRect
            x={cx + eyeSpacing - eyeSize}
            y={eyeY - 1}
            width={eyeSize * 2.5}
            height={2}
            r={1}
            color="#1A1A2E"
            opacity={0.6}
          />
        </Group>
      );
    default: // neutral
      return (
        <Group>
          <Circle cx={cx - eyeSpacing} cy={eyeY} r={eyeSize} color="#1A1A2E" />
          <Circle cx={cx + eyeSpacing} cy={eyeY} r={eyeSize} color="#1A1A2E" />
        </Group>
      );
  }
}

// Web fallback without Skia
function BloomFallback({
  stage,
  mood,
  size,
}: {
  stage: BloomGrowthStage;
  mood: BloomMood;
  size: number;
}) {
  const colors = getBloomColors(stage);
  const stageEmojis: Record<number, string> = {
    0: '🌰',
    1: '🌱',
    2: '🌿',
    3: '🌸',
    4: '🌻',
  };

  const moodFaces: Record<BloomMood, string> = {
    happy: '😊',
    neutral: '😐',
    sad: '😢',
    excited: '🤩',
    sleepy: '😴',
  };

  return (
    <View
      style={[
        fallbackStyles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.primary + '20',
          borderColor: colors.primary + '40',
        },
      ]}
    >
      <Text style={fallbackStyles.emoji}>{stageEmojis[stage]}</Text>
      <Text style={fallbackStyles.moodEmoji}>{moodFaces[mood]}</Text>
    </View>
  );
}

const fallbackStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  emoji: {
    fontSize: 48,
  },
  moodEmoji: {
    fontSize: 20,
    marginTop: 4,
  },
});
