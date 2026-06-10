"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin/auth";
import { getServerAuthClient } from "@/lib/supabase/server-auth";
import {
  announcementFormSchema,
  formValuesToAnnouncementRow,
  type AnnouncementFormValues,
} from "@/lib/announcement-schema";

export type AnnouncementActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string };

// Banner lives on the home page only.
function revalidateAnnouncements() {
  revalidatePath("/");
  revalidatePath("/admin/announcements");
}

export async function createAnnouncement(
  values: AnnouncementFormValues
): Promise<AnnouncementActionResult> {
  const admin = await requireAdmin();
  const parsed = announcementFormSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: "Please check the announcement details." };

  const row = formValuesToAnnouncementRow(parsed.data);
  const supabase = await getServerAuthClient();

  // Maintain the at-most-one-active invariant: deactivate any current active
  // row first (the partial unique index is the DB-level safety net).
  if (row.is_active) {
    const { error: deErr } = await supabase
      .from("announcements")
      .update({ is_active: false })
      .eq("is_active", true);
    if (deErr) return { ok: false, error: deErr.message };
  }

  const { data, error } = await supabase
    .from("announcements")
    .insert({ ...row, author_id: admin.id })
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };
  revalidateAnnouncements();
  return { ok: true, id: data?.id as string | undefined };
}

export async function updateAnnouncement(
  id: string,
  values: AnnouncementFormValues
): Promise<AnnouncementActionResult> {
  await requireAdmin();
  const parsed = announcementFormSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: "Please check the announcement details." };

  const row = formValuesToAnnouncementRow(parsed.data);
  const supabase = await getServerAuthClient();

  if (row.is_active) {
    const { error: deErr } = await supabase
      .from("announcements")
      .update({ is_active: false })
      .eq("is_active", true)
      .neq("id", id);
    if (deErr) return { ok: false, error: deErr.message };
  }

  const { error } = await supabase.from("announcements").update(row).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateAnnouncements();
  return { ok: true };
}

export async function deleteAnnouncement(id: string): Promise<AnnouncementActionResult> {
  await requireAdmin();
  const supabase = await getServerAuthClient();
  const { error } = await supabase.from("announcements").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateAnnouncements();
  return { ok: true };
}
