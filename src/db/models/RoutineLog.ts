import { Model } from '@nozbe/watermelondb';
import { field, text, readonly, date, relation } from '@nozbe/watermelondb/decorators';

export class RoutineLog extends Model {
  static table = 'routine_logs';

  static associations = {
    routines: { type: 'belongs_to' as const, key: 'routine_id' },
  };

  @text('supabase_id') supabaseId!: string | null;
  @text('routine_id') routineId!: string;
  @text('user_id') userId!: string;
  @field('completed_at') completedAt!: number;
  @text('date_key') dateKey!: string;
  @field('mood_score') moodScore!: number | null;
  @text('note') note!: string | null;
  @readonly @date('created_at') createdAt!: Date;

  @relation('routines', 'routine_id') routine: any;
}
