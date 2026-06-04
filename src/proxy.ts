import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Next 16 Proxy (the renamed `middleware`). Gates the admin portal:
 * - Refreshes the Supabase auth session cookie on every matched request
 *   (the @supabase/ssr SSR pattern).
 * - Redirects signed-out users away from protected /admin/** routes to the
 *   login page; redirects signed-in users away from the login page.
 *
 * Self-contained on purpose: per the proxy convention it should not rely on
 * shared app modules/globals. Authn/authz is ALSO enforced in server code
 * (requireAdmin), since a proxy matcher can skip Server Function calls.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Must be called to refresh an expired session before rendering.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isPublicAdminPath =
    pathname === "/admin/login" || pathname.startsWith("/admin/auth");

  // Helper: redirect while preserving any refreshed auth cookies.
  const redirectTo = (path: string) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = "";
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  };

  // Signed-out user hitting a protected admin route -> login.
  if (!user && !isPublicAdminPath) {
    return redirectTo("/admin/login");
  }

  // Signed-in user hitting the login page -> dashboard.
  if (user && pathname === "/admin/login") {
    return redirectTo("/admin");
  }

  return response;
}

export const config = {
  // Only run on the admin portal. (Auth is still enforced in server code.)
  matcher: ["/admin", "/admin/:path*"],
};
