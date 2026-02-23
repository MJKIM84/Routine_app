import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Typography } from '@ui/shared/components/Typography';
import { Button } from '@ui/shared/components/Button';
import { useThemeColors } from '@theme/index';
import { spacing, borderRadius } from '@theme/spacing';

interface OnboardingNameProps {
  initialName: string;
  onNext: (name: string) => void;
  onBack: () => void;
}

export function OnboardingName({ initialName, onNext, onBack }: OnboardingNameProps) {
  const colors = useThemeColors();
  const [name, setName] = useState(initialName);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Typography variant="display" style={styles.emoji}>
          👋
        </Typography>
        <Typography variant="h2" style={styles.title}>
          이름을 알려주세요
        </Typography>
        <Typography variant="body" color="secondary" style={styles.subtitle}>
          루미가 당신을 어떻게 불러드릴까요?
        </Typography>
        <View style={styles.inputWrapper}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="이름 또는 닉네임"
            placeholderTextColor={colors.textTertiary}
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                color: colors.text,
                borderColor: name.trim() ? colors.primary : colors.cardBorder,
              },
            ]}
            maxLength={20}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={() => name.trim() && onNext(name.trim())}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="이전"
          variant="ghost"
          onPress={onBack}
          style={styles.backBtn}
        />
        <Button
          title="다음"
          onPress={() => onNext(name.trim())}
          disabled={!name.trim()}
          size="lg"
          style={styles.nextBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  emoji: {
    fontSize: 60,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  inputWrapper: {
    width: '100%',
    marginTop: spacing['2xl'],
  },
  input: {
    borderWidth: 2,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
    fontSize: 18,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing['2xl'],
    paddingBottom: spacing['3xl'],
    gap: spacing.md,
  },
  backBtn: {
    flex: 0,
  },
  nextBtn: {
    flex: 1,
  },
});
