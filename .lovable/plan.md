# Novalestic Storefront Plan

This document describes the public storefront in the current repository. The former admin portal is retired; do not restore it as part of visual refinements.

## 1. Current verified state

- `src/routes/index.tsx` is the only application route registered in `src/routeTree.gen.ts`. The previous `/admin` and `/admin/login` routes are absent.
- `src/novalestic/App.tsx` renders the public jewellery storefront. `ShopContext` switches between catalogue, category, product detail, cart, contact, and policy views using the URL hash.
- `src/novalestic/data/publishedProducts.ts` deliberately returns an empty collection until a new backend is connected. Keep the existing empty catalogue state; do not add fake products or placeholder prices.
- The cart is stored locally in the browser. Checkout opens a WhatsApp enquiry and does not create an order or take payment.
- The old Supabase product tables, admin-role table, admin-access and auto-grant functions, auto-grant trigger, and related row-level security policies have been removed from the connected database. The private `product-images` storage bucket is empty and its access policies have been removed, but the bucket itself remains to be deleted through the supported Storage API.
- No Google sign-in, replacement admin portal, Laravel API, order database, or payment gateway is configured. Implement these only when explicitly requested.

## 2. Guardrails

- Keep the site public-storefront-only until the future backend/authentication design is approved.
- Do not recreate administrator routes, login pages, admin operations, role checks, or Supabase client/server authentication code as part of a design-only task.
- Preserve existing storefront behavior: category navigation, product detail navigation, local cart, contact links, WhatsApp enquiry, and policy pages.
- Keep the existing Novalestic logo and use the current jewellery imagery. Do not invent product listings, prices, specifications, customer reviews, or business policies.

## 3. Visual direction: Apple Luxury

- Generous white space, calm editorial typography, soft ivory backgrounds, fine dividers, and gold used sparingly.
- Keep Playfair Display for headings and Plus Jakarta Sans for body text.
- Use subtle, polished transitions and respect reduced-motion preferences.
- Keep the responsive mobile layout accessible, with visible focus states and appropriately sized controls.

## 4. Suggested visual refinement phases

1. Review shared design tokens in `src/styles.css` and standardize color, spacing, radius, and shadow values.
2. Refine `Header.tsx` and `Footer.tsx` while retaining current public navigation and contact details.
3. Refine the home/catalogue presentation, including `HeroSection.tsx`, `CuratedCategories.tsx`, and `BestsellingGrid.tsx`.
4. Refine product detail, cart, contact, and policy pages without changing the checkout/enquiry model.
5. Run tests, lint/type checks, and a production build. Verify mobile and desktop layouts, hash navigation, cart behavior, WhatsApp links, and reduced-motion behavior.

Design refinements should remain visual-only unless a separate change is explicitly approved. Do not publish to production without a direct request.
