import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'user_profiles',
      columns: [
        { name: 'supabase_id', type: 'string' },
        { name: 'display_name', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'avatar_url', type: 'string', isOptional: true },
        { name: 'plan_type', type: 'string' },
        { name: 'timezone', type: 'string' },
        { name: 'wake_time', type: 'string' },
        { name: 'onboarding_completed', type: 'boolean' },
        { name: 'goals', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),

    tableSchema({
      name: 'routines',
      columns: [
        { name: 'supabase_id', type: 'string', isOptional: true },
        { name: 'user_id', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'icon', type: 'string' },
        { name: 'color', type: 'string' },
        { name: 'category', type: 'string' },
        { name: 'time_slot', type: 'string' },
        { name: 'scheduled_time', type: 'string', isOptional: true },
        { name: 'frequency_type', type: 'string' },
        { name: 'frequency_value', type: 'string' },
        { name: 'duration_minutes', type: 'number', isOptional: true },
        { name: 'reminder_enabled', type: 'boolean' },
        { name: 'reminder_minutes_before', type: 'number' },
        { name: 'sort_order', type: 'number' },
        { name: 'is_active', type: 'boolean' },
        { name: 'is_from_template', type: 'boolean' },
        { name: 'template_id', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),

    tableSchema({
      name: 'routine_logs',
      columns: [
        { name: 'supabase_id', type: 'string', isOptional: true },
        { name: 'routine_id', type: 'string', isIndexed: true },
        { name: 'user_id', type: 'string' },
        { name: 'completed_at', type: 'number' },
        { name: 'date_key', type: 'string', isIndexed: true },
        { name: 'mood_score', type: 'number', isOptional: true },
        { name: 'note', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
      ],
    }),

    tableSchema({
      name: 'blooms',
      columns: [
        { name: 'supabase_id', type: 'string', isOptional: true },
        { name: 'user_id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'species', type: 'string' },
        { name: 'growth_stage', type: 'number' },
        { name: 'growth_points', type: 'number' },
        { name: 'water_drops', type: 'number' },
        { name: 'sunlight', type: 'number' },
        { name: 'health', type: 'number' },
        { name: 'mood', type: 'string' },
        { name: 'is_active', type: 'boolean' },
        { name: 'unlocked_at', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),

    tableSchema({
      name: 'streaks',
      columns: [
        { name: 'supabase_id', type: 'string', isOptional: true },
        { name: 'user_id', type: 'string' },
        { name: 'routine_id', type: 'string', isOptional: true },
        { name: 'current_count', type: 'number' },
        { name: 'longest_count', type: 'number' },
        { name: 'last_completed_date', type: 'string' },
        { name: 'rest_days_used', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),

    tableSchema({
      name: 'sync_log',
      columns: [
        { name: 'table_name', type: 'string' },
        { name: 'last_synced_at', type: 'number' },
        { name: 'last_pulled_at', type: 'number' },
        { name: 'sync_status', type: 'string' },
      ],
    }),
  ],
});
