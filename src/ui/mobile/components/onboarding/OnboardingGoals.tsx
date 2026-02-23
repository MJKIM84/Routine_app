import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Typography } from '@ui/shared/components/Typography';
import { Button } from '@ui/shared/components/Button';
import { useThemeColors } from '@theme/index';
import { spacing, borderRadius } from '@theme/spacing';
import { WELLNESS_GOALS } from '@core/stores/onboardingStore';
import { haptics } from '@platform/haptics';

interface OnboardingGoalsProps {
  initialGoals: string[];
  onNext: (goals: string[]) => void;
  onBack: () => void;
}

export function OnboardingGoals({ initialGoals, onNext, onBack }: OnboardingGoalsProps) {
  const colors = useThemeColors();
  const [selected, setSelected] = useState<string[]>(initialGoals);

  const toggleGoal = useCallback((goalId: string) => {
    haptics.light();
    setSelected((prev) =>
      prev.includes(goalId)
        ? prev.filter((id) => id !== goalId)
        : [...prev, goalId],
    );
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h2" style={styles.title}>
          어떤 습관을 만들고 싶나요?
        </Typography>
        <Typography variant="body" color="secondary" style={styles.subtitle}>
          관심 있는 목표를 선택해주세요 (복수 선택 가능)
        </Typography>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {WELLNESS_GOALS.map((goal) => {
          const isSelected = selected.includes(goal.id);
          return (
            <TouchableOpacity
              key={goal.id}
              onPress={() => toggleGoal(goal.id)}
              style={[
                styles.goalCard,
                {
                  backgroundColor: isSelected ? colors.primary + '15' : colors.card,
                  borderColor: isSelected ? colors.primary : colors.cardBorder,
                },
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.goalIcon}>
                <Typography variant="h2">{goal.icon}</Typography>
              </View>
              <View style={styles.goalContent}>
                <Typography variant="body" style={{ fontWeight: '600' }}>
                  {goal.label}
                </Typography>
                <Typography variant="caption" color="secondary">
                  {goal.description}
                </Typography>
              </View>
              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: isSelected ? colors.primary : colors.textTertiary,
                    backgroundColor: isSelected ? colors.primary : 'transparent',
                  },
                ]}
              >
                {isSelected && (
                  <Typography variant="caption" color="inverse" style={styles.checkmark}>
                    ✓
                  </Typography>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="이전"
          variant="ghost"
          onPress={onBack}
          style={styles.backBtn}
        />
        <Button
          title={selected.length > 0 ? `다음 (${selected.length}개 선택)` : '건너뛰기'}
          onPress={() => onNext(selected)}
          size="lg"
          style={styles.nextBtn}
          variant={selected.length > 0 ? 'primary' : 'outline'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing['2xl'],
    paddingBottom: spacing.base,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
  },
  goalIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  goalContent: {
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  checkmark: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing['2xl'],
    paddingBottom: spacing['3xl'],
    paddingTop: spacing.base,
    gap: spacing.md,
  },
  backBtn: {
    flex: 0,
  },
  nextBtn: {
    flex: 1,
  },
});
