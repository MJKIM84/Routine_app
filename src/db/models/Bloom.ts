import { Model } from '@nozbe/watermelondb';
import { field, text, readonly, date } from '@nozbe/watermelondb/decorators';

export class Bloom extends Model {
  static table = 'blooms';

  @text('supabase_id') supabaseId!: string | null;
  @text('user_id') userId!: string;
  @text('name') name!: string;
  @text('species') species!: string;
  @field('growth_stage') growthStage!: number;
  @field('growth_points') growthPoints!: number;
  @field('water_drops') waterDrops!: number;
  @field('sunlight') sunlight!: number;
  @field('health') health!: number;
  @text('mood') mood!: string;
  @field('is_active') isActive!: boolean;
  @field('unlocked_at') unlockedAt!: number;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}
