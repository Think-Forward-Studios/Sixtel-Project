import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Background photo (beer flight) + dark scrim for text legibility */}
      <Image
        src="/photos/hero.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-sixtel-ink/75" />
      <div className="mx-auto max-w-7xl px-4 py-24 text-center text-primary-foreground sm:px-6 md:py-32 lg:px-8">
        <p className="font-sans text-xs uppercase tracking-[0.2em] text-primary-foreground/80">
          Enterprise, Alabama · Since 2019
        </p>
        <h1 className="mt-6 font-heading text-4xl leading-tight md:text-6xl">
          The best Craft Package &amp; Growler Fill Spot in Enterprise
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-primary-foreground/90 md:text-lg">
          Come in, have a pint, and decide what delicious beers you&apos;ll take
          home. Twelve rotating taps, wine slushies, soft-serve margaritas,
          growler fills — and the community we&apos;ve built around them.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/join">Join Sixtel Rewards</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/#taps">See what&apos;s pouring</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
