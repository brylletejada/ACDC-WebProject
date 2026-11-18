-- Run this once in the Supabase SQL Editor (Dashboard → SQL → New query).
-- It creates the bookmarks table and locks each row to its owner.

create table if not exists public.saved_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  item_type text not null check (item_type in ('pathway', 'resource', 'opportunity')),
  item_key text not null,
  major_key text not null,
  major_title text not null,
  title text not null,
  description text not null default '',
  source_url text,
  created_at timestamptz not null default now(),
  unique (user_id, item_key)
);

create index if not exists saved_items_user_id_idx on public.saved_items (user_id);
create index if not exists saved_items_user_created_idx on public.saved_items (user_id, created_at desc);

alter table public.saved_items enable row level security;

drop policy if exists "Users can read own saved items" on public.saved_items;
create policy "Users can read own saved items"
  on public.saved_items
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own saved items" on public.saved_items;
create policy "Users can insert own saved items"
  on public.saved_items
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own saved items" on public.saved_items;
create policy "Users can delete own saved items"
  on public.saved_items
  for delete
  using (auth.uid() = user_id);

-- Required so signed-in users can use the table from the website.
grant usage on schema public to authenticated;
grant select, insert, delete on table public.saved_items to authenticated;
