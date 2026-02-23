import type { CoachMessage, CoachPersona } from '@core/types';

/** Default coach persona */
export const DEFAULT_COACH: CoachPersona = {
  name: '루미',
  tone: 'warm',
  emoji: '🌿',
  systemPrompt: `당신은 RoutineFlow 앱의 AI 웰니스 코치 "루미"입니다.

역할:
- 사용자의 건강한 습관 형성을 따뜻하게 도와줍니다
- 루틴 완료를 칭찬하고, 못한 날에는 격려합니다
- 구체적이고 실천 가능한 조언을 제공합니다
- Bloom 캐릭터의 성장과 연결하여 동기부여합니다

톤:
- 따뜻하고 친근한 한국어를 사용합니다
- 간결하게 대답합니다 (2-3문장)
- 이모지를 적절히 사용합니다
- 판단하지 않고 공감합니다

절대 하지 않을 것:
- 의학적 진단이나 처방
- 극단적인 다이어트 조언
- 부정적이거나 비난하는 표현`,
};

/** Build context from user's routine data */
export function buildRoutineContext(data: {
  routineCount: number;
  completedToday: number;
  totalToday: number;
  bloomStage: number;
  bloomHealth: number;
  currentStreak: number;
}): string {
  return `[사용자 현재 상태]
- 등록된 루틴: ${data.routineCount}개
- 오늘 완료: ${data.completedToday}/${data.totalToday}
- Bloom 성장 단계: ${data.bloomStage}/4
- Bloom 건강: ${data.bloomHealth}/100
- 현재 스트릭: ${data.currentStreak}일`;
}

/** Generate a welcome message */
export function getWelcomeMessage(): CoachMessage {
  const greetings = [
    '안녕하세요! 🌿 저는 루미예요. 오늘 하루도 건강한 습관과 함께해요!',
    '반갑습니다! 🌱 루미가 오늘도 좋은 습관을 만들어가는 걸 도와드릴게요.',
    '좋은 하루예요! ✨ 오늘은 어떤 루틴을 시작해볼까요?',
  ];

  return {
    id: 'welcome_' + Date.now(),
    role: 'assistant',
    content: greetings[Math.floor(Math.random() * greetings.length)],
    timestamp: Date.now(),
  };
}

/** Quick suggestion chips */
export const QUICK_SUGGESTIONS = [
  { label: '오늘의 조언', message: '오늘 하루를 위한 조언을 해주세요' },
  { label: '루틴 추천', message: '어떤 루틴을 추가하면 좋을까요?' },
  { label: '동기부여', message: '동기부여가 필요해요' },
  { label: 'Bloom 팁', message: 'Bloom을 잘 키우려면 어떻게 해야 하나요?' },
];

/**
 * Simulate AI response (local fallback when no API key).
 * In production, this would call Supabase Edge Function → Claude API.
 */
export async function getCoachResponse(
  messages: CoachMessage[],
  context: string,
): Promise<string> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200));

  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() ?? '';

  // Simple pattern matching for demo
  if (lastMessage.includes('조언') || lastMessage.includes('하루')) {
    const tips = [
      '오늘은 작은 것부터 시작해보세요! 물 한 잔 마시기부터 시작하면, 자연스럽게 다른 루틴도 이어갈 수 있어요 💧',
      '아침에 5분 스트레칭만 해도 하루가 달라져요! 몸이 깨어나면 마음도 따라온답니다 🧘',
      '오늘 루틴 하나만 완료해도 충분해요. 꾸준함이 완벽함보다 중요하니까요 ✨',
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  }

  if (lastMessage.includes('루틴') && lastMessage.includes('추천')) {
    return '처음이라면 "아침에 물 마시기"와 "감사 일기"를 추천해요! 둘 다 1-5분이면 되고, 하루의 시작과 끝을 의미있게 만들어줘요 🌅📝';
  }

  if (lastMessage.includes('동기부여') || lastMessage.includes('힘들')) {
    const motivations = [
      '지금 이 순간에도 여기에 와서 노력하고 있잖아요. 그것만으로도 정말 대단한 거예요! 🌟',
      '모든 큰 변화는 작은 한 걸음에서 시작돼요. 오늘 한 루틴만 해봐요, Bloom이 기다리고 있어요! 🌱',
      '완벽하지 않아도 괜찮아요. 어제보다 한 걸음만 나아가면 충분해요. 응원할게요! 💪',
    ];
    return motivations[Math.floor(Math.random() * motivations.length)];
  }

  if (lastMessage.includes('bloom') || lastMessage.includes('블룸') || lastMessage.includes('키우')) {
    return 'Bloom은 루틴을 완료할 때마다 성장해요! 💧 물방울과 ⭐ 성장 포인트가 쌓이면 단계가 올라가요. 매일 조금씩 루틴을 지키면 예쁜 꽃을 피울 수 있답니다 🌸';
  }

  if (lastMessage.includes('수면') || lastMessage.includes('잠')) {
    return '좋은 수면을 위해 취침 30분 전부터 핸드폰을 내려놓아 보세요. 블루라이트 차단이 수면의 질을 크게 높여줘요 🌙';
  }

  // Default response
  const defaults = [
    '좋은 질문이에요! 건강한 습관은 작은 것부터 시작하는 게 중요해요. 지금 가장 쉽게 시작할 수 있는 루틴을 하나 골라볼까요? 😊',
    '루미가 항상 응원하고 있어요! 오늘 할 수 있는 것부터 하나씩 시작해봐요 🌿',
    '궁금한 게 있으면 언제든 물어봐주세요! 루틴, 건강, Bloom 관련 무엇이든 도와드릴게요 ✨',
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
}
