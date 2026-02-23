import type { BloomMood, BloomGrowthStage } from '@core/types';
import { GROWTH_THRESHOLDS, BLOOM_STAGE_NAMES } from '@core/types';

export function getBloomStageName(stage: BloomGrowthStage): string {
  return BLOOM_STAGE_NAMES[stage];
}

export function getGrowthProgress(points: number, stage: BloomGrowthStage): number {
  const currentThreshold = GROWTH_THRESHOLDS[stage];
  const nextStage = Math.min(stage + 1, 4) as BloomGrowthStage;
  const nextThreshold = GROWTH_THRESHOLDS[nextStage];

  if (stage === 4) return 1;
  if (nextThreshold === currentThreshold) return 1;

  return (points - currentThreshold) / (nextThreshold - currentThreshold);
}

export function getMoodEmoji(mood: BloomMood): string {
  const map: Record<BloomMood, string> = {
    happy: '😊',
    neutral: '😐',
    sad: '😢',
    excited: '🤩',
    sleepy: '😴',
  };
  return map[mood];
}

export function getMoodMessage(mood: BloomMood, name: string): string {
  const messages: Record<BloomMood, string[]> = {
    happy: [
      `${name}이(가) 기분 좋아해요!`,
      `${name}이(가) 활짝 웃고 있어요`,
      `오늘 하루도 화이팅! 🌟`,
    ],
    neutral: [
      `${name}이(가) 당신을 기다려요`,
      `루틴을 완료하면 ${name}이(가) 기뻐할 거예요`,
    ],
    sad: [
      `${name}이(가) 시들어가고 있어요...`,
      `${name}이(가) 보고싶었어요`,
      `루틴을 완료해서 ${name}을(를) 응원해주세요`,
    ],
    excited: [
      `${name}이(가) 신나해요! 🎉`,
      `대단해요! ${name}이(가) 춤추고 있어요!`,
    ],
    sleepy: [
      `${name}이(가) 졸려해요...`,
      `좋은 밤 되세요 💤`,
    ],
  };

  const options = messages[mood];
  return options[Math.floor(Math.random() * options.length)];
}

export function getBloomScale(stage: BloomGrowthStage): number {
  const scales: Record<BloomGrowthStage, number> = {
    0: 0.4,
    1: 0.55,
    2: 0.7,
    3: 0.85,
    4: 1.0,
  };
  return scales[stage];
}

export function getBloomColors(stage: BloomGrowthStage) {
  const colors: Record<BloomGrowthStage, { primary: string; secondary: string; glow: string }> = {
    0: { primary: '#8B6914', secondary: '#A0845C', glow: '#D4A853' },
    1: { primary: '#4CAF50', secondary: '#81C784', glow: '#A5D6A7' },
    2: { primary: '#2E7D32', secondary: '#66BB6A', glow: '#81C784' },
    3: { primary: '#1B5E20', secondary: '#43A047', glow: '#66BB6A' },
    4: { primary: '#FF6F00', secondary: '#FFA726', glow: '#FFD54F' },
  };
  return colors[stage];
}
