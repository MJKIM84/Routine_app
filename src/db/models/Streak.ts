import { Model } from '@nozbe/watermelondb';
import { field, text, readonly, date } from '@nozbe/watermelondb/decorators';

export class Streak extends Model {
  static table = 'streaks';

  @text('supabase_id') supabaseId!: string | null;
  @text('user_id') userId!: string;
  @text('routine_id') routineId!: string | null;
  @field('current_count') currentCount!: number;
  @field('longest_count') longestCount!: number;
  @text('last_completed_date') lastCompletedDate!: string;
  @field('rest_days_used') restDaysUsed!: number;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}
