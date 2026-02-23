import React from 'react';
import { View, StyleSheet, ViewProps, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useThemeColors } from '@theme/index';
import { borderRadius, spacing } from '@theme/spacing';
import { shadows } from '@theme/shadows';

interface GlassCardProps extends ViewProps {
  intensity?: number;
  children: React.ReactNode;
}

export function GlassCard({ intensity = 80, children, style, ...props }: GlassCardProps) {
  const colors = useThemeColors();

  if (Platform.OS === 'ios') {
    return (
      <View style={[styles.container, shadows.glass, style]} {...props}>
        <BlurView intensity={intensity} tint="light" style={styles.blur}>
          <View style={[styles.inner, { borderColor: colors.cardBorder }]}>{children}</View>
        </BlurView>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        shadows.md,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
          borderWidth: 1,
        },
        style,
      ]}
      {...props}
    >
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  blur: {
    flex: 1,
  },
  inner: {
    padding: spacing.base,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
});
