create table if not exists public.sponsorship_public_contributions (
  id uuid primary key,
  name text not null,
  category text not null check (
    category in (
      'photography',
      'audio',
      'cake',
      'flowers',
      'aisle',
      'bride_presentation',
      'toast',
      'gratitude'
    )
  ),
  amount numeric(12,2) not null check (amount > 0),
  date text not null,
  created_at timestamptz not null default now()
);

alter table public.sponsorship_public_contributions enable row level security;
