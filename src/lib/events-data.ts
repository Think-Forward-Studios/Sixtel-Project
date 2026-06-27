import "server-only";

import { unstable_cache } from "next/cache";

import { getServiceClient } from "@/lib/supabase/server";

export type PublicEvent = {
  id: string;
  title: string;
  description: string | null;
  startsAt: string;
  endsAt: string | null;
  isMembersOnly: boolean;
  coverImagePath: string | null;
  externalRsvpUrl: string | null;
};

/** Cache tag for the public events read — admin writes call revalidatePath. */
export const EVENTS_CACHE_TAG = "events";

/**
 * Published events for the public site, soonest-first. Read with the SERVICE
 * client (not anon) on purpose: the `events` RLS exposes only
 * `published AND NOT is_members_only` to anon, but the public list shows
 * members-only events with a "Members only" badge (no member-session gating
 * yet — that's the /join workstream). The table's own design comment
 * anticipates this server-side read. We filter `published = true` explicitly
 * since the service client bypasses RLS — never expose drafts.
 */
export const getPublishedEvents = unstable_cache(
  async (): Promise<PublicEvent[]> => {
    const supabase = getServiceClient();
    const { data } = await supabase
      .from("events")
      .select(
        "id, title, description, starts_at, ends_at, is_members_only, cover_image_path, external_rsvp_url"
      )
      .eq("published", true)
      .order("starts_at", { ascending: true });
    return (data ?? []).map((r) => ({
      id: r.id as string,
      title: r.title as string,
      description: (r.description as string | null) ?? null,
      startsAt: r.starts_at as string,
      endsAt: (r.ends_at as string | null) ?? null,
      isMembersOnly: Boolean(r.is_members_only),
      coverImagePath: (r.cover_image_path as string | null) ?? null,
      externalRsvpUrl: (r.external_rsvp_url as string | null) ?? null,
    }));
  },
  ["published-events"],
  { tags: [EVENTS_CACHE_TAG], revalidate: 30 }
);

/** Upcoming published events (starts_at >= now), soonest-first — for the home Events section. */
export async function getUpcomingEvents(limit?: number): Promise<PublicEvent[]> {
  const now = Date.now();
  const upcoming = (await getPublishedEvents()).filter(
    (e) => new Date(e.startsAt).getTime() >= now
  );
  return typeof limit === "number" ? upcoming.slice(0, limit) : upcoming;
}
