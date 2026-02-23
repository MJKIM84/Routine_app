import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { GlassCard } from '@ui/shared/components/GlassCard';
import { Typography } from '@ui/shared/components/Typography';
import { Button } from '@ui/shared/components/Button';
import { useThemeColors } from '@theme/index';
import { spacing, borderRadius } from '@theme/spacing';
import { haptics } from '@platform/haptics';
import type { ReferralInfo } from '@core/types';

interface ReferralSectionProps {
  referral: ReferralInfo;
}

export function ReferralSection({ referral }: ReferralSectionProps) {
  const colors = useThemeColors();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    haptics.light();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    haptics.medium();
    // In real app, use Share API
  };

  return (
    <View>
      {/* Referral hero */}
      <GlassCard style={styles.heroCard}>
        <Typography variant="h2" style={{ textAlign: 'center' }}>
          🎁
        </Typography>
        <Typography variant="h3" style={{ textAlign: 'center', marginTop: spacing.md }}>
          친구를 초대하고{'\n'}보상을 받으세요!
        </Typography>
        <Typography
          variant="body"
          color="secondary"
          style={{ textAlign: 'center', marginTop: spacing.sm, lineHeight: 22 }}
        >
          친구가 가입하면 프리미엄 7일 무료 체험을{'\n'}
          선물로 드려요
        </Typography>
      </GlassCard>

      {/* Invite code */}
      <GlassCard style={styles.codeCard}>
        <Typography variant="label" color="secondary">
          나의 초대 코드
        </Typography>
        <TouchableOpacity
          style={[styles.codeBox, { backgroundColor: colors.primary + '08', borderColor: colors.primary + '20' }]}
          onPress={handleCopyCode}
          activeOpacity={0.7}
        >
          <Typography variant="h3" style={{ color: colors.primary, letterSpacing: 2 }}>
            {referral.code}
          </Typography>
          <Typography variant="caption" style={{ color: colors.primary }}>
            {copied ? '✓ 복사됨' : '탭하여 복사'}
          </Typography>
        </TouchableOpacity>
        <Button
          title="📤 초대 링크 공유하기"
          variant="primary"
          onPress={handleShare}
          style={styles.shareButton}
        />
      </GlassCard>

      {/* Stats */}
      <GlassCard style={styles.statsCard}>
        <Typography variant="body" style={{ fontWeight: '600', marginBottom: spacing.md }}>
          초대 현황
        </Typography>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Typography variant="h2" style={{ color: colors.primary, textAlign: 'center' }}>
              {referral.referralCount}
            </Typography>
            <Typography variant="caption" color="secondary" style={{ textAlign: 'center' }}>
              초대한 친구
            </Typography>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.cardBorder }]} />
          <View style={styles.statItem}>
            <Typography variant="h2" style={{ color: colors.accent, textAlign: 'center' }}>
              {referral.rewardsEarned}
            </Typography>
            <Typography variant="caption" color="secondary" style={{ textAlign: 'center' }}>
              받은 보상
            </Typography>
          </View>
        </View>
      </GlassCard>

      {/* Rewards info */}
      <GlassCard style={styles.rewardsCard}>
        <Typography variant="body" style={{ fontWeight: '600', marginBottom: spacing.md }}>
          보상 안내
        </Typography>
        <RewardItem
          icon="1️⃣"
          title="첫 번째 친구 초대"
          reward="프리미엄 7일 무료"
          colors={colors}
        />
        <RewardItem
          icon="3️⃣"
          title="3명 초대"
          reward="프리미엄 1개월 무료"
          colors={colors}
        />
        <RewardItem
          icon="🔟"
          title="10명 초대"
          reward="프리미엄 영구 이용"
          colors={colors}
        />
      </GlassCard>
    </View>
  );
}

function RewardItem({
  icon,
  title,
  reward,
  colors,
}: {
  icon: string;
  title: string;
  reward: string;
  colors: ReturnType<typeof useThemeColors>;
}) {
  return (
    <View style={[rewardStyles.item, { borderBottomColor: colors.cardBorder }]}>
      <Typography variant="body">{icon}</Typography>
      <View style={rewardStyles.info}>
        <Typography variant="body">{title}</Typography>
        <Typography variant="caption" style={{ color: colors.accent }}>
          {reward}
        </Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
    marginBottom: spacing.md,
  },
  codeCard: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  codeBox: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginTop: spacing.sm,
  },
  shareButton: {
    marginTop: spacing.md,
    width: '100%',
  },
  statsCard: {
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  rewardsCard: {
    marginBottom: spacing.lg,
  },
});

const rewardStyles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: spacing.md,
  },
  info: {
    flex: 1,
  },
});
