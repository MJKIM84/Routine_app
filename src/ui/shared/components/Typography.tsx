import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useThemeColors } from '@theme/index';
import { typography } from '@theme/typography';

interface TypographyProps extends TextProps {
  variant?: 'display' | 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  color?: 'primary' | 'secondary' | 'tertiary' | 'accent' | 'inverse';
  children: React.ReactNode;
}

export function Typography({
  variant = 'body',
  color = 'primary',
  children,
  style,
  ...props
}: TypographyProps) {
  const colors = useThemeColors();

  const colorMap = {
    primary: colors.text,
    secondary: colors.textSecondary,
    tertiary: colors.textTertiary,
    accent: colors.accent,
    inverse: '#FFFFFF',
  };

  return (
    <Text style={[styles[variant], { color: colorMap[color] }, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  display: {
    fontSize: typography.fontSize.display,
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.fontSize.display * typography.lineHeight.tight,
  },
  h1: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.fontSize['3xl'] * typography.lineHeight.tight,
  },
  h2: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.fontSize['2xl'] * typography.lineHeight.tight,
  },
  h3: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.fontSize.xl * typography.lineHeight.normal,
  },
  body: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.fontSize.base * typography.lineHeight.normal,
  },
  caption: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.fontSize.xs * typography.lineHeight.normal,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
