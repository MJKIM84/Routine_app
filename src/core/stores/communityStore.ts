import { create } from 'zustand';
import type { CommunityPost, Challenge, ReferralInfo } from '@core/types';

// ─── Mock Data ──────────────────────────────────────────
const MOCK_POSTS: CommunityPost[] = [
  {
    id: '1',
    userId: 'user1',
    userName: '하늘',
    content: '30일 연속 명상 루틴 달성! 🧘‍♀️ 처음엔 5분도 힘들었는데 이제 20분도 거뜬해요.',
    type: 'achievement',
    likes: 24,
    isLiked: false,
    createdAt: Date.now() - 3600000,
    tags: ['명상', '30일챌린지'],
  },
  {
    id: '2',
    userId: 'user2',
    userName: '민수',
    content: '아침 루틴 팁 공유! 전날 밤에 운동복을 미리 꺼놓으면 아침 운동 성공률이 확 올라가요 💪',
    type: 'tip',
    likes: 18,
    isLiked: true,
    createdAt: Date.now() - 7200000,
    tags: ['아침루틴', '운동'],
  },
  {
    id: '3',
    userId: 'user3',
    userName: '서연',
    content: '오늘 처음으로 모든 루틴을 완료했어요! 작은 시작이지만 기분이 너무 좋아요 ✨',
    type: 'achievement',
    likes: 31,
    isLiked: false,
    createdAt: Date.now() - 14400000,
    tags: ['첫완료'],
  },
  {
    id: '4',
    userId: 'user4',
    userName: '준혁',
    content: '모두 화이팅! 습관은 하루아침에 만들어지지 않지만, 매일 조금씩 하다 보면 어느새 당신의 일부가 됩니다 🌱',
    type: 'encouragement',
    likes: 42,
    isLiked: false,
    createdAt: Date.now() - 28800000,
    tags: ['응원'],
  },
  {
    id: '5',
    userId: 'user5',
    userName: '예린',
    content: '독서 챌린지 2주차! 매일 20분 읽기가 습관이 되니까 한 달에 책 3권도 가능해졌어요 📚',
    type: 'challenge',
    likes: 15,
    isLiked: false,
    createdAt: Date.now() - 43200000,
    tags: ['독서', '챌린지'],
  },
];

const MOCK_CHALLENGES: Challenge[] = [
  {
    id: 'c1',
    title: '7일 아침 기상 챌린지',
    description: '7일 동안 오전 7시 전에 기상하기! 상쾌한 아침의 시작.',
    icon: '🌅',
    durationDays: 7,
    participantCount: 1247,
    category: '생활',
    isJoined: false,
  },
  {
    id: 'c2',
    title: '21일 운동 습관 만들기',
    description: '매일 최소 30분 운동으로 건강한 습관을 만들어보세요.',
    icon: '💪',
    durationDays: 21,
    participantCount: 892,
    category: '운동',
    isJoined: true,
    startDate: Date.now() - 86400000 * 5,
    progress: 24,
  },
  {
    id: 'c3',
    title: '30일 명상 마스터',
    description: '하루 10분 명상으로 마음의 평화를 찾아보세요.',
    icon: '🧘',
    durationDays: 30,
    participantCount: 634,
    category: '마음',
    isJoined: false,
  },
  {
    id: 'c4',
    title: '14일 물 마시기',
    description: '매일 2리터 물 마시기 챌린지! 건강한 수분 보충 습관.',
    icon: '💧',
    durationDays: 14,
    participantCount: 2103,
    category: '건강',
    isJoined: false,
  },
];

// ─── Store ──────────────────────────────────────────────
interface CommunityState {
  posts: CommunityPost[];
  challenges: Challenge[];
  referral: ReferralInfo;
  activeTab: 'feed' | 'challenges' | 'referral';

  // Actions
  setActiveTab: (tab: 'feed' | 'challenges' | 'referral') => void;
  toggleLike: (postId: string) => void;
  joinChallenge: (challengeId: string) => void;
  leaveChallenge: (challengeId: string) => void;
  addPost: (content: string, type: CommunityPost['type'], tags?: string[]) => void;
}

export const useCommunityStore = create<CommunityState>((set) => ({
  posts: MOCK_POSTS,
  challenges: MOCK_CHALLENGES,
  referral: {
    code: 'ROUTINE2024',
    referralCount: 3,
    rewardsEarned: 2,
    shareLink: 'https://routineflow.app/invite/ROUTINE2024',
  },
  activeTab: 'feed',

  setActiveTab: (tab) => set({ activeTab: tab }),

  toggleLike: (postId) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId
          ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
          : p,
      ),
    })),

  joinChallenge: (challengeId) =>
    set((state) => ({
      challenges: state.challenges.map((c) =>
        c.id === challengeId
          ? {
              ...c,
              isJoined: true,
              startDate: Date.now(),
              progress: 0,
              participantCount: c.participantCount + 1,
            }
          : c,
      ),
    })),

  leaveChallenge: (challengeId) =>
    set((state) => ({
      challenges: state.challenges.map((c) =>
        c.id === challengeId
          ? {
              ...c,
              isJoined: false,
              startDate: undefined,
              progress: undefined,
              participantCount: c.participantCount - 1,
            }
          : c,
      ),
    })),

  addPost: (content, type, tags) =>
    set((state) => ({
      posts: [
        {
          id: Date.now().toString(),
          userId: 'me',
          userName: '나',
          content,
          type,
          likes: 0,
          isLiked: false,
          createdAt: Date.now(),
          tags,
        },
        ...state.posts,
      ],
    })),
}));
