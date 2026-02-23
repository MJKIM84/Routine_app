export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  type: 'achievement' | 'tip' | 'encouragement' | 'challenge';
  likes: number;
  isLiked: boolean;
  createdAt: number;
  tags?: string[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  durationDays: number;
  participantCount: number;
  category: string;
  isJoined: boolean;
  startDate?: number;
  progress?: number;
}

export interface ReferralInfo {
  code: string;
  referralCount: number;
  rewardsEarned: number;
  shareLink: string;
}
