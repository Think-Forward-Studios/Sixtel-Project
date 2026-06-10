"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon, Loader2Icon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { getBrowserClient } from "@/lib/supabase/client";
import {
  ACCEPTED_MIME,
  MAX_UPLOAD_BYTES,
  buildStoragePath,
  mediaPublicUrl,
  type MediaAsset,
  type MediaBucketId,
} from "@/lib/media-schema";
import { listMediaAssets, createMediaAsset } from "@/app/admin/(protected)/media/actions";

/**
 * Reusable image field: shows the current image + a dialog to pick an existing
 * asset (from `bucket`) or upload a new one. Returns the PUBLIC URL via onChange
 * (the existing label_image_url / cover_image_path fields render it directly).
 */
export function MediaPicker({
  bucket,
  value,
  onChange,
}: {
  bucket: MediaBucketId;
  value: string | null;
  onChange: (url: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<MediaAsset[] | null>(null);
  const [loading, setLoading] = useState(false);
  // upload state
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const [altText, setAltText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const loadAssets = async () => {
    setLoading(true);
    const a = await listMediaAssets(bucket);
    setAssets(a);
    setLoading(false);
  };

  // Load the library when the picker opens (in the click handler, not an effect).
  const openPicker = () => {
    setOpen(true);
    if (assets === null && !loading) void loadAssets();
  };

  const resetUpload = () => {
    setFile(null);
    setPreview(null);
    setDims(null);
    setAltText("");
    setError(null);
    setUploading(false);
  };

  const closeDialog = (o: boolean) => {
    setOpen(o);
    if (!o) resetUpload();
  };

  const select = (url: string) => {
    onChange(url);
    closeDialog(false);
  };

  const onFile = (f: File | null) => {
    setError(null);
    setFile(null);
    setPreview(null);
    setDims(null);
    if (!f) return;
    if (!ACCEPTED_MIME.includes(f.type)) {
      setError("Use JPEG, PNG, WebP, or GIF.");
      return;
    }
    if (f.size > MAX_UPLOAD_BYTES) {
      setError("File is too large (max 10 MB).");
      return;
    }
    const url = URL.createObjectURL(f);
    const img = new window.Image();
    img.onload = () => setDims({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = url;
    setFile(f);
    setPreview(url);
  };

  const onUpload = async () => {
    if (!file || !altText.trim()) return;
    setUploading(true);
    setError(null);
    const path = buildStoragePath(file.name);
    const supabase = getBrowserClient();
    const { error: upErr } = await supabase.storage
      .from(bucket)
      .upload(path, file, { contentType: file.type, upsert: false });
    if (upErr) {
      setError(`Upload failed: ${upErr.message}`);
      setUploading(false);
      return;
    }
    const res = await createMediaAsset({
      bucket,
      storage_path: path,
      original_filename: file.name,
      alt_text: altText.trim(),
      mime_type: file.type,
      size_bytes: file.size,
      width: dims?.w ?? null,
      height: dims?.h ?? null,
    });
    if (!res.ok) {
      await supabase.storage.from(bucket).remove([path]);
      setError(res.error);
      setUploading(false);
      return;
    }
    select(mediaPublicUrl(bucket, path)); // auto-select the new upload
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative size-16 shrink-0 overflow-hidden rounded border border-border bg-sixtel-cream">
        {value ? (
          <Image src={value} alt="" fill unoptimized sizes="64px" className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <ImageIcon className="size-5" />
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={openPicker}>
          {value ? "Change" : "Choose image"}
        </Button>
        {value && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
            Remove
          </Button>
        )}
      </div>

      <Dialog open={open} onOpenChange={closeDialog}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Choose an image</DialogTitle>
            <DialogDescription>Pick from the library or upload a new one.</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Library
            </p>
            {loading ? (
              <p className="text-sm text-muted-foreground">
                <Loader2Icon className="mr-1 inline size-4 animate-spin" /> Loading…
              </p>
            ) : !assets || assets.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No images in this bucket yet — upload one below.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {assets.map((a) => {
                  const u = mediaPublicUrl(a.bucket, a.storage_path);
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => select(u)}
                      className={cn(
                        "relative aspect-square overflow-hidden rounded border",
                        value === u
                          ? "border-sixtel-copper ring-2 ring-sixtel-copper"
                          : "border-border hover:border-sixtel-copper"
                      )}
                    >
                      <Image
                        src={u}
                        alt={a.alt_text ?? ""}
                        fill
                        unoptimized
                        sizes="120px"
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-3 border-t border-border pt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Upload new
            </p>
            <input
              type="file"
              accept={ACCEPTED_MIME.join(",")}
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-muted-foreground file:mr-3 file:border file:border-input file:bg-transparent file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground"
            />
            {preview && (
              <div className="relative aspect-video overflow-hidden rounded border border-border bg-sixtel-cream">
                {/* eslint-disable-next-line @next/next/no-img-element -- object-URL preview */}
                <img src={preview} alt="" className="h-full w-full object-contain" />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="pickerAlt">Alt text</Label>
              <Input
                id="pickerAlt"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Describe the image (required)"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button
              type="button"
              size="sm"
              onClick={onUpload}
              disabled={uploading || !file || !altText.trim()}
            >
              {uploading ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" /> Uploading…
                </>
              ) : (
                "Upload & select"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
