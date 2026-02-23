import { create } from 'zustand';

interface OnboardingState {
  hasCompletedOnboarding: boolean;
  currentStep: number;
  userName: string;
  selectedGoals: string[];

  // Actions
  setUserName: (name: string) => void;
  setSelectedGoals: (goals: string[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const ONBOARDING_STEPS = [
  'welcome',     // 0: Welcome screen
  'name',        // 1: Enter name
  'goals',       // 2: Select wellness goals
  'bloom',       // 3: Meet your Bloom
  'ready',       // 4: All set!
] as const;

export const TOTAL_ONBOARDING_STEPS = ONBOARDING_STEPS.length;

export const WELLNESS_GOALS = [
  { id: 'exercise', icon: '🏃', label: '운동 습관 만들기', description: '규칙적인 운동으로 건강해지기' },
  { id: 'meditation', icon: '🧘', label: '마음 챙김', description: '명상과 호흡으로 평온한 하루' },
  { id: 'sleep', icon: '😴', label: '수면 개선', description: '규칙적인 수면 습관 만들기' },
  { id: 'water', icon: '💧', label: '수분 섭취', description: '하루 물 섭취 목표 달성하기' },
  { id: 'journal', icon: '📝', label: '감사 일기', description: '매일 감사한 일 기록하기' },
  { id: 'skincare', icon: '✨', label: '피부 관리', description: '꾸준한 스킨케어 루틴' },
] as const;

export const useOnboardingStore = create<OnboardingState>((set) => ({
  hasCompletedOnboarding: false,
  currentStep: 0,
  userName: '',
  selectedGoals: [],

  setUserName: (name) => set({ userName: name }),
  setSelectedGoals: (goals) => set({ selectedGoals: goals }),

  nextStep: () =>
    set((s) => ({
      currentStep: Math.min(s.currentStep + 1, TOTAL_ONBOARDING_STEPS - 1),
    })),

  prevStep: () =>
    set((s) => ({
      currentStep: Math.max(s.currentStep - 1, 0),
    })),

  completeOnboarding: () =>
    set({ hasCompletedOnboarding: true }),

  resetOnboarding: () =>
    set({
      hasCompletedOnboarding: false,
      currentStep: 0,
      userName: '',
      selectedGoals: [],
    }),
}));
