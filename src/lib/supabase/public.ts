import "server-only";

import { createClient } from "@supabase/supabase-js";

/**
 * Anonymous, cookie-less Supabase client for PUBLIC reads from Server
 * Components. RLS applies as `anon` (e.g. tap_list_items public-read returns
 * only visible rows). No `cookies()` call, so callers stay statically
 * cacheable (used inside `unstable_cache`).
 */
export function getPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false } }
  );
}
