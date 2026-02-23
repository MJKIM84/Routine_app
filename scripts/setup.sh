#!/bin/bash
# ============================================================
# RoutineFlow 배포 셋업 스크립트
# 순서대로 실행하세요
# ============================================================

set -e

echo "🌱 RoutineFlow 배포 셋업 시작..."
echo ""

# ─── 1. Supabase 로그인 ────────────────────────────────
echo "━━━ Step 1: Supabase 로그인 ━━━"
echo "👉 https://supabase.com/dashboard 에서 Access Token 발급"
echo "   Settings > Access Tokens > Generate new token"
echo ""
read -p "Supabase Access Token 입력: " SUPABASE_TOKEN
export SUPABASE_ACCESS_TOKEN=$SUPABASE_TOKEN
echo "✅ Supabase 로그인 완료"
echo ""

# ─── 2. Supabase 프로젝트 생성 ─────────────────────────
echo "━━━ Step 2: Supabase 프로젝트 생성 ━━━"
echo "👉 https://supabase.com/dashboard/new 에서 프로젝트 생성"
echo "   - Name: RoutineFlow"
echo "   - Region: Northeast Asia (Tokyo) 또는 Seoul"
echo "   - DB Password: 안전한 비밀번호 설정"
echo ""
read -p "Supabase Project Ref (URL의 xxxxx.supabase.co 부분): " SUPABASE_REF
read -p "Supabase URL (https://xxxxx.supabase.co): " SUPABASE_URL
read -p "Supabase Anon Key: " SUPABASE_ANON_KEY
read -p "Supabase DB Password: " SUPABASE_DB_PASSWORD
echo ""

# ─── 3. Supabase 프로젝트 링크 + DB 마이그레이션 ───────
echo "━━━ Step 3: DB 마이그레이션 실행 ━━━"
supabase link --project-ref $SUPABASE_REF
supabase db push
echo "✅ 데이터베이스 테이블 생성 완료 (10개 테이블 + RLS)"
echo ""

# ─── 4. Edge Functions 배포 ─────────────────────────────
echo "━━━ Step 4: Edge Functions 배포 ━━━"
read -p "OpenAI API Key (AI 코치용): " OPENAI_KEY
supabase secrets set OPENAI_API_KEY=$OPENAI_KEY
supabase functions deploy ai-coach
supabase functions deploy push-notification
supabase functions deploy sync
echo "✅ Edge Functions 3개 배포 완료"
echo ""

# ─── 5. .env 파일 생성 ─────────────────────────────────
echo "━━━ Step 5: 환경변수 설정 ━━━"
cat > .env << EOF
EXPO_PUBLIC_SUPABASE_URL=$SUPABASE_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
EXPO_PUBLIC_SENTRY_DSN=
EOF
echo "✅ .env 파일 생성 완료"
echo ""

# ─── 6. EAS 로그인 + 프로젝트 연결 ─────────────────────
echo "━━━ Step 6: EAS 프로젝트 설정 ━━━"
eas login
eas init
echo "✅ EAS 프로젝트 연결 완료"
echo ""

# ─── 7. GitHub Secrets 설정 ─────────────────────────────
echo "━━━ Step 7: GitHub Secrets 설정 ━━━"
echo "👉 EAS 토큰이 필요합니다"
read -p "Expo Token (expo.dev > Settings > Access Tokens): " EXPO_TOKEN

gh secret set EXPO_TOKEN --body "$EXPO_TOKEN" --repo MJKIM84/Routine_app
gh secret set SUPABASE_URL --body "$SUPABASE_URL" --repo MJKIM84/Routine_app
gh secret set SUPABASE_ANON_KEY --body "$SUPABASE_ANON_KEY" --repo MJKIM84/Routine_app
echo "✅ GitHub Secrets 3개 설정 완료"
echo ""

# ─── 8. EAS Build 실행 ─────────────────────────────────
echo "━━━ Step 8: 프로덕션 빌드 ━━━"
echo "iOS + Android 빌드를 시작합니다..."
eas build --platform all --profile production
echo ""

# ─── 9. 스토어 제출 ────────────────────────────────────
echo "━━━ Step 9: 스토어 제출 ━━━"
read -p "빌드 완료 후 스토어에 제출할까요? (y/n): " SUBMIT
if [ "$SUBMIT" = "y" ]; then
  eas submit --platform all --profile production --latest
  echo "✅ 스토어 제출 완료!"
fi

echo ""
echo "🎉 RoutineFlow 배포 셋업 완료!"
echo ""
echo "📋 다음 단계:"
echo "   1. App Store Connect에서 앱 메타데이터 입력"
echo "   2. Google Play Console에서 스토어 등록정보 입력"
echo "   3. 스크린샷 5~6장 업로드"
echo "   4. 개인정보 처리방침 URL 등록: store/privacy-policy.html 호스팅"
echo "   5. 심사 제출"
