import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import { getServerAuthClient } from "@/lib/supabase/server-auth";
import type { AdminEvent } from "@/lib/event-schema";
import { EventForm } from "../EventForm";

export const metadata: Metadata = {
  title: "Edit event · Sixtel Admin",
};

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await getServerAuthClient();
  const { data } = await supabase
    .from("events")
    .select(
      "id, title, description, starts_at, ends_at, is_members_only, cover_image_path, external_rsvp_url, published"
    )
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();
  const event = data as AdminEvent;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-sixtel-ink"
        >
          <ArrowLeftIcon className="size-4" /> Back to events
        </Link>
        <h1 className="mt-2 font-heading text-2xl text-sixtel-ink">Edit event</h1>
      </div>
      <EventForm event={event} />
    </div>
  );
}
