import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GlassCard } from '@ui/shared/components/GlassCard';
import { Typography } from '@ui/shared/components/Typography';
import { Button } from '@ui/shared/components/Button';
import { useThemeColors } from '@theme/index';
import { spacing, borderRadius } from '@theme/spacing';
import { haptics } from '@platform/haptics';
import type { Challenge } from '@core/types';

interface ChallengeCardProps {
  challenge: Challenge;
  onJoin: (id: string) => void;
  onLeave: (id: string) => void;
}

export function ChallengeCard({ challenge, onJoin, onLeave }: ChallengeCardProps) {
  const colors = useThemeColors();

  const handlePress = () => {
    haptics.light();
    if (challenge.isJoined) {
      onLeave(challenge.id);
    } else {
      onJoin(challenge.id);
    }
  };

  return (
    <GlassCard style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '10' }]}>
          <Typography variant="h2">{challenge.icon}</Typography>
        </View>
        <View style={styles.info}>
          <Typography variant="body" style={{ fontWeight: '600' }}>
            {challenge.title}
          </Typography>
          <Typography variant="caption" color="secondary" style={styles.description}>
            {challenge.description}
          </Typography>
          <View style={styles.meta}>
            <Typography variant="caption" color="tertiary">
              📅 {challenge.durationDays}일
            </Typography>
            <Typography variant="caption" color="tertiary">
              👥 {challenge.participantCount.toLocaleString()}명
            </Typography>
          </View>
        </View>
      </View>

      {/* Progress bar (if joined) */}
      {challenge.isJoined && challenge.progress !== undefined && (
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Typography variant="caption" color="secondary">
              진행률
            </Typography>
            <Typography variant="caption" style={{ color: colors.primary, fontWeight: '600' }}>
              {challenge.progress}%
            </Typography>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: colors.cardBorder }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: colors.primary,
                  width: `${challenge.progress}%`,
                },
              ]}
            />
          </View>
        </View>
      )}

      <Button
        title={challenge.isJoined ? '참여 중 ✓' : '참여하기'}
        variant={challenge.isJoined ? 'outline' : 'primary'}
        size="sm"
        onPress={handlePress}
        style={styles.button}
      />
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
  },
  description: {
    marginTop: 2,
    lineHeight: 18,
  },
  meta: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  progressSection: {
    marginBottom: spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  button: {
    marginTop: spacing.xs,
  },
});
