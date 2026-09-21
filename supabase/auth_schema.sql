-- ==========================================================
-- Saasu Maa Ka Achaar: Supabase Database Migration
-- Idempotent script (safe to re-run multiple times)
-- ==========================================================

create extension if not exists "uuid-ossp";

-- ==========================================================
-- 1. PROFILES (Users)
-- ==========================================================
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin', 'staff')),
  is_active boolean default true,
  last_login_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_profiles_email on public.profiles (lower(email));
create index if not exists idx_profiles_role on public.profiles (role);

alter table public.profiles enable row level security;

drop policy if exists "Public can read own profile" on public.profiles;
create policy "Public can read own profile"
  on public.profiles
  for select
  using (true);

drop policy if exists "Service role full access on profiles" on public.profiles;
create policy "Service role full access on profiles"
  on public.profiles
  for all
  to service_role
  using (true)
  with check (true);

-- ==========================================================
-- 2. EMAIL OTPS
-- ==========================================================
create table if not exists public.email_otps (
  id uuid primary key default uuid_generate_v4(),
  email text not null,
  otp_hash text not null,
  purpose text not null default 'login' check (purpose in ('login', 'signup', 'reset')),
  attempts int not null default 0,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_email_otps_email on public.email_otps (lower(email), purpose);
create index if not exists idx_email_otps_expires on public.email_otps (expires_at);

alter table public.email_otps enable row level security;

drop policy if exists "Service role full access on email_otps" on public.email_otps;
create policy "Service role full access on email_otps"
  on public.email_otps
  for all
  to service_role
  using (true)
  with check (true);

-- ==========================================================
-- 3. ORDERS ENHANCEMENTS & INDEXES
-- ==========================================================
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  order_reference text unique not null,
  customer_name text not null,
  phone text not null,
  address text,
  items jsonb not null default '[]'::jsonb,
  total_amount numeric(10, 2) not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.orders add column if not exists user_id uuid references public.profiles(id) on delete set null;
alter table public.orders add column if not exists email text;
alter table public.orders add column if not exists city text default 'Bareilly';
alter table public.orders add column if not exists pincode text;
alter table public.orders add column if not exists subtotal numeric(10, 2) not null default 0;
alter table public.orders add column if not exists shipping_fee numeric(10, 2) not null default 0;
alter table public.orders add column if not exists payment_status text not null default 'unpaid';
alter table public.orders add column if not exists payment_method text default 'cod';
alter table public.orders add column if not exists admin_notes text;
alter table public.orders add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now()) not null;

create index if not exists idx_orders_created_at on public.orders (created_at desc);
create index if not exists idx_orders_status_created on public.orders (status, created_at desc);
create index if not exists idx_orders_user_id on public.orders (user_id, created_at desc);

alter table public.orders enable row level security;

drop policy if exists "Public users can submit orders" on public.orders;
create policy "Public users can submit orders"
  on public.orders
  for insert
  with check (true);

drop policy if exists "Admin service role has full access to orders" on public.orders;
create policy "Admin service role has full access to orders"
  on public.orders
  for all
  to service_role
  using (true)
  with check (true);

-- ==========================================================
-- 4. PAYMENTS TABLE (With Idempotency)
-- ==========================================================
create table if not exists public.payments (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  idempotency_key text unique not null,
  amount numeric(10, 2) not null,
  currency text not null default 'INR',
  status text not null default 'initiated' check (status in ('initiated', 'processing', 'successful', 'failed', 'refunded')),
  payment_method text not null default 'upi',
  gateway_name text default 'razorpay',
  gateway_payment_id text,
  gateway_order_id text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_payments_order_id on public.payments (order_id);
create index if not exists idx_payments_status on public.payments (status, created_at desc);
create index if not exists idx_payments_idempotency on public.payments (idempotency_key);

alter table public.payments enable row level security;

drop policy if exists "Service role full access on payments" on public.payments;
create policy "Service role full access on payments"
  on public.payments
  for all
  to service_role
  using (true)
  with check (true);
