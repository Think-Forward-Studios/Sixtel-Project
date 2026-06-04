// LOCAL-ONLY admin bootstrap for Sprint 0 testing.
//
//   node --env-file=.env.local scripts/seed-admin.mjs
//
// Creates (or finds) the auth user and upserts an active 'owner' row into
// admin_profiles. Mirrors the staging/prod bootstrap (Supabase dashboard
// invite + SQL insert) but for the local stack so the magic-link gate can be
// tested end-to-end via Mailpit. Refuses to run against a non-local project.
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;
const EMAIL = process.env.SEED_ADMIN_EMAIL ?? "sixtel@thinkforwardstudio.com";
const NAME = process.env.SEED_ADMIN_NAME ?? "Josh Bone";

if (!url || !secret) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY.");
  process.exit(1);
}
if (!/127\.0\.0\.1|localhost/.test(url)) {
  console.error(`Refusing to seed non-local Supabase (${url}). LOCAL ONLY.`);
  process.exit(1);
}

const admin = createClient(url, secret, { auth: { persistSession: false } });

let userId;
const created = await admin.auth.admin.createUser({
  email: EMAIL,
  email_confirm: true,
});
if (created.error) {
  const { data: list, error: listErr } = await admin.auth.admin.listUsers();
  if (listErr) {
    console.error("createUser + listUsers failed:", created.error.message, listErr.message);
    process.exit(1);
  }
  const found = list.users.find((u) => u.email === EMAIL);
  if (!found) {
    console.error("createUser failed and user not found:", created.error.message);
    process.exit(1);
  }
  userId = found.id;
  console.log("Auth user already existed:", userId);
} else {
  userId = created.data.user.id;
  console.log("Created auth user:", userId);
}

const { error: upErr } = await admin
  .from("admin_profiles")
  .upsert({ id: userId, display_name: NAME, role: "owner", is_active: true }, { onConflict: "id" });
if (upErr) {
  console.error("admin_profiles upsert failed:", upErr.message);
  process.exit(1);
}

console.log(`Seeded admin: ${EMAIL} (${NAME}, owner) -> ${userId}`);
