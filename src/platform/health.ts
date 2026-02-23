import { Platform } from 'react-native';

export const health = {
  isAvailable: (): boolean => {
    return Platform.OS === 'ios' || Platform.OS === 'android';
  },
  requestPermission: async (): Promise<boolean> => {
    // TODO: HealthKit / Health Connect 연동
    return false;
  },
  getSteps: async (_date: string): Promise<number> => {
    // TODO: 걸음 수 조회
    return 0;
  },
  getSleepHours: async (_date: string): Promise<number> => {
    // TODO: 수면 시간 조회
    return 0;
  },
};
