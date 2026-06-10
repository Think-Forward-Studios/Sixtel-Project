-- media_assets: catalog of uploaded images across the Storage buckets.
-- (NOTE: reconstructed from the Sprint 4a kickoff field list + the existing
-- storage_buckets migration pattern — the build plan §3.2 doc was unreadable
-- at build time (iCloud EPERM). Diff against §3.2 if anything looks off.)
create table media_assets (
  id                uuid primary key default gen_random_uuid(),
  bucket            text not null,
  storage_path      text not null,
  original_filename text,
  alt_text          text,
  mime_type         text,
  size_bytes        integer,
  width             integer,
  height            integer,
  uploaded_by       uuid references auth.users(id),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- One catalog row per stored object.
create unique index media_assets_bucket_path_key
  on media_assets (bucket, storage_path);

create trigger media_assets_set_updated_at
  before update on media_assets
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- Two new public buckets. The catalog also indexes the existing
-- tap-list-images + event-covers buckets (created in the initial migration).
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media-library', 'media-library', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('announcement-covers', 'announcement-covers', true)
on conflict (id) do nothing;

-- Storage writes: active admins only (reads are public via the bucket flag).
-- Mirrors storage_admin_write_tap_list_images / _event_covers.
create policy storage_admin_write_media_library
  on storage.objects
  for all
  to authenticated
  using ( bucket_id = 'media-library' and is_active_admin() )
  with check ( bucket_id = 'media-library' and is_active_admin() );

create policy storage_admin_write_announcement_covers
  on storage.objects
  for all
  to authenticated
  using ( bucket_id = 'announcement-covers' and is_active_admin() )
  with check ( bucket_id = 'announcement-covers' and is_active_admin() );

-- ------------------------------------------------------------
-- media_assets RLS: public read (metadata only; images are already public via
-- the bucket flag), admin write.
-- ------------------------------------------------------------
alter table media_assets enable row level security;

create policy media_assets_public_read
  on media_assets
  for select
  to anon, authenticated
  using ( true );

create policy media_assets_admin_all
  on media_assets
  for all
  to authenticated
  using ( is_active_admin() )
  with check ( is_active_admin() );
