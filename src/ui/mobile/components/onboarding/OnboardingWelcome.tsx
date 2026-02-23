import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '@ui/shared/components/Typography';
import { Button } from '@ui/shared/components/Button';
import { spacing } from '@theme/spacing';

interface OnboardingWelcomeProps {
  onNext: () => void;
}

export function OnboardingWelcome({ onNext }: OnboardingWelcomeProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Typography variant="display" style={styles.emoji}>
          🌱
        </Typography>
        <Typography variant="h1" style={styles.title}>
          RoutineFlow
        </Typography>
        <Typography variant="h3" color="accent" style={styles.tagline}>
          건강한 습관을 디자인하다
        </Typography>
        <Typography variant="body" color="secondary" style={styles.description}>
          작은 루틴이 큰 변화를 만들어요.{'\n'}
          Bloom 캐릭터와 함께 건강한 하루를 시작해보세요.
        </Typography>
      </View>

      <View style={styles.footer}>
        <Button
          title="시작하기"
          onPress={onNext}
          size="lg"
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  emoji: {
    fontSize: 80,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    textAlign: 'center',
    fontSize: 36,
    letterSpacing: -0.5,
  },
  tagline: {
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  description: {
    textAlign: 'center',
    marginTop: spacing.xl,
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: spacing['2xl'],
    paddingBottom: spacing['3xl'],
  },
  button: {
    width: '100%',
  },
});
