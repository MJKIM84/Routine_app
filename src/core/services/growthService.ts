/**
 * Growth Service
 * ASO, 딥링크, A/B 테스트, 온보딩 퍼널 추적 등 그로스 관련 서비스.
 * 실제 환경에서는 Firebase Analytics, Amplitude, AppsFlyer 등과 연동.
 */

// ─── ASO (App Store Optimization) ───────────────────────
export const ASO_METADATA = {
  ko: {
    appName: 'RoutineFlow - 루틴 관리',
    subtitle: '건강한 습관을 디자인하다',
    keywords: [
      '루틴', '습관', '습관관리', '루틴관리', '운동루틴',
      '아침루틴', '명상', '건강습관', '할일관리', '데일리루틴',
      '자기관리', '생산성', '목표관리', '습관추적', '스트릭',
    ],
    description:
      'RoutineFlow와 함께 건강한 일상을 만들어보세요. ' +
      'AI 코치가 맞춤 루틴을 제안하고, Bloom 컴패니언이 함께 성장합니다. ' +
      '아침 루틴부터 저녁 루틴까지, 당신의 하루를 체계적으로 관리하세요.',
    whatsNew:
      '• 새로운 Bloom 컴패니언 성장 시스템\n' +
      '• AI 웰니스 코치 추가\n' +
      '• 커뮤니티 챌린지 기능\n' +
      '• 홈 화면 위젯 지원\n' +
      '• 주간/월간 분석 리포트',
    promotionalText: '지금 시작하면 Premium 7일 무료 체험! 🌱',
  },
  en: {
    appName: 'RoutineFlow - Habit Tracker',
    subtitle: 'Design Your Healthy Habits',
    keywords: [
      'routine', 'habit', 'tracker', 'morning routine', 'health',
      'wellness', 'meditation', 'exercise', 'daily', 'productivity',
      'goal', 'streak', 'self-care', 'mindfulness', 'companion',
    ],
    description:
      'Build healthy habits with RoutineFlow. ' +
      'AI coach suggests personalized routines, and your Bloom companion grows with you. ' +
      'From morning to night, manage your day systematically.',
    whatsNew:
      '• New Bloom companion growth system\n' +
      '• AI Wellness Coach\n' +
      '• Community challenges\n' +
      '• Home screen widgets\n' +
      '• Weekly/Monthly analytics reports',
    promotionalText: 'Start now for 7-day free Premium trial! 🌱',
  },
};

// ─── Deep Link Configuration ────────────────────────────
export const DEEP_LINK_CONFIG = {
  scheme: 'routineflow',
  universalLinkDomain: 'routineflow.app',
  routes: {
    home: '/',
    routine: '/routine/:id',
    coach: '/coach',
    challenge: '/challenge/:id',
    invite: '/invite/:code',
    profile: '/profile',
    paywall: '/premium',
  },
};

export function buildDeepLink(route: keyof typeof DEEP_LINK_CONFIG.routes, params?: Record<string, string>): string {
  let path = DEEP_LINK_CONFIG.routes[route];
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      path = path.replace(`:${key}`, value);
    }
  }
  return `${DEEP_LINK_CONFIG.scheme}://${path}`;
}

export function buildUniversalLink(route: keyof typeof DEEP_LINK_CONFIG.routes, params?: Record<string, string>): string {
  let path = DEEP_LINK_CONFIG.routes[route];
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      path = path.replace(`:${key}`, value);
    }
  }
  return `https://${DEEP_LINK_CONFIG.universalLinkDomain}${path}`;
}

// ─── AARRR Funnel Events ────────────────────────────────
export type FunnelStage = 'acquisition' | 'activation' | 'retention' | 'referral' | 'revenue';

export interface AnalyticsEvent {
  name: string;
  stage: FunnelStage;
  properties?: Record<string, string | number | boolean>;
}

const EVENT_QUEUE: AnalyticsEvent[] = [];

export function trackEvent(event: AnalyticsEvent): void {
  EVENT_QUEUE.push(event);

  // In production: send to analytics provider
  if (__DEV__) {
    console.log(`[Analytics] ${event.stage}: ${event.name}`, event.properties || '');
  }
}

