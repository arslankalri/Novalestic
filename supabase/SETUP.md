# NOVALESTIC Supabase setup — Phase 1

This document accompanies `supabase/migrations/202610130001_novalestic_admin_foundation.sql`.

## Important status

The migration file is committed to GitHub, but the migration has **not** been applied to a Supabase project, and no administrator account or credentials have been created. The existing public storefront has not been changed by this phase.

## 1. Create the backend project

1. Create a dedicated Supabase project for NOVALESTIC JEWELLERS.
2. Keep project ownership in an account controlled by the business owner.
3. In the Supabase SQL Editor, review and apply the migration at:
   `supabase/migrations/202610130001_novalestic_admin_foundation.sql`
4. Confirm the tables `user_roles`, `products`, and `product_images` exist, RLS is enabled, and the `product-images` bucket exists.

Do not run this migration against a database used by another application.

## 2. Configure authentication

1. In Supabase Authentication settings, disable public email sign-ups.
2. Invite/create the owner's user through the trusted Supabase dashboard.
3. Verify the owner can sign in before assigning a role.
4. In the SQL Editor, replace the placeholder email below with the exact email used for the invited account, then run:

```sql
insert into public.user_roles (user_id, role)
select id, 'admin'
from auth.users
where lower(email) = lower('REPLACE-WITH-OWNER-EMAIL')
on conflict (user_id) do update set role = 'admin';
```

Check that exactly one intended user has the `admin` role. Do not add role-management controls to the public frontend. Partner access can be provisioned separately later.

## 3. Frontend environment values

The frontend will eventually need only the project URL and public/anon key:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Add these in the hosting/development environment settings. Never commit actual values into source control. Never expose the Supabase service-role key in a browser app or commit it to GitHub.

## 4. Data and publishing behavior

- Public catalogue reads must filter to `is_published = true`.
- Product creation should start unpublished until required fields and a primary image are provided.
- On Save & Publish, validate the product and set `is_published = true`; it will then be publicly readable.
- Keep enquiry-only pricing supported. Do not invent prices or specifications.
- Product photos are public-read because the storefront must display them; only authorized admin/partner accounts may upload, update, or delete them.
- Storage path convention: `products/{product_id}/{unique_filename}`.
- Allowed image types: JPEG, PNG, WebP; maximum 10 MiB per image.

## 5. Verification checklist

Before building the admin UI or connecting the public storefront, verify:

- [ ] Anonymous users cannot read unpublished product rows.
- [ ] Anonymous users cannot insert, update, or delete products.
- [ ] Authenticated users without an admin role cannot write products or upload files.
- [ ] The owner admin can insert and update products.
- [ ] Public visitors can read published products and product photos.
- [ ] Public visitors cannot create, update, or delete storage objects.
- [ ] Public self-registration is disabled.
- [ ] No service-role key is present in frontend code or Git history.

## Current phase boundary

This migration establishes the backend schema and security policies only. It does not add routes, UI, Supabase client dependencies, environment values, or change storefront data fetching. Do not begin Phase 3 until the backend and admin portal have been verified.
