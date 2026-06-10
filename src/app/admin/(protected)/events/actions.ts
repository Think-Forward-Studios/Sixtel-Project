"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin/auth";
import { getServerAuthClient } from "@/lib/supabase/server-auth";
import {
  eventFormSchema,
  formValuesToEventRow,
  type EventFormValues,
} from "@/lib/event-schema";

export type EventActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string };

// Refresh the public surfaces (home teaser + /events) and the admin list.
function revalidateEvents() {
  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/admin/events");
}

export async function createEvent(
  values: EventFormValues
): Promise<EventActionResult> {
  await requireAdmin();
  const parsed = eventFormSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: "Please check the event details." };

  const supabase = await getServerAuthClient();
  const { data, error } = await supabase
    .from("events")
    .insert(formValuesToEventRow(parsed.data))
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };
  revalidateEvents();
  return { ok: true, id: data?.id as string | undefined };
}

export async function updateEvent(
  id: string,
  values: EventFormValues
): Promise<EventActionResult> {
  await requireAdmin();
  const parsed = eventFormSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: "Please check the event details." };

  const supabase = await getServerAuthClient();
  const { error } = await supabase
    .from("events")
    .update(formValuesToEventRow(parsed.data))
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateEvents();
  return { ok: true };
}

export async function deleteEvent(id: string): Promise<EventActionResult> {
  await requireAdmin();
  const supabase = await getServerAuthClient();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateEvents();
  return { ok: true };
}

export async function setEventPublished(
  id: string,
  published: boolean
): Promise<EventActionResult> {
  await requireAdmin();
  const supabase = await getServerAuthClient();
  const { error } = await supabase
    .from("events")
    .update({ published })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateEvents();
  return { ok: true };
}
