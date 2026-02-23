export type PlanType = 'free' | 'ad_free' | 'premium' | 'family';

export type UserGoal =
  | 'health'
  | 'productivity'
  | 'mindfulness'
  | 'fitness'
  | 'sleep'
  | 'learning'
  | 'self_care';

export interface UserProfileData {
  id: string;
  supabaseId: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  planType: PlanType;
  timezone: string;
  wakeTime: string;
  onboardingCompleted: boolean;
  goals: UserGoal[];
}
