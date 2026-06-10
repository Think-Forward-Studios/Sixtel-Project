import type { Metadata } from "next";

import { getServerAuthClient } from "@/lib/supabase/server-auth";
import type { AdminTap } from "@/lib/tap-schema";
import { TapsManager } from "./TapsManager";

export const metadata: Metadata = {
  title: "Tap list · Sixtel Admin",
};

export default async function AdminTapsPage() {
  // Read as the signed-in admin (RLS tap_list_admin_all returns all rows,
  // including hidden ones). The (protected) layout already gates access.
  const supabase = await getServerAuthClient();
  const { data } = await supabase
    .from("tap_list_items")
    .select(
      "id, position, name, brewery, style, abv_percent, ibu, label_image_url, is_visible"
    )
    .order("position", { ascending: true });

  const taps = (data ?? []) as AdminTap[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-sixtel-ink">Tap list</h1>
        <p className="text-sm text-muted-foreground">
          Drag rows to reorder. Toggle the eye to hide a tap from the public
          site without deleting it.
        </p>
      </div>
      <TapsManager initialTaps={taps} />
    </div>
  );
}
