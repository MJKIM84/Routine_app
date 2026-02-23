export type BloomMood = 'happy' | 'neutral' | 'sad' | 'excited' | 'sleepy';

export type BloomGrowthStage = 0 | 1 | 2 | 3 | 4;

export const BLOOM_STAGE_NAMES: Record<BloomGrowthStage, string> = {
  0: 'Seed',
  1: 'Sprout',
  2: 'Growing',
  3: 'Bloom',
  4: 'Fruit',
};

export interface BloomData {
  id: string;
  name: string;
  species: string;
  growthStage: BloomGrowthStage;
  growthPoints: number;
  waterDrops: number;
  sunlight: number;
  health: number;
  mood: BloomMood;
  isActive: boolean;
}

export const GROWTH_THRESHOLDS: Record<BloomGrowthStage, number> = {
  0: 0,
  1: 10,
  2: 30,
  3: 60,
  4: 100,
};
