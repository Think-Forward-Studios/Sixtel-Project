// Local-only seed: resets the `events` table to a small demo set (a mix of
// upcoming + past, one members-only), in Sixtel's voice (asset inventory §4/§5).
// Re-runnable: deletes existing rows first, then inserts. Local-only.
//
//   node --env-file=.env.local scripts/seed-events.mjs
//
// Staging/prod are NOT seeded by this script — the admin adds events via
// /admin/events once the first-admin bootstrap is done.
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SECRET_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local");
  process.exit(1);
}
if (!/(127\.0\.0\.1|localhost)/.test(url)) {
  console.error(`Refusing to seed a non-local Supabase project: ${url}`);
  process.exit(1);
}

// Dates are relative to "now" so the Upcoming/Past tabs always demo correctly.
const now = new Date();
function at(daysFromNow, hour, minute = 0) {
  const d = new Date(now);
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

const EVENTS = [
  {
    title: "Weekend Wine Slushie Flight",
    description:
      "🍦 Four rotating wine-slushie flavors, one frosty flight. Recent pours: Green Apple, Hurricane, Mango, and Strawberry. Fri & Sat while it lasts.",
    starts_at: at(2, 17),
    ends_at: at(2, 22),
    is_members_only: false,
    cover_image_path: "/photos/events/slushies.jpg",
    external_rsvp_url: null,
    published: true,
  },
  {
    title: "Top Trivia: Name That Tune",
    description:
      "🎶 Test your ears at **Top Trivia: Name That Tune**. Teams welcome, prizes for the top three, free to play. Get here early for a table.",
    starts_at: at(3, 19),
    ends_at: at(3, 21),
    is_members_only: false,
    cover_image_path: "/photos/events/trivia.jpg",
    external_rsvp_url: null,
    published: true,
  },
  {
    title: "Mini Sixtel Menu Launch — Annie's Cafe Collab",
    description:
      "🚨 **BIG NEWS** — the Mini Sixtel Menu is here, in collaboration with **Annie's Cafe**. Three shareable apps and the Sixtel Smash Burger. Come hungry.",
    starts_at: at(5, 12),
    ends_at: null,
    is_members_only: false,
    cover_image_path: "/photos/events/annies-menu.jpg",
    external_rsvp_url: "https://www.facebook.com/SixtelBottleandGrowlerHouse/",
    published: true,
  },
  {
    title: "Members' Cellar Reserve Tasting",
    description:
      "🥃 A members-only pour of rare cellar reserves. **Sixtel Rewards** members — watch your inbox for the RSVP. Limited seats.",
    starts_at: at(16, 19),
    ends_at: at(16, 21),
    is_members_only: true,
    cover_image_path: null,
    external_rsvp_url: null,
    published: true,
  },
  {
    title: "Heroes for Humanity Community Care Event",
    description:
      "🇺🇸 Thank you to everyone who came out. At Sixtel Bottle & Growler House, community has always meant more to us than just beer.",
    starts_at: at(-18, 11),
    ends_at: at(-18, 15),
    is_members_only: false,
    cover_image_path: null,
    external_rsvp_url: null,
    published: true,
  },
];

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

const { error: delErr } = await supabase
  .from("events")
  .delete()
  .neq("id", "00000000-0000-0000-0000-000000000000");
if (delErr) {
  console.error("Reset (delete) failed:", delErr.message);
  process.exit(1);
}

const { error } = await supabase.from("events").insert(EVENTS);
if (error) {
  console.error("Seed failed:", error.message);
  process.exit(1);
}
console.log(`Reset + seeded ${EVENTS.length} events (${EVENTS.filter((e) => e.is_members_only).length} members-only).`);
