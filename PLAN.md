# LiftLog — Project Plan

## 1. Overview

**LiftLog** is a small multi-user web app for logging workouts and
auto-suggesting progressive-overload weight increases. Each user defines their own exercises,
starting weights, and a training goal (strength / hypertrophy / endurance /
fat loss). The app suggests a weekly weight increase per exercise based on
the goal and the exercise's movement pattern, and the user can override any
suggestion. Users log actual performance each week; "completing" a week
generates the next week's target weights automatically.

Built for a small private group (5–10 users) — friends, a household, or a
small training group — each with their own private data.

## 2. Goals

- Each user has a private, persistent workout plan and history.
- Starting weight → suggested progression → editable target, every week.
- Fast to use on a phone mid-workout (large tap targets, minimal typing).
- Cheap/free to run and simple to maintain solo.

## 3. Non-goals (out of scope for v1)

- Public sign-up / arbitrary scale (this is a private, invite-only app).
- Social features (feeds, comments, leaderboards).
- Exercise video library / form-check media.
- Native mobile app (a responsive web app is sufficient at this scale).
- Nutrition or body-composition tracking.

## 4. Target users & scale

- 5–10 named users, invited manually (no public registration flow needed
  for v1 — an invite link or manually created accounts is enough).
- Expect a handful of writes per user per workout session, a few sessions a
  week. This is comfortably within any free-tier database/hosting quota
  (see `ARCHITECTURE.md` §11).

## 5. Feature scope

### MVP (v1)
- Email/magic-link sign-in (Supabase Auth).
- **Step 1 — Choose a goal**: strength, hypertrophy, endurance, or fat loss.
  Stored on the user's profile.
- **Step 1.5 — Choose a plan style**: for the chosen goal, the app offers at
  least 3 distinct pre-generated plans to pick from (e.g. Full-Body,
  Upper/Lower, Push/Pull/Legs) — same goal, different exercise selection and
  volume, so the user picks whichever fits their schedule/preference. See
  `ARCHITECTURE.md` §3.1 for how styles are combined with goals.
- **Step 2 — Pre-generated plan**: picking a goal + style immediately shows
  a starter plan — a fixed list of exercises for that style, with sets/reps
  already filled in based on the goal (e.g. hypertrophy → 3–4 sets of 10;
  strength → 4 sets of 5). The user does not have to build this list by
  hand. Templates live in code (`src/lib/templates.js`), not the database —
  see `ARCHITECTURE.md` §3.1.
- **Step 3 — Enter initial lifts**: for each exercise in the pre-generated
  plan, the user enters the weight they can currently lift. Nothing is
  written to the database until this step — the template is just a preview
  until the user supplies real starting numbers.
- **Step 4 — Ideal next-week weight, editable**: once initial lifts are in,
  the app computes each exercise's suggested weekly increment from the same
  goal/movement-type table used to build the template, and shows the next
  "ideal" target weight for progressive overload. Every suggested increment
  (and the resulting target) is a plain editable field — the user can lift
  more or less than the ideal suggestion at any time.
- Exercises aren't limited to the template: users can add extra exercises,
  edit sets/reps/increment, or remove any exercise (template-sourced or
  custom) at any time from "Manage exercises."
- Weekly plan view: target weight per exercise, log actual weight/reps/sets.
- "Complete week" action: snapshots the week into history, advances every
  exercise's target weight by its increment.
