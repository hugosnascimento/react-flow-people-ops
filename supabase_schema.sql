-- Create Orchestrators Table
create table if not exists public.orchestrators (
  id text primary key,
  name text not null,
  description text,
  status text check (status in ('draft', 'active', 'paused', 'published')),
  nodes jsonb default '[]'::jsonb,
  edges jsonb default '[]'::jsonb,
  execution_health int default 100,
  error_count int default 0,
  last_execution timestamptz,
  user_id uuid references auth.users(id) not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.orchestrators enable row level security;

-- Policies
create policy "Users can view their own orchestrators"
on public.orchestrators for select
using (auth.uid() = user_id);

create policy "Users can insert their own orchestrators"
on public.orchestrators for insert
with check (auth.uid() = user_id);

create policy "Users can update their own orchestrators"
on public.orchestrators for update
using (auth.uid() = user_id);

create policy "Users can delete their own orchestrators"
on public.orchestrators for delete
using (auth.uid() = user_id);
