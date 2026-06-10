import Link from "next/link";
import { PencilIcon } from "lucide-react";

import type { AdminAnnouncement } from "@/lib/announcement-schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Presentational list (server component) — no client interactivity; activation
// happens in the form (with the active-swap confirm), so the list is just rows.
export function AnnouncementsManager({
  announcements,
}: {
  announcements: AdminAnnouncement[];
}) {
  if (announcements.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        No announcements yet. Add one to show a banner on the home page.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {announcements.map((a) => (
        <li
          key={a.id}
          className="flex items-center gap-3 rounded-md border border-border bg-card p-3"
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="truncate font-medium text-sixtel-ink">
                {a.title}
              </span>
              {a.is_active ? (
                <Badge variant="secondary">Active</Badge>
              ) : (
                <Badge variant="outline">Draft</Badge>
              )}
            </div>
            {a.body && (
              <p className="truncate text-sm text-muted-foreground">{a.body}</p>
            )}
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={`/admin/announcements/${a.id}`}>
              <PencilIcon className="size-4" /> Edit
            </Link>
          </Button>
        </li>
      ))}
    </ul>
  );
}
