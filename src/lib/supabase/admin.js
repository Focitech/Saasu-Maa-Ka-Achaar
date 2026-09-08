import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let adminInstance = null;

/**
 * Returns a Supabase client configured with the privileged service_role key.
 * STRICTLY SERVER-SIDE ONLY. Bypasses Row Level Security (RLS).
 * Use only in route handlers, server actions, or administrative backend tasks.
 */
export function getSupabaseAdmin() {
  if (typeof window !== 'undefined') {
    throw new Error('CRITICAL SECURITY ALERT: getSupabaseAdmin() cannot be called from client-side code.');
  }

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        'Supabase Admin Client: SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL is missing. Operating in mock/fallback mode.'
      );
    }
    return null;
  }

  if (!adminInstance) {
    adminInstance = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return adminInstance;
}
