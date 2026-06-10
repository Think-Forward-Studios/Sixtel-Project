import "server-only";

import { unstable_cache } from "next/cache";

import { getPublicClient } from "@/lib/supabase/public";

export type PublicTap = {
  id: string;
  name: string;
  brewery: string | null;
  style: string | null;
  abvPercent: number | null;
  labelImageUrl: string | null;
};

/** Cache tag for the public taps read — admin writes call revalidateTag(TAPS_CACHE_TAG). */
export const TAPS_CACHE_TAG = "taps";

/**
 * Visible taps for the public site (home teaser + /taps), ordered by position.
 * Cached + tagged so the marketing pages stay static and refresh when an admin
 * edits the list (via revalidateTag / revalidatePath in the admin actions).
 */
export const getVisibleTaps = unstable_cache(
  async (): Promise<PublicTap[]> => {
    const supabase = getPublicClient();
    const { data } = await supabase
      .from("tap_list_items")
      .select("id, name, brewery, style, abv_percent, label_image_url")
      .eq("is_visible", true)
      .order("position", { ascending: true });
    return (data ?? []).map((r) => ({
      id: r.id as string,
      name: r.name as string,
      brewery: (r.brewery as string | null) ?? null,
      style: (r.style as string | null) ?? null,
      abvPercent: (r.abv_percent as number | null) ?? null,
      labelImageUrl: (r.label_image_url as string | null) ?? null,
    }));
  },
  ["visible-taps"],
  { tags: [TAPS_CACHE_TAG], revalidate: 30 }
);
