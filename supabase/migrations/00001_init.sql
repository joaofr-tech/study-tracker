-- Study Tracker - Schema Inicial

create table if not exists resources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tags text[] default '{}',
  skills text[] default '{}',
  xp integer default 50,
  status text default 'pending' check (status in ('pending', 'completed')),
  progress integer default 0 check (progress between 0 and 100),
  created_at timestamptz default now(),
  completed_at timestamptz
);

create table if not exists platforms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  description text default ''
);

-- Enable Row Level Security
alter table resources enable row level security;
alter table platforms enable row level security;

-- Allow all operations for authenticated users
create policy "Allow all for authenticated users" on resources
  for all using (auth.role() = 'authenticated');

create policy "Allow all for authenticated users" on platforms
  for all using (auth.role() = 'authenticated');
