"use client";

import { useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { EyeIcon, EyeOffIcon, PencilIcon } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { type AdminEvent, formatEventWhen } from "@/lib/event-schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { setEventPublished } from "./actions";

type Tab = "upcoming" | "past" | "drafts";

export function EventsManager({ initialEvents }: { initialEvents: AdminEvent[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("upcoming");
  const [, startTransition] = useTransition();
  const [events, applyOptimistic] = useOptimistic(
    initialEvents,
    (state, action: { id: string; published: boolean }) =>
      state.map((e) =>
        e.id === action.id ? { ...e, published: action.published } : e
      )
  );

  // Stable "now" captured at mount — avoids an impure Date.now() call during
  // render (events don't cross the upcoming/past boundary mid-session).
  const [now] = useState(() => Date.now());
  const ts = (e: AdminEvent) => new Date(e.starts_at).getTime();
  const buckets: Record<Tab, AdminEvent[]> = {
    upcoming: events
      .filter((e) => e.published && ts(e) >= now)
      .sort((a, b) => ts(a) - ts(b)),
    past: events
      .filter((e) => e.published && ts(e) < now)
      .sort((a, b) => ts(b) - ts(a)),
    drafts: events.filter((e) => !e.published).sort((a, b) => ts(a) - ts(b)),
  };
  const rows = buckets[tab];

  const onTogglePublish = (e: AdminEvent) => {
    const next = !e.published;
    startTransition(async () => {
      applyOptimistic({ id: e.id, published: next });
      const res = await setEventPublished(e.id, next);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      router.refresh();
    });
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "upcoming", label: "Upcoming" },
    { key: "past", label: "Past" },
    { key: "drafts", label: "Drafts" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-1 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors",
              tab === t.key
                ? "border-sixtel-copper text-sixtel-ink"
                : "border-transparent text-muted-foreground hover:text-sixtel-ink"
            )}
          >
            {t.label}{" "}
            <span className="text-muted-foreground">({buckets[t.key].length})</span>
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No {tab} events.
        </p>
      ) : (
        <ul className="space-y-2">
          {rows.map((e) => (
            <li
              key={e.id}
              className="flex items-center gap-3 rounded-md border border-border bg-card p-3"
            >
              <div className="relative size-14 shrink-0 overflow-hidden rounded bg-secondary">
                {e.cover_image_path ? (
                  <Image
                    src={e.cover_image_path}
                    alt=""
                    fill
                    unoptimized
                    sizes="56px"
                    className="object-cover"
                  />
                ) : null}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="truncate font-medium text-sixtel-ink">
                    {e.title}
                  </span>
                  {e.is_members_only && <Badge variant="outline">Members</Badge>}
                  {e.published ? (
                    <Badge variant="secondary">Published</Badge>
                  ) : (
                    <Badge variant="outline">Draft</Badge>
                  )}
                </div>
                <p className="truncate text-sm text-muted-foreground">
                  {formatEventWhen(e.starts_at)}
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={e.published ? "Unpublish" : "Publish"}
                onClick={() => onTogglePublish(e)}
              >
                {e.published ? (
                  <EyeIcon className="size-4" />
                ) : (
                  <EyeOffIcon className="size-4 text-muted-foreground" />
                )}
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/events/${e.id}`}>
                  <PencilIcon className="size-4" /> Edit
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
