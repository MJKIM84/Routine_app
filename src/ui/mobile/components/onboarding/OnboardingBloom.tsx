import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '@ui/shared/components/Typography';
import { Button } from '@ui/shared/components/Button';
import { useThemeColors } from '@theme/index';
import { spacing } from '@theme/spacing';

interface OnboardingBloomProps {
  userName: string;
  onNext: () => void;
  onBack: () => void;
}

export function OnboardingBloom({ userName, onNext, onBack }: OnboardingBloomProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.bloomArea}>
          <View style={[styles.bloomCircle, { backgroundColor: colors.primary + '15' }]}>
            <Typography variant="display" style={styles.bloomEmoji}>
              🌱
            </Typography>
          </View>
          <Typography variant="caption" color="accent" style={styles.bloomLabel}>
            Bloom - 씨앗 단계
          </Typography>
        </View>

        <Typography variant="h2" style={styles.title}>
          {userName}님의 Bloom을{'\n'}소개할게요!
        </Typography>
        <Typography variant="body" color="secondary" style={styles.description}>
          Bloom은 당신의 루틴 친구예요.{'\n'}
          루틴을 완료하면 함께 성장하고,{'\n'}
          씨앗에서 꽃까지 5단계로 자라나요! 🌸
        </Typography>

        <View style={styles.features}>
          <View style={styles.featureRow}>
            <Typography variant="body" style={styles.featureIcon}>💧</Typography>
            <Typography variant="caption" color="secondary">
              루틴 완료 시 물방울을 얻어요
            </Typography>
          </View>
          <View style={styles.featureRow}>
            <Typography variant="body" style={styles.featureIcon}>⭐</Typography>
            <Typography variant="caption" color="secondary">
              성장 포인트가 쌓이면 단계가 올라가요
            </Typography>
          </View>
          <View style={styles.featureRow}>
            <Typography variant="body" style={styles.featureIcon}>❤️</Typography>
            <Typography variant="caption" color="secondary">
              건강도를 유지하면 Bloom이 행복해해요
            </Typography>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="이전"
          variant="ghost"
          onPress={onBack}
          style={styles.backBtn}
        />
        <Button
          title="다음"
          onPress={onNext}
          size="lg"
          style={styles.nextBtn}
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
  bloomArea: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  bloomCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bloomEmoji: {
    fontSize: 60,
  },
  bloomLabel: {
    marginTop: spacing.md,
    fontWeight: '600',
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginTop: spacing.base,
    lineHeight: 24,
  },
  features: {
    marginTop: spacing.xl,
    alignSelf: 'stretch',
    gap: spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  featureIcon: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing['2xl'],
    paddingBottom: spacing['3xl'],
    gap: spacing.md,
  },
  backBtn: {
    flex: 0,
  },
  nextBtn: {
    flex: 1,
  },
});