// Predefined events
export const GrowthEvents = {
  // Acquisition
  appInstall: () => trackEvent({ name: 'app_install', stage: 'acquisition' }),
  firstOpen: () => trackEvent({ name: 'first_open', stage: 'acquisition' }),
  deepLinkOpened: (source: string) =>
    trackEvent({ name: 'deep_link_opened', stage: 'acquisition', properties: { source } }),

  // Activation
  onboardingStarted: () => trackEvent({ name: 'onboarding_started', stage: 'activation' }),
  onboardingCompleted: (durationSec: number) =>
    trackEvent({ name: 'onboarding_completed', stage: 'activation', properties: { durationSec } }),
  firstRoutineCreated: () => trackEvent({ name: 'first_routine_created', stage: 'activation' }),
  firstRoutineCompleted: () => trackEvent({ name: 'first_routine_completed', stage: 'activation' }),
  bloomNamed: () => trackEvent({ name: 'bloom_named', stage: 'activation' }),

  // Retention
  dailyLogin: (daysSinceInstall: number) =>
    trackEvent({ name: 'daily_login', stage: 'retention', properties: { daysSinceInstall } }),
  routineCompleted: (routineId: string, streak: number) =>
    trackEvent({ name: 'routine_completed', stage: 'retention', properties: { routineId, streak } }),
  streakMilestone: (days: number) =>
    trackEvent({ name: 'streak_milestone', stage: 'retention', properties: { days } }),
  coachSessionStarted: () => trackEvent({ name: 'coach_session_started', stage: 'retention' }),

  // Referral
  inviteCodeGenerated: () => trackEvent({ name: 'invite_code_generated', stage: 'referral' }),
  inviteLinkShared: (channel: string) =>
    trackEvent({ name: 'invite_link_shared', stage: 'referral', properties: { channel } }),
  referralSignup: (referrerCode: string) =>
    trackEvent({ name: 'referral_signup', stage: 'referral', properties: { referrerCode } }),

  // Revenue
  paywallViewed: (source: string) =>
    trackEvent({ name: 'paywall_viewed', stage: 'revenue', properties: { source } }),
  trialStarted: (plan: string) =>
    trackEvent({ name: 'trial_started', stage: 'revenue', properties: { plan } }),
  subscriptionPurchased: (plan: string, price: number) =>
    trackEvent({ name: 'subscription_purchased', stage: 'revenue', properties: { plan, price } }),
  subscriptionCancelled: (reason: string) =>
    trackEvent({ name: 'subscription_cancelled', stage: 'revenue', properties: { reason } }),
};

// ─── A/B Test Configuration ─────────────────────────────
export interface ABTest {
  id: string;
  name: string;
  variants: string[];
  activeVariant: string;
  isActive: boolean;
}

const AB_TESTS: ABTest[] = [
  {
    id: 'onboarding_flow',
    name: '온보딩 플로우 테스트',
    variants: ['control', 'short_flow', 'video_intro'],
    activeVariant: 'control',
    isActive: true,
  },
  {
    id: 'paywall_design',
    name: '페이월 디자인 테스트',
    variants: ['control', 'comparison_table', 'social_proof'],
    activeVariant: 'control',
    isActive: true,
  },
  {
    id: 'push_timing',
    name: '푸시 알림 시간 테스트',
    variants: ['7am', '8am', '9am'],
    activeVariant: '7am',
    isActive: false,
  },
];

export function getABTests(): ABTest[] {
  return AB_TESTS;
}

export function getVariant(testId: string): string {
  const test = AB_TESTS.find((t) => t.id === testId);
  if (!test || !test.isActive) return 'control';
  return test.activeVariant;
}

// ─── Campaign Tracking ──────────────────────────────────
export interface Campaign {
  id: string;
  name: string;
  source: string;
  medium: string;
  content?: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'paused' | 'completed';
}

export const ACTIVE_CAMPAIGNS: Campaign[] = [
  {
    id: 'launch_2024',
    name: '런칭 프로모션',
    source: 'instagram',
    medium: 'paid',
    content: '프리미엄 50% 할인',
    startDate: '2024-03-01',
    status: 'active',
  },
  {
    id: 'wellness_month',
    name: '웰니스의 달',
    source: 'blog',
    medium: 'organic',
    content: '건강한 습관 가이드',
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    status: 'active',
  },
  {
    id: 'referral_boost',
    name: '친구 초대 부스트',
    source: 'app',
    medium: 'referral',
    content: '추가 보상 이벤트',
    startDate: '2024-03-15',
    status: 'active',
  },
];
