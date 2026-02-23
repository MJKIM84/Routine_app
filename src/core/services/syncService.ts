// WatermelonDB ↔ Supabase 동기화 서비스
import { supabase } from '@core/api/supabase';

const SYNC_TABLES = ['routines', 'routine_logs', 'blooms', 'streaks', 'user_profiles'];

interface SyncResult {
  success: boolean;
  timestamp?: string;
  error?: string;
}

/**
 * Pull: 서버 → 클라이언트 변경사항 가져오기
 */
export async function pullChanges(lastPulledAt: number | null): Promise<SyncResult> {
  try {
    const { data, error } = await supabase.functions.invoke('sync', {
      body: { lastPulledAt, tables: SYNC_TABLES },
      method: 'POST',
      headers: { 'x-action': 'pull' },
    });

    if (error) return { success: false, error: error.message };

    // TODO: WatermelonDB에 changes 적용
    // synchronize({ database, pullChanges: () => data, pushChanges: () => {} });

    return { success: true, timestamp: data?.timestamp };
  } catch (err) {
    return { success: false, error: 'Network error' };
  }
}

/**
 * Push: 클라이언트 → 서버 변경사항 전송
 */
export async function pushChanges(changes: Record<string, unknown>): Promise<SyncResult> {
  try {
    const { data, error } = await supabase.functions.invoke('sync', {
      body: { changes },
      method: 'POST',
      headers: { 'x-action': 'push' },
    });

    if (error) return { success: false, error: error.message };

    return { success: true };
  } catch (err) {
    return { success: false, error: 'Network error' };
  }
}

/**
 * Full sync: Pull → Push → Pull
 */
export async function fullSync(lastPulledAt: number | null): Promise<SyncResult> {
  // Step 1: Pull remote changes
  const pullResult = await pullChanges(lastPulledAt);
  if (!pullResult.success) return pullResult;

  // Step 2: Push local changes
  // In production: collect WatermelonDB local changes and push
  // const localChanges = await database.getLocalChanges();
  // await pushChanges(localChanges);

  return { success: true, timestamp: pullResult.timestamp };
}

/**
 * Register push token for notifications
 */
export async function registerPushToken(
  token: string,
  platform: 'ios' | 'android' | 'web',
): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('push_tokens')
      .upsert(
        { user_id: user.id, token, platform, is_active: true },
        { onConflict: 'user_id,token' },
      );

    return !error;
  } catch {
    return false;
  }
}
