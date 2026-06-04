import { NextResponse, type NextRequest } from "next/server";

import { getServerAuthClient } from "@/lib/supabase/server-auth";

// Magic-link redirect target. Supabase appends ?code=... (PKCE); we exchange
// it for a session (sets the auth cookies) and land the admin at /admin.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await getServerAuthClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}/admin`);
    }
  }

  return NextResponse.redirect(`${origin}/admin/login?error=auth`);
}
