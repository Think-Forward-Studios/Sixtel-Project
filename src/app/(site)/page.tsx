import { AnnouncementBanner } from "@/components/sixtel/AnnouncementBanner";
import { Hero } from "@/components/sixtel/Hero";
import { TapsTeaser } from "@/components/sixtel/TapsTeaser";
import { StoryStrip } from "@/components/sixtel/StoryStrip";
import { EventsTeaser } from "@/components/sixtel/EventsTeaser";
import { VisitStrip } from "@/components/sixtel/VisitStrip";

export default function Home() {
  return (
    <>
      <AnnouncementBanner />
      <Hero />
      <TapsTeaser />
      <StoryStrip />
      <EventsTeaser />
      <VisitStrip />
    </>
  );
}
