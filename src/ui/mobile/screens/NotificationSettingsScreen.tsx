import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView, Switch, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { SafeLayout } from '@ui/shared/layouts/SafeLayout';
import { GlassCard } from '@ui/shared/components/GlassCard';
import { Typography } from '@ui/shared/components/Typography';
import { useThemeColors } from '@theme/index';
import { spacing, borderRadius } from '@theme/spacing';
import { useSettingsStore } from '@core/stores/settingsStore';

export function NotificationSettingsScreen() {
  const colors = useThemeColors();
  const router = useRouter();

  const notificationsEnabled = useSettingsStore((s) => s.notificationsEnabled);
  const setNotificationsEnabled = useSettingsStore((s) => s.setNotificationsEnabled);
  const notifications = useSettingsStore((s) => s.notifications);
  const updateNotifications = useSettingsStore((s) => s.updateNotifications);

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
        <Typography variant="h2" style={{ flex: 1 }}>알림 설정</Typography>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Master toggle */}
        <GlassCard style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Typography variant="body" style={{ fontWeight: '600' }}>
                알림 허용
              </Typography>
              <Typography variant="caption" color="secondary">
                모든 알림을 켜거나 끕니다
              </Typography>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={trackColor}
              thumbColor={notificationsEnabled ? thumbColor : undefined}
            />
          </View>
        </GlassCard>

        {/* Reminder settings */}
        <Typography variant="h3" style={styles.sectionTitle}>
          리마인더
        </Typography>
        <GlassCard style={[styles.card, !notificationsEnabled && styles.disabled]}>
          <SwitchRow
            label="아침 리마인더"
            description={`매일 ${notifications.morningReminderTime}에 루틴 알림`}
            value={notifications.morningReminder}
            disabled={!notificationsEnabled}
            onValueChange={(v) => updateNotifications({ morningReminder: v })}
            trackColor={trackColor}
            thumbColor={thumbColor}
          />
          <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />
          <SwitchRow
            label="저녁 리마인더"
            description={`매일 ${notifications.eveningReminderTime}에 하루 정리`}
            value={notifications.eveningReminder}
            disabled={!notificationsEnabled}
            onValueChange={(v) => updateNotifications({ eveningReminder: v })}
            trackColor={trackColor}
            thumbColor={thumbColor}
          />
          <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />
          <SwitchRow
            label="스트릭 위험 알림"
            description="스트릭이 끊어질 위험이 있을 때"
            value={notifications.streakReminder}
            disabled={!notificationsEnabled}
            onValueChange={(v) => updateNotifications({ streakReminder: v })}
            trackColor={trackColor}
            thumbColor={thumbColor}
          />
        </GlassCard>

        {/* Report & social */}
        <Typography variant="h3" style={styles.sectionTitle}>
          리포트 & 소셜
        </Typography>
        <GlassCard style={[styles.card, !notificationsEnabled && styles.disabled]}>
          <SwitchRow
            label="주간 리포트"
            description="매주 월요일 아침에 주간 분석 알림"
            value={notifications.weeklyReport}
            disabled={!notificationsEnabled}
            onValueChange={(v) => updateNotifications({ weeklyReport: v })}
            trackColor={trackColor}
            thumbColor={thumbColor}
          />
          <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />
          <SwitchRow
            label="커뮤니티 알림"
            description="댓글, 좋아요, 챌린지 업데이트"
            value={notifications.communityUpdates}
            disabled={!notificationsEnabled}
            onValueChange={(v) => updateNotifications({ communityUpdates: v })}
            trackColor={trackColor}
            thumbColor={thumbColor}
          />
        </GlassCard>

        {/* Info */}
        <GlassCard style={[styles.infoCard, { backgroundColor: colors.primary + '08' }]}>
          <Typography variant="caption" color="secondary" style={{ lineHeight: 18 }}>
            {'💡 '}알림 시간은 기기의 설정에 따라 다를 수 있습니다.
            {'\n'}시스템 알림 권한이 꺼져 있으면 앱 알림이 표시되지 않습니다.
          </Typography>
        </GlassCard>

        <View style={{ height: Platform.OS === 'ios' ? 100 : 80 }} />
      </ScrollView>
    </SafeLayout>
  );
}

function SwitchRow({
  label,
  description,
  value,
  disabled,
  onValueChange,
  trackColor,
  thumbColor,
}: {
  label: string;
  description: string;
  value: boolean;
  disabled?: boolean;
  onValueChange: (v: boolean) => void;
  trackColor: { false: string; true: string };
  thumbColor?: string;
}) {
  return (
    <View style={[styles.row, disabled && styles.disabled]}>
      <View style={styles.rowInfo}>
        <Typography variant="body">{label}</Typography>
        <Typography variant="caption" color="secondary">
          {description}
        </Typography>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={trackColor}
        thumbColor={value ? thumbColor : undefined}
      />
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
  sectionTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  card: {
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  rowInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: spacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
  infoCard: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
});
