# RoutineFlow Store Submission Checklist

## Pre-Submission Setup

### 1. Supabase Setup
- [ ] Create project at https://supabase.com/dashboard/new
  - Region: Northeast Asia (Tokyo) recommended
- [ ] Run `supabase link --project-ref YOUR_REF`
- [ ] Run `supabase db push` (applies migrations/001_initial_schema.sql)
- [ ] Set secrets: `supabase secrets set OPENAI_API_KEY=sk-...`
- [ ] Deploy Edge Functions:
  ```bash
  supabase functions deploy ai-coach
  supabase functions deploy push-notification
  supabase functions deploy sync
  ```
- [ ] Copy Supabase URL and Anon Key to `.env`

### 2. EAS Setup
- [ ] Run `eas login`
- [ ] Run `eas init` (auto-updates app.json projectId)
- [ ] Verify app.json `extra.eas.projectId` is set
- [ ] Verify app.json `updates.url` has correct project ID

### 3. GitHub Secrets
- [ ] `gh secret set EXPO_TOKEN --body "YOUR_TOKEN" --repo MJKIM84/Routine_app`
- [ ] `gh secret set SUPABASE_URL --body "https://xxx.supabase.co" --repo MJKIM84/Routine_app`
- [ ] `gh secret set SUPABASE_ANON_KEY --body "eyJ..." --repo MJKIM84/Routine_app`

---

## Apple App Store

### App Store Connect Setup
- [ ] Create App in App Store Connect
- [ ] Set Bundle ID: `com.routineflow.app`
- [ ] Set Primary Category: Health & Fitness
- [ ] Set Age Rating: 4+

### App Information
- [ ] App Name: `RoutineFlow - 루틴 관리`
- [ ] Subtitle: `건강한 습관을 디자인하다`
- [ ] Description: See `src/config/storeListings.ts` > longDescription.ko
- [ ] Keywords: 루틴,습관,건강,웰니스,AI코치,다이어리,셀프케어,루미,블룸,챌린지
- [ ] Support URL: https://routineflow.app/support
- [ ] Privacy Policy URL: Host `store/privacy-policy.html`

### Screenshots (Required)
- [ ] iPhone 6.7" (1290 x 2796) - 3~10 screenshots
- [ ] iPhone 6.5" (1242 x 2688) - 3~10 screenshots
- [ ] iPad 12.9" (2048 x 2732) - Optional but recommended

### Review Information
- [ ] Demo account credentials (if login required)
- [ ] Notes for reviewer: "This app uses AI coaching (OpenAI API) for wellness tips. No medical advice is provided."

### eas.json iOS Submit Config
Update `eas.json` > submit > production > ios:
- [ ] `appleId`: Your Apple ID email
- [ ] `ascAppId`: App Store Connect App ID (numeric)
- [ ] `appleTeamId`: Apple Developer Team ID

---

## Google Play Store

### Play Console Setup
- [ ] Create App in Google Play Console
- [ ] Set Package Name: `com.routineflow.app`
- [ ] Set Category: Health & Fitness
- [ ] Set Content Rating: Everyone

### Store Listing
- [ ] App Name: `RoutineFlow - 루틴 관리`
- [ ] Short Description: `AI 코치와 함께 건강한 습관을 만들어보세요`
- [ ] Full Description: See `src/config/storeListings.ts` > longDescription.ko
- [ ] Privacy Policy URL: Host `store/privacy-policy.html`

### Screenshots (Required)
- [ ] Phone: 1080 x 1920 minimum - 2~8 screenshots
- [ ] 7-inch Tablet: Optional
- [ ] 10-inch Tablet: Optional

### Feature Graphic
- [ ] 1024 x 500 PNG or JPG

### eas.json Android Submit Config
- [ ] Create Google Play Service Account JSON
- [ ] Place as `./google-services.json` in project root
- [ ] Update track to `"production"` when ready (currently `"internal"`)

---

## Build & Submit

### Preview Build (Testing)
```bash
eas build --platform all --profile preview
```

### Production Build
```bash
eas build --platform all --profile production
```

### Submit to Stores
```bash
# iOS
eas submit --platform ios --profile production --latest

# Android
eas submit --platform android --profile production --latest
```

### Or via Git Tag (triggers CI/CD)
```bash
git tag v1.0.0
git push --tags
```

---

## Post-Submission
- [ ] Monitor build status at https://expo.dev
- [ ] Check App Store Connect for review status
- [ ] Check Google Play Console for review status
- [ ] Set up Sentry DSN for production error tracking
- [ ] Verify push notifications work end-to-end
- [ ] Test OTA updates: `eas update --branch production`
