-- Aplica todas as correções necessárias no Supabase

-- 1. Renomeia tags -> areas (caso a migration 4 não tenha sido aplicada)
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'resources' and column_name = 'tags'
  ) then
    alter table resources rename column tags to areas;
  end if;
end $$;

-- 2. Corrige políticas RLS em resources (faltava WITH CHECK)
drop policy if exists "Allow all for authenticated users" on resources;
drop policy if exists "Allow all" on resources;
create policy "Allow all" on resources
  for all using (true) with check (true);

-- 3. Corrige políticas RLS em platforms (faltava WITH CHECK)
drop policy if exists "Allow all for authenticated users" on platforms;
drop policy if exists "Allow all" on platforms;
create policy "Allow all" on platforms
  for all using (true) with check (true);

-- 4. Corrige políticas RLS em glossary (faltava WITH CHECK)
drop policy if exists "Allow all" on glossary;
create policy "Allow all" on glossary
  for all using (true) with check (true);
