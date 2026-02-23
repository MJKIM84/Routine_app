import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography } from '@ui/shared/components/Typography';
import { GlassCard } from '@ui/shared/components/GlassCard';
import { PaywallScreen } from '@ui/mobile/screens/PaywallScreen';
import { useSubscriptionStore } from '@core/stores/subscriptionStore';
import { useThemeColors } from '@theme/index';
import { spacing, borderRadius } from '@theme/spacing';

interface PremiumGateProps {
  feature: string;
  children: React.ReactNode;
  compact?: boolean;
}

/**
 * Wraps content behind a premium gate.
 * Shows the content if user is premium, otherwise shows an upgrade prompt.
 */
export function PremiumGate({ feature, children, compact = false }: PremiumGateProps) {
  const tier = useSubscriptionStore((s) => s.tier);
  const isPremium = tier === 'premium' || tier === 'premium_plus';
  const [showPaywall, setShowPaywall] = useState(false);

  if (isPremium) {
    return <>{children}</>;
  }

  if (compact) {
    return (
      <>
        <TouchableOpacity
          onPress={() => setShowPaywall(true)}
          activeOpacity={0.7}
        >
          <PremiumBadge feature={feature} />
        </TouchableOpacity>
        <PaywallScreen
          visible={showPaywall}
          onClose={() => setShowPaywall(false)}
          featureHighlight={feature}
        />
      </>
    );
  }

  return (
    <>
      <PremiumCard feature={feature} onUpgrade={() => setShowPaywall(true)} />
      <PaywallScreen
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        featureHighlight={feature}
      />
    </>
  );
}

function PremiumBadge({ feature }: { feature: string }) {
  const colors = useThemeColors();

  return (
    <View style={[styles.badge, { backgroundColor: colors.accent + '15', borderColor: colors.accent + '30' }]}>
      <Typography variant="caption" style={{ color: colors.accent, fontWeight: '600' }}>
        ✨ PRO
      </Typography>
    </View>
  );
}

function PremiumCard({ feature, onUpgrade }: { feature: string; onUpgrade: () => void }) {
  const colors = useThemeColors();

  return (
    <GlassCard style={styles.card}>
      <Typography variant="body" style={styles.lockEmoji}>
        🔒
      </Typography>
      <Typography variant="h3" style={styles.cardTitle}>
        프리미엄 기능
      </Typography>
      <Typography variant="caption" color="secondary" style={styles.cardDesc}>
        {feature}
      </Typography>
      <TouchableOpacity
        onPress={onUpgrade}
        style={[styles.upgradeBtn, { backgroundColor: colors.accent }]}
        activeOpacity={0.7}
      >
        <Typography variant="caption" color="inverse" style={{ fontWeight: '600' }}>
          업그레이드
        </Typography>
      </TouchableOpacity>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  card: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  lockEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  cardTitle: {
    marginBottom: spacing.xs,
  },
  cardDesc: {
    textAlign: 'center',
    marginBottom: spacing.base,
  },
  upgradeBtn: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
});
