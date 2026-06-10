import "server-only";

import { unstable_cache } from "next/cache";

import { getPublicClient } from "@/lib/supabase/public";

export type PublicAnnouncement = {
  id: string;
  title: string;
  body: string | null;
  linkUrl: string | null;
  linkLabel: string | null;
};

/** Cache tag for the active-announcement read — admin writes call revalidatePath('/'). */
export const ANNOUNCEMENTS_CACHE_TAG = "announcements";

/**
 * The single active announcement (or null). Uses the anon client — the
 * `announcements` RLS public-read policy exposes only the active row
 * (`using (is_active)`), and the partial unique index guarantees at most one.
 * Cached + 30s ISR so the home page stays static and refreshes on activation.
 */
export const getActiveAnnouncement = unstable_cache(
  async (): Promise<PublicAnnouncement | null> => {
    const supabase = getPublicClient();
    const { data } = await supabase
      .from("announcements")
      .select("id, title, body, link_url, link_label")
      .eq("is_active", true)
      .maybeSingle();
    if (!data) return null;
    return {
      id: data.id as string,
      title: data.title as string,
      body: (data.body as string | null) ?? null,
      linkUrl: (data.link_url as string | null) ?? null,
      linkLabel: (data.link_label as string | null) ?? null,
    };
  },
  ["active-announcement"],
  { tags: [ANNOUNCEMENTS_CACHE_TAG], revalidate: 30 }
);
