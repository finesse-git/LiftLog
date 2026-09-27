create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  goal text not null default 'hypertrophy'
    check (goal in ('strength','hypertrophy','endurance','fatloss')),
  plan_style text
    check (plan_style in ('full_body','upper_lower','push_pull_legs')),
  created_at timestamptz not null default now()
);

create table exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  movement_type text not null
    check (movement_type in ('compound_lower','compound_upper','isolation')),
  sets int not null default 3,
  reps int not null default 8,
  start_weight numeric not null,
  increment numeric not null,
  suggested_increment numeric not null,
  current_week int not null default 1,
  current_target numeric not null,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

create table weekly_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  exercise_id uuid not null references exercises(id) on delete cascade,
  week_number int not null,
  target_weight numeric not null,
  actual_weight numeric,
  actual_reps int,
  actual_sets int,
  logged_at timestamptz not null default now()
);

alter table profiles enable row level security;
alter table exercises enable row level security;
alter table weekly_logs enable row level security;

create policy "own profile" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "own exercises" on exercises
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own logs" on weekly_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
