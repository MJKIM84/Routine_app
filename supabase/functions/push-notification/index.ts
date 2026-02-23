// Push Notification Edge Function
// Supabase Edge Function: 리마인더 및 넛지 푸시 알림 발송
// POST /functions/v1/push-notification

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PushRequest {
  userId?: string;      // 특정 사용자 (optional, 없으면 전체)
  type: 'reminder' | 'streak_risk' | 'nudge' | 'weekly_report';
  title: string;
  body: string;
  data?: Record<string, string>;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { userId, type, title, body, data } = (await req.json()) as PushRequest;

    // Get push tokens
    let query = supabaseAdmin
      .from('push_tokens')
      .select('token, platform, user_id')
      .eq('is_active', true);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data: tokens, error } = await query;

    if (error || !tokens?.length) {
      return new Response(
        JSON.stringify({ sent: 0, error: error?.message ?? 'No tokens found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Send via Expo Push API
    const expoPushUrl = 'https://exp.host/--/api/v2/push/send';
    const messages = tokens.map((t) => ({
      to: t.token,
      sound: 'default',
      title,
      body,
      data: { ...data, type, userId: t.user_id },
      channelId: type === 'reminder' ? 'routine-reminders' : 'general',
    }));

    // Batch send (Expo supports up to 100 per request)
    const batches = [];
    for (let i = 0; i < messages.length; i += 100) {
      batches.push(messages.slice(i, i + 100));
    }

    let totalSent = 0;
    for (const batch of batches) {
      const response = await fetch(expoPushUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(batch),
      });

      if (response.ok) {
        totalSent += batch.length;
      }
    }

    return new Response(
      JSON.stringify({ sent: totalSent, total: messages.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
