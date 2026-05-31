import { Hero } from "@/components/sixtel/Hero";
import { TapsTeaser } from "@/components/sixtel/TapsTeaser";
import { StoryStrip } from "@/components/sixtel/StoryStrip";
import { EventsTeaser } from "@/components/sixtel/EventsTeaser";
import { VisitStrip } from "@/components/sixtel/VisitStrip";

export default function Home() {
  return (
    <>
      <Hero />
      <TapsTeaser />
      <StoryStrip />
      <EventsTeaser />
      <VisitStrip />
    </>
  );
}
