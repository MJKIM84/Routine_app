import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '@ui/shared/components/Typography';
import { useThemeColors } from '@theme/index';
import { spacing, borderRadius } from '@theme/spacing';
import type { CoachMessage } from '@core/types';

interface ChatBubbleProps {
  message: CoachMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const colors = useThemeColors();
  const isUser = message.role === 'user';

  const timeStr = new Date(message.timestamp).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={[styles.row, isUser && styles.rowUser]}>
      {/* Coach avatar */}
      {!isUser && (
        <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
          <Typography variant="body" style={styles.avatarEmoji}>
            🌿
          </Typography>
        </View>
      )}

      <View
        style={[
          styles.bubble,
          isUser
            ? [styles.bubbleUser, { backgroundColor: colors.primary }]
            : [styles.bubbleCoach, { backgroundColor: colors.card, borderColor: colors.cardBorder }],
        ]}
      >
        {!isUser && (
          <Typography variant="caption" color="accent" style={styles.coachName}>
            루미
          </Typography>
        )}
        <Typography
          variant="body"
          style={[
            styles.messageText,
            { color: isUser ? '#FFFFFF' : colors.text },
          ]}
        >
          {message.content}
        </Typography>
        <Typography
          variant="label"
          style={[
            styles.time,
            { color: isUser ? 'rgba(255,255,255,0.7)' : colors.textTertiary },
          ]}
        >
          {timeStr}
        </Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.base,
  },
  rowUser: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginBottom: 2,
  },
  avatarEmoji: {
    fontSize: 16,
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  bubbleUser: {
    borderBottomRightRadius: 4,
  },
  bubbleCoach: {
    borderWidth: 1,
    borderBottomLeftRadius: 4,
  },
  coachName: {
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'none',
    letterSpacing: 0,
  },
  messageText: {
    lineHeight: 22,
  },
  time: {
    marginTop: spacing.xs,
    textAlign: 'right',
    textTransform: 'none',
    letterSpacing: 0,
  },
});
