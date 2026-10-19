-- Public visitors should only be able to read the fields required to display
-- published catalogue items. Keep internal SKU and stock counts private.
begin;

-- Product photos are intentionally public catalogue assets. Use permanent public
-- URLs instead of expiring signed URLs, and enforce the same 10 MB MIME limits
-- that the catalogue admin validates client-side.
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'product-images',
  'product-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

revoke select on table public.products from anon;
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
) on table public.products to anon;

-- The storefront reads the product's primary_image_url directly and does not
-- need public access to the product_images management table.
revoke select on table public.product_images from anon;

commit;
