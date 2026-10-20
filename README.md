# NOVALESTIC JEWELLERS

A simple jewellery catalogue built with React, TypeScript, TanStack Router, Vite, Tailwind CSS and Supabase. Prices are shown in Pakistani rupees (PKR).

## What the shop does

- Shows only real products published in the connected Supabase catalogue. No demo products or promotional placeholders are inserted when the catalogue is empty.
- Supports category browsing, product details, metal options, ring sizing, a saved shopping bag and an itemised WhatsApp enquiry.
- Provides contact and provisional privacy, shipping, returns and website-terms pages.
- Offers Google sign-in and email/password sign-in for catalogue administrators; only users with an existing `admin` or `partner` role can access the dashboard.
- Keeps a protected catalogue admin at `/admin/login` and `/admin` for adding product information, uploading photos and publishing or unpublishing products.

## Important checkout limitation

The shopping bag sends an enquiry through WhatsApp. It does **not** take payment or create a confirmed order. The team must confirm price, availability, delivery and payment arrangements directly with the customer. No payment gateway or automatic checkout has been configured.

Before public launch, verify the WhatsApp number, business contact details, legal identity, real product photography, product descriptions, prices and stock status. Replace the provisional policy copy with business-approved terms for the markets served.

## Supabase setup

1. Set the environment variables below in your hosting environment.
2. Apply the relevant SQL migrations in `supabase/migrations` to the intended Supabase project.
3. Confirm the product tables, image storage bucket, authentication and row-level security are configured.
4. Configure Google sign-in for the connected Lovable Cloud project, then sign in at `/admin/login` with a Google account that has an existing `admin` or `partner` role. Add real product photos and details, then explicitly publish each product.
5. Test the public catalogue as a signed-out visitor and the admin as an authorised user.

Environment variables used by the app:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Use `.env.example` as a template. Never commit service-role keys or other server secrets.

## Development

GitHub Actions checks formatting, tests, TypeScript, lint and the production build on pushes to `main` and pull requests targeting `main`.

```sh
bun install
bun run dev
bun run test
bun run lint
bun run build
```
