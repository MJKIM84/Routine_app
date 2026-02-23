import { create } from 'zustand';
import type { RoutineData, RoutineLogData } from '@core/types';
import { getTodayKey } from '@core/utils/routine';

interface RoutineStoreState {
  // Data
  routines: RoutineData[];
  logs: RoutineLogData[];

  // Actions
  addRoutine: (routine: Omit<RoutineData, 'id' | 'sortOrder' | 'isActive' | 'isFromTemplate'> & { isFromTemplate?: boolean; templateId?: string }) => string;
  updateRoutine: (id: string, updates: Partial<RoutineData>) => void;
  deleteRoutine: (id: string) => void;
  toggleRoutineActive: (id: string) => void;
  reorderRoutines: (routineIds: string[]) => void;

  // Log actions
  completeRoutine: (routineId: string, note?: string) => void;
  uncompleteRoutine: (routineId: string, dateKey?: string) => void;
}

let idCounter = 0;
function generateId(): string {
  idCounter += 1;
  return `routine_${Date.now()}_${idCounter}`;
}

function generateLogId(): string {
  idCounter += 1;
  return `log_${Date.now()}_${idCounter}`;
}

export const useRoutineStore = create<RoutineStoreState>((set, get) => ({
  routines: [],
  logs: [],

  addRoutine: (input) => {
    const id = generateId();
    const { routines } = get();
    const maxOrder = routines.reduce((max, r) => Math.max(max, r.sortOrder), -1);

    const newRoutine: RoutineData = {
      id,
      title: input.title,
      description: input.description,
      icon: input.icon,
      color: input.color,
      category: input.category,
      timeSlot: input.timeSlot,
      scheduledTime: input.scheduledTime,
      frequencyType: input.frequencyType,
      frequencyValue: input.frequencyValue,
      durationMinutes: input.durationMinutes,
      reminderEnabled: input.reminderEnabled,
      reminderMinutesBefore: input.reminderMinutesBefore,
      sortOrder: maxOrder + 1,
      isActive: true,
      isFromTemplate: input.isFromTemplate ?? false,
      templateId: input.templateId,
    };

    set((state) => ({
      routines: [...state.routines, newRoutine],
    }));

    return id;
  },

  updateRoutine: (id, updates) => {
    set((state) => ({
      routines: state.routines.map((r) =>
        r.id === id ? { ...r, ...updates } : r,
      ),
    }));
  },

  deleteRoutine: (id) => {
    set((state) => ({
      routines: state.routines.filter((r) => r.id !== id),
      logs: state.logs.filter((l) => l.routineId !== id),
    }));
  },

  toggleRoutineActive: (id) => {
    set((state) => ({
      routines: state.routines.map((r) =>
        r.id === id ? { ...r, isActive: !r.isActive } : r,
      ),
    }));
  },

  reorderRoutines: (routineIds) => {
    set((state) => ({
      routines: state.routines.map((r) => {
        const idx = routineIds.indexOf(r.id);
        return idx >= 0 ? { ...r, sortOrder: idx } : r;
      }),
    }));
  },

  completeRoutine: (routineId, note) => {
    const today = getTodayKey();
    const existing = get().logs.find(
      (l) => l.routineId === routineId && l.dateKey === today,
    );
    if (existing) return;

    const newLog: RoutineLogData = {
      id: generateLogId(),
      routineId,
      completedAt: Date.now(),
      dateKey: today,
      note,
    };

    set((state) => ({
      logs: [...state.logs, newLog],
    }));
  },

  uncompleteRoutine: (routineId, dateKey) => {
    const key = dateKey ?? getTodayKey();
    set((state) => ({
      logs: state.logs.filter(
        (l) => !(l.routineId === routineId && l.dateKey === key),
      ),
    }));
  },
}));

/** Selector helpers - use with useMemo in components */
export function selectActiveRoutines(state: RoutineStoreState): RoutineData[] {
  return state.routines.filter((r) => r.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function selectTodayCompletedIds(state: RoutineStoreState): string[] {
  const today = getTodayKey();
  return state.logs.filter((l) => l.dateKey === today).map((l) => l.routineId);
}
