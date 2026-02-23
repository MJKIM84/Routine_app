import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeLayout } from '@ui/shared/layouts/SafeLayout';
import { GlassCard } from '@ui/shared/components/GlassCard';
import { Typography } from '@ui/shared/components/Typography';
import { useThemeColors } from '@theme/index';
import { spacing, borderRadius } from '@theme/spacing';
import { useSettingsStore, type ThemeMode } from '@core/stores/settingsStore';

const THEME_OPTIONS: { mode: ThemeMode; label: string; icon: string; description: string }[] = [
  {
    mode: 'system',
    label: '시스템 설정',
    icon: '📱',
    description: '기기 설정에 따라 자동 전환',
  },
  {
    mode: 'light',
    label: '라이트 모드',
    icon: '☀️',
    description: '밝고 따뜻한 베이지 테마',
  },
  {
    mode: 'dark',
    label: '다크 모드',
    icon: '🌙',
    description: '눈에 편안한 다크 테마',
  },
];

export function ThemeSettingsScreen() {
  const colors = useThemeColors();
  const router = useRouter();

  const themeMode = useSettingsStore((s) => s.themeMode);
  const setThemeMode = useSettingsStore((s) => s.setThemeMode);
  const hapticEnabled = useSettingsStore((s) => s.hapticEnabled);
  const setHapticEnabled = useSettingsStore((s) => s.setHapticEnabled);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const trackColor = { false: colors.cardBorder, true: colors.primary + '80' };
  const thumbColor = Platform.OS === 'android' ? colors.primary : undefined;

  return (
    <SafeLayout>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
          <Typography variant="h3">{'\u2190'} </Typography>
        </TouchableOpacity>
        <Typography variant="h2" style={{ flex: 1 }}>테마 설정</Typography>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Theme mode */}
        <Typography variant="h3" style={styles.sectionTitle}>
          외관
        </Typography>
        <GlassCard style={styles.card}>
          {THEME_OPTIONS.map((option, index) => {
            const isSelected = themeMode === option.mode;
            return (
              <React.Fragment key={option.mode}>
                {index > 0 && (
                  <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />
                )}
                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() => setThemeMode(option.mode)}
                  activeOpacity={0.7}
                >
                  <Typography variant="body">{option.icon}</Typography>
                  <View style={styles.optionInfo}>
                    <Typography variant="body" style={{ fontWeight: isSelected ? '700' : '400' }}>
                      {option.label}
                    </Typography>
                    <Typography variant="caption" color="secondary">
                      {option.description}
                    </Typography>
                  </View>
                  <View
                    style={[
                      styles.radio,
                      { borderColor: isSelected ? colors.primary : colors.textTertiary },
                    ]}
                  >
                    {isSelected && (
                      <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                    )}
                  </View>
                </TouchableOpacity>
              </React.Fragment>
            );
          })}
        </GlassCard>

        {/* Haptic feedback */}
        <Typography variant="h3" style={styles.sectionTitle}>
          인터랙션
        </Typography>
        <GlassCard style={styles.card}>
          <View style={styles.switchRow}>
            <View style={styles.optionInfo}>
              <Typography variant="body">진동 피드백</Typography>
              <Typography variant="caption" color="secondary">
                버튼 탭 시 진동 반응
              </Typography>
            </View>
            <Switch
              value={hapticEnabled}
              onValueChange={setHapticEnabled}
              trackColor={trackColor}
              thumbColor={hapticEnabled ? thumbColor : undefined}
            />
          </View>
        </GlassCard>

        {/* Preview */}
        <Typography variant="h3" style={styles.sectionTitle}>
          미리보기
        </Typography>
        <GlassCard style={styles.previewCard}>
          <View style={styles.previewRow}>
            <View style={[styles.previewChip, { backgroundColor: colors.primary }]}>
              <Typography variant="caption" style={{ color: '#fff', fontWeight: '600' }}>
                Primary
              </Typography>
            </View>
            <View style={[styles.previewChip, { backgroundColor: colors.accent }]}>
              <Typography variant="caption" style={{ color: '#fff', fontWeight: '600' }}>
                Accent
              </Typography>
            </View>
            <View style={[styles.previewChip, { backgroundColor: colors.success }]}>
              <Typography variant="caption" style={{ color: '#fff', fontWeight: '600' }}>
                Success
              </Typography>
            </View>
          </View>
          <View style={[styles.previewDivider, { backgroundColor: colors.cardBorder }]} />
          <View style={styles.previewTextRow}>
            <Typography variant="body">Aa</Typography>
            <Typography variant="body" color="secondary">Bb</Typography>
            <Typography variant="body" color="tertiary">Cc</Typography>
            <Typography variant="body" style={{ fontWeight: '700' }}>Dd</Typography>
          </View>
          <Typography variant="caption" color="secondary" style={{ marginTop: spacing.sm }}>
            현재 적용된 테마의 색상과 텍스트 스타일
          </Typography>
        </GlassCard>

        {/* Info */}
        <GlassCard style={[styles.infoCard, { backgroundColor: colors.primary + '08' }]}>
          <Typography variant="caption" color="secondary" style={{ lineHeight: 18 }}>
            {'💡 '}시스템 설정을 선택하면 기기의 다크 모드 설정에 따라 자동으로 테마가 변경됩니다.
            {'\n'}테마 변경은 앱 전체에 즉시 적용됩니다.
          </Typography>
        </GlassCard>

        <View style={{ height: Platform.OS === 'ios' ? 100 : 80 }} />
      </ScrollView>
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  sectionTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  card: {
    marginBottom: spacing.sm,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: spacing.xs,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  optionInfo: {
    flex: 1,
  },
  radio: {
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
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  previewCard: {
    marginBottom: spacing.sm,
  },
  previewRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  previewChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  previewDivider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: spacing.md,
  },
  previewTextRow: {
    flexDirection: 'row',
    gap: spacing.xl,
    alignItems: 'baseline',
  },
  infoCard: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
});
