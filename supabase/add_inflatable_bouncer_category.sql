do $$
declare
  constraint_name text;
begin
  for constraint_name in
    select c.conname
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    join unnest(c.conkey) as ck(attnum) on true
    join pg_attribute a on a.attrelid = t.oid and a.attnum = ck.attnum
    where n.nspname = 'public'
      and t.relname = 'sponsorship_contributions'
      and c.contype = 'c'
      and a.attname = 'category'
  loop
    execute format('alter table public.sponsorship_contributions drop constraint %I', constraint_name);
  end loop;

  for constraint_name in
    select c.conname
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    join unnest(c.conkey) as ck(attnum) on true
    join pg_attribute a on a.attrelid = t.oid and a.attnum = ck.attnum
    where n.nspname = 'public'
      and t.relname = 'sponsorship_public_contributions'
      and c.contype = 'c'
      and a.attname = 'category'
  loop
    execute format('alter table public.sponsorship_public_contributions drop constraint %I', constraint_name);
  end loop;
end $$;

alter table public.sponsorship_contributions
add constraint sponsorship_contributions_category_check
check (
  category in (
    'photography',
    'audio',
    'cake',
    'flowers',
    'aisle',
    'bride_presentation',
    'toast',
    'inflatable_bouncer',
    'gratitude'
  )
);

alter table public.sponsorship_public_contributions
add constraint sponsorship_public_contributions_category_check
check (
  category in (
    'photography',
    'audio',
    'cake',
    'flowers',
    'aisle',
    'bride_presentation',
    'toast',
    'inflatable_bouncer',
    'gratitude'
  )
);
