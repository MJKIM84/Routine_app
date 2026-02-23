import { Redirect } from 'expo-router';
import { useOnboardingStore } from '@core/stores/onboardingStore';

export default function Index() {
  const hasCompleted = useOnboardingStore((s) => s.hasCompletedOnboarding);

  if (!hasCompleted) {
    return <Redirect href="/(onboarding)" />;
  }

  return <Redirect href="/(tabs)" />;
}
