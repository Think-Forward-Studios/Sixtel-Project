import { TapCard } from "@/components/sixtel/TapCard";
import { getVisibleTaps } from "@/lib/taps-data";
import { SOCIALS } from "@/lib/site";

const extras = [
  {
    title: "Growler & crowler fills",
    body: "Take your favorite pour home — we fill growlers and seal crowlers to go.",
  },
  {
    title: "Wine slushies",
    body: "Rotating flavors. Recent pours: Green Apple, Hurricane, Mango, Strawberry.",
  },
  {
    title: "Soft-serve margaritas",
    body: "Strawberry and Mango, returning periodically.",
  },
  {
    title: "Craft package",
    body: "A wall of cans and bottles to pick from and take home.",
  },
];

// "Taps" section of the single-page home — the full visible tap list + extras.
export async function TapsSection() {
  const taps = await getVisibleTaps();

  return (
    <section
      id="taps"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <h2 className="font-heading text-3xl text-sixtel-ink md:text-4xl">
        On Tap
      </h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Our current lineup, updated as we change it. For check-ins and ratings,
        find us on{" "}
        <a
          href={SOCIALS.untappd}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          Untappd
        </a>
        .
      </p>

      {taps.length > 0 ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {taps.map((tap) => (
            <TapCard key={tap.id} tap={tap} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-muted-foreground">
          No taps are listed right now — check back soon.
        </p>
      )}

      <div className="mt-16">
        <h3 className="font-heading text-2xl text-sixtel-ink">More than beer</h3>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {extras.map((item) => (
            <div key={item.title}>
              <h4 className="font-heading text-lg text-sixtel-ink">
                {item.title}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
