import { create } from 'zustand';

export type ThemeMode = 'system' | 'light' | 'dark';

interface NotificationSettings {
  morningReminder: boolean;
  morningReminderTime: string; // HH:mm
  eveningReminder: boolean;
  eveningReminderTime: string;
  streakReminder: boolean;
  weeklyReport: boolean;
  communityUpdates: boolean;
}

interface SettingsState {
  // General
  notificationsEnabled: boolean;
  hapticEnabled: boolean;
  themeMode: ThemeMode;

  // Notification details
  notifications: NotificationSettings;

  // Actions
  setNotificationsEnabled: (enabled: boolean) => void;
  setHapticEnabled: (enabled: boolean) => void;
  setThemeMode: (mode: ThemeMode) => void;
  updateNotifications: (partial: Partial<NotificationSettings>) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  notificationsEnabled: true,
  hapticEnabled: true,
  themeMode: 'system',

  notifications: {
    morningReminder: true,
    morningReminderTime: '07:00',
    eveningReminder: true,
    eveningReminderTime: '21:00',
    streakReminder: true,
    weeklyReport: true,
    communityUpdates: false,
  },

  setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
  setHapticEnabled: (hapticEnabled) => set({ hapticEnabled }),
  setThemeMode: (themeMode) => set({ themeMode }),
  updateNotifications: (partial) =>
    set((state) => ({
      notifications: { ...state.notifications, ...partial },
    })),
}));
