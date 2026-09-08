-- ==========================================================
-- Saasu Maa Ka Achaar: Supabase Database Schema
-- Run this script in the Supabase SQL Editor
-- ==========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PRODUCTS TABLE
create table if not exists public.products (
  id text primary key,
  name text not null,
  hindi_name text not null,
  category text not null,
  tagline text,
  description text,
  price numeric(10, 2) not null,
  weight text not null,
  in_stock boolean default true,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for products
alter table public.products enable row level security;

-- Policy: Anyone (anon/public) can view in-stock products
create policy "Public users can view products"
  on public.products
  for select
  using (true);

-- Policy: Only service_role (admin) can insert, update, or delete products
create policy "Admin service role can manage products"
  on public.products
  for all
  to service_role
  using (true)
  with check (true);

-- 2. ORDERS TABLE
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  order_reference text unique not null,
  customer_name text not null,
  phone text not null,
  address text,
  items jsonb not null default '[]'::jsonb,
  total_amount numeric(10, 2) not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for orders
alter table public.orders enable row level security;

-- Policy: Anyone (anon) can submit an order
create policy "Public users can submit orders"
  on public.orders
  for insert
  with check (true);

-- Policy: Only service_role (admin) can view and manage all orders
create policy "Admin service role has full access to orders"
  on public.orders
  for all
  to service_role
  using (true)
  with check (true);

-- 3. SEED PRODUCTS
insert into public.products (id, name, hindi_name, category, tagline, description, price, weight, in_stock)
values
  ('aam-achaar', 'Aam Ka Achaar', 'आम का अचार', 'Mango', 'Desi Ramkela mangoes in wood-pressed mustard oil', 'Handcrafted with raw ramkela mangoes, cold-pressed mustard oil, and grandma’s secret spice blend.', 249.00, '500g', true),
  ('meetha-aam', 'Meetha Aam Achaar', 'मीठा आम अचार', 'Mango', 'Sweet, tangy, sun-cooked traditional mango chunda', 'Slow-cooked in sunlight with jaggery, cardamom, and gentle Indian spices.', 279.00, '500g', true),
  ('mix-achaar', 'Mix Achaar', 'मिक्स अचार', 'Classic', 'Crunchy seasonal vegetables in spicy brine', 'Crunchy carrots, raw mango, cauliflower, and green chillies pickled to perfection.', 239.00, '500g', true),
  ('hari-mirch', 'Hari Mirch Achaar', 'हरी मिर्च अचार', 'Spicy', 'Zesty green chillies with crushed mustard and amchur', 'Stuffed and marinated pungent green chillies with roasted cumin and crushed rai.', 219.00, '400g', true),
  ('nimbu-achaar', 'Nimbu Achaar', 'नींबू अचार', 'Digestive', 'Oil-free, aged tangy lemon pickle', 'Sun-matured thin-skinned juicy lemons infused with rock salt, hing, and ajwain.', 229.00, '500g', true),
  ('lahsun-achaar', 'Lahsun Achaar', 'लहसुन अचार', 'Spicy', 'Aromatic garlic cloves steeped in mustard sauce', 'Whole desi garlic cloves steeped in roasted spices and pure mustard oil.', 269.00, '400g', true),
  ('kathal-achaar', 'Kathal Achaar', 'कटहल अचार', 'Special', 'Tender baby raw jackfruit marinated with rich spices', 'Meaty raw jackfruit pieces seasoned with traditional Uttar Pradesh pickling recipe.', 289.00, '500g', true),
  ('karonda-achaar', 'Karonda Achaar', 'करोंदा अचार', 'Special', 'Rare wild natal plum with fiery green chillies', 'Crisp, sour tart berries balanced with turmeric, fenugreek, and split mustard seeds.', 259.00, '400g', true)
on conflict (id) do update set
  price = excluded.price,
  weight = excluded.weight,
  tagline = excluded.tagline;
