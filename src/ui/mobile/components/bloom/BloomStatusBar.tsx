import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '@ui/shared/components/Typography';
import { useThemeColors } from '@theme/index';
import { spacing, borderRadius } from '@theme/spacing';
import type { BloomGrowthStage } from '@core/types';
import { getBloomStageName, getGrowthProgress } from '@core/utils/bloom';
import { GROWTH_THRESHOLDS } from '@core/types';

interface BloomStatusBarProps {
  stage: BloomGrowthStage;
  growthPoints: number;
  health: number;
  waterDrops: number;
}

export function BloomStatusBar({ stage, growthPoints, health, waterDrops }: BloomStatusBarProps) {
  const colors = useThemeColors();
  const progress = getGrowthProgress(growthPoints, stage);
  const stageName = getBloomStageName(stage);
  const nextStage = Math.min(stage + 1, 4) as BloomGrowthStage;
  const nextThreshold = GROWTH_THRESHOLDS[nextStage];

  return (
    <View style={styles.container}>
      {/* Growth progress */}
      <View style={styles.row}>
        <Typography variant="caption" color="secondary">
          {stageName} → {stage < 4 ? getBloomStageName(nextStage) : 'MAX'}
        </Typography>
        <Typography variant="caption" color="secondary">
          {growthPoints}/{stage < 4 ? nextThreshold : growthPoints}
        </Typography>
      </View>
      <View style={[styles.progressTrack, { backgroundColor: colors.card }]}>
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: colors.primary,
              width: `${Math.min(progress * 100, 100)}%`,
            },
          ]}
        />
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <StatChip icon="💧" value={waterDrops} label="물방울" color="#64B5F6" />
        <StatChip icon="❤️" value={health} label="건강" color={health > 50 ? '#EF5350' : '#BDBDBD'} />
        <StatChip icon="⭐" value={growthPoints} label="성장" color="#FFD54F" />
      </View>
    </View>
  );
}

function StatChip({
  icon,
  value,
  label,
  color,
}: {
  icon: string;
  value: number;
  label: string;
  color: string;
}) {
  return (
    <View style={statStyles.chip}>
      <Typography variant="body">{icon}</Typography>
      <Typography variant="body" style={{ fontWeight: '600', marginLeft: 4 }}>
        {value}
      </Typography>
      <Typography variant="caption" color="tertiary" style={{ marginLeft: 2 }}>
        {label}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

const statStyles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
