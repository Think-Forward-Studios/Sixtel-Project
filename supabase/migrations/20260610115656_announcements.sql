-- announcements: single-banner content. Multiple rows can exist as drafts,
-- but at most ONE row may be active at any time (enforced by partial unique index).
create table announcements (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  body        text,                                  -- short Markdown body, 1–2 sentences
  link_url    text,                                  -- optional CTA URL
  link_label  text,                                  -- optional CTA label (required when link_url is set)
  is_active   boolean not null default false,
  author_id   uuid references auth.users(id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Enforce at most one active banner at any time. Partial unique index on
-- is_active = true means a second row trying to be active fails at the DB.
create unique index announcements_only_one_active
  on announcements (is_active)
  where is_active = true;

create trigger announcements_set_updated_at
  before update on announcements
  for each row execute function set_updated_at();

alter table announcements enable row level security;

-- Public reads only the active banner
create policy announcements_public_read
  on announcements for select
  to anon, authenticated
  using (is_active);

-- Admins manage everything
create policy announcements_admin_all
  on announcements for all
  to authenticated
  using ( is_active_admin() )
  with check ( is_active_admin() );
