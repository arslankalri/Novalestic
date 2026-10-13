-- NOVALESTIC JEWELLERS: secure catalogue foundation
-- Phase 1 only. This migration creates backend structures but does not connect
-- the existing storefront or provision an administrator account.
-- Apply only to the dedicated NOVALESTIC Supabase project after reviewing it.

create extension if not exists pgcrypto;

create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'partner')),
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) > 0),
  slug text not null unique check (length(trim(slug)) > 0),
  sku text unique,
  category text not null check (
    category in ('rings', 'earrings', 'necklaces', 'bangles-bracelets')
  ),
  price_pkr numeric(14,2) check (price_pkr is null or price_pkr >= 0),
  pricing_mode text not null default 'enquiry'
    check (pricing_mode in ('fixed', 'enquiry')),
  hallmark_badge text,
  metal text,
  available_metals text[] not null default '{}',
  carat text,
  origin text,
  cut text,
  clarity text,
  dimensions text,
  tag text,
  short_desc text,
  description text,
  primary_image_url text,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  in_stock boolean not null default false,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  constraint products_price_mode_check check (
    (pricing_mode = 'enquiry') or price_pkr is not null
  ),
  constraint products_publish_validation check (
    not is_published or (
      length(trim(title)) > 0
      and length(trim(slug)) > 0
      and category is not null
      and primary_image_url is not null
      and length(trim(primary_image_url)) > 0
    )
  )
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  storage_path text,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (product_id, sort_order)
);

create index if not exists products_public_catalogue_idx
  on public.products (is_published, category, is_featured, created_at desc);

create index if not exists product_images_product_order_idx
  on public.product_images (product_id, sort_order);

create or replace function public.novalestic_has_admin_access()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_roles r
    where r.user_id = (select auth.uid())
      and r.role in ('admin', 'partner')
  );
$$;

revoke all on function public.novalestic_has_admin_access() from public;
grant execute on function public.novalestic_has_admin_access() to anon, authenticated;

create or replace function public.novalestic_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  if new.is_published and old.is_published is distinct from true then
    new.published_at = now();
  end if;
  if not new.is_published then
    new.published_at = null;
  end if;
  return new;
end;
$$;

drop trigger if exists novalestic_products_updated_at on public.products;
create trigger novalestic_products_updated_at
before update on public.products
for each row execute function public.novalestic_set_updated_at();

alter table public.user_roles enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;

-- Table grants are required in addition to RLS policies.
grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant select on public.product_images to anon, authenticated;
grant insert, update, delete on public.product_images to authenticated;

drop policy if exists "Users can read their own role" on public.user_roles;
create policy "Users can read their own role"
on public.user_roles for select
to authenticated
using (user_id = (select auth.uid()) or public.novalestic_has_admin_access());

-- Role rows must be provisioned by a trusted operator through the Supabase
-- dashboard/SQL editor. There are deliberately no client INSERT/UPDATE/DELETE policies.
revoke all on public.user_roles from anon, authenticated;
grant select on public.user_roles to authenticated;

drop policy if exists "Public can read published products" on public.products;
create policy "Public can read published products"
on public.products for select
to anon, authenticated
using (is_published = true or public.novalestic_has_admin_access());

drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products"
on public.products for insert
to authenticated
with check (public.novalestic_has_admin_access());

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products"
on public.products for update
to authenticated
using (public.novalestic_has_admin_access())
with check (public.novalestic_has_admin_access());

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products"
on public.products for delete
to authenticated
using (public.novalestic_has_admin_access());

drop policy if exists "Public can read images for published products" on public.product_images;
create policy "Public can read images for published products"
on public.product_images for select
to anon, authenticated
using (
  public.novalestic_has_admin_access()
  or exists (
    select 1 from public.products p
    where p.id = product_id and p.is_published = true
  )
);

drop policy if exists "Admins can insert product images" on public.product_images;
create policy "Admins can insert product images"
on public.product_images for insert
to authenticated
with check (public.novalestic_has_admin_access());

drop policy if exists "Admins can update product images" on public.product_images;
create policy "Admins can update product images"
on public.product_images for update
to authenticated
using (public.novalestic_has_admin_access())
with check (public.novalestic_has_admin_access());

drop policy if exists "Admins can delete product images" on public.product_images;
create policy "Admins can delete product images"
on public.product_images for delete
to authenticated
using (public.novalestic_has_admin_access());

-- Product image storage. Public read is required for product photos on the
-- storefront; upload/update/delete remain restricted to admin/partner roles.
-- The 'product-images' bucket itself is created through the Lovable Cloud storage tool
-- (bucket rows cannot be written from SQL migrations).

drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'product-images');

drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'product-images'
  and public.novalestic_has_admin_access()
);

drop policy if exists "Admins can update product images" on storage.objects;
create policy "Admins can update product images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'product-images'
  and public.novalestic_has_admin_access()
)
with check (
  bucket_id = 'product-images'
  and public.novalestic_has_admin_access()
);

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'product-images'
  and public.novalestic_has_admin_access()
);
