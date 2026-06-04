"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2Icon, MailCheckIcon } from "lucide-react";
import { toast } from "sonner";

import { getBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
});
type LoginValues = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  const onSubmit = handleSubmit(async ({ email }: LoginValues) => {
    const supabase = getBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Only pre-invited admins can sign in — no self-signup.
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/admin/auth/callback`,
      },
    });
    // Always show the neutral "sent" state (don't reveal which emails exist).
    if (error) {
      // Real delivery/config errors still surface; enumeration is avoided by
      // Supabase returning success for unknown emails when shouldCreateUser=false.
      console.error("signInWithOtp error:", error.message);
    }
    setSent(true);
    toast.success("If that email is an admin, a sign-in link is on its way.");
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-heading text-2xl text-sixtel-ink">
            Sixtel Admin
          </CardTitle>
          <CardDescription>
            Sign in with a magic link sent to your email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <MailCheckIcon className="mt-0.5 size-5 shrink-0 text-sixtel-copper" />
              <p>
                Check your inbox. If that email belongs to an admin, a sign-in
                link is on its way — click it to continue. You can close this
                tab.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@thinkforwardstudio.com"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin" /> Sending…
                  </>
                ) : (
                  "Send magic link"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
