"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin/auth";
import { getServerAuthClient } from "@/lib/supabase/server-auth";
import {
  tapFormSchema,
  formValuesToRow,
  type TapFormValues,
} from "@/lib/tap-schema";

export type TapActionResult = { ok: true } | { ok: false; error: string };

// Refresh the public home (Taps section) and the admin list. The marketing site
// is single-page now, so the tap list renders on "/" (no standalone /taps).
function revalidateTaps() {
  revalidatePath("/");
  revalidatePath("/admin/taps");
}

export async function createTap(
  values: TapFormValues
): Promise<TapActionResult> {
  await requireAdmin();
  const parsed = tapFormSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: "Please check the tap details." };

  const supabase = await getServerAuthClient();
  const { data: maxRow } = await supabase
    .from("tap_list_items")
    .select("position")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextPosition = ((maxRow?.position as number | undefined) ?? 0) + 1;

  const { error } = await supabase.from("tap_list_items").insert({
    ...formValuesToRow(parsed.data),
    source: "manual",
    position: nextPosition,
  });
  if (error) return { ok: false, error: error.message };
  revalidateTaps();
  return { ok: true };
}

export async function updateTap(
  id: string,
  values: TapFormValues
): Promise<TapActionResult> {
  await requireAdmin();
  const parsed = tapFormSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: "Please check the tap details." };

  const supabase = await getServerAuthClient();
  const { error } = await supabase
    .from("tap_list_items")
    .update(formValuesToRow(parsed.data))
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateTaps();
  return { ok: true };
}

export async function deleteTap(id: string): Promise<TapActionResult> {
  await requireAdmin();
  const supabase = await getServerAuthClient();
  const { error } = await supabase.from("tap_list_items").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateTaps();
  return { ok: true };
}

export async function setTapVisible(
  id: string,
  isVisible: boolean
): Promise<TapActionResult> {
  await requireAdmin();
  const supabase = await getServerAuthClient();
  const { error } = await supabase
    .from("tap_list_items")
    .update({ is_visible: isVisible })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateTaps();
  return { ok: true };
}

// Re-number positions 1..N in the given id order. No unique constraint on
// `position`, so sequential updates are safe.
export async function reorderTaps(orderedIds: string[]): Promise<TapActionResult> {
  await requireAdmin();
  const supabase = await getServerAuthClient();
  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabase
      .from("tap_list_items")
      .update({ position: i + 1 })
      .eq("id", orderedIds[i]);
    if (error) return { ok: false, error: error.message };
  }
  revalidateTaps();
  return { ok: true };
}
