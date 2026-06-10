import type { Metadata } from "next";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { getServerAuthClient } from "@/lib/supabase/server-auth";
import {
  MEDIA_BUCKETS,
  isValidBucket,
  type MediaAsset,
  type MediaBucketId,
} from "@/lib/media-schema";
import { MediaGrid } from "./MediaGrid";

export const metadata: Metadata = {
  title: "Media · Sixtel Admin",
};

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ bucket?: string }>;
}) {
  const { bucket } = await searchParams;
  const active: "all" | MediaBucketId = isValidBucket(bucket) ? bucket : "all";

  const supabase = await getServerAuthClient();
  let query = supabase
    .from("media_assets")
    .select(
      "id, bucket, storage_path, original_filename, alt_text, mime_type, size_bytes, width, height, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(200);
  if (active !== "all") query = query.eq("bucket", active);
  const { data } = await query;
  const assets = (data ?? []) as MediaAsset[];

  const defaultUploadBucket: MediaBucketId = active === "all" ? "media-library" : active;
  const chips = [{ id: "all" as const, label: "All" }, ...MEDIA_BUCKETS];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl text-sixtel-ink">Media</h1>
        <p className="text-sm text-muted-foreground">
          Upload and manage images. Public URLs are reusable across the site.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {chips.map((c) => (
          <Link
            key={c.id}
            href={c.id === "all" ? "/admin/media" : `/admin/media?bucket=${c.id}`}
            className={cn(
              "rounded-full border px-3 py-1 text-sm transition-colors",
              active === c.id
                ? "border-sixtel-copper bg-sixtel-copper/10 text-sixtel-ink"
                : "border-border text-muted-foreground hover:text-sixtel-ink"
            )}
          >
            {c.label}
          </Link>
        ))}
      </div>

      <MediaGrid assets={assets} defaultBucket={defaultUploadBucket} />
    </div>
  );
}
