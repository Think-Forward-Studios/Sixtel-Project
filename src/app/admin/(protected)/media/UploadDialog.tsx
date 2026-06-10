"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

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
import { getBrowserClient } from "@/lib/supabase/client";
import {
  ACCEPTED_MIME,
  MAX_UPLOAD_BYTES,
  MEDIA_BUCKETS,
  buildStoragePath,
  type MediaBucketId,
} from "@/lib/media-schema";
import { createMediaAsset } from "./actions";

export function UploadDialog({
  open,
  onOpenChange,
  defaultBucket,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  defaultBucket: MediaBucketId;
}) {
  const router = useRouter();
  const [bucket, setBucket] = useState<string>(defaultBucket);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const [altText, setAltText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const reset = () => {
    setBucket(defaultBucket);
    setFile(null);
    setPreview(null);
    setDims(null);
    setAltText("");
    setError(null);
    setUploading(false);
  };

  // Client-side validation BEFORE any network call.
  const onFile = (f: File | null) => {
    setError(null);
    setFile(null);
    setPreview(null);
    setDims(null);
    if (!f) return;
    if (!ACCEPTED_MIME.includes(f.type)) {
      setError("Unsupported file type. Use JPEG, PNG, WebP, or GIF.");
      return;
    }
    if (f.size > MAX_UPLOAD_BYTES) {
      setError(`File is too large (${(f.size / 1024 / 1024).toFixed(1)} MB). Max 10 MB.`);
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
    if (!ACCEPTED_MIME.includes(file.type) || file.size > MAX_UPLOAD_BYTES) {
      setError("Invalid file.");
      return;
    }
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
      // Roll back the orphaned Storage object if the catalog insert failed.
      await supabase.storage.from(bucket).remove([path]);
      setError(res.error);
      setUploading(false);
      return;
    }
    toast.success("Image uploaded.");
    reset();
    onOpenChange(false);
    router.refresh();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload image</DialogTitle>
          <DialogDescription>JPEG, PNG, WebP, or GIF — up to 10 MB.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="bucket">Bucket</Label>
            <select
              id="bucket"
              value={bucket}
              onChange={(e) => setBucket(e.target.value)}
              className="w-full rounded-none border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring"
            >
              {MEDIA_BUCKETS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="file">File</Label>
            <input
              id="file"
              type="file"
              accept={ACCEPTED_MIME.join(",")}
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-muted-foreground file:mr-3 file:border file:border-input file:bg-transparent file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground"
            />
          </div>

          {preview && (
            <div className="relative aspect-video overflow-hidden rounded border border-border bg-sixtel-cream">
              {/* eslint-disable-next-line @next/next/no-img-element -- object-URL preview, not a remote asset */}
              <img src={preview} alt="" className="h-full w-full object-contain" />
              {dims && (
                <span className="absolute bottom-1 right-1 rounded bg-sixtel-ink/70 px-1.5 py-0.5 text-xs text-white">
                  {dims.w}×{dims.h}
                </span>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="alt">Alt text</Label>
            <Input
              id="alt"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe the image (required to upload)"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={uploading}>
              Cancel
            </Button>
            <Button type="button" onClick={onUpload} disabled={uploading || !file || !altText.trim()}>
              {uploading ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" /> Uploading…
                </>
              ) : (
                "Upload"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
