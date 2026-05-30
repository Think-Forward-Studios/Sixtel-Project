import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/server";

// Next 16: GET route handlers are dynamic (uncached) by default, and this one
// performs a live DB query, so it always runs at request time. No `dynamic`
// route-config is needed here (and omitting it avoids a conflict if Cache
// Components is enabled later).

export async function GET() {
  try {
    const supabase = getServiceClient();
    const { error } = await supabase
      .from("members_cache")
      .select("id", { count: "exact", head: true });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json({ ok: true, supabase: "connected" });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
