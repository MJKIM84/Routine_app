import { create } from 'zustand';
import type { SubscriptionTier, SubscriptionPlan } from '@core/types';

interface SubscriptionStoreState {
  tier: SubscriptionTier;
  expiresAt: number | null;
  isRestoring: boolean;
  isPurchasing: boolean;

  // Derived
  isPremium: () => boolean;
  isPremiumPlus: () => boolean;

  // Actions
  purchase: (planId: string) => Promise<boolean>;
  restore: () => Promise<boolean>;
  setTier: (tier: SubscriptionTier) => void;
}

/** Available subscription plans (would come from RevenueCat in production) */
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'rf_premium_monthly',
    tier: 'premium',
    period: 'monthly',
    price: 4900,
    currency: 'KRW',
    priceLabel: '₩4,900/월',
    features: [
      '무제한 루틴',
      'AI 코치 무제한',
      '상세 통계',
      '스트릭 복원',
    ],
  },
  {
    id: 'rf_premium_yearly',
    tier: 'premium',
    period: 'yearly',
    price: 39900,
    currency: 'KRW',
    priceLabel: '₩39,900/년',
    features: [
      '무제한 루틴',
      'AI 코치 무제한',
      '상세 통계',
      '스트릭 복원',
    ],
    isPopular: true,
  },
];

export const useSubscriptionStore = create<SubscriptionStoreState>((set, get) => ({
  tier: 'free',
  expiresAt: null,
  isRestoring: false,
  isPurchasing: false,

  isPremium: () => {
    const { tier } = get();
    return tier === 'premium' || tier === 'premium_plus';
  },

  isPremiumPlus: () => {
    const { tier } = get();
    return tier === 'premium_plus';
  },

  purchase: async (planId: string) => {
    set({ isPurchasing: true });

    try {
      // In production: RevenueCat purchase flow
      // const purchaserInfo = await Purchases.purchasePackage(package);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate successful purchase for demo
      const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
      if (plan) {
        const duration = plan.period === 'yearly' ? 365 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
        set({
          tier: plan.tier,
          expiresAt: Date.now() + duration,
          isPurchasing: false,
        });
        return true;
      }

      set({ isPurchasing: false });
      return false;
    } catch {
      set({ isPurchasing: false });
      return false;
    }
  },

  restore: async () => {
    set({ isRestoring: true });

    try {
      // In production: RevenueCat restore flow
      // const purchaserInfo = await Purchases.restorePurchases();
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate no previous purchase found
      set({ isRestoring: false });
      return false;
    } catch {
      set({ isRestoring: false });
      return false;
    }
  },

  setTier: (tier) => set({ tier }),
}));