- History view: past weeks' targets vs. actuals, per exercise.
- Data is private per user (row-level security — no user can read another
  user's data).
- Mobile-first responsive layout, works offline-tolerant (queued writes
  retry on reconnect).

### Phase 2 (nice-to-have, not required for launch)
- Editable rep ranges tied to goal, auto-suggested like weight increments.
- Deload week reminder every N weeks (per the goal's typical cycle).
- CSV export of history.
- Per-exercise notes/PRs highlighted automatically.
- Simple charts (weight-over-time per exercise) using a lightweight charting
  lib (e.g. Chart.js) or hand-rolled SVG.
- Shared "group" view (opt-in) so users can see each other's streaks —
  explicitly opt-in, off by default, to protect privacy.

## 6. Tech stack summary

| Layer            | Choice                                   |
|------------------|-------------------------------------------|
| Frontend         | Vite + Svelte + Tailwind CSS               |
| Auth             | Supabase Auth (magic link / email+password)|
| Database         | Supabase Postgres, Row-Level Security       |
| Hosting (static) | Vercel / Netlify / Cloudflare Pages (any)   |
| CI/CD            | GitHub Actions → auto-deploy on push to main|

See `ARCHITECTURE.md` for full detail and rationale.

## 7. Repo structure (proposed)

```
/
├── PLAN.md
├── ARCHITECTURE.md
├── README.md
├── .env.example
├── package.json
├── vite.config.js
├── tailwind.config.js
├── supabase/
│   ├── migrations/
│   │   └── 0001_init.sql
│   └── seed.sql
├── src/
│   ├── main.js
│   ├── App.svelte
│   ├── lib/
│   │   ├── supabaseClient.js
│   │   ├── suggestions.js       # goal/type → increment+sets+reps table
│   │   └── stores/
│   │       ├── auth.js
│   │       ├── exercises.js
│   │       └── history.js
│   ├── routes/                  # or components/ if not using a router
│   │   ├── Login.svelte
│   │   ├── WeeklyPlan.svelte
│   │   ├── ManageExercises.svelte
│   │   └── History.svelte
│   └── components/
│       ├── ExerciseCard.svelte
│       ├── GoalSelector.svelte
│       └── HistoryWeek.svelte
└── .github/
    └── workflows/
        └── deploy.yml
```

## 8. Environment & secrets management

- `SUPABASE_URL` and `SUPABASE_ANON_KEY` are public-safe (RLS enforces
  privacy) and go in `.env` (git-ignored) locally, and in the hosting
  provider's environment-variable settings for production.
- No server-side secret key is needed for v1 since all writes go through
  RLS-protected client calls — no custom backend server required.
- `.env.example` checked into the repo documents the required variables
  without real values.

## 9. Testing strategy

- **Unit tests** (Vitest): the suggestion engine (`suggestions.js`) — pure
  function, easy to test exhaustively across goal × movement-type
  combinations.
- **Component tests** (Testing Library + Vitest): exercise form validation,
  week-completion logic.
- **Manual QA checklist** before each release: sign in as two different
  test users, confirm neither can see the other's data (RLS smoke test).
- **RLS policy tests**: a short SQL script (or Supabase's `pgTAP`) that
  asserts a user cannot select/update another user's rows.

## 10. Deployment plan

1. Create a Supabase project; run migrations from `supabase/migrations/`.
2. Set `SUPABASE_URL` / `SUPABASE_ANON_KEY` in the hosting provider.
3. Connect the GitHub repo to Vercel/Netlify/Cloudflare Pages — enable
   auto-deploy on push to `main`.
4. Manually invite the 5–10 users (Supabase Auth dashboard → invite by
   email, or a one-time sign-up link you share privately).
5. Smoke-test sign-in and data isolation with two accounts before sharing
   broadly.

## 11. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Free-tier Supabase project auto-pauses after 7 days of inactivity | Low-stakes for a private app; restore manually from dashboard when it happens, or add a free weekly GitHub Actions cron hitting a health-check endpoint to keep it warm. |
| A user edits data on two devices at once | Last-write-wins is acceptable at this scale; not building conflict resolution for v1. |
| Suggested increments don't fit someone's actual capability | Every suggestion is editable inline — this is a starting point, not a mandate (see `ARCHITECTURE.md` §6). |
| Losing access to the Supabase project (single point of maintenance) | Keep the SQL schema and RLS policies in the repo (`supabase/migrations/`) so the whole backend is reproducible from source control. |

## 12. Future enhancements (beyond Phase 2)

- Native-feeling PWA install prompt + offline-first caching.
- Multiple training blocks / mesocycles per user, with deload scheduling.
- Optional coach role: one user can view (read-only) a subset of others'
  data, with explicit per-user consent.
