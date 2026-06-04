"use client";

import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheckIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import {
  AGE_GATE_TEXT,
  SMS_CONSENT_TEXT,
  joinDetailsSchema,
  joinVerifySchema,
  toE164Demo,
} from "@/lib/join-schema";
import { joinInit, joinVerify } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Step = "details" | "verify" | "done";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1));

// Matches the underline style of <Input> so the birthday selects feel native.
const selectClass =
  "h-10 w-full border border-transparent border-b-input bg-transparent px-0 text-base outline-none focus-visible:border-b-ring md:text-sm";

export function JoinForm() {
  const [step, setStep] = useState<Step>("details");
  const [phoneDisplay, setPhoneDisplay] = useState("");

  const detailsForm = useForm({
    resolver: zodResolver(joinDetailsSchema),
    defaultValues: {
      phone: "",
      displayName: "",
      birthdayMonth: "",
      birthdayDay: "",
      isOfAge: false,
      smsConsent: false,
    },
  });

  const verifyForm = useForm({
    resolver: zodResolver(joinVerifySchema),
    defaultValues: { code: "" },
  });

  // Both forms stay mounted across steps, so going Back preserves Step-1 values.
  const onDetails = detailsForm.handleSubmit(async (values) => {
    const res = await joinInit(values);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    setPhoneDisplay(toE164Demo(values.phone));
    setStep("verify");
    toast("Demo — pretend we texted you a code. Enter any 6 digits.");
  });

  const onVerify = verifyForm.handleSubmit(async (values) => {
    const res = await joinVerify(values);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    setStep("done");
    toast.success("Preview complete — nothing was saved.");
  });

  const detailsErrors = detailsForm.formState.errors;
  const isSending = detailsForm.formState.isSubmitting;
  const verifyErrors = verifyForm.formState.errors;
  const isVerifying = verifyForm.formState.isSubmitting;

  return (
    <Card className="overflow-hidden">
      {step === "details" && (
        <form onSubmit={onDetails} noValidate>
          <CardHeader>
            <CardTitle className="font-heading text-xl text-sixtel-ink">
              Create your account
            </CardTitle>
            <CardDescription>
              Start with your mobile number. Name and birthday are optional.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="phone">Mobile number</Label>
              <Input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="(334) 555-0142"
                aria-invalid={!!detailsErrors.phone}
                {...detailsForm.register("phone")}
              />
              {detailsErrors.phone && (
                <p className="text-xs text-destructive">
                  {detailsErrors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="displayName">
                First name{" "}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="displayName"
                autoComplete="given-name"
                placeholder="Alex"
                {...detailsForm.register("displayName")}
              />
            </div>

            <div className="space-y-1.5">
              <Label>
                Birthday{" "}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <select
                  aria-label="Birthday month"
                  className={selectClass}
                  {...detailsForm.register("birthdayMonth")}
                >
                  <option value="">Month</option>
                  {MONTHS.map((m, i) => (
                    <option key={m} value={String(i + 1)}>
                      {m}
                    </option>
                  ))}
                </select>
                <select
                  aria-label="Birthday day"
                  className={selectClass}
                  {...detailsForm.register("birthdayDay")}
                >
                  <option value="">Day</option>
                  {DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              {detailsErrors.birthdayDay && (
                <p className="text-xs text-destructive">
                  {detailsErrors.birthdayDay.message}
                </p>
              )}
            </div>

            {/*
              PLACEHOLDER consent UI — NOT legal-reviewed/final. Per the page-level
              "Preview / demo" banner, NOTHING here is captured or stored.
              TODO(real signup): replace copy with counsel-approved text and persist
              the EXACT shown string to consent_records.consent_text.
            */}
            <div className="space-y-3 border-t border-border pt-5">
              <div className="flex items-start gap-2">
                <Controller
                  name="isOfAge"
                  control={detailsForm.control}
                  render={({ field }) => (
                    <Checkbox
                      id="isOfAge"
                      className="mt-0.5"
                      checked={field.value}
                      onCheckedChange={(c) => field.onChange(c === true)}
                      aria-invalid={!!detailsErrors.isOfAge}
                    />
                  )}
                />
                <Label htmlFor="isOfAge" className="leading-snug">
                  {AGE_GATE_TEXT}
                </Label>
              </div>
              {detailsErrors.isOfAge && (
                <p className="text-xs text-destructive">
                  {detailsErrors.isOfAge.message}
                </p>
              )}

              <div className="flex items-start gap-2">
                <Controller
                  name="smsConsent"
                  control={detailsForm.control}
                  render={({ field }) => (
                    <Checkbox
                      id="smsConsent"
                      className="mt-0.5"
                      checked={field.value}
                      onCheckedChange={(c) => field.onChange(c === true)}
                      aria-invalid={!!detailsErrors.smsConsent}
                    />
                  )}
                />
                <Label htmlFor="smsConsent" className="leading-snug">
                  {SMS_CONSENT_TEXT}
                </Label>
              </div>
              {detailsErrors.smsConsent && (
                <p className="text-xs text-destructive">
                  {detailsErrors.smsConsent.message}
                </p>
              )}

              <p className="text-xs text-muted-foreground">
                See our{" "}
                <Link href="/privacy" className="underline underline-offset-2">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="/terms" className="underline underline-offset-2">
                  Terms
                </Link>
                .
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isSending}>
              {isSending ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" /> Sending…
                </>
              ) : (
                "Send my code"
              )}
            </Button>
          </CardContent>
        </form>
      )}

      {step === "verify" && (
        <form onSubmit={onVerify} noValidate>
          <CardHeader>
            <CardTitle className="font-heading text-xl text-sixtel-ink">
              Enter your code
            </CardTitle>
            <CardDescription>
              We sent a 6-digit code to {phoneDisplay || "your phone"}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="code" className="sr-only">
                Verification code
              </Label>
              <Input
                id="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="------"
                aria-invalid={!!verifyErrors.code}
                className="text-center font-mono text-2xl tracking-[0.5em]"
                {...verifyForm.register("code")}
              />
              {verifyErrors.code && (
                <p className="text-center text-xs text-destructive">
                  {verifyErrors.code.message}
                </p>
              )}
              <p className="text-center text-xs text-muted-foreground">
                Demo mode — any 6 digits will work.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setStep("details")}
                disabled={isVerifying}
              >
                Back
              </Button>
              <Button type="submit" className="flex-1" disabled={isVerifying}>
                {isVerifying ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin" /> Verifying…
                  </>
                ) : (
                  "Verify"
                )}
              </Button>
            </div>
          </CardContent>
        </form>
      )}

      {step === "done" && (
        <CardContent className="space-y-4 py-10 text-center">
          <CircleCheckIcon className="mx-auto size-12 text-sixtel-copper" />
          <div className="space-y-1">
            <h2 className="font-heading text-2xl text-sixtel-ink">
              Thanks for the preview
            </h2>
            <p className="text-sm text-muted-foreground">
              This is a design preview — nothing was saved and no account was
              created. The real Sixtel Rewards signup is coming soon.
            </p>
          </div>
          <Button asChild className="w-full">
            <Link href="/">Back to home</Link>
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
