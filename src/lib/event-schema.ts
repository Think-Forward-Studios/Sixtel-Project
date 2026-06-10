import { z } from "zod";

/**
 * Admin event form. Mirrors the editable columns of `events`. Datetime fields
 * are HTML datetime-local strings ("YYYY-MM-DDTHH:mm"); the server action
 * converts them to ISO timestamptz. Description is Markdown (rendered with
 * react-markdown in the form preview and on the public page).
 */
export const eventFormSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(200),
    description: z.string().trim().max(5000).optional(),
    startsAt: z.string().min(1, "Start date & time is required"),
    endsAt: z.string().optional(),
    coverImagePath: z.string().trim().max(500).optional(),
    isMembersOnly: z.boolean(),
    externalRsvpUrl: z
      .string()
      .trim()
      .max(500)
      .optional()
      .refine((v) => !v || /^https?:\/\/.+/.test(v), "Must be a full URL (https://…)"),
    published: z.boolean(),
  })
  .refine((v) => !v.endsAt || !v.startsAt || v.endsAt >= v.startsAt, {
    message: "End must be after the start",
    path: ["endsAt"],
  });

export type EventFormValues = z.infer<typeof eventFormSchema>;

/** A full events row as read for the admin list (all events, any state). */
export type AdminEvent = {
  id: string;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string | null;
  is_members_only: boolean;
  cover_image_path: string | null;
  external_rsvp_url: string | null;
  published: boolean;
};

/** ISO timestamptz -> "YYYY-MM-DDTHH:mm" for datetime-local inputs (local time). */
function toDatetimeLocal(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function eventToFormValues(e: AdminEvent): EventFormValues {
  return {
    title: e.title,
    description: e.description ?? "",
    startsAt: toDatetimeLocal(e.starts_at),
    endsAt: toDatetimeLocal(e.ends_at),
    coverImagePath: e.cover_image_path ?? "",
    isMembersOnly: e.is_members_only,
    externalRsvpUrl: e.external_rsvp_url ?? "",
    published: e.published,
  };
}

/** Human-friendly date/time, e.g. "Wed, Jun 18 · 7:00 PM". Client-safe. */
export function formatEventWhen(startsAt: string): string {
  const d = new Date(startsAt);
  const date = d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${date} · ${time}`;
}

export function formValuesToEventRow(values: EventFormValues) {
  const trimmed = (s?: string) => {
    const t = (s ?? "").trim();
    return t === "" ? null : t;
  };
  return {
    title: values.title.trim(),
    description: trimmed(values.description),
    starts_at: new Date(values.startsAt).toISOString(),
    ends_at:
      values.endsAt && values.endsAt.trim() !== ""
        ? new Date(values.endsAt).toISOString()
        : null,
    cover_image_path: trimmed(values.coverImagePath),
    is_members_only: values.isMembersOnly,
    external_rsvp_url: trimmed(values.externalRsvpUrl),
    published: values.published,
  };
}
