-- ==========================================================
-- Saasu Maa: Password Auth Migration (idempotent)
-- Run once in Supabase SQL editor
-- ==========================================================

-- Add password_hash column (null = passwordless-only account)
alter table public.profiles
  add column if not exists password_hash text default null;

-- Index for fast email lookup during password login
create index if not exists idx_profiles_email_pw
  on public.profiles (lower(email))
  where password_hash is not null;
