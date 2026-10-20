# NOVALESTIC JEWELLERS

This repository contains the public Novalestic jewellery storefront only. The previous admin portal and Supabase-backed catalogue administration have been retired. A new backend and Google-based admin sign-in may be added later as a separate, explicitly requested phase.

## Current state

- The public storefront, product-detail views, local cart, contact page, and policy pages are retained.
- The product loader returns an empty collection until a future backend is connected. No sample products or made-up prices are used as fallback catalogue entries.
- The old `/admin`, `/admin/login`, and related dashboard routes are not present in the generated route tree.
- The legacy Supabase `products`, `product_images`, and `user_roles` tables, admin-access/auto-grant functions, auto-grant trigger, and associated row-level security policies have been removed from the connected Novalestic database.
- The private `product-images` Storage bucket is empty and has no remaining product-image policies. Supabase blocked deleting its bucket metadata directly through SQL, so the bucket itself still needs deletion through the supported Storage API.
- The shopping cart is browser-local and checkout opens a WhatsApp enquiry; it does not save an order or take payment.
- No Laravel API, customer-order database, payment gateway, or Google-based admin sign-in is configured yet.

Do not accept real online orders until the backend, authentication/authorization, persistent product and order handling, and applicable business policies are implemented and tested. Do not reintroduce admin routes or legacy Supabase access while the future backend is undecided.

## Development

This project uses Bun:

```sh
bun install
bun run dev
bun run test
bun run lint
bun run build
```

Changes committed to the GitHub branch connected to Lovable can sync to the project editor. This change does not publish the production site.
