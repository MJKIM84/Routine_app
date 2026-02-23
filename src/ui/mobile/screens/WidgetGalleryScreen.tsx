import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeLayout } from '@ui/shared/layouts/SafeLayout';
import { GlassCard } from '@ui/shared/components/GlassCard';
import { Typography } from '@ui/shared/components/Typography';
import { Button } from '@ui/shared/components/Button';
import { WidgetPreview } from '@ui/mobile/components/widget';
import { AVAILABLE_WIDGETS, type WidgetConfig } from '@core/services/widgetService';
import { useThemeColors } from '@theme/index';
import { spacing, borderRadius } from '@theme/spacing';
import { haptics } from '@platform/haptics';
import { TouchableOpacity } from 'react-native';

export function WidgetGalleryScreen() {
  const colors = useThemeColors();
  const router = useRouter();

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <SafeLayout>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
          <Typography variant="h3">← </Typography>
        </TouchableOpacity>
        <Typography variant="h2" style={{ flex: 1 }}>
          위젯
        </Typography>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Info card */}
        <GlassCard style={styles.infoCard}>
          <Typography variant="h3" style={{ textAlign: 'center' }}>
            📱
          </Typography>
          <Typography variant="body" style={{ fontWeight: '600', textAlign: 'center', marginTop: spacing.sm }}>
            홈 화면 위젯
          </Typography>
          <Typography variant="caption" color="secondary" style={{ textAlign: 'center', marginTop: spacing.xs, lineHeight: 18 }}>
            홈 화면에 위젯을 추가하여{'\n'}루틴을 빠르게 확인하세요
          </Typography>
        </GlassCard>

        {/* Widget previews */}
        <Typography variant="h3" style={styles.sectionTitle}>
          사용 가능한 위젯
        </Typography>

        {/* Small widgets row */}
        <Typography variant="label" color="secondary" style={styles.sizeLabel}>
          소형 위젯
        </Typography>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.smallWidgetRow}
        >
          {AVAILABLE_WIDGETS.filter((w) => w.size === 'small').map((widget) => (
            <View key={widget.type} style={styles.smallWidgetContainer}>
              <WidgetPreview type={widget.type} />
              <Typography variant="caption" style={{ textAlign: 'center', marginTop: spacing.sm, fontWeight: '600' }}>
                {widget.label}
              </Typography>
              <Typography variant="caption" color="tertiary" style={{ textAlign: 'center', marginTop: 2 }}>
                {widget.description}
              </Typography>
            </View>
          ))}
        </ScrollView>

        {/* Medium widgets */}
        <Typography variant="label" color="secondary" style={[styles.sizeLabel, { marginTop: spacing.xl }]}>
          중형 위젯
        </Typography>
        {AVAILABLE_WIDGETS.filter((w) => w.size === 'medium').map((widget) => (
          <View key={widget.type} style={styles.mediumWidgetContainer}>
            <WidgetPreview type={widget.type} />
            <View style={styles.widgetInfo}>
              <Typography variant="body" style={{ fontWeight: '600', marginTop: spacing.sm }}>
                {widget.icon} {widget.label}
              </Typography>
              <Typography variant="caption" color="secondary">
                {widget.description}
              </Typography>
            </View>
          </View>
        ))}

        {/* Setup instructions */}
        <GlassCard style={styles.setupCard}>
          <Typography variant="body" style={{ fontWeight: '600', marginBottom: spacing.md }}>
            위젯 추가 방법
          </Typography>
          <SetupStep number={1} text="홈 화면을 길게 누르세요" colors={colors} />
          <SetupStep number={2} text="'+' 또는 '위젯 추가' 버튼을 탭하세요" colors={colors} />
          <SetupStep number={3} text="RoutineFlow를 검색하세요" colors={colors} />
          <SetupStep number={4} text="원하는 위젯을 선택하고 추가하세요" colors={colors} />
        </GlassCard>

        <View style={{ height: Platform.OS === 'ios' ? 100 : 80 }} />
      </ScrollView>
    </SafeLayout>
  );
}

function SetupStep({
  number,
  text,
  colors,
}: {
  number: number;
  text: string;
  colors: ReturnType<typeof useThemeColors>;
}) {
  return (
    <View style={stepStyles.row}>
      <View style={[stepStyles.number, { backgroundColor: colors.primary + '15' }]}>
        <Typography variant="caption" style={{ color: colors.primary, fontWeight: '700' }}>
          {number}
        </Typography>
      </View>
      <Typography variant="body" style={stepStyles.text}>
        {text}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  scrollContent: {
    paddingBottom: spacing['2xl'],
  },
  infoCard: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  sizeLabel: {
    marginBottom: spacing.md,
    textTransform: 'none',
    letterSpacing: 0,
  },
  smallWidgetRow: {
    gap: spacing.md,
    paddingBottom: spacing.sm,
  },
  smallWidgetContainer: {
    width: 160,
    alignItems: 'center',
  },
  mediumWidgetContainer: {
    marginBottom: spacing.lg,
  },
  widgetInfo: {
    paddingHorizontal: spacing.xs,
  },
  setupCard: {
    marginTop: spacing.xl,
  },
});

const stepStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  number: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    marginLeft: spacing.md,
  },
});
