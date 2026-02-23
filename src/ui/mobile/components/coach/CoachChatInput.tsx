import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Typography } from '@ui/shared/components/Typography';
import { useThemeColors } from '@theme/index';
import { spacing, borderRadius } from '@theme/spacing';
import { QUICK_SUGGESTIONS } from '@core/services/coachService';
import { haptics } from '@platform/haptics';

interface CoachChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  remainingMessages: number;
  showSuggestions?: boolean;
}

export function CoachChatInput({
  onSend,
  disabled = false,
  remainingMessages,
  showSuggestions = true,
}: CoachChatInputProps) {
  const colors = useThemeColors();
  const [text, setText] = useState('');

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    haptics.light();
    onSend(trimmed);
    setText('');
  }, [text, disabled, onSend]);

  const handleSuggestion = useCallback(
    (message: string) => {
      if (disabled) return;
      haptics.light();
      onSend(message);
    },
    [disabled, onSend],
  );

  return (
    <View style={styles.container}>
      {/* Quick suggestions */}
      {showSuggestions && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestionsContent}
          style={styles.suggestionsScroll}
        >
          {QUICK_SUGGESTIONS.map((suggestion) => (
            <TouchableOpacity
              key={suggestion.label}
              onPress={() => handleSuggestion(suggestion.message)}
              style={[
                styles.suggestionChip,
                {
                  backgroundColor: colors.primary + '15',
                  borderColor: colors.primary + '30',
                },
              ]}
              activeOpacity={0.7}
              disabled={disabled}
            >
              <Typography
                variant="caption"
                style={{ color: colors.primary, fontWeight: '500' }}
              >
                {suggestion.label}
              </Typography>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Input area */}
      <View style={[styles.inputRow, { borderTopColor: colors.cardBorder }]}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={
            disabled
              ? '오늘 무료 메시지를 모두 사용했어요'
              : '루미에게 메시지를 보내세요...'
          }
          placeholderTextColor={colors.textTertiary}
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: colors.cardBorder,
            },
          ]}
          multiline
          maxLength={500}
          editable={!disabled}
          returnKeyType="send"
          onSubmitEditing={handleSend}
          blurOnSubmit
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={disabled || !text.trim()}
          style={[
            styles.sendBtn,
            {
              backgroundColor: text.trim() && !disabled ? colors.primary : colors.textTertiary + '30',
            },
          ]}
          activeOpacity={0.7}
        >
          <Typography
            variant="body"
            style={{ color: text.trim() && !disabled ? '#FFFFFF' : colors.textTertiary }}
          >
            ↑
          </Typography>
        </TouchableOpacity>
      </View>

      {/* Remaining messages count */}
      {remainingMessages < 999 && (
        <View style={styles.limitInfo}>
          <Typography variant="label" color="tertiary" style={styles.limitText}>
            오늘 남은 메시지: {remainingMessages}회
          </Typography>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  suggestionsScroll: {
    maxHeight: 44,
  },
  suggestionsContent: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  suggestionChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm + 2,
    fontSize: 15,
    maxHeight: 100,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  limitInfo: {
    alignItems: 'center',
    paddingBottom: spacing.xs,
  },
  limitText: {
    textTransform: 'none',
    letterSpacing: 0,
  },
});
