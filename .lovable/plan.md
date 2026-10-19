# Phase A Audit + Apple Luxury Redesign Plan (plan only)

## 1. Audit findings (verified by reading files)

**Entry and routing**
- `src/routes/__root.tsx` holds the shared page shell and loads the Google Fonts (Playfair Display, Plus Jakarta Sans).
- `src/routes/index.tsx` (/) renders `src/novalestic/App.tsx`. That file switches between views itself through `ShopContext`: home, shop, rings, earrings, necklaces, bangles-bracelets, product-detail, cart and contact. The URL hash (#rings, #cart) keeps the view in sync.
- Admin pages are separate and only load in the browser: `/admin/login`, `/admin` (protected by `hasAdminAccess()` in `beforeLoad`), plus `/admin/overview`, `/inventory`, `/orders`, `/customers`, `/enquiries` and `/reports`.

**Styles**
- `src/styles.css` uses Tailwind v4 and shadcn tokens, plus the `serif-luxury` class. Storefront components mostly hardcode hex colours (`#fbf9f4`, `#DFC27F`, `#9E7B32`, `#002118`) instead of using the shared colour tokens.

**Components and data**
- Storefront components live in `src/novalestic/components/`: Header, Footer, HeroSection, CuratedCategories, BestsellingGrid, CraftsmanshipSection, GuaranteesSection, NewsletterSection, CatalogView, ProductDetailView, CartView, ContactView, NotificationToast and NovalesticLogo.
- Admin code lives in `src/novalestic/admin/`: `access.ts`, `AdminDashboard.tsx` and `AdminOperations.tsx`.
- Sign-in uses email and password through the generated browser client. `src/start.ts` adds the sign-in token to server calls. The rules are enforced in the database by `novalestic_has_admin_access()`.

**Backend references (no secrets shown)**
- Lovable Cloud is connected. `.env` holds only the public URL, the publishable key and the project ID. No service key appears in the frontend code.
- There are two migrations: `202610130001_novalestic_admin_foundation.sql` and `202610140001_novalestic_operations.sql`.

**Product source order and fallback (key finding)**
1. `ShopContext` starts with `INITIAL_PRODUCTS`: 4 sample items from `data/products.ts` (sample-ring, sample-earrings, sample-necklace, sample-bangle-bracelet). They carry made-up prices (Rs. 850,000 / 540,000 / 1,250,000 / 380,000) and "To be confirmed" specs.
2. After the page loads, `fetchPublishedProducts()` replaces the samples, but only if at least one published product exists.
3. **If there are no published products, or the database can't be reached, visitors see the 4 sample items with sample prices.** They are labelled "Sample listing" / "Preview", but they can still be added to the cart.
4. Real products load only after the page appears, so samples can flash briefly before live products replace them.
5. In `App.tsx`, product detail falls back to `'sample-ring'` when no product is selected.
6. `CuratedCategories` shows the copy "Browse All Sample Jewellery".

**WhatsApp and cart**
- WhatsApp numbers don't match. The links use `923019653550` (Footer, ContactView, CatalogView, BestsellingGrid, and ProductDetailView through `WHATSAPP_NUMBER`). The number saved in project memory is `+923001234567`, which is marked as a placeholder. Please confirm the real number.
- The WhatsApp number is typed out separately in 4 or more places instead of being stored once.
- The cart is saved in the browser under `nova_lestic_cart_pkr_v1`, capped at 1–99 per item. Ring size defaults to "Size 14 (Standard)". Cart items keep a copy of the product, so a cart saved while samples were showing can still hold sample items after real products go live.
- Checkout is not active; the cart only shows a notice.

**Build and tests**
- Available commands: `vite build`, `vitest run` (1 routing test in `src/test/app-routing.test.tsx`), `eslint`, and `tsgo` for type checks. No tests cover the storefront's behaviour.

**Repository binding**
- The current working branch is `edit/edt-4d7a3313-...`; the latest commit is "Work in progress". The GitHub remote and main-branch binding are not visible from here, so they are unverified.

## 2. Redesign direction: "Apple Luxury"
- Lots of white space, large calm headings, a soft ivory background, gold used only as an accent, thin dividers and gentle motion.
- Keep Playfair Display for headings and Plus Jakarta Sans for body text, as stored in memory.
- Visual changes only: no new features, no changes to data or wording.

## 3. Phases
- **Phase 1: Design tokens.** Add semantic colours (ivory, ink, gold, emerald, hairline), spacing, radius and shadow tokens to `src/styles.css`. No visible change yet.
- **Phase 2: Shell.** Restyle Header (a frosted sticky bar) and Footer.
- **Phase 3: Home page.** Restyle HeroSection, CuratedCategories, BestsellingGrid, CraftsmanshipSection, GuaranteesSection and NewsletterSection.
- **Phase 4: Shopping pages.** Restyle CatalogView, ProductDetailView, CartView, ContactView and NotificationToast.
- **Phase 5: Check.** Run tests, type checks and build, then take screenshots on desktop and mobile. Confirm that the hash links, cart, WhatsApp links and PKR prices behave exactly as before.

Each phase changes class names and layout only. Event handlers, props, context calls and text stay as they are.

## 4. Files likely to change
- `src/styles.css`
- `src/novalestic/components/` Header, Footer, HeroSection, CuratedCategories, BestsellingGrid, CraftsmanshipSection, GuaranteesSection, NewsletterSection, CatalogView, ProductDetailView, CartView, ContactView, NotificationToast
- `src/novalestic/App.tsx` (wrapper classes only)

## 5. Files to leave untouched
- `src/novalestic/context/ShopContext.tsx`, `src/novalestic/data/*`, `src/novalestic/types/*`
- `src/novalestic/admin/*` and every `src/routes/admin.*.tsx`
- `src/routes/__root.tsx`, `src/routes/index.tsx`, `src/router.tsx`, `src/start.ts`, `src/server.ts`, `src/routeTree.gen.ts`
- `src/integrations/supabase/*`, `supabase/*`, `.env`, `vite.config.ts`, `package.json`
- `NovalesticLogo.tsx` (the logo stays as it is)

## 6. Open decisions (not part of the redesign unless you approve them)
- Should the sample products be hidden from visitors (showing an empty state instead) once the live catalogue is empty?
- What is the real WhatsApp number: 0301 9653550 or the +923001234567 placeholder?
- Should all WhatsApp links use one shared number setting?
