"use server";

import {
  joinDetailsSchema,
  joinVerifySchema,
  type JoinDetails,
  type JoinVerify,
} from "@/lib/join-schema";

export type JoinActionResult = { ok: true } | { ok: false; error: string };

/**
 * DEMO STUB — persists NOTHING. Mirrors the real POST /api/members/signup-init.
 * TODO(real signup): normalize phone -> E.164 (libphonenumber-js),
 * Square SearchLoyaltyAccounts (dedupe), Twilio Verify send (channel "sms").
 * See ../Sixtel_Architecture_Plan_v2.md "Scenario A" steps 2-6.
 */
export async function joinInit(values: JoinDetails): Promise<JoinActionResult> {
  // Server Functions are reachable via direct POST regardless of the UI, so we
  // re-validate here. This also keeps the stub drop-in compatible with the real
  // endpoint, which will validate the same shape.
  const parsed = joinDetailsSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: "Please check your details and try again." };
  }
  await new Promise((resolve) => setTimeout(resolve, 900)); // simulate Twilio Verify send
  return { ok: true }; // demo: pretend the code was sent — nothing is saved
}

/**
 * DEMO STUB — persists NOTHING. Mirrors the real POST /api/members/signup-verify.
 * TODO(real signup): Twilio VerificationCheck, Square CreateCustomer +
 * CreateLoyaltyAccount, write consent_records (consent_text/version/source/ip/ua),
 * write members_cache, set signed session cookie, redirect("/account").
 * See ../Sixtel_Architecture_Plan_v2.md "Scenario A" steps 8-15.
 */
export async function joinVerify(
  values: JoinVerify
): Promise<JoinActionResult> {
  const parsed = joinVerifySchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: "That code didn't work. Try again." };
  }
  await new Promise((resolve) => setTimeout(resolve, 900)); // simulate Twilio check
  // Demo: accept ANY 6 digits. Nothing is verified against a real code or stored.
  return { ok: true };
}
