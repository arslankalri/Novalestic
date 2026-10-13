# NOVALESTIC JEWELLERS — backend and admin setup

## Current architecture

The public storefront and protected catalogue admin are in the original `arslankalri/Novalestic` repository. The catalogue uses the Supabase/Lovable Cloud backend configured for this project.

The business-operations UI adds private order, customer, enquiry, inventory and reporting pages. These pages require the operations migration below to be applied to the **same database used by the live project**.

## 1. Apply the operations migration

Run this file once in the project's Cloud/Supabase SQL editor:

`supabase/migrations/202610140001_novalestic_operations.sql`

[Open the migration on GitHub](https://github.com/arslankalri/Novalestic/blob/main/supabase/migrations/202610140001_novalestic_operations.sql)

This migration creates the customers, enquiries, orders, order-items and inventory-movement tables; private admin/partner RLS policies; automatic order numbers; stock-ledger updates; and private product cost fields for internal margin estimates.

**Do not apply it to a different project's database.** If the catalogue foundation migration has not already been applied to this database, apply the foundation migration first:

`supabase/migrations/202610130001_novalestic_admin_foundation.sql`

Do not re-run an already-applied foundation migration just because the operations migration is new.

## 2. Admin access

The owner account should be provisioned through the trusted Cloud authentication dashboard and granted the `admin` role in `public.user_roles`. Public registration is not part of the app. Add a partner account later with a separate `partner` role; do not share the owner's password.

The app checks admin/partner access before showing protected admin routes. Database RLS independently restricts customer, enquiry, order, order-item and inventory records to those roles.

## 3. Admin pages

- `/admin` — catalogue management and product publishing
- `/admin/overview` — operations overview
- `/admin/orders` — record and track manual orders from WhatsApp, phone, Instagram, in-person or other sources
- `/admin/enquiries` — enquiry pipeline and follow-up dates
- `/admin/customers` — customer records and linked order totals
- `/admin/inventory` — stock ledger and current stock
- `/admin/reports` — recent recorded sales, collected payments and estimated gross profit where product cost is known

Manual orders are not online checkout. Payment is recorded manually; the app does not process payments or create shipping labels.

## 4. Inventory and financial accuracy

- Use the Inventory page to record opening stock, restocks, returns, sales/dispatches, damage and downward adjustments.
- Inventory movements are ledger records; they cannot be edited or deleted from the client. Corrections should be entered as compensating movements.
- Stock cannot be reduced below zero by the stock ledger.
- Product cost price is private and is never displayed on the public storefront.
- Gross profit is an estimate based on order-item price and the cost snapshot captured when the order is created. Missing cost prices mean the estimate is incomplete; shipping, discounts, taxes, returns and other expenses may require further accounting treatment.
- Dashboard sales cards summarize the latest 100 orders, not a complete accounting statement.

## 5. Security rules

- Never put a Supabase service-role key or database password into browser code or commit it to GitHub.
- Keep public sign-ups disabled.
- Public catalogue access must remain limited to published products.
- Operational tables must remain admin/partner-only.
- Only authorized staff can upload or delete product images.
- Test owner and non-admin access separately before production use.

## 6. Verification checklist

After applying the migration, sign in and verify:

- [ ] Overview loads without database errors.
- [ ] A customer record can be saved.
- [ ] A WhatsApp/phone enquiry can be recorded and its status changed.
- [ ] A manual order can be created and its order number generated.
- [ ] Order status and payment status can be updated.
- [ ] An opening stock or restock movement increases the product's stock quantity.
- [ ] An outgoing movement cannot make stock negative.
- [ ] A known product cost is copied into a new order item and reports show an estimate.
- [ ] Signed-out visitors and signed-in non-admin users cannot read operational records.
- [ ] Public product browsing still shows published products only.
