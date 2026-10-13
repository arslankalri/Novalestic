-- NOVALESTIC JEWELLERS: operations foundation
-- Adds private customer, enquiry, order and inventory operations.
-- All operational records are restricted to authorised admin/partner accounts.

create sequence if not exists public.novalestic_order_number_seq;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (length(trim(full_name)) > 0),
  phone text,
  email text,
  city text,
  address text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  customer_name text not null check (length(trim(customer_name)) > 0),
  phone text,
  email text,
  channel text not null default 'whatsapp'
    check (channel in ('website','whatsapp','phone','instagram','in_person','other')),
  status text not null default 'new'
    check (status in ('new','contacted','quoted','converted','lost')),
  subject text,
  message text,
  product_id uuid references public.products(id) on delete set null,
  follow_up_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid references public.customers(id) on delete set null,
  customer_name text not null check (length(trim(customer_name)) > 0),
  phone text,
  email text,
  status text not null default 'pending'
    check (status in ('pending','confirmed','processing','shipped','delivered','cancelled')),
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid','partial','paid','refunded')),
  payment_method text not null default 'manual'
    check (payment_method in ('manual','cash','bank_transfer','card','cod','other')),
  subtotal_pkr numeric(14,2) not null default 0 check (subtotal_pkr >= 0),
  shipping_fee_pkr numeric(14,2) not null default 0 check (shipping_fee_pkr >= 0),
  discount_pkr numeric(14,2) not null default 0 check (discount_pkr >= 0),
  total_pkr numeric(14,2) not null default 0 check (total_pkr >= 0),
  paid_amount_pkr numeric(14,2) not null default 0 check (paid_amount_pkr >= 0),
  shipping_address text,
  city text,
  tracking_number text,
  source text not null default 'manual'
    check (source in ('website','whatsapp','phone','instagram','in_person','manual','other')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_title text not null,
  sku text,
  quantity integer not null check (quantity > 0),
  unit_price_pkr numeric(14,2) not null check (unit_price_pkr >= 0),
  line_total_pkr numeric(14,2) not null check (line_total_pkr >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete restrict,
  movement_type text not null
    check (movement_type in ('opening','restock','sale','return','adjustment','damage')),
  quantity_delta integer not null check (quantity_delta <> 0),
  reason text not null check (length(trim(reason)) > 0),
  order_id uuid references public.orders(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists customers_name_idx on public.customers (lower(full_name));
create index if not exists enquiries_status_created_idx on public.enquiries (status, created_at desc);
create index if not exists orders_status_created_idx on public.orders (status, created_at desc);
create index if not exists order_items_order_idx on public.order_items (order_id);
create index if not exists inventory_movements_product_idx on public.inventory_movements (product_id, created_at desc);

create or replace function public.novalestic_generate_order_number()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.order_number is null or length(trim(new.order_number)) = 0 then
    new.order_number := 'NV-' || to_char(now(), 'YYYY') || '-' ||
      lpad(nextval('public.novalestic_order_number_seq')::text, 6, '0');
  end if;
  return new;
end;
$$;

drop trigger if exists novalestic_orders_number on public.orders;
create trigger novalestic_orders_number
before insert on public.orders
for each row execute function public.novalestic_generate_order_number();

drop trigger if exists novalestic_customers_updated_at on public.customers;
create trigger novalestic_customers_updated_at before update on public.customers
for each row execute function public.novalestic_set_updated_at();

drop trigger if exists novalestic_enquiries_updated_at on public.enquiries;
create trigger novalestic_enquiries_updated_at before update on public.enquiries
for each row execute function public.novalestic_set_updated_at();

drop trigger if exists novalestic_orders_updated_at on public.orders;
create trigger novalestic_orders_updated_at before update on public.orders
for each row execute function public.novalestic_set_updated_at();

alter table public.customers enable row level security;
alter table public.enquiries enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.inventory_movements enable row level security;

grant select, insert, update, delete on public.customers, public.enquiries, public.orders,
  public.order_items, public.inventory_movements to authenticated;
grant usage, select on sequence public.novalestic_order_number_seq to authenticated;

drop policy if exists "Admins manage customers" on public.customers;
create policy "Admins manage customers" on public.customers for all to authenticated
using (public.novalestic_has_admin_access()) with check (public.novalestic_has_admin_access());

drop policy if exists "Admins manage enquiries" on public.enquiries;
create policy "Admins manage enquiries" on public.enquiries for all to authenticated
using (public.novalestic_has_admin_access()) with check (public.novalestic_has_admin_access());

drop policy if exists "Admins manage orders" on public.orders;
create policy "Admins manage orders" on public.orders for all to authenticated
using (public.novalestic_has_admin_access()) with check (public.novalestic_has_admin_access());

drop policy if exists "Admins manage order items" on public.order_items;
create policy "Admins manage order items" on public.order_items for all to authenticated
using (public.novalestic_has_admin_access()) with check (public.novalestic_has_admin_access());

drop policy if exists "Admins manage inventory movements" on public.inventory_movements;
create policy "Admins manage inventory movements" on public.inventory_movements for all to authenticated
using (public.novalestic_has_admin_access()) with check (public.novalestic_has_admin_access());

-- Keep the product stock quantity in sync with an auditable movement ledger.
create or replace function public.novalestic_apply_inventory_movement()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_qty integer;
begin
  select stock_quantity into current_qty from public.products where id = new.product_id for update;
  if not found then
    raise exception 'Product not found';
  end if;
  if current_qty + new.quantity_delta < 0 then
    raise exception 'Stock cannot become negative';
  end if;
  update public.products
    set stock_quantity = current_qty + new.quantity_delta,
        in_stock = (current_qty + new.quantity_delta) > 0
    where id = new.product_id;
  return new;
end;
$$;

drop trigger if exists novalestic_inventory_apply on public.inventory_movements;
create trigger novalestic_inventory_apply
before insert on public.inventory_movements
for each row execute function public.novalestic_apply_inventory_movement();

-- Ledger rows are immutable: corrections are recorded as compensating movements.
drop policy if exists "Admins manage inventory movements" on public.inventory_movements;
create policy "Admins read inventory movements" on public.inventory_movements for select to authenticated
using (public.novalestic_has_admin_access());
drop policy if exists "Admins insert inventory movements" on public.inventory_movements;
create policy "Admins insert inventory movements" on public.inventory_movements for insert to authenticated
with check (public.novalestic_has_admin_access());
