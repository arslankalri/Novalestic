# NOVALESTIC JEWELLERS

A responsive, luxury-styled jewellery storefront built with React, TypeScript, TanStack Router, Vite, Tailwind CSS, and Supabase. Prices are represented in Pakistani rupees (PKR).

## Current store status

**Readiness: storefront preview; not ready for full online sales yet.**

- The public catalogue loads only published products from the connected Supabase database. Sample product fixtures have been removed. The last database check on 19 October 2026 found no published product rows, so the collection needs real catalogue entries before customers can shop it.
- Home, category, product-detail, contact, and cart views are implemented. Product details support metal/ring-size selections and WhatsApp enquiries.
- The cart is a browser-side saved cart. The checkout button is intentionally disabled; there is no completed online checkout, payment gateway, shipping calculation, or automated website-to-order submission flow yet.
- The WhatsApp contact number is currently configured in storefront components and should be verified by the business owner before launch.
- Authenticated admin routes exist at `/admin/login` and `/admin`. Access checks call the database-side `novalestic_has_admin_access` function; keep these checks and the corresponding database policies intact.
- The operations migration `supabase/migrations/202610140001_novalestic_operations.sql` defines customers, enquiries, orders, costing and stock-ledger tables. It had not been applied to the connected database at the last verification, so those operations screens must not be treated as production-ready until the migration and its RLS policies are reviewed and safely applied.
- Opt-in visitor analytics is now implemented in the storefront and admin overview. It records page views only after consent and stores a random tab-session ID, a storefront path, the referrer hostname and a mobile/desktop size category; it does not intentionally store IP addresses, names, contact details or message contents in the analytics table. Events are configured for 90-day retention. Apply `supabase/migrations/202610190001_novalestic_website_analytics.sql` to the intended Supabase project before expecting analytics data in the admin panel.

## Before launch

1. Add and publish verified product records with genuine photos, descriptions, material details, stock status and accurate pricing/enquiry settings.
2. Verify the WhatsApp number, store contact details, currency, shipping regions, shipping charges, returns policy, privacy policy and terms.
3. Decide whether orders will be completed manually through WhatsApp or through a real checkout. If adding checkout, connect order creation, payment, delivery, refunds and inventory updates before enabling the checkout button.
4. Review and apply the operations migration and the opt-in website analytics migration in the intended Supabase project. Confirm row-level security with both an authorised admin and an unauthorised account.
5. Verify admin access, catalogue CRUD, customer and enquiry handling, stock movements, manual order creation and visitor analytics using an authorised admin account.
6. Confirm the business's actual shipping regions and charges, delivery estimates, returns/exchange terms, privacy notice and terms of sale before publishing those policies to customers.
7. Test the public site on mobile and desktop, accessibility and error states, then complete a full end-to-end enquiry/order rehearsal before production launch.

## Development

Install dependencies using Bun and the repository lockfile:

```sh
bun install
bun run dev
bun run test
bun run build
bun run lint
bunx prettier --check "src/novalestic/**/*.{ts,tsx,js,jsx,json,css,md}" "src/styles.css"
```

Keep credentials and private management controls out of the public storefront. Admin access must continue to be enforced by database-side authorization and RLS, not by hiding links in the UI.
