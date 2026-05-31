import { InfoIcon } from "lucide-react";

/**
 * Shared chrome for legal pages (/privacy, /terms).
 *
 * NOTE: the body copy on these pages is PLACEHOLDER / draft, not legal advice.
 * The draft notice below makes that explicit. Final Privacy Policy + Terms must
 * be reviewed by counsel before launch (see the pre-launch checklist).
 */
export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
      <h1 className="font-heading text-3xl text-sixtel-ink md:text-4xl">
        {title}
      </h1>

      <div
        role="note"
        className="mt-6 flex items-start gap-2 border border-border bg-secondary/60 px-4 py-3 text-sm text-secondary-foreground"
      >
        <InfoIcon className="mt-0.5 size-4 shrink-0" />
        <p>
          <span className="font-semibold">Draft placeholder.</span> This is
          sample copy for the demo. The final {title.toLowerCase()} will be
          reviewed by counsel before launch — it is not a binding legal
          document yet.
        </p>
      </div>

      <div className="mt-10 space-y-8">{children}</div>
    </section>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-heading text-xl text-sixtel-ink">{heading}</h2>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </div>
  );
}
