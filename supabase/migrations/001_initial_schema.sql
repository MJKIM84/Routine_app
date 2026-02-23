-- ============================================================
-- RoutineFlow - Supabase Initial Schema Migration
-- Version: 001
-- Description: 전체 테이블, RLS 정책, 인덱스, 트리거 생성
-- ============================================================

-- ─── Extensions ─────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "moddatetime";

-- ─── Helper: updated_at 자동 갱신 트리거 함수 ──────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================================================
-- 1. PROFILES (사용자 프로필)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  email text not null default '',
  avatar_url text,
  plan_type text not null default 'free' check (plan_type in ('free', 'premium', 'premium_plus')),
  timezone text not null default 'Asia/Seoul',
  wake_time text not null default '07:00',
  onboarding_completed boolean not null default false,
  goals text not null default '[]', -- JSON array
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function update_updated_at();

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 2. ROUTINES (루틴)
-- ============================================================
create table public.routines (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  icon text not null default '✅',
  color text not null default '#1A6B3C',
  category text not null default 'health' check (category in ('health', 'exercise', 'mindfulness', 'productivity', 'learning', 'social', 'custom')),
  time_slot text not null default 'morning' check (time_slot in ('morning', 'afternoon', 'evening', 'night')),
  scheduled_time text, -- HH:mm format
  frequency_type text not null default 'daily' check (frequency_type in ('daily', 'weekly', 'custom')),
  frequency_value text not null default '[]', -- JSON: weekdays etc.
  duration_minutes int,
  reminder_enabled boolean not null default false,
  reminder_minutes_before int not null default 10,
  sort_order int not null default 0,
  is_active boolean not null default true,
  is_from_template boolean not null default false,
  template_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_routines_user_id on public.routines(user_id);
create index idx_routines_user_active on public.routines(user_id, is_active);

create trigger routines_updated_at
  before update on public.routines
  for each row execute function update_updated_at();

alter table public.routines enable row level security;

create policy "Users can view own routines"
  on public.routines for select using (auth.uid() = user_id);

create policy "Users can insert own routines"
  on public.routines for insert with check (auth.uid() = user_id);

create policy "Users can update own routines"
  on public.routines for update using (auth.uid() = user_id);

create policy "Users can delete own routines"
  on public.routines for delete using (auth.uid() = user_id);

-- ============================================================
-- 3. ROUTINE_LOGS (루틴 완료 로그)
-- ============================================================
create table public.routine_logs (
  id uuid primary key default uuid_generate_v4(),
  routine_id uuid not null references public.routines(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  completed_at timestamptz not null default now(),
  date_key text not null, -- YYYY-MM-DD format
  mood_score int check (mood_score between 1 and 5),
  note text,
  created_at timestamptz not null default now()
);

create index idx_routine_logs_user_date on public.routine_logs(user_id, date_key);
create index idx_routine_logs_routine on public.routine_logs(routine_id);
create index idx_routine_logs_date_key on public.routine_logs(date_key);

alter table public.routine_logs enable row level security;

create policy "Users can view own logs"
  on public.routine_logs for select using (auth.uid() = user_id);

create policy "Users can insert own logs"
  on public.routine_logs for insert with check (auth.uid() = user_id);

create policy "Users can delete own logs"
  on public.routine_logs for delete using (auth.uid() = user_id);

-- ============================================================
-- 4. BLOOMS (Bloom 컴패니언)
-- ============================================================
create table public.blooms (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Bloom',
  species text not null default 'basic_sprout',
  growth_stage int not null default 0,
  growth_points int not null default 0,
  water_drops int not null default 0,
  sunlight int not null default 0,
  health int not null default 80,
  mood text not null default 'neutral' check (mood in ('happy', 'neutral', 'sad', 'excited', 'sleepy')),
  is_active boolean not null default true,
  unlocked_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_blooms_user on public.blooms(user_id);

create trigger blooms_updated_at
  before update on public.blooms
  for each row execute function update_updated_at();

alter table public.blooms enable row level security;

create policy "Users can view own blooms"
  on public.blooms for select using (auth.uid() = user_id);

create policy "Users can insert own blooms"
  on public.blooms for insert with check (auth.uid() = user_id);

create policy "Users can update own blooms"
  on public.blooms for update using (auth.uid() = user_id);

-- ============================================================
-- 5. STREAKS (스트릭 추적)
-- ============================================================
create table public.streaks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  routine_id uuid references public.routines(id) on delete set null,
  current_count int not null default 0,
  longest_count int not null default 0,
  last_completed_date text, -- YYYY-MM-DD
  rest_days_used int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_streaks_user on public.streaks(user_id);
create index idx_streaks_user_routine on public.streaks(user_id, routine_id);

create trigger streaks_updated_at
  before update on public.streaks
  for each row execute function update_updated_at();

alter table public.streaks enable row level security;

create policy "Users can view own streaks"
  on public.streaks for select using (auth.uid() = user_id);

create policy "Users can insert own streaks"
  on public.streaks for insert with check (auth.uid() = user_id);

create policy "Users can update own streaks"
  on public.streaks for update using (auth.uid() = user_id);

-- ============================================================
-- 6. COMMUNITY_POSTS (커뮤니티 게시글)
-- ============================================================
create table public.community_posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  type text not null default 'tip' check (type in ('achievement', 'tip', 'encouragement', 'challenge')),
  likes_count int not null default 0,
  tags text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_community_posts_created on public.community_posts(created_at desc);
create index idx_community_posts_type on public.community_posts(type);

create trigger community_posts_updated_at
  before update on public.community_posts
  for each row execute function update_updated_at();

alter table public.community_posts enable row level security;

-- 커뮤니티는 모든 인증 사용자가 볼 수 있음
create policy "Authenticated users can view posts"
  on public.community_posts for select
  using (auth.role() = 'authenticated');

create policy "Users can insert own posts"
  on public.community_posts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own posts"
  on public.community_posts for update
  using (auth.uid() = user_id);

create policy "Users can delete own posts"
  on public.community_posts for delete
  using (auth.uid() = user_id);

-- ─── Post Likes (좋아요) ────────────────────────────────────
create table public.post_likes (
  user_id uuid not null references auth.users(id) on delete cascade,
  post_id uuid not null references public.community_posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

alter table public.post_likes enable row level security;

create policy "Authenticated users can view likes"
  on public.post_likes for select
  using (auth.role() = 'authenticated');

create policy "Users can toggle own likes"
  on public.post_likes for insert
  with check (auth.uid() = user_id);

create policy "Users can remove own likes"
  on public.post_likes for delete
  using (auth.uid() = user_id);

-- ============================================================
-- 7. CHALLENGES (챌린지)
-- ============================================================
create table public.challenges (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  icon text not null default '🎯',
  duration_days int not null default 7,
  category text not null default 'health',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.challenges enable row level security;

create policy "Authenticated users can view challenges"
  on public.challenges for select
  using (auth.role() = 'authenticated');

-- ─── Challenge Participants ─────────────────────────────────
create table public.challenge_participants (
  user_id uuid not null references auth.users(id) on delete cascade,
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  joined_at timestamptz not null default now(),
  progress int not null default 0,
  completed boolean not null default false,
  primary key (user_id, challenge_id)
);

alter table public.challenge_participants enable row level security;

create policy "Authenticated users can view participants"
  on public.challenge_participants for select
  using (auth.role() = 'authenticated');

create policy "Users can join challenges"
  on public.challenge_participants for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.challenge_participants for update
  using (auth.uid() = user_id);

create policy "Users can leave challenges"
  on public.challenge_participants for delete
  using (auth.uid() = user_id);

-- ============================================================
-- 8. SUBSCRIPTIONS (구독 상태)
-- ============================================================
create table public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  tier text not null default 'free' check (tier in ('free', 'premium', 'premium_plus')),
  period text check (period in ('monthly', 'yearly')),
  revenue_cat_id text,
  started_at timestamptz,
  expires_at timestamptz,
  is_active boolean not null default false,
  is_trial boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_subscriptions_user on public.subscriptions(user_id);

create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function update_updated_at();

alter table public.subscriptions enable row level security;

create policy "Users can view own subscription"
  on public.subscriptions for select using (auth.uid() = user_id);

create policy "Users can insert own subscription"
  on public.subscriptions for insert with check (auth.uid() = user_id);

create policy "Users can update own subscription"
  on public.subscriptions for update using (auth.uid() = user_id);

-- ============================================================
-- 9. REFERRALS (추천 코드)
-- ============================================================
create table public.referrals (
  id uuid primary key default uuid_generate_v4(),
  referrer_id uuid not null references auth.users(id) on delete cascade,
  referred_id uuid references auth.users(id) on delete set null,
  code text not null unique,
  status text not null default 'pending' check (status in ('pending', 'completed', 'rewarded')),
  created_at timestamptz not null default now()
);

create index idx_referrals_referrer on public.referrals(referrer_id);
create index idx_referrals_code on public.referrals(code);

alter table public.referrals enable row level security;

create policy "Users can view own referrals"
  on public.referrals for select
  using (auth.uid() = referrer_id or auth.uid() = referred_id);

create policy "Users can create referral codes"
  on public.referrals for insert
  with check (auth.uid() = referrer_id);

-- ============================================================
-- 10. PUSH TOKENS (푸시 알림 토큰)
-- ============================================================
create table public.push_tokens (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  token text not null,
  platform text not null check (platform in ('ios', 'android', 'web')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_push_tokens_user on public.push_tokens(user_id);

alter table public.push_tokens enable row level security;

create policy "Users can manage own tokens"
  on public.push_tokens for all
  using (auth.uid() = user_id);

-- ============================================================
-- DONE
-- ============================================================
