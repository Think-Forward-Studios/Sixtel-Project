"use client";
import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client. Uses the PUBLISHABLE key (safe to expose),
 * and is subject to Row-Level Security.
 */
export function getBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
