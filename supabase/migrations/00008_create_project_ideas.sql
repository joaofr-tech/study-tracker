create table if not exists project_ideas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  problem text,
  solution text,
  technologies text[] default '{}',
  next_step text,
  status text default 'idea' check (status in ('idea', 'exploring', 'in_progress', 'mvp', 'launched')),
  complexity integer default 1 check (complexity in (1, 2, 3)),
  repo_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table project_ideas enable row level security;

create policy "Allow all" on project_ideas
  for all using (true) with check (true);
