create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  area text not null,
  status text default 'to_learn' check (status in ('to_learn', 'learning', 'learned')),
  "order" integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table skills enable row level security;

create policy "Allow all" on skills
  for all using (true) with check (true);
