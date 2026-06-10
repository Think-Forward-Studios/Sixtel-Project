// Local-only seed: populate tap_list_items with the current tap lineup so the
// public site (home teaser + /taps) and the /admin/taps manager have content.
// Idempotent: skips if the table already has rows.
//
//   node --env-file=.env.local scripts/seed-taps.mjs
//
// Staging/prod are NOT seeded by this script — the admin adds taps via
// /admin/taps once the first-admin bootstrap is done.
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

// The current lineup (mirrors the prior static src/lib/taps.ts).
const TAPS = [
  { name: "Orange Crush", brewery: "Hidden Springs Ale Works", style: "Wheat Beer", abv_percent: 5.2, ibu: null, label_image_url: "/photos/taps/tap-orange-crush.jpg" },
  { name: "ORNG Double IPA", brewery: "Wild Leap Brew Co.", style: "IPA — Hazy", abv_percent: 8.2, ibu: null, label_image_url: "/photos/taps/tap-orng.jpg" },
  { name: "Hey Girl Hey!", brewery: "Old Black Bear Brewing Co.", style: "Sour — Berliner Weisse", abv_percent: 4.6, ibu: null, label_image_url: "/photos/taps/tap-hey-girl-hey.jpg" },
  { name: "S'mores Stout", brewery: "Martin House Brewing Company", style: "Stout — Imperial", abv_percent: 9.2, ibu: null, label_image_url: "/photos/taps/tap-smores-stout.jpg" },
];

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

const { count, error: countErr } = await supabase
  .from("tap_list_items")
  .select("id", { count: "exact", head: true });
if (countErr) {
  console.error("Count failed:", countErr.message);
  process.exit(1);
}
if ((count ?? 0) > 0) {
  console.log(`tap_list_items already has ${count} row(s) — skipping seed.`);
  process.exit(0);
}

const rows = TAPS.map((t, i) => ({ ...t, position: i + 1, source: "manual", is_visible: true }));
const { error } = await supabase.from("tap_list_items").insert(rows);
if (error) {
  console.error("Seed failed:", error.message);
  process.exit(1);
}
console.log(`Seeded ${rows.length} taps into tap_list_items.`);
