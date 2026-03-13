// src/lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Client public (lecture seule, RLS appliqué)
// Returns a dummy client during build if env vars are not set
export const supabase: SupabaseClient = url && anon
  ? createClient(url, anon)
  : (null as unknown as SupabaseClient);

// Client admin (service_role, bypass RLS — server-side uniquement)
export const supabaseAdmin: SupabaseClient | null = url && serviceRole
  ? createClient(url, serviceRole)
  : null;
