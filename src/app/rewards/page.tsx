import type { Metadata } from "next";
import Link from "next/link";
import { Star, CalendarDays, Cake } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Rewards",
  description:
    "Sixtel Rewards — earn points on every pour and pickup, members-only nights, and birthday treats. Join free with your phone.",
};

const benefits = [
  {
    icon: Star,
    title: "Points on every pour & pickup",
    body: "Earn on what you already buy — pints, growler fills, and cans for the road.",
  },
  {
    icon: CalendarDays,
    title: "Members-only nights",
    body: "First dibs on tap takeovers, releases, and members-only events.",
  },
  {
    icon: Cake,
    title: "Birthday treats",
    body: "We mark your birthday with a little something on us.",
  },
];

export default function RewardsPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
      <h1 className="font-heading text-3xl text-sixtel-ink md:text-4xl">
        Sixtel Rewards
      </h1>
      <p className="mt-2 text-muted-foreground">
        For the regulars who make this place what it is. Free to join — all you
        need is your phone number.
      </p>

      <div className="mt-10 space-y-8">
        {benefits.map((benefit) => (
          <div key={benefit.title} className="flex items-start gap-4">
            <benefit.icon className="mt-1 size-6 shrink-0 text-sixtel-copper" />
            <div>
              <h2 className="font-heading text-xl text-sixtel-ink">
                {benefit.title}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {benefit.body}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 border-t border-border pt-8">
        <h2 className="font-heading text-xl text-sixtel-ink">How to join</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Sign up with your mobile number, then show it at the counter to earn
          on every visit. That&apos;s it.
        </p>
        <Button asChild className="mt-6">
          <Link href="/join">Join Sixtel Rewards</Link>
        </Button>
      </div>
    </section>
  );
}
