-- Allow all operations for anon users (resources and platforms)
-- This fixes RLS blocking CRUD when no auth is implemented

drop policy if exists "Allow all for authenticated users" on resources;
drop policy if exists "Allow all" on resources;
create policy "Allow all" on resources
  for all using (true) with check (true);

drop policy if exists "Allow all for authenticated users" on platforms;
drop policy if exists "Allow all" on platforms;
create policy "Allow all" on platforms
  for all using (true) with check (true);
