-- Glossário de termos técnicos

create table if not exists glossary (
  id uuid primary key default gen_random_uuid(),
  term text not null,
  definition text default '',
  areas text[] default '{}',
  pinned boolean default false,
  created_at timestamptz default now()
);

alter table glossary enable row level security;

create policy "Allow all" on glossary
  for all using (true);
