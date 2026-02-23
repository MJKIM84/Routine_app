import React, { useEffect, useMemo } from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

interface BloomParticlesProps {
  visible: boolean;
  onComplete?: () => void;
  count?: number;
  size?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  delay: number;
}

const PARTICLE_COLORS = ['#FFD54F', '#81C784', '#FF8A80', '#80DEEA', '#CE93D8', '#FFAB91'];

export function BloomParticles({
  visible,
  onComplete,
  count = 12,
  size = 200,
}: BloomParticlesProps) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i): Particle => ({
      id: i,
      x: Math.random() * size - size / 2,
      y: Math.random() * size - size / 2,
      color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
      size: 4 + Math.random() * 6,
      delay: Math.random() * 300,
    }));
  }, [count, size]);

  if (!visible) return null;

  return (
    <View style={[styles.container, { width: size, height: size }]} pointerEvents="none">
      {particles.map((particle) => (
        <ParticleItem
          key={particle.id}
          particle={particle}
          containerSize={size}
          onComplete={particle.id === 0 ? onComplete : undefined}
        />
      ))}
    </View>
  );
}

function ParticleItem({
  particle,
  containerSize,
  onComplete,
}: {
  particle: Particle;
  containerSize: number;
  onComplete?: () => void;
}) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      particle.delay,
      withTiming(1, { duration: 200 }, () => {
        opacity.value = withTiming(0, { duration: 400, easing: Easing.out(Easing.ease) }, () => {
          if (onComplete) {
            runOnJS(onComplete)();
          }
        });
      }),
    );
    translateY.value = withDelay(
      particle.delay,
      withTiming(-30 - Math.random() * 40, { duration: 600, easing: Easing.out(Easing.ease) }),
    );
    scale.value = withDelay(
      particle.delay,
      withTiming(1, { duration: 300 }, () => {
        scale.value = withTiming(0, { duration: 300 });
      }),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: containerSize / 2 + particle.x - particle.size / 2,
          top: containerSize / 2 + particle.y - particle.size / 2,
          width: particle.size,
          height: particle.size,
          borderRadius: particle.size / 2,
          backgroundColor: particle.color,
        },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
