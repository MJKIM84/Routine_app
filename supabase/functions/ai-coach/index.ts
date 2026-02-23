// AI Coach Edge Function
// Supabase Edge Function: AI 코칭 응답 생성
// POST /functions/v1/ai-coach

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CoachRequest {
  message: string;
  context?: {
    routineCount?: number;
    streak?: number;
    bloomName?: string;
    recentCompletionRate?: number;
  };
}

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Auth check
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } },
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { message, context } = (await req.json()) as CoachRequest;

    // Build system prompt
    const systemPrompt = buildSystemPrompt(context);

    // Call OpenAI API
    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIKey) {
      return new Response(JSON.stringify({ error: 'AI service not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const aiData = await aiResponse.json();
    const reply = aiData.choices?.[0]?.message?.content ?? '죄송합니다. 잠시 후 다시 시도해 주세요.';

    return new Response(
      JSON.stringify({ reply, model: 'gpt-4o-mini' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});

function buildSystemPrompt(context?: CoachRequest['context']): string {
  let prompt = `당신은 '루미'라는 이름의 AI 웰니스 코치입니다. RoutineFlow 앱의 사용자를 도와 건강한 습관을 만들도록 돕습니다.

규칙:
- 항상 따뜻하고 격려하는 톤을 유지하세요.
- 한국어로 답변하세요.
- 답변은 간결하게 2-3문장으로 작성하세요.
- 과학적 근거를 기반으로 조언하되, 전문 용어는 피하세요.
- 사용자의 Bloom 컴패니언에 대해 언급하면 유대감을 높여주세요.
- 구체적이고 실행 가능한 조언을 제공하세요.`;

  if (context) {
    prompt += '\n\n현재 사용자 상태:';
    if (context.routineCount !== undefined) prompt += `\n- 등록 루틴 수: ${context.routineCount}개`;
    if (context.streak !== undefined) prompt += `\n- 현재 스트릭: ${context.streak}일`;
    if (context.bloomName) prompt += `\n- Bloom 이름: ${context.bloomName}`;
    if (context.recentCompletionRate !== undefined) prompt += `\n- 최근 완료율: ${Math.round(context.recentCompletionRate * 100)}%`;
  }

  return prompt;
}
