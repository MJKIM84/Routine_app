import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useThemeColors } from '@theme/index';
import { borderRadius, spacing } from '@theme/spacing';
import { typography } from '@theme/typography';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const colors = useThemeColors();

  const sizeStyle = size === 'sm' ? styles.size_sm : size === 'lg' ? styles.size_lg : styles.size_md;
  const textSizeStyle = size === 'sm' ? styles.text_sm : size === 'lg' ? styles.text_lg : styles.text_md;

  const variantStyle: ViewStyle =
    variant === 'outline'
      ? { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary }
      : variant === 'ghost'
        ? { backgroundColor: 'transparent' }
        : variant === 'secondary'
          ? { backgroundColor: colors.accent }
          : { backgroundColor: colors.primary };

  const textColor =
    variant === 'outline' || variant === 'ghost' ? colors.primary : '#FFFFFF';

  return (
    <TouchableOpacity
      style={[
        styles.base,
        sizeStyle,
        variantStyle,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={[styles.text, textSizeStyle, { color: textColor }, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  size_sm: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
  },
  size_md: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  size_lg: {
    paddingVertical: spacing.base,
    paddingHorizontal: spacing['2xl'],
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: typography.fontWeight.semibold,
  },
  text_sm: {
    fontSize: typography.fontSize.sm,
  },
  text_md: {
    fontSize: typography.fontSize.base,
  },
  text_lg: {
    fontSize: typography.fontSize.md,
  },
});
