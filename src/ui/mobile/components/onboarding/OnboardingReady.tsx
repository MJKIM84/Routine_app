import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '@ui/shared/components/Typography';
import { Button } from '@ui/shared/components/Button';
import { useThemeColors } from '@theme/index';
import { spacing } from '@theme/spacing';

interface OnboardingReadyProps {
  userName: string;
  goalCount: number;
  onComplete: () => void;
}

export function OnboardingReady({ userName, goalCount, onComplete }: OnboardingReadyProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Typography variant="display" style={styles.emoji}>
          🎉
        </Typography>
        <Typography variant="h1" style={styles.title}>
          준비 완료!
        </Typography>
        <Typography variant="body" color="secondary" style={styles.subtitle}>
          {userName}님, 건강한 습관 여정을 시작해요
        </Typography>

        <View style={styles.summary}>
          <View style={[styles.summaryCard, { backgroundColor: colors.primary + '10' }]}>
            <Typography variant="h3" style={{ color: colors.primary }}>
              🌱 Bloom
            </Typography>
            <Typography variant="caption" color="secondary">
              씨앗부터 시작해서 함께 성장해요
            </Typography>
          </View>

          {goalCount > 0 && (
            <View style={[styles.summaryCard, { backgroundColor: colors.accent + '10' }]}>
              <Typography variant="h3" style={{ color: colors.accent }}>
                🎯 목표 {goalCount}개
              </Typography>
              <Typography variant="caption" color="secondary">
                선택한 목표에 맞는 루틴을 추천해드릴게요
              </Typography>
            </View>
          )}

          <View style={[styles.summaryCard, { backgroundColor: colors.primary + '10' }]}>
            <Typography variant="h3" style={{ color: colors.primary }}>
              🌿 AI 코치 루미
            </Typography>
            <Typography variant="caption" color="secondary">
              언제든 루미에게 도움을 요청하세요
            </Typography>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="루틴 시작하기 🚀"
          onPress={onComplete}
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
  },
  title: {
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  summary: {
    marginTop: spacing['2xl'],
    width: '100%',
    gap: spacing.md,
  },
  summaryCard: {
    padding: spacing.base,
    borderRadius: 16,
    alignItems: 'center',
    gap: spacing.xs,
  },
  footer: {
    paddingHorizontal: spacing['2xl'],
    paddingBottom: spacing['3xl'],
  },
  button: {
    width: '100%',
  },
});
