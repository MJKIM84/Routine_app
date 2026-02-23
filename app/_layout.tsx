import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useThemeColors } from '@theme/index';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

export default function RootLayout() {
  const colors = useThemeColors();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style={colors.statusBar} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" options={{ presentation: 'modal' }} />
          <Stack.Screen name="(onboarding)" options={{ gestureEnabled: false }} />
          <Stack.Screen name="widget-gallery" options={{ presentation: 'modal' }} />
          <Stack.Screen name="admin" options={{ presentation: 'modal' }} />
          <Stack.Screen name="notification-settings" options={{ presentation: 'modal' }} />
          <Stack.Screen name="theme-settings" options={{ presentation: 'modal' }} />
          <Stack.Screen name="feedback" options={{ presentation: 'modal' }} />
          <Stack.Screen name="about" options={{ presentation: 'modal' }} />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
