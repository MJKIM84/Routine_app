import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeLayout } from '@ui/shared/layouts/SafeLayout';
import { GlassCard } from '@ui/shared/components/GlassCard';
import { Typography } from '@ui/shared/components/Typography';
import { useThemeColors } from '@theme/index';
import { spacing, borderRadius } from '@theme/spacing';
import { APP_NAME, APP_VERSION } from '@config/constants';

const TECH_STACK = [
  { name: 'React Native', version: '0.81', icon: '⚛️' },
  { name: 'Expo SDK', version: '54', icon: '📦' },
  { name: 'TypeScript', version: '5.x', icon: '🔷' },
  { name: 'WatermelonDB', version: 'Offline-first', icon: '💧' },
  { name: 'Supabase', version: 'Backend', icon: '🟢' },
  { name: 'Skia', version: 'Bloom Rendering', icon: '🎨' },
];

const LEGAL_LINKS = [
  { label: '이용약관', url: 'https://routineflow.app/terms' },
  { label: '개인정보 처리방침', url: 'https://routineflow.app/privacy' },
  { label: '오픈소스 라이선스', url: 'https://routineflow.app/licenses' },
];

export function AppInfoScreen() {
  const colors = useThemeColors();
  const router = useRouter();

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleOpenLink = useCallback((url: string) => {
    Linking.openURL(url).catch(() => {
      // silently fail
    });
  }, []);

  return (
    <SafeLayout>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
          <Typography variant="h3">{'\u2190'} </Typography>
        </TouchableOpacity>
        <Typography variant="h2" style={{ flex: 1 }}>앱 정보</Typography>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* App identity */}
        <GlassCard style={styles.identityCard}>
          <View style={[styles.appIcon, { backgroundColor: colors.primary + '15' }]}>
            <Typography variant="display">🌱</Typography>
          </View>
          <Typography variant="h2" style={{ textAlign: 'center', marginTop: spacing.md }}>
            {APP_NAME}
          </Typography>
          <Typography variant="caption" color="secondary" style={{ textAlign: 'center', marginTop: spacing.xs }}>
            건강한 습관을 디자인하다
          </Typography>
          <View style={[styles.versionBadge, { backgroundColor: colors.primary + '12' }]}>
            <Typography variant="label" style={{ color: colors.primary, letterSpacing: 0, textTransform: 'none' }}>
              v{APP_VERSION}
            </Typography>
          </View>
        </GlassCard>

        {/* What's new */}
        <Typography variant="h3" style={styles.sectionTitle}>
          최근 업데이트
        </Typography>
        <GlassCard style={styles.card}>
          <UpdateItem text="Bloom 컴패니언 성장 시스템" icon="🌱" />
          <UpdateItem text="AI 웰니스 코치" icon="🤖" />
          <UpdateItem text="커뮤니티 챌린지 기능" icon="👥" />
          <UpdateItem text="홈 화면 위젯 지원" icon="📱" />
          <UpdateItem text="주간/월간 분석 리포트" icon="📊" />
        </GlassCard>

        {/* Tech stack */}
        <Typography variant="h3" style={styles.sectionTitle}>
          기술 스택
        </Typography>
        <GlassCard style={styles.card}>
          <View style={styles.techGrid}>
            {TECH_STACK.map((tech) => (
              <View key={tech.name} style={[styles.techItem, { borderColor: colors.cardBorder }]}>
                <Typography variant="body">{tech.icon}</Typography>
                <Typography variant="caption" style={{ fontWeight: '600', marginTop: 2 }}>
                  {tech.name}
                </Typography>
                <Typography variant="caption" color="tertiary" style={{ fontSize: 10 }}>
                  {tech.version}
                </Typography>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Legal */}
        <Typography variant="h3" style={styles.sectionTitle}>
          법적 정보
        </Typography>
        <GlassCard style={styles.card}>
          {LEGAL_LINKS.map((link, index) => (
            <React.Fragment key={link.label}>
              {index > 0 && (
                <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />
              )}
              <TouchableOpacity
                style={styles.legalRow}
                onPress={() => handleOpenLink(link.url)}
                activeOpacity={0.7}
              >
                <Typography variant="body">{link.label}</Typography>
                <Typography variant="body" color="tertiary">{'→'}</Typography>
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </GlassCard>

        {/* Contact */}
        <GlassCard style={styles.card}>
          <View style={styles.contactRow}>
            <Typography variant="caption" color="secondary">
              문의
            </Typography>
            <Typography variant="body" style={{ fontWeight: '500' }}>
              support@routineflow.app
            </Typography>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />
          <View style={styles.contactRow}>
            <Typography variant="caption" color="secondary">
              웹사이트
            </Typography>
            <TouchableOpacity onPress={() => handleOpenLink('https://routineflow.app')}>
              <Typography variant="body" style={{ color: colors.primary, fontWeight: '500' }}>
                routineflow.app
              </Typography>
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* Footer */}
        <Typography
          variant="caption"
          color="tertiary"
          style={{ textAlign: 'center', marginTop: spacing.xl, lineHeight: 18 }}
        >
          Made with 💚 by RoutineFlow Team{'\n'}
          {'\u00A9'} 2024 RoutineFlow. All rights reserved.
        </Typography>

        <View style={{ height: Platform.OS === 'ios' ? 100 : 80 }} />
      </ScrollView>
    </SafeLayout>
  );
}

function UpdateItem({ text, icon }: { text: string; icon: string }) {
  return (
    <View style={styles.updateRow}>
      <Typography variant="caption">{icon}</Typography>
      <Typography variant="body" style={{ flex: 1 }}>
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
  identityCard: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  versionBadge: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  sectionTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  card: {
    marginBottom: spacing.sm,
  },
  updateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  techItem: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderRadius: borderRadius.md,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: spacing.sm,
  },
  legalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
});
