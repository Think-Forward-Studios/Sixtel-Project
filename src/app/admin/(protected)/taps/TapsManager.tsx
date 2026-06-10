"use client";

import { useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  EyeIcon,
  EyeOffIcon,
  GripVerticalIcon,
  PencilIcon,
  PlusIcon,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import type { AdminTap } from "@/lib/tap-schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { reorderTaps, setTapVisible } from "./actions";
import { TapEditSheet } from "./TapEditSheet";

type OptimisticAction =
  | { type: "reorder"; ids: string[] }
  | { type: "toggle"; id: string; visible: boolean };

export function TapsManager({ initialTaps }: { initialTaps: AdminTap[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<AdminTap | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Optimistic view derived from the server data — auto-reconciles to
  // `initialTaps` after each action's router.refresh().
  const [taps, applyOptimistic] = useOptimistic(
    initialTaps,
    (state, action: OptimisticAction) => {
      if (action.type === "reorder") {
        const byId = new Map(state.map((t) => [t.id, t]));
        return action.ids
          .map((id) => byId.get(id))
          .filter((t): t is AdminTap => Boolean(t));
      }
      return state.map((t) =>
        t.id === action.id ? { ...t, is_visible: action.visible } : t
      );
    }
  );

  const openNew = () => {
    setEditing(null);
    setSheetOpen(true);
  };
  const openEdit = (tap: AdminTap) => {
    setEditing(tap);
    setSheetOpen(true);
  };
  const onSaved = () => startTransition(() => router.refresh());

  const onToggleVisible = (tap: AdminTap) => {
    const next = !tap.is_visible;
    startTransition(async () => {
      applyOptimistic({ type: "toggle", id: tap.id, visible: next });
      const res = await setTapVisible(tap.id, next);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      router.refresh();
    });
  };

  // Native HTML5 drag-and-drop reorder (admin is desktop-only).
  const onDropOn = (targetId: string) => {
    const sourceId = dragId;
    setDragId(null);
    setOverId(null);
    if (!sourceId || sourceId === targetId) return;
    const from = taps.findIndex((t) => t.id === sourceId);
    const to = taps.findIndex((t) => t.id === targetId);
    if (from === -1 || to === -1) return;

    const next = [...taps];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    const ids = next.map((t) => t.id);

    startTransition(async () => {
      applyOptimistic({ type: "reorder", ids });
      const res = await reorderTaps(ids);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openNew}>
          <PlusIcon className="size-4" /> Add tap
        </Button>
      </div>

      {taps.length === 0 ? (
        <p className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No taps yet. Add your first tap to get started.
        </p>
      ) : (
        <ul className="space-y-2">
          {taps.map((tap) => (
            <li
              key={tap.id}
              draggable
              onDragStart={() => setDragId(tap.id)}
              onDragEnd={() => {
                setDragId(null);
                setOverId(null);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                if (overId !== tap.id) setOverId(tap.id);
              }}
              onDrop={() => onDropOn(tap.id)}
              className={cn(
                "flex items-center gap-3 rounded-md border border-border bg-card p-3",
                dragId === tap.id && "opacity-50",
                overId === tap.id &&
                  dragId &&
                  dragId !== tap.id &&
                  "border-sixtel-copper"
              )}
            >
              <span
                className="cursor-grab text-muted-foreground"
                aria-hidden="true"
              >
                <GripVerticalIcon className="size-5" />
              </span>

              <div className="relative size-12 shrink-0 overflow-hidden rounded bg-sixtel-cream">
                {tap.label_image_url ? (
                  <Image
                    src={tap.label_image_url}
                    alt=""
                    fill
                    unoptimized
                    sizes="48px"
                    className="object-cover"
                  />
                ) : null}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-medium text-sixtel-ink">
                    {tap.name}
                  </span>
                  {!tap.is_visible && <Badge variant="outline">Hidden</Badge>}
                </div>
                <p className="truncate text-sm text-muted-foreground">
                  {[tap.brewery, tap.style].filter(Boolean).join(" · ") || "—"}
                </p>
              </div>

              <div className="hidden shrink-0 gap-3 text-sm text-muted-foreground sm:flex">
                <span>{tap.abv_percent != null ? `${tap.abv_percent}%` : "—"} ABV</span>
                <span>{tap.ibu != null ? tap.ibu : "—"} IBU</span>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={tap.is_visible ? "Hide from public site" : "Show on public site"}
                onClick={() => onToggleVisible(tap)}
              >
                {tap.is_visible ? (
                  <EyeIcon className="size-4" />
                ) : (
                  <EyeOffIcon className="size-4 text-muted-foreground" />
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => openEdit(tap)}
              >
                <PencilIcon className="size-4" /> Edit
              </Button>
            </li>
          ))}
        </ul>
      )}

      <TapEditSheet
        tap={editing}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSaved={onSaved}
      />
    </div>
  );
}
