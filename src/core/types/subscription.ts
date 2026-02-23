export type SubscriptionTier = 'free' | 'premium' | 'premium_plus';

export type SubscriptionPeriod = 'monthly' | 'yearly';

export interface SubscriptionPlan {
  id: string;
  tier: SubscriptionTier;
  period: SubscriptionPeriod;
  price: number;
  currency: string;
  priceLabel: string;
  features: string[];
  isPopular?: boolean;
}

export interface SubscriptionState {
  tier: SubscriptionTier;
  expiresAt: number | null;
  isActive: boolean;
}

export const FREE_FEATURES = [
  '기본 루틴 관리 (5개)',
  'Bloom 캐릭터',
  'AI 코치 (일 3회)',
  '기본 통계',
] as const;

export const PREMIUM_FEATURES = [
  '무제한 루틴 관리',
  'Bloom 캐릭터 + 커스터마이징',
  'AI 코치 무제한',
  '상세 통계 & 인사이트',
  '스트릭 복원 (월 2회)',
  '광고 제거',
  '프리미엄 테마',
] as const;

export const PREMIUM_PLUS_FEATURES = [
  ...PREMIUM_FEATURES,
  '커뮤니티 프리미엄 배지',
  '우선 고객 지원',
  'Bloom 특별 종 해금',
] as const;
