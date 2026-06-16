alter publication supabase_realtime
add table public.sponsorship_public_contributions;

drop policy if exists "Allow public read sponsorship progress"
on public.sponsorship_public_contributions;

create policy "Allow public read sponsorship progress"
on public.sponsorship_public_contributions
for select
to anon
using (true);
