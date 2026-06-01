export type SixtelEvent = {
  title: string;
  date: string;
  membersOnly: boolean;
  image: string;
  // Portrait promo flyers are shown "contain" (whole flyer, dark backdrop)
  // instead of "cover" so their text isn't cropped by the landscape card.
  fit?: "cover" | "contain";
};

// Real recurring event types from Sixtel's socials, with owned promo/photos.
// Follow Facebook for exact dates and one-offs (see SOCIALS.facebook).
export const events: SixtelEvent[] = [
  { title: "Top Trivia: Name That Tune", date: "Wed evenings", membersOnly: false, image: "/photos/events/trivia.jpg" },
  { title: "Mini Sixtel Menu Launch — Annie's Cafe Collab", date: "Next weekend", membersOnly: false, image: "/photos/events/annies-menu.jpg", fit: "contain" },
  { title: "Weekend Wine Slushie Flight", date: "Fri & Sat", membersOnly: false, image: "/photos/events/slushies.jpg" },
];
