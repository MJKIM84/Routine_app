import { create } from 'zustand';
import type { CoachMessage } from '@core/types';
import { getCoachResponse, getWelcomeMessage, buildRoutineContext } from '@core/services/coachService';
import { AI_COACH_FREE_LIMIT } from '@config/constants';

interface CoachStoreState {
  messages: CoachMessage[];
  isLoading: boolean;
  dailyUsageCount: number;
  lastUsageDate: string;
  isPremium: boolean;

  // Actions
  sendMessage: (content: string, routineContext?: string) => Promise<void>;
  initConversation: () => void;
  clearConversation: () => void;
  canSendMessage: () => boolean;
  getRemainingMessages: () => number;
}

function getTodayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

let msgIdCounter = 0;
function genMsgId(): string {
  msgIdCounter += 1;
  return `msg_${Date.now()}_${msgIdCounter}`;
}

export const useCoachStore = create<CoachStoreState>((set, get) => ({
  messages: [],
  isLoading: false,
  dailyUsageCount: 0,
  lastUsageDate: '',
  isPremium: false,

  initConversation: () => {
    const { messages } = get();
    if (messages.length === 0) {
      const welcome = getWelcomeMessage();
      set({ messages: [welcome] });
    }
  },

  clearConversation: () => {
    const welcome = getWelcomeMessage();
    set({ messages: [welcome] });
  },

  canSendMessage: () => {
    const { isPremium, dailyUsageCount, lastUsageDate } = get();
    if (isPremium) return true;

    const today = getTodayStr();
    if (lastUsageDate !== today) return true; // New day resets
    return dailyUsageCount < AI_COACH_FREE_LIMIT;
  },

  getRemainingMessages: () => {
    const { isPremium, dailyUsageCount, lastUsageDate } = get();
    if (isPremium) return 999;

    const today = getTodayStr();
    if (lastUsageDate !== today) return AI_COACH_FREE_LIMIT;
    return Math.max(0, AI_COACH_FREE_LIMIT - dailyUsageCount);
  },

  sendMessage: async (content, routineContext) => {
    const state = get();
    if (!state.canSendMessage()) return;
    if (state.isLoading) return;

    const today = getTodayStr();
    const newCount = state.lastUsageDate === today ? state.dailyUsageCount + 1 : 1;

    const userMsg: CoachMessage = {
      id: genMsgId(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    set({
      messages: [...state.messages, userMsg],
      isLoading: true,
      dailyUsageCount: newCount,
      lastUsageDate: today,
    });

    try {
      const allMessages = [...state.messages, userMsg];
      const response = await getCoachResponse(allMessages, routineContext ?? '');

      const assistantMsg: CoachMessage = {
        id: genMsgId(),
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };

      set((s) => ({
        messages: [...s.messages, assistantMsg],
        isLoading: false,
      }));
    } catch {
      const errorMsg: CoachMessage = {
        id: genMsgId(),
        role: 'assistant',
        content: '죄송해요, 잠시 문제가 생겼어요. 다시 시도해 주세요 🙏',
        timestamp: Date.now(),
      };

      set((s) => ({
        messages: [...s.messages, errorMsg],
        isLoading: false,
      }));
    }
  },
}));
