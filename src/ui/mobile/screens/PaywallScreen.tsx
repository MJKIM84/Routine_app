import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '@ui/shared/components/Typography';
import { Button } from '@ui/shared/components/Button';
import { GlassCard } from '@ui/shared/components/GlassCard';
import { useThemeColors } from '@theme/index';
import { spacing, borderRadius } from '@theme/spacing';
import { useSubscriptionStore, SUBSCRIPTION_PLANS } from '@core/stores/subscriptionStore';
import { PREMIUM_FEATURES, FREE_FEATURES } from '@core/types';
import { haptics } from '@platform/haptics';
import type { SubscriptionPlan } from '@core/types';

interface PaywallScreenProps {
  visible: boolean;
  onClose: () => void;
  featureHighlight?: string;
}

export function PaywallScreen({ visible, onClose, featureHighlight }: PaywallScreenProps) {
  const colors = useThemeColors();
  const purchase = useSubscriptionStore((s) => s.purchase);
  const restore = useSubscriptionStore((s) => s.restore);
  const isPurchasing = useSubscriptionStore((s) => s.isPurchasing);
  const isRestoring = useSubscriptionStore((s) => s.isRestoring);

  const [selectedPlan, setSelectedPlan] = useState<string>(
    SUBSCRIPTION_PLANS.find((p) => p.isPopular)?.id ?? SUBSCRIPTION_PLANS[0]?.id ?? '',
  );

  const handlePurchase = useCallback(async () => {
    if (!selectedPlan) return;
    haptics.light();

    const success = await purchase(selectedPlan);
    if (success) {
      haptics.success();
      onClose();
    } else {
      if (Platform.OS === 'web') {
        // Web fallback
      } else {
        Alert.alert('결제 실패', '결제를 완료할 수 없습니다. 다시 시도해주세요.');
      }
    }
  }, [selectedPlan, purchase, onClose]);

  const handleRestore = useCallback(async () => {
    haptics.light();
    const success = await restore();
    if (success) {
      haptics.success();
      onClose();
    } else {
      if (Platform.OS === 'web') {
        // Web fallback
      } else {
        Alert.alert('복원 실패', '이전 구매 내역을 찾을 수 없습니다.');
      }
    }
  }, [restore, onClose]);

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Typography variant="body" color="accent">
              닫기
            </Typography>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Hero */}
          <View style={styles.hero}>
            <Typography variant="display" style={styles.heroEmoji}>
              ✨
            </Typography>
            <Typography variant="h1" style={styles.heroTitle}>
              Premium으로{'\n'}업그레이드
            </Typography>
            <Typography variant="body" color="secondary" style={styles.heroSubtitle}>
              건강한 습관의 가능성을 무한히 확장하세요
            </Typography>
          </View>

          {featureHighlight && (
            <GlassCard style={styles.highlightCard}>
              <Typography variant="caption" color="accent" style={{ fontWeight: '600' }}>
                💎 프리미엄 기능
              </Typography>
              <Typography variant="body" style={{ marginTop: spacing.xs }}>
                {featureHighlight}
              </Typography>
            </GlassCard>
          )}

          {/* Plan selection */}
          <View style={styles.plans}>
            {SUBSCRIPTION_PLANS.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isSelected={selectedPlan === plan.id}
                onSelect={() => {
                  haptics.light();
                  setSelectedPlan(plan.id);
                }}
              />
            ))}
          </View>

          {/* Features list */}
          <View style={styles.features}>
            <Typography variant="h3" style={styles.featuresTitle}>
              Premium에 포함된 기능
            </Typography>
            {PREMIUM_FEATURES.map((feature, i) => (
              <View key={i} style={styles.featureRow}>
                <Typography variant="body" style={{ color: colors.primary }}>
                  ✓
                </Typography>
                <Typography variant="body" style={styles.featureText}>
                  {feature}
                </Typography>
              </View>
            ))}
          </View>

          {/* Free tier comparison */}
          <View style={styles.freeSection}>
            <Typography variant="caption" color="tertiary" style={styles.freeTitle}>
              무료 플랜
            </Typography>
            {FREE_FEATURES.map((feature, i) => (
              <View key={i} style={styles.featureRow}>
                <Typography variant="body" color="tertiary">
                  •
                </Typography>
                <Typography variant="caption" color="secondary" style={styles.featureText}>
                  {feature}
                </Typography>
              </View>
            ))}
          </View>

          <View style={{ height: spacing['2xl'] }} />
        </ScrollView>

        {/* CTA */}
        <View style={[styles.cta, { borderTopColor: colors.cardBorder }]}>
          <Button
            title={isPurchasing ? '처리 중...' : '프리미엄 시작하기'}
            onPress={handlePurchase}
            size="lg"
            loading={isPurchasing}
            style={styles.ctaButton}
          />
          <TouchableOpacity onPress={handleRestore} disabled={isRestoring}>
            <Typography variant="caption" color="secondary" style={styles.restoreText}>
              {isRestoring ? '복원 중...' : '구매 복원하기'}
            </Typography>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

/** Individual plan card */
function PlanCard({
  plan,
  isSelected,
  onSelect,
}: {
  plan: SubscriptionPlan;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const colors = useThemeColors();
  const savingsLabel = plan.period === 'yearly' ? '32% 할인' : null;

  return (
    <TouchableOpacity
      onPress={onSelect}
      style={[
        styles.planCard,
        {
          borderColor: isSelected ? colors.primary : colors.cardBorder,
          backgroundColor: isSelected ? colors.primary + '08' : colors.card,
        },
      ]}
      activeOpacity={0.7}
    >
      {plan.isPopular && (
        <View style={[styles.popularBadge, { backgroundColor: colors.primary }]}>
          <Typography variant="label" color="inverse" style={styles.popularText}>
            인기
          </Typography>
        </View>
      )}

      <View style={styles.planRadio}>
        <View
          style={[
            styles.radioOuter,
            { borderColor: isSelected ? colors.primary : colors.textTertiary },
          ]}
        >
          {isSelected && (
            <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
          )}
        </View>
      </View>

      <View style={styles.planContent}>
        <Typography variant="body" style={{ fontWeight: '600' }}>
          {plan.period === 'yearly' ? '연간' : '월간'} 플랜
        </Typography>
        <Typography variant="h3" style={{ color: colors.primary }}>
          {plan.priceLabel}
        </Typography>
        {savingsLabel && (
          <Typography variant="caption" style={{ color: colors.success, fontWeight: '600' }}>
            {savingsLabel}
          </Typography>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  heroEmoji: {
    fontSize: 60,
  },
  heroTitle: {
    textAlign: 'center',
    marginTop: spacing.base,
  },
  heroSubtitle: {
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  highlightCard: {
    marginBottom: spacing.lg,
  },
  plans: {
    gap: spacing.md,
    marginBottom: spacing['2xl'],
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderBottomLeftRadius: borderRadius.sm,
  },
  popularText: {
    fontSize: 10,
    textTransform: 'none',
    letterSpacing: 0,
  },
  planRadio: {
    marginRight: spacing.base,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  planContent: {
    flex: 1,
    gap: 2,
  },
  features: {
    marginBottom: spacing.xl,
  },
  featuresTitle: {
    marginBottom: spacing.base,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  featureText: {
    flex: 1,
  },
  freeSection: {
    opacity: 0.7,
    marginBottom: spacing.lg,
  },
  freeTitle: {
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  cta: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  ctaButton: {
    width: '100%',
  },
  restoreText: {
    marginTop: spacing.md,
    textDecorationLine: 'underline',
  },
});
