import { z } from "zod";

/**
 * Admin announcement form. Mirrors the editable columns of `announcements`.
 * `link_url` and `link_label` must be set together (both or neither) — enforced
 * here and matching the build plan §8.4 acceptance gate.
 */
export const announcementFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(80, "Keep the title under 80 characters"),
    // Soft cap ~200 via the UI counter; hard cap here keeps the banner thin.
    body: z.string().trim().max(280, "Keep the body short — under 280 characters").optional(),
    linkUrl: z
      .string()
      .trim()
      .max(500)
      .optional()
      .refine((v) => !v || /^https?:\/\/.+/.test(v), "Must be a full URL (https://…)"),
    linkLabel: z.string().trim().max(60).optional(),
    isActive: z.boolean(),
  })
  .refine(
    (v) => Boolean(v.linkUrl && v.linkUrl.trim()) === Boolean(v.linkLabel && v.linkLabel.trim()),
    {
      message: "Set a link URL and a label together (or leave both empty)",
      path: ["linkLabel"],
    }
  );

export type AnnouncementFormValues = z.infer<typeof announcementFormSchema>;

/** A full announcements row as read for the admin list. */
export type AdminAnnouncement = {
  id: string;
  title: string;
  body: string | null;
  link_url: string | null;
  link_label: string | null;
  is_active: boolean;
};

export function announcementToFormValues(a: AdminAnnouncement): AnnouncementFormValues {
  return {
    title: a.title,
    body: a.body ?? "",
    linkUrl: a.link_url ?? "",
    linkLabel: a.link_label ?? "",
    isActive: a.is_active,
  };
}

export function formValuesToAnnouncementRow(values: AnnouncementFormValues) {
  const trimmed = (s?: string) => {
    const t = (s ?? "").trim();
    return t === "" ? null : t;
  };
  return {
    title: values.title.trim(),
    body: trimmed(values.body),
    link_url: trimmed(values.linkUrl),
    link_label: trimmed(values.linkLabel),
    is_active: values.isActive,
  };
}
