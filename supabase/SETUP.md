# NOVALESTIC JEWELLERS — Supabase setup

This project currently provides a simple jewellery catalogue, product details, a persistent shopping cart and WhatsApp enquiry checkout. It does **not** process online payments or manage online orders.

## 1. Confirm the correct Supabase project

Open the Supabase project used by the deployed Novalestic site. Make sure it is the same project configured in the app's environment variables. Never paste a service-role key or database password into frontend code or GitHub.

Before changing the database, confirm that the foundation already exists:

- `public.products`
- `public.product_images`
- `public.user_roles`
- `public.novalestic_has_admin_access()`

If these do not exist, review and apply `supabase/migrations/202610130001_novalestic_admin_foundation.sql` once first. Do not re-run it on a database where it is already installed.

## 2. Apply the catalogue security migrations in order

In the **same project's** Supabase SQL Editor, review and run both files in this order:

1. `supabase/migrations/202610200001_restrict_public_product_columns.sql` — configures the product photo bucket and limits anonymous catalogue columns.
2. `supabase/migrations/202610200002_harden_authenticated_catalogue_access.sql` — removes table-wide product reads from signed-in users, restricts product-photo metadata to administrators, and keeps dashboard reads to the fields it needs.

[Open migration 1](https://github.com/arslankalri/Novalestic/blob/main/supabase/migrations/202610200001_restrict_public_product_columns.sql) · [Open migration 2](https://github.com/arslankalri/Novalestic/blob/main/supabase/migrations/202610200002_harden_authenticated_catalogue_access.sql)

The second migration addresses a permissions gap: the foundation migration grants table-level product reads to authenticated users, which can expose internal fields even if anonymous access is narrowed. Do not apply these migrations to a different database. Review active policies and permissions first if you made manual database changes.

These migrations do not create products, provision an administrator account, or deploy the website.

## 3. Confirm administrator access

In Supabase Authentication, confirm that your owner account exists. Then verify that its user ID has a row in `public.user_roles` with the role `admin`. The app's `/admin` page checks this role through `novalestic_has_admin_access()`. Public registration should remain disabled unless you intentionally configure and test a secure account-creation flow.

If the owner role row is missing, add the real Auth user UUID through the trusted Supabase SQL Editor; do not guess the UUID:

```sql
insert into public.user_roles (user_id, role)
values ('REPLACE_WITH_REAL_AUTH_USER_UUID', 'admin')
on conflict (user_id) do update set role = excluded.role;
```

## 4. Add real products

Sign in at `/admin/login`, then open `/admin`. For each jewellery item:

1. Enter the product name and category.
2. Choose either a fixed PKR price or price-on-enquiry.
3. Add its metal/purity and a short, accurate description.
4. Upload at least one real product photo (JPEG, PNG or WebP, up to 10 MB each).
5. Save the product. New products stay as drafts until you choose **Publish** in the product list.

Use only real products, accurate prices and photographs you have permission to use. Do not publish test/example products.

## 5. Test before launch

- [ ] Admin sign-in works; a signed-out visitor cannot open the admin page.
- [ ] An administrator can add a draft with a photo, edit it, and publish/unpublish it.
- [ ] A published product appears in its correct category; an unpublished draft does not appear publicly.
- [ ] Product search, metal filter, sorting, product options and cart quantity controls work.
- [ ] The cart persists when the page is refreshed.
- [ ] WhatsApp checkout opens a message with the selected products/options and correct quantities.
- [ ] Product images load in a private/incognito browser session.
- [ ] An out-of-stock item cannot be added to the cart.
- [ ] Shipping, returns, terms, contact details and business policies are accurate before they are shown publicly.

The cart checkout sends an **enquiry**, not a confirmed order, and does not collect payment. Confirm price, stock, delivery and payment terms with the customer before accepting an order.

## 6. Deploy

The latest code checks should pass before deploying. After deployment, repeat the browser checks against the actual live site and production Supabase project. A green GitHub CI run verifies formatting, tests, type-checking, lint and build; it does not prove that production database permissions, image uploads, administrator access or WhatsApp links work end to end.
