import { Platform } from 'react-native';
import type { RoutineData } from '@core/types';

let Notifications: typeof import('expo-notifications') | null = null;

async function getNotifications() {
  if (!Notifications) {
    Notifications = await import('expo-notifications');
  }
  return Notifications;
}

// ── Permission ──────────────────────────────────────────
export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    const N = await getNotifications();
    const { status: existing } = await N.getPermissionsAsync();
    if (existing === 'granted') return true;

    const { status } = await N.requestPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
}

// ── Schedule helpers ────────────────────────────────────
function parseTime(time: string): { hour: number; minute: number } | null {
  const m = time.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  return { hour: parseInt(m[1], 10), minute: parseInt(m[2], 10) };
}

// 요일 인덱스 (expo-notifications: 1=Sun, 7=Sat)
const DAY_MAP: Record<string, number> = {
  sun: 1, mon: 2, tue: 3, wed: 4, thu: 5, fri: 6, sat: 7,
};

// ── Schedule a routine alarm ────────────────────────────
export async function scheduleRoutineAlarm(routine: RoutineData): Promise<string | null> {
  if (Platform.OS === 'web') return null;
  if (!routine.scheduledTime || !routine.reminderEnabled) return null;

  const parsed = parseTime(routine.scheduledTime);
  if (!parsed) return null;

  // Subtract reminder offset
  let alarmHour = parsed.hour;
  let alarmMinute = parsed.minute - routine.reminderMinutesBefore;
  if (alarmMinute < 0) {
    alarmMinute += 60;
    alarmHour -= 1;
    if (alarmHour < 0) alarmHour = 23;
  }

  try {
    const N = await getNotifications();

    // Cancel existing for this routine first
    await cancelRoutineAlarm(routine.id);

    // Configure notification channel (Android)
    if (Platform.OS === 'android') {
      await N.setNotificationChannelAsync('routine-alarms', {
        name: '루틴 알람',
        importance: N.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        sound: 'default',
      });
    }

    const body = routine.durationMinutes
      ? `${routine.icon} ${routine.title} (${routine.durationMinutes}분)`
      : `${routine.icon} ${routine.title}`;

    let notificationId: string;

    if (routine.frequencyType === 'specific_days' && routine.frequencyValue) {
      // Schedule for each specific day
      const days = routine.frequencyValue.split(',');
      for (const day of days) {
        const weekday = DAY_MAP[day.trim().toLowerCase()];
        if (!weekday) continue;

        await N.scheduleNotificationAsync({
          content: {
            title: '루틴 시간이에요!',
            body,
            data: { routineId: routine.id, type: 'routine_alarm' },
            sound: 'default',
            ...(Platform.OS === 'android' ? { channelId: 'routine-alarms' } : {}),
          },
          trigger: {
            type: N.SchedulableTriggerInputTypes.WEEKLY,
            weekday,
            hour: alarmHour,
            minute: alarmMinute,
          },
          identifier: `routine_${routine.id}_${day}`,
        });
      }
      notificationId = `routine_${routine.id}_multi`;
    } else {
      // Daily alarm
      notificationId = await N.scheduleNotificationAsync({
        content: {
          title: '루틴 시간이에요!',
          body,
          data: { routineId: routine.id, type: 'routine_alarm' },
          sound: 'default',
          ...(Platform.OS === 'android' ? { channelId: 'routine-alarms' } : {}),
        },
        trigger: {
          type: N.SchedulableTriggerInputTypes.DAILY,
          hour: alarmHour,
          minute: alarmMinute,
        },
        identifier: `routine_${routine.id}`,
      });
    }

    return notificationId;
  } catch (e) {
    console.warn('[Notifications] Schedule failed:', e);
    return null;
  }
}

// ── Cancel alarm for a routine ──────────────────────────
export async function cancelRoutineAlarm(routineId: string): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    const N = await getNotifications();
    const scheduled = await N.getAllScheduledNotificationsAsync();
    for (const n of scheduled) {
      if (n.identifier.startsWith(`routine_${routineId}`)) {
        await N.cancelScheduledNotificationAsync(n.identifier);
      }
    }
  } catch (e) {
    console.warn('[Notifications] Cancel failed:', e);
  }
}

// ── Cancel all alarms ───────────────────────────────────
export async function cancelAllAlarms(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    const N = await getNotifications();
    await N.cancelAllScheduledNotificationsAsync();
  } catch (e) {
    console.warn('[Notifications] CancelAll failed:', e);
  }
}

// ── Re-schedule all routine alarms ──────────────────────
export async function rescheduleAllAlarms(routines: RoutineData[]): Promise<void> {
  await cancelAllAlarms();
  const activeRoutines = routines.filter(r => r.isActive && r.reminderEnabled && r.scheduledTime);
  for (const r of activeRoutines) {
    await scheduleRoutineAlarm(r);
  }
}

// ── Setup notification handler ──────────────────────────
export async function setupNotificationHandler(
  onRoutineTap: (routineId: string) => void,
): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    const N = await getNotifications();

    // Handle foreground notifications
    N.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    // Handle notification taps
    N.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (data?.routineId && data?.type === 'routine_alarm') {
        onRoutineTap(data.routineId as string);
      }
    });
  } catch (e) {
    console.warn('[Notifications] Setup handler failed:', e);
  }
}

// ── Legacy export for compatibility ─────────────────────
export const notifications = {
  requestPermission: requestNotificationPermission,
  scheduleRoutineReminder: async (routineId: string, time: string) => {
    // Legacy stub - use scheduleRoutineAlarm instead
    console.warn('Use scheduleRoutineAlarm() instead');
  },
  cancelAll: cancelAllAlarms,
};
