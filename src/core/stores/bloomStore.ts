import { create } from 'zustand';
import type { BloomMood, BloomGrowthStage } from '@core/types';
import { GROWTH_THRESHOLDS } from '@core/types';
import { BLOOM_GROWTH_PER_ROUTINE, BLOOM_WATER_PER_ROUTINE, BLOOM_MAX_HEALTH } from '@config/constants';

interface BloomState {
  name: string;
  species: string;
  growthStage: BloomGrowthStage;
  growthPoints: number;
  waterDrops: number;
  sunlight: number;
  health: number;
  mood: BloomMood;
  isActive: boolean;

  // Animation triggers
  isGrowing: boolean;
  showParticles: boolean;
  showLevelUp: boolean;

  // Actions
  setBloom: (bloom: Partial<BloomState>) => void;
  addGrowthPoints: (points: number) => void;
  completeRoutine: () => void;
  updateMood: (mood: BloomMood) => void;
  degradeHealth: (amount: number) => void;
  resetAnimations: () => void;
}

function calculateStage(points: number): BloomGrowthStage {
  if (points >= GROWTH_THRESHOLDS[4]) return 4;
  if (points >= GROWTH_THRESHOLDS[3]) return 3;
  if (points >= GROWTH_THRESHOLDS[2]) return 2;
  if (points >= GROWTH_THRESHOLDS[1]) return 1;
  return 0;
}

export const useBloomStore = create<BloomState>((set, get) => ({
  name: 'Bloom',
  species: 'default',
  growthStage: 0,
  growthPoints: 0,
  waterDrops: 0,
  sunlight: 50,
  health: 80,
  mood: 'neutral',
  isActive: true,

  isGrowing: false,
  showParticles: false,
  showLevelUp: false,

  setBloom: (bloom) => set(bloom),

  addGrowthPoints: (points) => {
    const current = get();
    const newPoints = current.growthPoints + points;
    const newStage = calculateStage(newPoints);
    const leveledUp = newStage > current.growthStage;

    set({
      growthPoints: newPoints,
      growthStage: newStage,
      isGrowing: true,
      showParticles: true,
      showLevelUp: leveledUp,
    });
  },

  completeRoutine: () => {
    const current = get();
    const newPoints = current.growthPoints + BLOOM_GROWTH_PER_ROUTINE;
    const newWater = current.waterDrops + BLOOM_WATER_PER_ROUTINE;
    const newHealth = Math.min(current.health + 3, BLOOM_MAX_HEALTH);
    const newStage = calculateStage(newPoints);
    const leveledUp = newStage > current.growthStage;

    // Mood improves with routine completion
    const happyMoods: BloomMood[] = ['happy', 'excited'];
    const newMood = happyMoods[Math.floor(Math.random() * happyMoods.length)];

    set({
      growthPoints: newPoints,
      waterDrops: newWater,
      health: newHealth,
      growthStage: newStage,
      mood: newMood,
      isGrowing: true,
      showParticles: true,
      showLevelUp: leveledUp,
    });
  },

  updateMood: (mood) => set({ mood }),

  degradeHealth: (amount) => {
    const current = get();
    const newHealth = Math.max(current.health - amount, 0);
    const newMood: BloomMood = newHealth < 30 ? 'sad' : newHealth < 60 ? 'neutral' : current.mood;
    set({ health: newHealth, mood: newMood });
  },

  resetAnimations: () =>
    set({ isGrowing: false, showParticles: false, showLevelUp: false }),
}));
