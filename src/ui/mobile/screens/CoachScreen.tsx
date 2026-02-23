import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeLayout } from '@ui/shared/layouts/SafeLayout';
import { Typography } from '@ui/shared/components/Typography';
import { ChatBubble, TypingIndicator, CoachChatInput } from '@ui/mobile/components/coach';
import { useCoachStore } from '@core/stores/coachStore';
import { useRoutineStore } from '@core/stores/routineStore';
import { useBloomStore } from '@core/stores/bloomStore';
import { buildRoutineContext } from '@core/services/coachService';
import { getTodayKey } from '@core/utils/routine';
import { useThemeColors } from '@theme/index';
import { spacing } from '@theme/spacing';

export function CoachScreen() {
  const colors = useThemeColors();
  const scrollRef = useRef<ScrollView>(null);

  // Coach store
  const messages = useCoachStore((s) => s.messages);
  const isLoading = useCoachStore((s) => s.isLoading);
  const sendMessage = useCoachStore((s) => s.sendMessage);
  const initConversation = useCoachStore((s) => s.initConversation);
  const canSendMessage = useCoachStore((s) => s.canSendMessage);
  const getRemainingMessages = useCoachStore((s) => s.getRemainingMessages);

  // Routine context for coach
  const rawRoutines = useRoutineStore((s) => s.routines);
  const rawLogs = useRoutineStore((s) => s.logs);
  const bloomStage = useBloomStore((s) => s.growthStage);
  const bloomHealth = useBloomStore((s) => s.health);

  const routineContext = useMemo(() => {
    const activeRoutines = rawRoutines.filter((r) => r.isActive);
    const today = getTodayKey();
    const todayLogs = rawLogs.filter((l) => l.dateKey === today);
    const completedIds = new Set(todayLogs.map((l) => l.routineId));
    const completedToday = activeRoutines.filter((r) => completedIds.has(r.id)).length;

    return buildRoutineContext({
      routineCount: activeRoutines.length,
      completedToday,
      totalToday: activeRoutines.length,
      bloomStage,
      bloomHealth,
      currentStreak: 0, // TODO: implement streak tracking
    });
  }, [rawRoutines, rawLogs, bloomStage, bloomHealth]);

  // Initialize conversation on mount
  useEffect(() => {
    initConversation();
  }, [initConversation]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  const handleSend = useCallback(
    (content: string) => {
      sendMessage(content, routineContext);
    },
    [sendMessage, routineContext],
  );

  const remaining = getRemainingMessages();
  const canSend = canSendMessage();
  const showSuggestions = messages.length <= 2;

  return (
    <SafeLayout edges={['top']} padded={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.cardBorder }]}>
          <View style={styles.headerContent}>
            <View style={[styles.coachAvatar, { backgroundColor: colors.primary + '20' }]}>
              <Typography variant="h3">🌿</Typography>
            </View>
            <View>
              <Typography variant="h3">루미</Typography>
              <Typography variant="caption" color="secondary">
                AI 웰니스 코치
              </Typography>
            </View>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
        >
          {/* Intro card */}
          {messages.length <= 1 && (
            <View style={[styles.introCard, { backgroundColor: colors.primary + '08' }]}>
              <Typography variant="caption" color="secondary" style={styles.introText}>
                루미는 당신의 건강한 습관 형성을 도와주는 AI 코치예요.
                루틴, 건강, Bloom에 대해 무엇이든 물어보세요!
              </Typography>
            </View>
          )}

          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}

          {isLoading && <TypingIndicator />}

          <View style={{ height: spacing.base }} />
        </ScrollView>

        {/* Input area */}
        <View style={[styles.inputContainer, { backgroundColor: colors.background }]}>
          <CoachChatInput
            onSend={handleSend}
            disabled={!canSend}
            remainingMessages={remaining}
            showSuggestions={showSuggestions}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  coachAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesContent: {
    paddingTop: spacing.base,
    paddingBottom: spacing.sm,
  },
  introCard: {
    marginHorizontal: spacing.base,
    marginBottom: spacing.base,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderRadius: 12,
  },
  introText: {
    textAlign: 'center',
    lineHeight: 20,
  },
  inputContainer: {
    paddingBottom: Platform.OS === 'ios' ? 88 : 64,
  },
});
