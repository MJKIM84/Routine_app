export const notifications = {
  requestPermission: async (): Promise<boolean> => {
    // TODO: expo-notifications 연동
    return false;
  },
  scheduleRoutineReminder: async (_routineId: string, _time: string) => {
    // TODO: 스케줄 알림 구현
  },
  cancelAll: async () => {
    // TODO: 모든 알림 취소
  },
};
