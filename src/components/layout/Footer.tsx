import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <p className="font-heading text-xl text-sixtel-ink">Sixtel</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Bottle &amp; Growler House
            <br />
            Enterprise, Alabama
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Explore
          </p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/#taps">On tap</Link></li>
            <li><Link href="/#events">Events</Link></li>
            <li><Link href="/#rewards">Rewards</Link></li>
            <li><Link href="/#story">Story</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Connect
          </p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <a
                href="https://www.facebook.com/SixtelBottleandGrowlerHouse/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/sixtelbgh/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://untappd.com/v/sixtel-bottle-and-growler-house/8431111"
                target="_blank"
                rel="noopener noreferrer"
              >
                Untappd
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Legal
          </p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/privacy">Privacy</Link></li>
            <li><Link href="/terms">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-border px-4 pt-6 text-xs text-muted-foreground sm:px-6 lg:px-8">
        © {new Date().getFullYear()} Sixtel Bottle &amp; Growler House.
        Woman-owned and veteran-owned.
      </div>
    </footer>
  );
}
