"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  type MediaAsset,
  type MediaBucketId,
  mediaPublicUrl,
} from "@/lib/media-schema";
import { UploadDialog } from "./UploadDialog";
import { MediaDetailSheet } from "./MediaDetailSheet";

export function MediaGrid({
  assets,
  defaultBucket,
}: {
  assets: MediaAsset[];
  defaultBucket: MediaBucketId;
}) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selected, setSelected] = useState<MediaAsset | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setUploadOpen(true)}>
          <UploadIcon className="size-4" /> Upload
        </Button>
      </div>

      {assets.length === 0 ? (
        <p className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No media here yet. Upload an image to get started.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {assets.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setSelected(a)}
              className="group text-left"
            >
              <div className="relative aspect-square overflow-hidden rounded-md border border-border bg-sixtel-cream transition-colors group-hover:border-sixtel-copper">
                <Image
                  src={mediaPublicUrl(a.bucket, a.storage_path)}
                  alt={a.alt_text ?? ""}
                  fill
                  unoptimized
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover"
                />
              </div>
              <p className="mt-1 truncate text-xs font-medium text-sixtel-ink">
                {a.original_filename ?? a.storage_path}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {a.width && a.height ? `${a.width}×${a.height}` : "—"} ·{" "}
                {new Date(a.created_at).toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>
      )}

      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        defaultBucket={defaultBucket}
      />
      <MediaDetailSheet
        asset={selected}
        onOpenChange={(o) => {
          if (!o) setSelected(null);
        }}
      />
    </div>
  );
}
