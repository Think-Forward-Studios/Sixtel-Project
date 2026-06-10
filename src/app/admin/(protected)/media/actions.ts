"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin/auth";
import { getServerAuthClient } from "@/lib/supabase/server-auth";
import { ACCEPTED_MIME, MAX_UPLOAD_BYTES, isValidBucket } from "@/lib/media-schema";

export type MediaActionResult = { ok: true } | { ok: false; error: string };

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
export async function createMediaAsset(input: CreateInput): Promise<MediaActionResult> {
  const admin = await requireAdmin();
  if (!isValidBucket(input.bucket)) return { ok: false, error: "Unknown bucket." };
  if (!ACCEPTED_MIME.includes(input.mime_type)) return { ok: false, error: "Unsupported file type." };
  if (!input.size_bytes || input.size_bytes > MAX_UPLOAD_BYTES) return { ok: false, error: "File too large." };
  if (!input.storage_path) return { ok: false, error: "Missing upload path." };

  const supabase = await getServerAuthClient();
  const { error } = await supabase.from("media_assets").insert({
    bucket: input.bucket,
    storage_path: input.storage_path,
    original_filename: input.original_filename,
    alt_text: input.alt_text.trim() || null,
    mime_type: input.mime_type,
    size_bytes: input.size_bytes,
    width: input.width,
    height: input.height,
    uploaded_by: admin.id,
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/media");
  return { ok: true };
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

// Removes the Storage object AND the catalog row (object first, then row).
export async function deleteMediaAsset(id: string): Promise<MediaActionResult> {
  await requireAdmin();
  const supabase = await getServerAuthClient();
  const { data, error: selErr } = await supabase
    .from("media_assets")
    .select("bucket, storage_path")
    .eq("id", id)
    .maybeSingle();
  if (selErr) return { ok: false, error: selErr.message };
  if (!data) return { ok: false, error: "Media asset not found." };

  const { error: rmErr } = await supabase.storage
    .from(data.bucket as string)
    .remove([data.storage_path as string]);
  if (rmErr) return { ok: false, error: `Storage delete failed: ${rmErr.message}` };

  const { error: delErr } = await supabase.from("media_assets").delete().eq("id", id);
  if (delErr) return { ok: false, error: delErr.message };
  revalidatePath("/admin/media");
  return { ok: true };
}
