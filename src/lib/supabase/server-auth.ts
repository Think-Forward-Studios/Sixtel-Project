import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Cookie-aware Supabase client for SERVER COMPONENTS and ROUTE HANDLERS.
 *
 * Uses the PUBLISHABLE (anon) key + the signed-in user's session cookies, so
 * RLS applies as that user (this is what `is_active_admin()` checks via
 * `auth.uid()`). This is distinct from `./server.ts` `getServiceClient()`,
 * which uses the SECRET key and bypasses RLS for trusted server work.
 *
 * Next 16: `cookies()` is async — await it.
 */
export async function getServerAuthClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // `setAll` was called from a Server Component, where the cookie
            // store is read-only. Safe to ignore: the proxy (src/proxy.ts)
            // refreshes the auth cookie on every request.
          }
        },
      },
    }
  );
}
