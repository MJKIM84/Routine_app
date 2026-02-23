/**
 * useAppReview — App Store / Play Store 리뷰 요청 훅
 * storeListings.ts의 조건에 따라 적절한 시점에 리뷰를 요청합니다.
 */
import { useCallback, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as StoreReview from 'expo-store-review';
import * as SecureStore from 'expo-secure-store';
import { STORE_LISTING } from '@config/storeListings';

const REVIEW_STORAGE_KEY = '@routineflow/review';
const { reviewPromptConditions } = STORE_LISTING;

interface ReviewState {
  lastPromptDate: string | null;
  promptCount: number;
  hasReviewed: boolean;
}

async function getReviewState(): Promise<ReviewState> {
  try {
    const raw = await SecureStore.getItemAsync(REVIEW_STORAGE_KEY);
    return raw ? JSON.parse(raw) : { lastPromptDate: null, promptCount: 0, hasReviewed: false };
  } catch {
    return { lastPromptDate: null, promptCount: 0, hasReviewed: false };
  }
}

async function saveReviewState(state: ReviewState): Promise<void> {
  try {
    await SecureStore.setItemAsync(REVIEW_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // silently fail
  }
}

export function useAppReview(userStats: {
  daysSinceInstall: number;
  totalCompletedRoutines: number;
  currentStreak: number;
}) {
  const hasChecked = useRef(false);

  const checkAndRequestReview = useCallback(async () => {
    if (Platform.OS === 'web') return;
    if (hasChecked.current) return;
    hasChecked.current = true;

    try {
      // Check if StoreReview is available
      const isAvailable = await StoreReview.isAvailableAsync();
      if (!isAvailable) return;

      // Check conditions
      const { daysSinceInstall, totalCompletedRoutines, currentStreak } = userStats;
      if (daysSinceInstall < reviewPromptConditions.minDaysSinceInstall) return;
      if (totalCompletedRoutines < reviewPromptConditions.minRoutinesCompleted) return;
      if (currentStreak < reviewPromptConditions.minStreak) return;

      // Check review state
      const state = await getReviewState();
      if (state.hasReviewed) return;

      // Check monthly limit
      if (state.lastPromptDate) {
        const lastDate = new Date(state.lastPromptDate);
        const now = new Date();
        const daysSinceLastPrompt = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceLastPrompt < 30) return;
      }

      // Request review
      await StoreReview.requestReview();

      // Update state
      await saveReviewState({
        lastPromptDate: new Date().toISOString(),
        promptCount: state.promptCount + 1,
        hasReviewed: false, // We can't know if they actually reviewed
      });
    } catch {
      // Silently fail - review prompts are non-critical
    }
  }, [userStats]);

  useEffect(() => {
    // Delay review prompt to not interrupt user flow
    const timer = setTimeout(checkAndRequestReview, 3000);
    return () => clearTimeout(timer);
  }, [checkAndRequestReview]);

  return { requestReview: checkAndRequestReview };
}
