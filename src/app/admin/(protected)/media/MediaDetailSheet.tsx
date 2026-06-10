"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CopyIcon, Loader2Icon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type MediaAsset, mediaPublicUrl, formatBytes } from "@/lib/media-schema";
import { updateMediaAltText, deleteMediaAsset, type MediaRef } from "./actions";

export function MediaDetailSheet({
  asset,
  onOpenChange,
}: {
  asset: MediaAsset | null;
  onOpenChange: (o: boolean) => void;
}) {
  return (
    <Sheet open={!!asset} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        {/* Keyed by id → fresh state per selection (no prop-sync effect). */}
        {asset && (
          <DetailContent
            key={asset.id}
            asset={asset}
            onClose={() => onOpenChange(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

function DetailContent({
  asset,
  onClose,
}: {
  asset: MediaAsset;
  onClose: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [alt, setAlt] = useState(asset.alt_text ?? "");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [refs, setRefs] = useState<MediaRef[] | null>(null);
  const url = mediaPublicUrl(asset.bucket, asset.storage_path);

  const onSaveAlt = () => {
    startTransition(async () => {
      const res = await updateMediaAltText(asset.id, alt);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Alt text saved.");
      router.refresh();
    });
  };

  const onDelete = (force = false) => {
    startTransition(async () => {
      const res = await deleteMediaAsset(asset.id, force);
      if (res.ok) {
        toast.success("Image deleted.");
        onClose();
        router.refresh();
        return;
      }
      if ("references" in res) {
        setRefs(res.references); // in use — surface the references first (§9.5)
        return;
      }
      toast.error(res.error);
    });
  };

  return (
    <>
      <SheetHeader>
        <SheetTitle className="truncate">
          {asset.original_filename ?? "Image"}
        </SheetTitle>
        <SheetDescription>
          {asset.bucket} ·{" "}
          {asset.width && asset.height ? `${asset.width}×${asset.height} · ` : ""}
          {formatBytes(asset.size_bytes)}
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-4 px-4 pb-6">
        <div className="relative aspect-video overflow-hidden rounded border border-border bg-sixtel-cream">
          {/* eslint-disable-next-line @next/next/no-img-element -- direct public Storage URL */}
          <img src={url} alt={asset.alt_text ?? ""} className="h-full w-full object-contain" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="detailAlt">Alt text</Label>
          <div className="flex gap-2">
            <Input id="detailAlt" value={alt} onChange={(e) => setAlt(e.target.value)} />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onSaveAlt}
              disabled={pending || alt === (asset.alt_text ?? "")}
            >
              Save
            </Button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="detailUrl">Public URL</Label>
          <div className="flex gap-2">
            <Input id="detailUrl" readOnly value={url} className="text-xs" />
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-label="Copy URL"
              onClick={() => {
                navigator.clipboard.writeText(url);
                toast.success("URL copied.");
              }}
            >
              <CopyIcon className="size-4" />
            </Button>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          {refs ? (
            <div className="space-y-2 text-sm">
              <p className="text-sixtel-ink">
                In use by {refs.length} item{refs.length > 1 ? "s" : ""} — deleting removes
                the image from {refs.length > 1 ? "them" : "it"}:
              </p>
              <ul className="list-inside list-disc text-muted-foreground">
                {refs.map((r) => (
                  <li key={`${r.kind}-${r.id}`}>
                    {r.kind}: {r.title}
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(true)}
                  disabled={pending}
                >
                  {pending ? <Loader2Icon className="size-4 animate-spin" /> : "Delete anyway"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setRefs(null);
                    setConfirmDelete(false);
                  }}
                  disabled={pending}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : confirmDelete ? (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Delete the image and its file?</span>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => onDelete()}
                disabled={pending}
              >
                {pending ? <Loader2Icon className="size-4 animate-spin" /> : "Yes, delete"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setConfirmDelete(false)}
                disabled={pending}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="ghost"
              className="text-destructive"
              onClick={() => setConfirmDelete(true)}
              disabled={pending}
            >
              <Trash2Icon className="size-4" /> Delete
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
