// Shared (client-safe) media types + helpers. No server-only imports.

export type MediaAsset = {
  id: string;
  bucket: string;
  storage_path: string;
  original_filename: string | null;
  alt_text: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  created_at: string;
};

// The four buckets, mapped to the filter chips. (media-library + announcement-covers
// added in the media_assets migration; tap-list-images + event-covers pre-exist.)
export const MEDIA_BUCKETS = [
  { id: "media-library", label: "Library" },
  { id: "tap-list-images", label: "Taps" },
  { id: "event-covers", label: "Events" },
  { id: "announcement-covers", label: "Announcements" },
] as const;

export type MediaBucketId = (typeof MEDIA_BUCKETS)[number]["id"];

export const ACCEPTED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

export function isValidBucket(b: string | undefined | null): b is MediaBucketId {
  return !!b && MEDIA_BUCKETS.some((x) => x.id === b);
}

/** Public Storage URL — buckets are public=true, so the direct URL serves the file. */
export function mediaPublicUrl(bucket: string, storagePath: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return `${base}/storage/v1/object/public/${bucket}/${storagePath}`;
}

export function formatBytes(bytes: number | null): string {
  if (bytes == null) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** "<YYYY>/<MM>/<slug>-<short-uuid>.<ext>" — called in the upload handler (client). */
export function buildStoragePath(filename: string): string {
  const dot = filename.lastIndexOf(".");
  const ext =
    (dot >= 0 ? filename.slice(dot + 1) : "").toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
  const base =
    (dot >= 0 ? filename.slice(0, dot) : filename)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "image";
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const short = crypto.randomUUID().slice(0, 8);
  return `${yyyy}/${mm}/${base}-${short}.${ext}`;
}
