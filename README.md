# NOVALESTIC JEWELLERS

The current repository contains the public Novalestic storefront UI. The previous Supabase-backed product database and admin portal have been retired while a new Laravel backend is planned.

## Current state

- Public storefront design and product detail/cart components are retained.
- The product loader currently returns an empty collection, so the catalogue uses its existing empty state until a backend is connected.
- The old `/admin` and `/admin/login` routes and dashboard have been removed.
- The previous Supabase product tables, admin roles, product-image bucket, and admin policies are being removed from the connected Supabase project.
- The shopping cart is browser-local and checkout opens a WhatsApp enquiry; it does not create a saved order or take payment.
- No Laravel API, customer-order database, payment gateway, or Google-based admin plugin is configured yet.

Do not accept real online orders until the Laravel backend, admin authentication/authorization, persistent products and order handling, and the applicable business policies are ready and tested.

## Development

This project uses Bun:

```sh
bun install
bun run dev
bun run test
bun run lint
bun run build
```

Changes committed to the GitHub branch connected to Lovable sync to the project editor. This change does not publish the production site.
