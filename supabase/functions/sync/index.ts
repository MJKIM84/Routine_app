// WatermelonDB Sync Edge Function
// Supabase Edge Function: WatermelonDB ↔ Supabase 양방향 동기화
// POST /functions/v1/sync

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// WatermelonDB → Supabase 테이블 매핑
const TABLE_MAP: Record<string, string> = {
  routines: 'routines',
  routine_logs: 'routine_logs',
  blooms: 'blooms',
  streaks: 'streaks',
  user_profiles: 'profiles',
};

interface SyncPullRequest {
  lastPulledAt: number | null; // ISO timestamp or null for first sync
  tables: string[];
}

interface SyncPushRequest {
  changes: Record<string, {
    created: Record<string, unknown>[];
    updated: Record<string, unknown>[];
    deleted: string[];
  }>;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } },
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const action = url.searchParams.get('action'); // 'pull' or 'push'

    if (action === 'pull') {
      return await handlePull(req, supabase, user.id);
    } else if (action === 'push') {
      return await handlePush(req, supabase, user.id);
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action. Use ?action=pull or ?action=push' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});

async function handlePull(req: Request, supabase: ReturnType<typeof createClient>, userId: string) {
  const { lastPulledAt, tables } = (await req.json()) as SyncPullRequest;

  const changes: Record<string, { created: unknown[]; updated: unknown[]; deleted: string[] }> = {};
  const timestamp = new Date().toISOString();

  for (const table of tables) {
    const supabaseTable = TABLE_MAP[table];
    if (!supabaseTable) continue;

    let query = supabase.from(supabaseTable).select('*');

    // profiles는 id로 필터, 나머지는 user_id로 필터
    if (supabaseTable === 'profiles') {
      query = query.eq('id', userId);
    } else {
      query = query.eq('user_id', userId);
    }

    if (lastPulledAt) {
      // 마지막 동기화 이후 변경된 것만
      query = query.gt('updated_at', new Date(lastPulledAt).toISOString());
    }

    const { data, error } = await query;
    if (error) continue;

    changes[table] = {
      created: lastPulledAt ? [] : (data ?? []),
      updated: lastPulledAt ? (data ?? []) : [],
      deleted: [],
    };
  }

  return new Response(
    JSON.stringify({ changes, timestamp }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
}

async function handlePush(req: Request, supabase: ReturnType<typeof createClient>, userId: string) {
  const { changes } = (await req.json()) as SyncPushRequest;

  const results: Record<string, { created: number; updated: number; deleted: number }> = {};

  for (const [table, tableChanges] of Object.entries(changes)) {
    const supabaseTable = TABLE_MAP[table];
    if (!supabaseTable) continue;

    let created = 0;
    let updated = 0;
    let deleted = 0;

    // Created
    if (tableChanges.created.length > 0) {
      const rows = tableChanges.created.map((row) => ({
        ...row,
        user_id: supabaseTable === 'profiles' ? undefined : userId,
        id: supabaseTable === 'profiles' ? userId : undefined,
      }));
      const { error } = await supabase.from(supabaseTable).upsert(rows);
      if (!error) created = rows.length;
    }

    // Updated
    if (tableChanges.updated.length > 0) {
      for (const row of tableChanges.updated) {
        const { error } = await supabase
          .from(supabaseTable)
          .update(row)
          .eq('id', (row as Record<string, unknown>).id);
        if (!error) updated++;
      }
    }

    // Deleted
    if (tableChanges.deleted.length > 0) {
      const { error } = await supabase
        .from(supabaseTable)
        .delete()
        .in('id', tableChanges.deleted);
      if (!error) deleted = tableChanges.deleted.length;
    }

    results[table] = { created, updated, deleted };
  }

  return new Response(
    JSON.stringify({ results }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
}
