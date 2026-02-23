import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  OnboardingWelcome,
  OnboardingName,
  OnboardingGoals,
  OnboardingBloom,
  OnboardingReady,
} from '@ui/mobile/components/onboarding';
import { useOnboardingStore, TOTAL_ONBOARDING_STEPS } from '@core/stores/onboardingStore';
import { useBloomStore } from '@core/stores/bloomStore';
import { useThemeColors } from '@theme/index';
import { spacing } from '@theme/spacing';
import { haptics } from '@platform/haptics';

export function OnboardingScreen() {
  const colors = useThemeColors();
  const currentStep = useOnboardingStore((s) => s.currentStep);
  const userName = useOnboardingStore((s) => s.userName);
  const selectedGoals = useOnboardingStore((s) => s.selectedGoals);
  const setUserName = useOnboardingStore((s) => s.setUserName);
  const setSelectedGoals = useOnboardingStore((s) => s.setSelectedGoals);
  const nextStep = useOnboardingStore((s) => s.nextStep);
  const prevStep = useOnboardingStore((s) => s.prevStep);
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);
  const setBloom = useBloomStore((s) => s.setBloom);

  const handleNameNext = useCallback(
    (name: string) => {
      haptics.light();
      setUserName(name);
      nextStep();
    },
    [setUserName, nextStep],
  );

  const handleGoalsNext = useCallback(
    (goals: string[]) => {
      haptics.light();
      setSelectedGoals(goals);
      nextStep();
    },
    [setSelectedGoals, nextStep],
  );

  const handleBloomNext = useCallback(() => {
    haptics.light();
    nextStep();
  }, [nextStep]);

  const handleComplete = useCallback(() => {
    haptics.success();
    // Set the bloom name to user's name
    if (userName) {
      setBloom({ name: `${userName}의 Bloom` });
    }
    completeOnboarding();
    router.replace('/(tabs)');
  }, [userName, setBloom, completeOnboarding]);

  const handleNext = useCallback(() => {
    haptics.light();
    nextStep();
  }, [nextStep]);

  const handleBack = useCallback(() => {
    haptics.light();
    prevStep();
  }, [prevStep]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Progress indicator */}
      <View style={styles.progressRow}>
        {Array.from({ length: TOTAL_ONBOARDING_STEPS }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              {
                backgroundColor: i <= currentStep ? colors.primary : colors.cardBorder,
                flex: i === currentStep ? 2 : 1,
              },
            ]}
          />
        ))}
      </View>

      {/* Step content */}
      {currentStep === 0 && (
        <OnboardingWelcome onNext={handleNext} />
      )}
      {currentStep === 1 && (
        <OnboardingName
          initialName={userName}
          onNext={handleNameNext}
          onBack={handleBack}
        />
      )}
      {currentStep === 2 && (
        <OnboardingGoals
          initialGoals={selectedGoals}
          onNext={handleGoalsNext}
          onBack={handleBack}
        />
      )}
      {currentStep === 3 && (
        <OnboardingBloom
          userName={userName || '사용자'}
          onNext={handleBloomNext}
          onBack={handleBack}
        />
      )}
      {currentStep === 4 && (
        <OnboardingReady
          userName={userName || '사용자'}
          goalCount={selectedGoals.length}
          onComplete={handleComplete}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing.base,
    gap: spacing.xs,
  },
  progressDot: {
    height: 4,
    borderRadius: 2,
  },
});
