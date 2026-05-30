import Link from "next/link";
import { Button } from "@/components/ui/button";

export function StoryStrip() {
  return (
    <section className="bg-sixtel-cream">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-2 md:items-center lg:px-8">
        {/* Placeholder image — real interior/cover photo drops in during Block 5 */}
        <div className="aspect-[4/3] rounded-lg bg-secondary" />
        <div>
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Our story
          </p>
          <h2 className="mt-4 font-heading text-3xl text-sixtel-ink md:text-4xl">
            Woman-owned. Veteran-owned. Built for Enterprise.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-foreground/80">
            We opened on Main Street in 2019 with one belief: the best beer is
            the kind you share. Years later, what&apos;s in the glass — twelve
            rotating taps, growler fills, wine slushies, soft-serve margaritas —
            matters less than who&apos;s in the room. Dog-friendly, and built for
            the people who come back every Friday.
          </p>
          <Button asChild className="mt-8" variant="outline">
            <Link href="/story">Read the full story</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
