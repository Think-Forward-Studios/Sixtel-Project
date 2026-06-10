import type { Metadata } from "next";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { getServerAuthClient } from "@/lib/supabase/server-auth";
import type { AdminEvent } from "@/lib/event-schema";
import { Button } from "@/components/ui/button";
import { EventsManager } from "./EventsManager";

export const metadata: Metadata = {
  title: "Events · Sixtel Admin",
};

export default async function AdminEventsPage() {
  // Read as the signed-in admin (RLS events admin-all returns every row,
  // including drafts and members-only). The (protected) layout gates access.
  const supabase = await getServerAuthClient();
  const { data } = await supabase
    .from("events")
    .select(
      "id, title, description, starts_at, ends_at, is_members_only, cover_image_path, external_rsvp_url, published"
    )
    .order("starts_at", { ascending: false });

  const events = (data ?? []) as AdminEvent[];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-sixtel-ink">Events</h1>
          <p className="text-sm text-muted-foreground">
            Create, publish, and manage events. Drafts stay hidden from the
            public site until you publish them.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/events/new">
            <PlusIcon className="size-4" /> Add event
          </Link>
        </Button>
      </div>
      <EventsManager initialEvents={events} />
    </div>
  );
}
