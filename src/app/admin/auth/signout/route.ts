import { NextResponse, type NextRequest } from "next/server";

import { getServerAuthClient } from "@/lib/supabase/server-auth";

// POST target for the Sign Out button. Clears the Supabase session and sends
// the user back to the public site. 303 turns the POST into a GET redirect.
export async function POST(request: NextRequest) {
  const supabase = await getServerAuthClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
