import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { getServerAuthClient } from "@/lib/supabase/server-auth";
import { AnnouncementForm } from "../AnnouncementForm";

export const metadata: Metadata = {
  title: "New announcement · Sixtel Admin",
};

export default async function NewAnnouncementPage() {
  const supabase = await getServerAuthClient();
  const { data: active } = await supabase
    .from("announcements")
    .select("id, title")
    .eq("is_active", true)
    .maybeSingle();

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
          New announcement
        </h1>
      </div>
      <AnnouncementForm
        announcement={null}
        activeOther={
          active ? { id: active.id as string, title: active.title as string } : null
        }
      />
    </div>
  );
}
