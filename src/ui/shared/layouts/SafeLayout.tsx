import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@theme/index';
import { spacing } from '@theme/spacing';

interface SafeLayoutProps extends ViewProps {
  children: React.ReactNode;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  padded?: boolean;
}

export function SafeLayout({
  children,
  edges = ['top'],
  padded = true,
  style,
  ...props
}: SafeLayoutProps) {
  const colors = useThemeColors();

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.container, { backgroundColor: colors.background }, style]}
      {...props}
    >
      <View style={[styles.content, padded && styles.padded]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: spacing.base,
  },
});
