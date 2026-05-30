export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto py-16 space-y-8">
        <div>
          <h1 className="font-heading text-5xl text-sixtel-ink">
            Sixtel Bottle &amp; Growler House
          </h1>
          <p className="mt-4 text-muted-foreground">Design tokens preview</p>
        </div>
        <div className="flex gap-4">
          <div className="size-24 rounded-lg bg-primary" />
          <div className="size-24 rounded-lg bg-secondary" />
          <div className="size-24 rounded-lg bg-accent" />
          <div className="size-24 rounded-lg bg-sixtel-copper" />
          <div className="size-24 rounded-lg bg-sixtel-cream border border-border" />
        </div>
      </section>
    </main>
  );
}
