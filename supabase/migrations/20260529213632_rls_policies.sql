-- ============================================================
-- Sixtel RLS policies
-- ============================================================
--
-- Conventions:
--   * Every table has RLS enabled.
--   * service_role bypasses RLS (this is Supabase's built-in
--     behavior — we don't need to grant it explicitly).
--   * Member-facing data is gated by our application's own
--     session check on the server side; we do NOT use Supabase
--     Auth for members. So for member-related tables, the
--     policy is essentially: anon and authenticated cannot
--     read or write anything; only service_role can. That's
--     a tight default — every member-facing read goes through
--     a server endpoint that holds the service_role key.
--   * Admin-facing data is gated by Supabase Auth: a row in
--     admin_profiles with is_active = true grants access.

-- ------------------------------------------------------------
-- members_cache: server-only access.
-- ------------------------------------------------------------
alter table members_cache enable row level security;

-- No anon or authenticated policies = no access for either.
-- service_role bypasses RLS automatically.

-- ------------------------------------------------------------
-- consent_records: server-only access.
-- ------------------------------------------------------------
alter table consent_records enable row level security;
-- No anon/authenticated policies. Server holds the artifact.

-- ------------------------------------------------------------
-- admin_profiles: a Supabase-authenticated user can read their
-- own profile only. Writes go through server endpoints using
-- the service_role.
-- ------------------------------------------------------------
alter table admin_profiles enable row level security;

create policy admin_profiles_read_own
  on admin_profiles
  for select
  to authenticated
  using ( id = (select auth.uid()) );

-- Helper function: is the current Supabase Auth user an active admin?
-- This gets re-used in every admin-facing table policy below.
create or replace function is_active_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1 from admin_profiles
    where id = (select auth.uid())
      and is_active = true
  );
$$;

-- security definer + set search_path is the safe pattern for
-- helper functions used inside RLS policies. The function runs
-- as the function owner (postgres, here), which gives it the
-- ability to read admin_profiles regardless of the caller's
-- own RLS. The explicit search_path prevents an attacker from
-- shadowing 'public' with a malicious schema.

-- ------------------------------------------------------------
-- passport_definitions: admins can read/write.
-- Anonymous visitors can read active, published passports too,
-- so the public /rewards/passports page works without auth.
-- ------------------------------------------------------------
alter table passport_definitions enable row level security;

create policy passport_definitions_public_read
  on passport_definitions
  for select
  to anon, authenticated
  using ( is_active and (start_at is null or start_at <= now()) and (end_at is null or end_at >= now()) );

create policy passport_definitions_admin_all
  on passport_definitions
  for all
  to authenticated
  using ( is_active_admin() )
  with check ( is_active_admin() );

-- ------------------------------------------------------------
-- passport_criteria: admin-only.
-- ------------------------------------------------------------
alter table passport_criteria enable row level security;

create policy passport_criteria_admin_all
  on passport_criteria
  for all
  to authenticated
  using ( is_active_admin() )
  with check ( is_active_admin() );

-- ------------------------------------------------------------
-- passport_progress: admin-only via Supabase Auth.
-- Members read their own progress through the server endpoint
-- (service_role bypass), not through the SDK.
-- ------------------------------------------------------------
alter table passport_progress enable row level security;

create policy passport_progress_admin_read
  on passport_progress
  for select
  to authenticated
  using ( is_active_admin() );

-- No write policy: writes are server-side (passport credit pipeline).

-- ------------------------------------------------------------
-- passport_completions: same pattern as passport_progress.
-- ------------------------------------------------------------
alter table passport_completions enable row level security;

create policy passport_completions_admin_read
  on passport_completions
  for select
  to authenticated
  using ( is_active_admin() );

-- ------------------------------------------------------------
-- events: published events are public-readable.
-- ------------------------------------------------------------
alter table events enable row level security;

create policy events_public_read_published
  on events
  for select
  to anon, authenticated
  using ( published and not is_members_only );

-- Members-only events visible to authenticated admins only via
-- this policy; for member viewing, the server fetches with
-- service_role after our session check.
create policy events_admin_all
  on events
  for all
  to authenticated
  using ( is_active_admin() )
  with check ( is_active_admin() );

-- ------------------------------------------------------------
-- event_rsvps: writes are server-side; admin reads only.
-- ------------------------------------------------------------
alter table event_rsvps enable row level security;

create policy event_rsvps_admin_read
  on event_rsvps
  for select
  to authenticated
  using ( is_active_admin() );

-- ------------------------------------------------------------
-- tap_list_items: visible items are public-readable. Admin writes.
-- ------------------------------------------------------------
alter table tap_list_items enable row level security;

create policy tap_list_public_read
  on tap_list_items
  for select
  to anon, authenticated
  using ( is_visible );

create policy tap_list_admin_all
  on tap_list_items
  for all
  to authenticated
  using ( is_active_admin() )
  with check ( is_active_admin() );

-- ------------------------------------------------------------
-- webhook_events: server-only. Webhook handler uses service_role.
-- ------------------------------------------------------------
alter table webhook_events enable row level security;

-- ------------------------------------------------------------
-- admin_adjustments: admin read access for audit; writes are
-- server-side from the admin adjust-points endpoint.
-- ------------------------------------------------------------
alter table admin_adjustments enable row level security;

create policy admin_adjustments_admin_read
  on admin_adjustments
  for select
  to authenticated
  using ( is_active_admin() );
