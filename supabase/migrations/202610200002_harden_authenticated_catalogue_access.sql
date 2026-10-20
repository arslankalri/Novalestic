-- Harden catalogue reads for every database role, including signed-in non-admin users.
-- Admin product-management queries intentionally select only fields needed by the simple dashboard.
begin;

-- A table-level SELECT grant overrides column minimisation, so revoke it before
-- granting only storefront/admin-dashboard fields. Keep internal metadata private.
revoke select on table public.products from public, anon, authenticated;
revoke select (slug, sku, stock_quantity, updated_at, published_at)
  on table public.products from public, anon, authenticated;

grant select (
  id,
  title,
  category,
  price_pkr,
  pricing_mode,
  hallmark_badge,
  metal,
  available_metals,
  carat,
  origin,
  cut,
  clarity,
  dimensions,
  tag,
  short_desc,
  description,
  primary_image_url,
  in_stock,
  is_published,
  is_featured,
  created_at
) on table public.products to anon, authenticated;

-- Public photos remain publicly viewable through storage URLs, but the table
-- containing admin upload paths and photo management metadata is admin-only.
revoke select on table public.product_images from public, anon, authenticated;
revoke select (id, product_id, image_url, storage_path, alt_text, sort_order, created_at)
  on table public.product_images from public, anon, authenticated;

grant select (id, product_id, image_url, storage_path, alt_text, sort_order)
  on table public.product_images to authenticated;

drop policy if exists "Public can read images for published products" on public.product_images;
drop policy if exists "Admins can read product images" on public.product_images;
create policy "Admins can read product images"
on public.product_images for select
to authenticated
using (public.novalestic_has_admin_access());

commit;
