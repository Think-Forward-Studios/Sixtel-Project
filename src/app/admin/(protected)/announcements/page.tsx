import type { Metadata } from "next";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { getServerAuthClient } from "@/lib/supabase/server-auth";
import type { AdminAnnouncement } from "@/lib/announcement-schema";
import { Button } from "@/components/ui/button";
import { AnnouncementsManager } from "./AnnouncementsManager";

export const metadata: Metadata = {
  title: "Announcements · Sixtel Admin",
};

export default async function AdminAnnouncementsPage() {
  const supabase = await getServerAuthClient();
  const { data } = await supabase
    .from("announcements")
    .select("id, title, body, link_url, link_label, is_active")
    .order("is_active", { ascending: false })
    .order("updated_at", { ascending: false });

  const announcements = (data ?? []) as AdminAnnouncement[];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-sixtel-ink">Announcements</h1>
          <p className="text-sm text-muted-foreground">
            The home-page banner. At most one can be active at a time —
            activating one replaces the current active banner.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/announcements/new">
            <PlusIcon className="size-4" /> Add announcement
          </Link>
        </Button>
      </div>
      <AnnouncementsManager announcements={announcements} />
    </div>
  );
}
