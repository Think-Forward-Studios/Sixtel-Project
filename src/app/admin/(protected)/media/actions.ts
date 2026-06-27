"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin/auth";
import { getServerAuthClient } from "@/lib/supabase/server-auth";
import {
  ACCEPTED_MIME,
  MAX_UPLOAD_BYTES,
  isValidBucket,
  mediaPublicUrl,
  type MediaAsset,
} from "@/lib/media-schema";

export type MediaActionResult = { ok: true } | { ok: false; error: string };

export type MediaRef = { kind: "Tap" | "Event"; id: string; title: string };
export type DeleteMediaResult =
  | { ok: true }
  | { ok: false; error: string }
  | { ok: false; references: MediaRef[] };

type CreateInput = {
  bucket: string;
  storage_path: string;
  original_filename: string;
  alt_text: string;
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
};

// Records a media asset AFTER the client has uploaded the object to Storage.
// Re-validates server-side (defense-in-depth); RLS enforces admin-only.
// Returns the created id so the picker can select it immediately.
export async function createMediaAsset(
  input: CreateInput
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const admin = await requireAdmin();
  if (!isValidBucket(input.bucket)) return { ok: false, error: "Unknown bucket." };
  if (!ACCEPTED_MIME.includes(input.mime_type)) return { ok: false, error: "Unsupported file type." };
  if (!input.size_bytes || input.size_bytes > MAX_UPLOAD_BYTES) return { ok: false, error: "File too large." };
  if (!input.storage_path) return { ok: false, error: "Missing upload path." };

  const supabase = await getServerAuthClient();
  const { data, error } = await supabase
    .from("media_assets")
    .insert({
      bucket: input.bucket,
      storage_path: input.storage_path,
      original_filename: input.original_filename,
      alt_text: input.alt_text.trim() || null,
      mime_type: input.mime_type,
      size_bytes: input.size_bytes,
      width: input.width,
      height: input.height,
      uploaded_by: admin.id,
    })
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/media");
  return { ok: true, id: data?.id as string };
}

// Library list for a bucket — drives the MediaPicker grid.
export async function listMediaAssets(bucket: string): Promise<MediaAsset[]> {
  await requireAdmin();
  const supabase = await getServerAuthClient();
  const { data } = await supabase
    .from("media_assets")
    .select(
      "id, bucket, storage_path, original_filename, alt_text, mime_type, size_bytes, width, height, created_at"
    )
    .eq("bucket", bucket)
    .order("created_at", { ascending: false })
    .limit(100);
  return (data ?? []) as MediaAsset[];
}

export async function updateMediaAltText(id: string, altText: string): Promise<MediaActionResult> {
  await requireAdmin();
  const supabase = await getServerAuthClient();
  const { error } = await supabase
    .from("media_assets")
    .update({ alt_text: altText.trim() || null })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/media");
  return { ok: true };
}

// §9.5: delete with reference check. Without `force`, returns the referencing
// taps/events instead of deleting. With `force`, nulls those references first,
// then removes the Storage object and the catalog row.
export async function deleteMediaAsset(id: string, force = false): Promise<DeleteMediaResult> {
  await requireAdmin();
  const supabase = await getServerAuthClient();
  const { data, error: selErr } = await supabase
    .from("media_assets")
    .select("bucket, storage_path")
    .eq("id", id)
    .maybeSingle();
  if (selErr) return { ok: false, error: selErr.message };
  if (!data) return { ok: false, error: "Media asset not found." };

  const bucket = data.bucket as string;
  const storagePath = data.storage_path as string;
  const url = mediaPublicUrl(bucket, storagePath);

  // Reference check against the public surfaces that store image URLs.
  const refs: MediaRef[] = [];
  const { data: taps } = await supabase
    .from("tap_list_items")
    .select("id, name")
    .eq("label_image_url", url);
  for (const t of taps ?? []) refs.push({ kind: "Tap", id: t.id as string, title: t.name as string });
  const { data: events } = await supabase
    .from("events")
    .select("id, title")
    .eq("cover_image_path", url);
  for (const e of events ?? []) refs.push({ kind: "Event", id: e.id as string, title: e.title as string });

  if (refs.length > 0 && !force) return { ok: false, references: refs };

  if (refs.length > 0) {
    // Null the referencing fields so they don't point at a deleted object.
    await supabase.from("tap_list_items").update({ label_image_url: null }).eq("label_image_url", url);
    await supabase.from("events").update({ cover_image_path: null }).eq("cover_image_path", url);
  }

  const { error: rmErr } = await supabase.storage.from(bucket).remove([storagePath]);
  if (rmErr) return { ok: false, error: `Storage delete failed: ${rmErr.message}` };
  const { error: delErr } = await supabase.from("media_assets").delete().eq("id", id);
  if (delErr) return { ok: false, error: delErr.message };

  revalidatePath("/admin/media");
  if (refs.length > 0) {
    // Single-page site: the Taps + Events sections render on "/".
    revalidatePath("/");
  }
  return { ok: true };
}
