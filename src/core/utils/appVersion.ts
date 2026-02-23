/**
 * App version utilities
 * 앱 버전 정보 및 업데이트 체크 유틸리티
 */
import * as Application from 'expo-application';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

export function getAppVersion(): string {
  return Application.nativeApplicationVersion ?? Constants.expoConfig?.version ?? '1.0.0';
}

export function getBuildNumber(): string {
  return Application.nativeBuildVersion ?? '1';
}

export function getFullVersion(): string {
  return `${getAppVersion()} (${getBuildNumber()})`;
}

export function getAppName(): string {
  return Application.applicationName ?? 'RoutineFlow';
}

export function getBundleId(): string {
  return Application.applicationId ?? 'com.routineflow.app';
}

/** Get the store URL for the current platform */
export function getStoreUrl(): string | null {
  if (Platform.OS === 'ios') {
    // Replace YOUR_APP_ID with actual App Store ID after first submission
    const appStoreId = Constants.expoConfig?.extra?.appStoreId;
    return appStoreId
      ? `https://apps.apple.com/app/id${appStoreId}`
      : null;
  }
  if (Platform.OS === 'android') {
    const packageName = Application.applicationId;
    return packageName
      ? `https://play.google.com/store/apps/details?id=${packageName}`
      : null;
  }
  return null;
}

/**
 * Get install date (approximate - based on first app launch storage)
 */
export async function getInstallDate(): Promise<Date | null> {
  try {
    if (Platform.OS === 'ios') {
      const installTime = await Application.getInstallationTimeAsync();
      return installTime;
    }
    // Android doesn't have a reliable API for install date
    // Use AsyncStorage fallback in production
    return null;
  } catch {
    return null;
  }
}
