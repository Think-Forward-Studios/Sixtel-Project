import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/taps", label: "Taps" },
  { href: "/events", label: "Events" },
  { href: "/rewards", label: "Rewards" },
  { href: "/story", label: "Story" },
  { href: "/visit", label: "Visit" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/brand/logo-square.jpg"
            alt="Sixtel"
            width={36}
            height={36}
            priority
            className="size-9 rounded-full object-cover"
          />
          <span className="font-heading text-lg text-sixtel-ink">Sixtel</span>
        </Link>

        <nav className="hidden gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button asChild>
            <Link href="/join">Join Rewards</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
