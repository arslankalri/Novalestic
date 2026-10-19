-- Public visitors should only be able to read the fields required to display
-- published catalogue items. Keep internal SKU and stock counts private.
begin;

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
