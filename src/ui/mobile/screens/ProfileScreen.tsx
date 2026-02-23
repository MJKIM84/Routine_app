import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeLayout } from '@ui/shared/layouts/SafeLayout';
import { GlassCard } from '@ui/shared/components/GlassCard';
import { Typography } from '@ui/shared/components/Typography';
import { Button } from '@ui/shared/components/Button';
import { PaywallScreen } from '@ui/mobile/screens/PaywallScreen';
import { useThemeColors } from '@theme/index';
import { spacing, borderRadius } from '@theme/spacing';
import { APP_VERSION } from '@config/constants';
import { useOnboardingStore } from '@core/stores/onboardingStore';
import { useSubscriptionStore } from '@core/stores/subscriptionStore';
import { useBloomStore } from '@core/stores/bloomStore';
import { haptics } from '@platform/haptics';

export function ProfileScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const userName = useOnboardingStore((s) => s.userName);
  const tier = useSubscriptionStore((s) => s.tier);
  const bloomName = useBloomStore((s) => s.name);
  const growthStage = useBloomStore((s) => s.growthStage);
  const [showPaywall, setShowPaywall] = useState(false);

  const handleOpenCommunity = useCallback(() => {
    haptics.light();
    router.push('/(tabs)/explore');
  }, [router]);

  const handleOpenWidgets = useCallback(() => {
    haptics.light();
    router.push('/widget-gallery');
  }, [router]);

  const handleOpenAdmin = useCallback(() => {
    haptics.light();
    router.push('/admin');
  }, [router]);

  const handleOpenNotifications = useCallback(() => {
    haptics.light();
    router.push('/notification-settings');
  }, [router]);

  const handleOpenTheme = useCallback(() => {
    haptics.light();
    router.push('/theme-settings');
  }, [router]);

  const handleOpenFeedback = useCallback(() => {
    haptics.light();
    router.push('/feedback');
  }, [router]);

  const handleOpenAbout = useCallback(() => {
    haptics.light();
    router.push('/about');
  }, [router]);

  const isPremium = tier === 'premium' || tier === 'premium_plus';
  const tierLabel = isPremium ? 'Premium' : 'Free';

  return (
    <SafeLayout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Typography variant="h2">프로필</Typography>
        </View>

        {/* Profile card */}
        <GlassCard style={styles.profileCard}>
          <View style={[styles.avatar, { backgroundColor: colors.primary + '15' }]}>
            <Typography variant="display">
              {userName ? userName.charAt(0).toUpperCase() : '👤'}
            </Typography>
          </View>
          <Typography variant="h3" style={{ textAlign: 'center', marginTop: spacing.md }}>
            {userName || '게스트 사용자'}
          </Typography>
          <View style={[styles.tierBadge, {
            backgroundColor: isPremium ? colors.accent + '15' : colors.cardBorder,
          }]}>
            <Typography
              variant="label"
              style={{
                color: isPremium ? colors.accent : colors.textSecondary,
                textTransform: 'none',
                letterSpacing: 0,
                fontWeight: '600',
              }}
            >
              {isPremium ? '✨ ' : ''}{tierLabel} 플랜
            </Typography>
          </View>
          {!isPremium && (
            <Button
              title="Premium 업그레이드"
              variant="secondary"
              onPress={() => {
                haptics.light();
                setShowPaywall(true);
              }}
              style={styles.upgradeButton}
              size="sm"
            />
          )}
        </GlassCard>

        {/* Bloom summary */}
        <GlassCard style={styles.bloomCard}>
          <View style={styles.bloomRow}>
            <Typography variant="h3">🌱</Typography>
            <View style={styles.bloomInfo}>
              <Typography variant="body" style={{ fontWeight: '600' }}>
                {bloomName}
              </Typography>
              <Typography variant="caption" color="secondary">
                성장 단계: {growthStage + 1}/5
              </Typography>
            </View>
          </View>
        </GlassCard>

        {/* Menu items */}
        <GlassCard style={styles.menuCard}>
          <MenuItem icon="🔔" label="알림 설정" onPress={handleOpenNotifications} />
          <MenuItem icon="🎨" label="테마 설정" onPress={handleOpenTheme} />
          {!isPremium && (
            <MenuItem
              icon="💎"
              label="Premium 업그레이드"
              accent
              onPress={() => {
                haptics.light();
                setShowPaywall(true);
              }}
            />
          )}
          <MenuItem icon="📱" label="위젯 설정" onPress={handleOpenWidgets} />
          <MenuItem icon="👥" label="커뮤니티" onPress={handleOpenCommunity} />
          <MenuItem icon="📋" label="피드백 보내기" onPress={handleOpenFeedback} />
          <MenuItem icon="📊" label="어드민 대시보드" onPress={handleOpenAdmin} />
          <MenuItem icon="ℹ️" label="앱 정보" onPress={handleOpenAbout} />
        </GlassCard>

        <Typography
          variant="caption"
          color="tertiary"
          style={{ textAlign: 'center', marginTop: spacing.xl, marginBottom: spacing['3xl'] }}
        >
          RoutineFlow v{APP_VERSION}
        </Typography>
      </ScrollView>

      <PaywallScreen
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
      />
    </SafeLayout>
  );
}

function MenuItem({
  icon,
  label,
  accent,
  onPress,
}: {
  icon: string;
  label: string;
  accent?: boolean;
  onPress: () => void;
}) {
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      style={[menuStyles.item, { borderBottomColor: colors.cardBorder }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Typography variant="body">{icon}</Typography>
      <Typography
        variant="body"
        style={[
          menuStyles.label,
          accent && { color: colors.accent, fontWeight: '600' },
        ]}
      >
        {label}
      </Typography>
      <Typography variant="body" color="tertiary">
        →
      </Typography>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: spacing.xl,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierBadge: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  upgradeButton: {
    marginTop: spacing.base,
  },
  bloomCard: {
    marginBottom: spacing.lg,
  },
  bloomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  bloomInfo: {
    flex: 1,
  },
  menuCard: {
    marginBottom: spacing.lg,
  },
});

const menuStyles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: {
    flex: 1,
    marginLeft: spacing.md,
  },
});
