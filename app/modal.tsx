import { View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Typography } from '@ui/shared/components/Typography';
import { useThemeColors } from '@theme/index';
import { spacing } from '@theme/spacing';

export default function ModalScreen() {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Typography variant="h2">Modal</Typography>
      <Link href="/" dismissTo style={styles.link}>
        <Typography variant="body" style={{ color: colors.primary }}>
          홈으로 돌아가기
        </Typography>
      </Link>
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
  link: {
    marginTop: spacing.base,
    paddingVertical: spacing.base,
  },
});
