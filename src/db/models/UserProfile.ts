import { Model } from '@nozbe/watermelondb';
import { field, text, readonly, date } from '@nozbe/watermelondb/decorators';

export class UserProfile extends Model {
  static table = 'user_profiles';

  @text('supabase_id') supabaseId!: string;
  @text('display_name') displayName!: string;
  @text('email') email!: string;
  @text('avatar_url') avatarUrl!: string | null;
  @text('plan_type') planType!: string;
  @text('timezone') timezone!: string;
  @text('wake_time') wakeTime!: string;
  @field('onboarding_completed') onboardingCompleted!: boolean;
  @text('goals') goals!: string;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}
