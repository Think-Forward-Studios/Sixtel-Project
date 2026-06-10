import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import { getServerAuthClient } from "@/lib/supabase/server-auth";
import type { AdminAnnouncement } from "@/lib/announcement-schema";
import { AnnouncementForm } from "../AnnouncementForm";

export const metadata: Metadata = {
  title: "Edit announcement · Sixtel Admin",
};

export default async function EditAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await getServerAuthClient();
  const { data } = await supabase
    .from("announcements")
    .select("id, title, body, link_url, link_label, is_active")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();
  const announcement = data as AdminAnnouncement;

  // The active row, if it's a DIFFERENT announcement (drives the swap confirm).
  const { data: active } = await supabase
    .from("announcements")
    .select("id, title")
    .eq("is_active", true)
    .maybeSingle();
  const activeOther =
    active && active.id !== id
      ? { id: active.id as string, title: active.title as string }
      : null;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/announcements"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-sixtel-ink"
        >
          <ArrowLeftIcon className="size-4" /> Back to announcements
        </Link>
        <h1 className="mt-2 font-heading text-2xl text-sixtel-ink">
          Edit announcement
        </h1>
      </div>
      <AnnouncementForm announcement={announcement} activeOther={activeOther} />
    </div>
  );
}
