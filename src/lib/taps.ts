export type Tap = {
  name: string;
  brewery: string;
  style: string;
  abv: number;
  image: string;
};

// Real taps from the live Untappd list (May 29, 2026), with label/can art.
// (Orange Crush art is a low-res Untappd thumbnail — swap for higher-res later.)
// The on-site lineup is 12 rotating taps; this is a representative sample —
// the live/full list lives on Untappd (see SOCIALS.untappd).
export const taps: Tap[] = [
  { name: "Orange Crush", brewery: "Hidden Springs Ale Works", style: "Wheat Beer", abv: 5.2, image: "/photos/taps/tap-orange-crush.jpg" },
  { name: "ORNG Double IPA", brewery: "Wild Leap Brew Co.", style: "IPA — Hazy", abv: 8.2, image: "/photos/taps/tap-orng.jpg" },
  { name: "Hey Girl Hey!", brewery: "Old Black Bear Brewing Co.", style: "Sour — Berliner Weisse", abv: 4.6, image: "/photos/taps/tap-hey-girl-hey.jpg" },
  { name: "S'mores Stout", brewery: "Martin House Brewing Company", style: "Stout — Imperial", abv: 9.2, image: "/photos/taps/tap-smores-stout.jpg" },
];
