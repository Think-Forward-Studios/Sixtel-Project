import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Sixtel Bottle & Growler House — woman-owned, veteran-owned, and built for Enterprise, Alabama since 2019.",
};

export default function StoryPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
      <p className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Our story
      </p>
      <h1 className="mt-4 font-heading text-3xl text-sixtel-ink md:text-4xl">
        Woman-owned. Veteran-owned. Built for Enterprise.
      </h1>

      <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-lg bg-secondary">
        <Image
          src="/photos/story.jpg"
          alt="Inside Sixtel on a busy night"
          fill
          sizes="(min-width: 768px) 768px, 100vw"
          className="object-cover"
        />
      </div>

      <div className="mt-10 space-y-6 text-base leading-relaxed text-foreground/80">
        <p>
          We opened on Main Street in Enterprise in 2019 with one belief: the
          best beer is the kind you share.
        </p>
        <p>
          Years later, what&apos;s in the glass — twelve rotating taps, growler
          fills, wine slushies, soft-serve margaritas — still matters less than
          who&apos;s in the room. We&apos;re dog-friendly, and built for the
          people who come back every Friday.
        </p>
        <p>
          What started as a corner shop is now a community: thousands of
          neighbors on Facebook and tens of thousands of Untappd check-ins
          later, the regulars are what keep this place humming.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Button asChild>
          <Link href="/visit">Come see us</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/join">Join Sixtel Rewards</Link>
        </Button>
      </div>
    </section>
  );
}
