-- Create the two buckets we need.
-- Public buckets are readable by anyone via direct URL.
-- Private buckets require signed URLs or RLS policies on storage.objects.

insert into storage.buckets (id, name, public)
values ('tap-list-images', 'tap-list-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('event-covers', 'event-covers', true)
on conflict (id) do nothing;

-- RLS on the storage.objects table controls who can upload.
-- Reads are governed by the bucket's public flag (above).

-- Only active admins can upload, update, or delete.
create policy storage_admin_write_tap_list_images
  on storage.objects
  for all
  to authenticated
  using (
    bucket_id = 'tap-list-images' and is_active_admin()
  )
  with check (
    bucket_id = 'tap-list-images' and is_active_admin()
  );

create policy storage_admin_write_event_covers
  on storage.objects
  for all
  to authenticated
  using (
    bucket_id = 'event-covers' and is_active_admin()
  )
  with check (
    bucket_id = 'event-covers' and is_active_admin()
  );
