import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeLayout } from '@ui/shared/layouts/SafeLayout';
import { Typography } from '@ui/shared/components/Typography';
import { FeedCard, ChallengeCard, ReferralSection } from '@ui/mobile/components/community';
import { useCommunityStore } from '@core/stores/communityStore';
import { useThemeColors } from '@theme/index';
import { spacing, borderRadius } from '@theme/spacing';

type TabId = 'feed' | 'challenges' | 'referral';

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'feed', label: '피드', icon: '📝' },
  { id: 'challenges', label: '챌린지', icon: '🔥' },
  { id: 'referral', label: '초대', icon: '🎁' },
];

export function CommunityScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const posts = useCommunityStore((s) => s.posts);
  const challenges = useCommunityStore((s) => s.challenges);
  const referral = useCommunityStore((s) => s.referral);
  const activeTab = useCommunityStore((s) => s.activeTab);
  const setActiveTab = useCommunityStore((s) => s.setActiveTab);
  const toggleLike = useCommunityStore((s) => s.toggleLike);
  const joinChallenge = useCommunityStore((s) => s.joinChallenge);
  const leaveChallenge = useCommunityStore((s) => s.leaveChallenge);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <SafeLayout>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
          <Typography variant="h3">← </Typography>
        </TouchableOpacity>
        <Typography variant="h2" style={{ flex: 1 }}>
          커뮤니티
        </Typography>
      </View>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && {
                backgroundColor: colors.primary + '15',
                borderColor: colors.primary,
              },
              activeTab !== tab.id && { borderColor: colors.cardBorder },
            ]}
            onPress={() => setActiveTab(tab.id)}
            activeOpacity={0.7}
          >
            <Typography variant="caption">
              {tab.icon} {tab.label}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 'feed' && (
          <View>
            {posts.map((post) => (
              <FeedCard key={post.id} post={post} onLike={toggleLike} />
            ))}
          </View>
        )}

        {activeTab === 'challenges' && (
          <View>
            <Typography variant="body" color="secondary" style={styles.sectionDesc}>
              다른 사용자들과 함께 도전해보세요! 🏆
            </Typography>
            {challenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onJoin={joinChallenge}
                onLeave={leaveChallenge}
              />
            ))}
          </View>
        )}

        {activeTab === 'referral' && (
          <ReferralSection referral={referral} />
        )}

        {/* Bottom spacing for tab bar */}
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
  tabBar: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: spacing['2xl'],
  },
  sectionDesc: {
    marginBottom: spacing.md,
  },
});
