// Local-only seed: resets tap_list_items to the canonical 12-tap demo lineup
// (the live Untappd list captured 2026-05-29, per Sixtel_Asset_Inventory.md §3).
// Re-runnable: deletes existing rows first, then inserts the 12. Local-only.
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

// Live lineup (Untappd, 2026-05-29, 1:13 PM). label_image_url is set only for
// the 4 labels we have on disk; the rest render a placeholder until the
// MediaPicker lands (Sprint 4).
const TAPS = [
  { name: "Stone Buenaveza Salt & Lime Lager", brewery: "Stone Brewing", style: "Lager — Mexican", abv_percent: 4.7, label_image_url: null },
  { name: "Orange Crush", brewery: "Hidden Springs Ale Works", style: "Wheat Beer — Other", abv_percent: 5.2, label_image_url: "/photos/taps/tap-orange-crush.jpg" },
  { name: "Ruby", brewery: "Fat Bottom Brewing Co.", style: "Red Ale — American Amber / Red", abv_percent: 5.3, label_image_url: null },
  { name: "Daddy Juice", brewery: "Aslin Beer Company", style: "Sour — Fruited", abv_percent: 6.0, label_image_url: null },
  { name: "Hey Girl Hey!", brewery: "Old Black Bear Brewing Co.", style: "Sour — Fruited Berliner Weisse", abv_percent: 4.6, label_image_url: "/photos/taps/tap-hey-girl-hey.jpg" },
  { name: "SIPS: Two Fingers Blue", brewery: "Parish Brewing Co.", style: "Sour — Fruited Berliner Weisse", abv_percent: 4.8, label_image_url: null },
  { name: "Cherry Limeade", brewery: "Ciderboys Hard Cider", style: "Cider — Other Fruit", abv_percent: 5.0, label_image_url: null },
  { name: "Sorbet", brewery: "Aslin Beer Company", style: "IPA — Milkshake", abv_percent: 6.5, label_image_url: null },
  { name: "ORNG Double IPA", brewery: "Wild Leap Brew Co.", style: "IPA — Imperial / Hazy", abv_percent: 8.2, label_image_url: "/photos/taps/tap-orng.jpg" },
  { name: "Lunch", brewery: "Maine Beer Company", style: "IPA — American", abv_percent: 7.0, label_image_url: null },
  { name: "Crema Stout", brewery: "Common Bond Brewers", style: "Stout — American", abv_percent: 7.2, label_image_url: null },
  { name: "S'mores Stout", brewery: "Martin House Brewing Company", style: "Stout — Imperial / Double", abv_percent: 9.2, label_image_url: "/photos/taps/tap-smores-stout.jpg" },
];

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

// Clean reset: delete all existing rows (service key bypasses RLS), then insert
// the canonical 12. PostgREST requires a filter on delete, so match all ids.
const { error: delErr } = await supabase
  .from("tap_list_items")
  .delete()
  .neq("id", "00000000-0000-0000-0000-000000000000");
if (delErr) {
  console.error("Reset (delete) failed:", delErr.message);
  process.exit(1);
}

const rows = TAPS.map((t, i) => ({ ...t, ibu: null, position: i + 1, source: "manual", is_visible: true }));
const { error } = await supabase.from("tap_list_items").insert(rows);
if (error) {
  console.error("Seed failed:", error.message);
  process.exit(1);
}
console.log(`Reset + seeded ${rows.length} taps into tap_list_items.`);
