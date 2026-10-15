import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Browser-side Supabase client.
 * Safe to use in Client Components. RLS policies protect all data.
 */
// Singleton for browser-side Supabase client
let _client: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  if (!_client) {
    _client = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  return _client;
}

export function getSupabaseClient() {
  return createClient();
}
