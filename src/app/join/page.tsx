import type { Metadata } from "next";
import { InfoIcon } from "lucide-react";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JoinForm } from "./JoinForm";

export const metadata: Metadata = {
  title: "Join Sixtel Rewards",
  description:
    "Sign up for Sixtel Rewards — earn points on every pour and pickup in Enterprise, Alabama.",
};

export default function JoinPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:py-24">
          <h1 className="font-heading text-3xl text-sixtel-ink md:text-4xl">
            Join Sixtel Rewards
          </h1>
          <p className="mt-2 text-muted-foreground">
            Points on every pour and pickup. Members-only nights. Birthday
            treats.
          </p>

          {/*
            Honest-demo notice (added per the Codex adversarial review): this
            /join is a non-functional PREVIEW and must not imply a real signup.
            The form below validates and simulates success but stores nothing.
          */}
          <div
            role="note"
            className="mt-6 flex items-start gap-2 border border-border bg-secondary/60 px-4 py-3 text-sm text-secondary-foreground"
          >
            <InfoIcon className="mt-0.5 size-4 shrink-0" />
            <p>
              <span className="font-semibold">Preview / demo.</span> Nothing you
              enter here is saved or sent, and no account is created. The real
              signup is coming soon.
            </p>
          </div>

          <div className="mt-8">
            <JoinForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
