import { Model } from '@nozbe/watermelondb';
import { field, text, readonly, date, children } from '@nozbe/watermelondb/decorators';

export class Routine extends Model {
  static table = 'routines';

  static associations = {
    routine_logs: { type: 'has_many' as const, foreignKey: 'routine_id' },
  };

  @text('supabase_id') supabaseId!: string | null;
  @text('user_id') userId!: string;
  @text('title') title!: string;
  @text('description') description!: string | null;
  @text('icon') icon!: string;
  @text('color') color!: string;
  @text('category') category!: string;
  @text('time_slot') timeSlot!: string;
  @text('scheduled_time') scheduledTime!: string | null;
  @text('frequency_type') frequencyType!: string;
  @text('frequency_value') frequencyValue!: string;
  @field('duration_minutes') durationMinutes!: number | null;
  @field('reminder_enabled') reminderEnabled!: boolean;
  @field('reminder_minutes_before') reminderMinutesBefore!: number;
  @field('sort_order') sortOrder!: number;
  @field('is_active') isActive!: boolean;
  @field('is_from_template') isFromTemplate!: boolean;
  @text('template_id') templateId!: string | null;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @children('routine_logs') logs: any;
}
