import { View, StyleSheet } from 'react-native';
import { Typography } from '@ui/shared/components/Typography';
import { Button } from '@ui/shared/components/Button';
import { useThemeColors } from '@theme/index';
import { spacing } from '@theme/spacing';
import { router } from 'expo-router';

export default function LoginScreen() {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Typography variant="h1" style={styles.title}>
        RoutineFlow
      </Typography>
      <Typography variant="body" color="secondary" style={styles.subtitle}>
        건강한 습관을 디자인하다
      </Typography>
      <Button
        title="로그인 (준비 중)"
        onPress={() => router.back()}
        style={styles.button}
        disabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  title: { marginBottom: spacing.sm },
  subtitle: { marginBottom: spacing['3xl'] },
  button: { minWidth: 250 },
});
