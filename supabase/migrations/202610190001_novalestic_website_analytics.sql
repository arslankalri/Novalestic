-- First-party, opt-in storefront analytics for Novalestic.
-- Stores only a random tab/session ID, a sanitized app page path, referrer hostname and device-size category.
-- Does not store IP addresses, full referrer URLs, customer messages or account details.

create table if not exists public.website_page_views (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null,
  page_path text not null
    check (char_length(trim(page_path)) between 1 and 160 and page_path !~* '^/admin'),
  referrer_host text
    check (referrer_host is null or char_length(referrer_host) <= 253),
  device_type text not null default 'unknown'
    check (device_type in ('mobile', 'desktop', 'unknown')),
  created_at timestamptz not null default now()
);

create index if not exists website_page_views_created_at_idx
  on public.website_page_views (created_at desc);
create index if not exists website_page_views_path_created_at_idx
  on public.website_page_views (page_path, created_at desc);
create index if not exists website_page_views_session_created_at_idx
  on public.website_page_views (session_id, created_at desc);

alter table public.website_page_views enable row level security;

revoke all on public.website_page_views from public, anon, authenticated;
grant insert (session_id, page_path, referrer_host, device_type)
  on public.website_page_views to anon, authenticated;
grant select on public.website_page_views to authenticated;

drop policy if exists "Storefront may record anonymous page views" on public.website_page_views;
create policy "Storefront may record anonymous page views"
  on public.website_page_views
  for insert
  to anon, authenticated
  with check (
    char_length(trim(page_path)) between 1 and 160
    and page_path !~* '^/admin'
    and device_type in ('mobile', 'desktop', 'unknown')
    and (referrer_host is null or char_length(referrer_host) <= 253)
  );

drop policy if exists "Admins may read website analytics" on public.website_page_views;
create policy "Admins may read website analytics"
  on public.website_page_views
  for select
  to authenticated
  using (public.novalestic_has_admin_access());

-- Retain only the most recent 90 days of page-view events.
create or replace function public.novalestic_prune_website_page_views()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.website_page_views
  where created_at < now() - interval '90 days';
  return new;
end;
$$;

revoke all on function public.novalestic_prune_website_page_views() from public;

drop trigger if exists novalestic_prune_website_page_views on public.website_page_views;
create trigger novalestic_prune_website_page_views
  before insert on public.website_page_views
  for each row execute function public.novalestic_prune_website_page_views();
