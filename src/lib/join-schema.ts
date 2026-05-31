import { z } from "zod";

/**
 * Shared validation + consent constants for the /join signup DEMO.
 *
 * TODO(real signup): this same schema is meant to feed the real
 * POST /api/members/signup-init + /signup-verify endpoints. See
 * ../Sixtel_Architecture_Plan_v2.md ("Scenario A") and the members_cache /
 * consent_records table definitions. The demo persists NOTHING.
 */

// Demo phone validation WITHOUT libphonenumber-js: accept a loose US-ish shape,
// then normalize to a fake E.164 via toE164Demo(). The real flow normalizes
// server-side with libphonenumber-js.
const PHONE_REGEX = /^[\d\s().+-]{10,20}$/;

export const joinDetailsSchema = z
  .object({
    // -> members_cache.phone_e164
    phone: z.string().trim().regex(PHONE_REGEX, "Enter a valid phone number"),
    // -> members_cache.display_name
    displayName: z.string().trim().max(80).optional(),
    // -> members_cache.birthday_month (1-12) / birthday_day (1-31).
    // Kept as strings from <select> in the demo; "" means "not provided".
    birthdayMonth: z.string().optional(),
    birthdayDay: z.string().optional(),
    // Consent — NOT pre-checked; must be true to proceed. Demo: non-binding,
    // nothing is captured (see the page-level "Preview / demo" banner).
    isOfAge: z
      .boolean()
      .refine((v) => v === true, "Please confirm you are 21 or older"),
    smsConsent: z
      .boolean()
      .refine((v) => v === true, "SMS consent is required to join"),
  })
  .refine((d) => Boolean(d.birthdayMonth) === Boolean(d.birthdayDay), {
    error: "Choose both birthday month and day, or leave both blank",
    path: ["birthdayDay"],
  });

export type JoinDetails = z.infer<typeof joinDetailsSchema>;

export const joinVerifySchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
});

export type JoinVerify = z.infer<typeof joinVerifySchema>;

// Forward-compat consent metadata (mirrors consent_records columns).
// PLACEHOLDER copy — NOT legal-reviewed. TODO(real signup): replace with
// counsel-approved wording; the EXACT shown text must be written to
// consent_records.consent_text with a real consent_version.
export const CONSENT_VERSION = "demo-v0-2026-05";
export const CONSENT_SOURCE = "website_signup";
export const AGE_GATE_TEXT = "I confirm I am 21 years of age or older.";
export const SMS_CONSENT_TEXT =
  "I agree to receive recurring automated marketing text messages from Sixtel at the number provided. Consent is not a condition of purchase. Msg & data rates may apply. Reply STOP to opt out.";

// Demo-only phone normalization (NO libphonenumber-js).
// TODO(real signup): replace with libphonenumber-js parse/format to true E.164.
export function toE164Demo(input: string): string {
  const digits = input.replace(/\D/g, "");
  const ten = digits.slice(-10);
  return `+1${ten}`; // naive US assumption — demo only
}
