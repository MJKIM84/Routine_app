/**
 * Store Listing Texts
 * 앱스토어 / 플레이스토어 등록용 텍스트 및 메타데이터.
 */

export const STORE_LISTING = {
  // App Store / Play Store 공통
  appName: 'RoutineFlow - 루틴 관리',
  subtitle: '건강한 습관을 디자인하다',
  category: 'Health & Fitness',
  ageRating: '4+',

  // 핵심 기능 (스크린샷 캡션용)
  featureHighlights: [
    {
      title: 'AI 맞춤 루틴',
      description: 'AI 코치가 당신에게 맞는 루틴을 추천해드려요',
      icon: '🤖',
    },
    {
      title: 'Bloom 컴패니언',
      description: '루틴을 완료할수록 함께 성장하는 디지털 식물',
      icon: '🌱',
    },
    {
      title: '스마트 분석',
      description: '주간/월간 리포트로 나의 습관을 돌아봐요',
      icon: '📊',
    },
    {
      title: '커뮤니티 챌린지',
      description: '다른 사용자들과 함께 도전해보세요',
      icon: '🔥',
    },
    {
      title: '홈 화면 위젯',
      description: '위젯으로 오늘의 루틴을 빠르게 확인',
      icon: '📱',
    },
  ],

  // 앱 설명 (Long Description)
  longDescription: {
    ko: `RoutineFlow는 건강한 습관을 체계적으로 관리할 수 있는 올인원 루틴 앱입니다.

🌱 Bloom 컴패니언
매일 루틴을 완료할 때마다 당신의 Bloom이 함께 성장합니다. 물을 주고, 햇빛을 나누며, 5단계 성장을 경험하세요.

🤖 AI 웰니스 코치
AI 코치 '루미'가 당신의 루틴 상태를 분석하고 맞춤 조언을 제공합니다. 동기부여부터 습관 최적화까지!

📊 스마트 분석
주간 트렌드, 카테고리별 완료율, 시간대별 분석으로 나의 습관 패턴을 파악하세요.

🔥 커뮤니티 챌린지
다른 사용자들과 함께하는 7일, 21일, 30일 챌린지로 동기부여를 얻으세요.

✨ 주요 기능
• 아침/오후/저녁/밤 시간대별 루틴 관리
• 스트릭 추적 및 마일스톤 축하
• 홈 화면 위젯으로 빠른 확인
• 다크 모드 지원 (Liquid Glass UI)
• 오프라인 사용 가능

루틴은 하루아침에 만들어지지 않지만, RoutineFlow와 함께라면 더 쉽게 시작할 수 있어요.`,
    en: `RoutineFlow is an all-in-one routine management app for building healthy habits.

🌱 Bloom Companion - Your Bloom grows with every routine you complete.
🤖 AI Wellness Coach - Personalized advice from AI coach 'Lumi'.
📊 Smart Analytics - Track your habits with weekly and monthly reports.
🔥 Community Challenges - Join challenges with other users.

Start your journey to better habits today with RoutineFlow.`,
  },

  // 리뷰 요청 트리거 조건
  reviewPromptConditions: {
    minDaysSinceInstall: 7,
    minRoutinesCompleted: 10,
    minStreak: 3,
    maxPromptsPerMonth: 1,
  },
};

// ─── Social Share Templates ─────────────────────────────
export const SHARE_TEMPLATES = {
  streakMilestone: (days: number) =>
    `🔥 RoutineFlow에서 ${days}일 연속 루틴 달성! 건강한 습관의 힘을 느끼고 있어요. #RoutineFlow #습관관리 #${days}일챌린지`,

  routineComplete: (routineCount: number) =>
    `✅ 오늘 ${routineCount}개 루틴 모두 완료! RoutineFlow와 함께 하루를 완벽하게 마무리했어요. #RoutineFlow #루틴완료`,

  bloomGrowth: (bloomStage: number) =>
    `🌱 나의 Bloom이 ${bloomStage}단계로 성장했어요! 루틴을 할수록 함께 자라는 디지털 식물, 너무 귀엽죠? #RoutineFlow #Bloom`,

  challengeJoin: (challengeName: string) =>
    `🔥 RoutineFlow에서 "${challengeName}" 챌린지에 참여했어요! 함께 도전해볼까요? #RoutineFlow #챌린지`,

  appInvite: (inviteCode: string) =>
    `건강한 습관을 만들고 싶다면 RoutineFlow를 추천해요! 🌱 초대 코드: ${inviteCode}로 가입하면 특별 혜택이 있어요. https://routineflow.app/invite/${inviteCode}`,
};
