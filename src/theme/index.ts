import { useColorScheme } from 'react-native';
import { lightColors, darkColors, palette } from './colors';
import { typography } from './typography';
import { spacing, borderRadius } from './spacing';
import { shadows, glassEffect } from './shadows';
import { animations } from './animations';

export const theme = {
  palette,
  typography,
  spacing,
  borderRadius,
  shadows,
  glassEffect,
  animations,
};

export function useThemeColors() {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? darkColors : lightColors;
}

export { lightColors, darkColors, palette } from './colors';
export { typography } from './typography';
export { spacing, borderRadius } from './spacing';
export { shadows, glassEffect } from './shadows';
export { animations } from './animations';
