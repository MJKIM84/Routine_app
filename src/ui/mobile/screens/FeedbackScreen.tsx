import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeLayout } from '@ui/shared/layouts/SafeLayout';
import { GlassCard } from '@ui/shared/components/GlassCard';
import { Typography } from '@ui/shared/components/Typography';
import { Button } from '@ui/shared/components/Button';
import { useThemeColors } from '@theme/index';
import { spacing, borderRadius } from '@theme/spacing';
import { haptics } from '@platform/haptics';

type FeedbackCategory = 'bug' | 'feature' | 'improvement' | 'other';

const CATEGORIES: { key: FeedbackCategory; label: string; icon: string }[] = [
  { key: 'bug', label: '버그 신고', icon: '🐛' },
  { key: 'feature', label: '기능 요청', icon: '💡' },
  { key: 'improvement', label: '개선 의견', icon: '✨' },
  { key: 'other', label: '기타', icon: '💬' },
];

export function FeedbackScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const [category, setCategory] = useState<FeedbackCategory>('improvement');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleSubmit = useCallback(() => {
    if (!message.trim()) {
      Alert.alert('안내', '피드백 내용을 입력해 주세요.');
      return;
    }
    haptics.success();
    // In production: send to Supabase or email service
    setSubmitted(true);
  }, [message]);

  if (submitted) {
    return (
      <SafeLayout>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
            <Typography variant="h3">{'\u2190'} </Typography>
          </TouchableOpacity>
          <Typography variant="h2" style={{ flex: 1 }}>피드백</Typography>
        </View>
        <View style={styles.successContainer}>
          <Typography variant="display" style={{ textAlign: 'center' }}>
            🎉
          </Typography>
          <Typography variant="h2" style={{ textAlign: 'center', marginTop: spacing.lg }}>
            감사합니다!
          </Typography>
          <Typography
            variant="body"
            color="secondary"
            style={{ textAlign: 'center', marginTop: spacing.sm, lineHeight: 22 }}
          >
            소중한 피드백을 보내주셨습니다.{'\n'}빠르게 검토 후 반영하겠습니다.
          </Typography>
          <Button
            title="돌아가기"
            variant="primary"
            onPress={handleBack}
            style={{ marginTop: spacing['2xl'] }}
          />
        </View>
      </SafeLayout>
    );
  }

  return (
    <SafeLayout>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
          <Typography variant="h3">{'\u2190'} </Typography>
        </TouchableOpacity>
        <Typography variant="h2" style={{ flex: 1 }}>피드백 보내기</Typography>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Category */}
        <Typography variant="h3" style={styles.sectionTitle}>
          카테고리
        </Typography>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat.key;
            return (
              <TouchableOpacity
                key={cat.key}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: isSelected ? colors.primary + '15' : colors.card,
                    borderColor: isSelected ? colors.primary : colors.cardBorder,
                  },
                ]}
                onPress={() => {
                  haptics.light();
                  setCategory(cat.key);
                }}
                activeOpacity={0.7}
              >
                <Typography variant="body">{cat.icon}</Typography>
                <Typography
                  variant="caption"
                  style={{
                    fontWeight: isSelected ? '700' : '500',
                    color: isSelected ? colors.primary : colors.text,
                  }}
                >
                  {cat.label}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Message */}
        <Typography variant="h3" style={styles.sectionTitle}>
          내용
        </Typography>
        <GlassCard style={styles.inputCard}>
          <TextInput
            style={[
              styles.textInput,
              {
                color: colors.text,
                borderColor: colors.cardBorder,
              },
            ]}
            placeholder="어떤 점을 개선하면 좋을까요? 자유롭게 적어주세요."
            placeholderTextColor={colors.textTertiary}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            value={message}
            onChangeText={setMessage}
            maxLength={1000}
          />
          <Typography variant="caption" color="tertiary" style={{ textAlign: 'right', marginTop: spacing.xs }}>
            {message.length}/1000
          </Typography>
        </GlassCard>

        {/* Submit */}
        <Button
          title="피드백 보내기"
          variant="primary"
          onPress={handleSubmit}
          style={styles.submitButton}
        />

        {/* Info */}
        <GlassCard style={[styles.infoCard, { backgroundColor: colors.primary + '08' }]}>
          <Typography variant="caption" color="secondary" style={{ lineHeight: 18 }}>
            {'💌 '}보내주신 피드백은 RoutineFlow 팀에게 직접 전달됩니다.
            {'\n'}개인정보는 수집하지 않으며, 제품 개선에만 활용됩니다.
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
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
  },
  inputCard: {
    marginBottom: spacing.md,
  },
  textInput: {
    minHeight: 140,
    fontSize: 15,
    lineHeight: 22,
    padding: 0,
  },
  submitButton: {
    marginBottom: spacing.md,
  },
  infoCard: {
    marginBottom: spacing.md,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
});
