import { z } from "zod";

/**
 * Admin tap form. Editable columns of `tap_list_items`. Numeric fields are
 * kept as STRINGS in the form (RHF-friendly) and converted to number|null in
 * the server action. `source` defaults to 'manual' on create; `position` is
 * managed by the create/reorder logic.
 */
export const tapFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  brewery: z.string().trim().max(120).optional(),
  style: z.string().trim().max(120).optional(),
  // "", "5", or "5.2" (up to 2 decimals)
  abvPercent: z
    .string()
    .trim()
    .regex(/^(\d{1,2}(\.\d{1,2})?)?$/, "ABV like 5.2")
    .optional(),
  // "" or a whole number
  ibu: z.string().trim().regex(/^\d{0,3}$/, "IBU is a whole number").optional(),
  // URL or local path (the seed uses /photos/... paths) — kept loose on purpose
  labelImageUrl: z.string().trim().max(500).optional(),
  isVisible: z.boolean(),
});

export type TapFormValues = z.infer<typeof tapFormSchema>;

/** A full tap_list_items row as read for the admin list (all rows, any visibility). */
export type AdminTap = {
  id: string;
  position: number;
  name: string;
  brewery: string | null;
  style: string | null;
  abv_percent: number | null;
  ibu: number | null;
  label_image_url: string | null;
  is_visible: boolean;
};

/** Map an AdminTap row to form values (numbers -> strings, nulls -> ""). */
export function tapToFormValues(tap: AdminTap): TapFormValues {
  return {
    name: tap.name,
    brewery: tap.brewery ?? "",
    style: tap.style ?? "",
    abvPercent: tap.abv_percent == null ? "" : String(tap.abv_percent),
    ibu: tap.ibu == null ? "" : String(tap.ibu),
    labelImageUrl: tap.label_image_url ?? "",
    isVisible: tap.is_visible,
  };
}

/** Map validated form values to the DB column shape (strings -> number|null). */
export function formValuesToRow(values: TapFormValues) {
  const trimmed = (s?: string) => {
    const t = (s ?? "").trim();
    return t === "" ? null : t;
  };
  return {
    name: values.name.trim(),
    brewery: trimmed(values.brewery),
    style: trimmed(values.style),
    abv_percent: values.abvPercent && values.abvPercent.trim() !== "" ? Number(values.abvPercent) : null,
    ibu: values.ibu && values.ibu.trim() !== "" ? Number(values.ibu) : null,
    label_image_url: trimmed(values.labelImageUrl),
    is_visible: values.isVisible,
  };
}
