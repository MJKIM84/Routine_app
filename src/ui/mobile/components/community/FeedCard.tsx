import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { GlassCard } from '@ui/shared/components/GlassCard';
import { Typography } from '@ui/shared/components/Typography';
import { useThemeColors } from '@theme/index';
import { spacing, borderRadius } from '@theme/spacing';
import type { CommunityPost } from '@core/types';

const TYPE_CONFIG: Record<CommunityPost['type'], { icon: string; label: string }> = {
  achievement: { icon: '🏆', label: '달성' },
  tip: { icon: '💡', label: '팁' },
  encouragement: { icon: '💛', label: '응원' },
  challenge: { icon: '🔥', label: '챌린지' },
};

function getTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

interface FeedCardProps {
  post: CommunityPost;
  onLike: (postId: string) => void;
}

export function FeedCard({ post, onLike }: FeedCardProps) {
  const colors = useThemeColors();
  const typeInfo = TYPE_CONFIG[post.type];

  return (
    <GlassCard style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: colors.primary + '15' }]}>
          <Typography variant="body">
            {post.userName.charAt(0)}
          </Typography>
        </View>
        <View style={styles.headerInfo}>
          <Typography variant="body" style={{ fontWeight: '600' }}>
            {post.userName}
          </Typography>
          <Typography variant="caption" color="tertiary">
            {getTimeAgo(post.createdAt)}
          </Typography>
        </View>
        <View style={[styles.typeBadge, { backgroundColor: colors.primary + '10' }]}>
          <Typography variant="caption">
            {typeInfo.icon} {typeInfo.label}
          </Typography>
        </View>
      </View>

      {/* Content */}
      <Typography variant="body" style={styles.content}>
        {post.content}
      </Typography>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <View style={styles.tags}>
          {post.tags.map((tag) => (
            <View
              key={tag}
              style={[styles.tag, { backgroundColor: colors.primary + '10' }]}
            >
              <Typography variant="caption" style={{ color: colors.primary }}>
                #{tag}
              </Typography>
            </View>
          ))}
        </View>
      )}

      {/* Actions */}
      <View style={[styles.actions, { borderTopColor: colors.cardBorder }]}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onLike(post.id)}
          activeOpacity={0.7}
        >
          <Typography variant="body">
            {post.isLiked ? '❤️' : '🤍'}
          </Typography>
          <Typography
            variant="caption"
            style={{ marginLeft: 4, color: post.isLiked ? colors.accent : colors.textSecondary }}
          >
            {post.likes}
          </Typography>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <Typography variant="body">💬</Typography>
          <Typography variant="caption" color="secondary" style={{ marginLeft: 4 }}>
            답글
          </Typography>
        </TouchableOpacity>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  typeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  content: {
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: spacing.sm,
    gap: spacing.xl,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
});
