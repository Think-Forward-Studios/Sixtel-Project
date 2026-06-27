import { AnnouncementBanner } from "@/components/sixtel/AnnouncementBanner";
import { Hero } from "@/components/sixtel/Hero";
import { TapsSection } from "@/components/sixtel/TapsSection";
import { EventsSection } from "@/components/sixtel/EventsSection";
import { RewardsSection } from "@/components/sixtel/RewardsSection";
import { StorySection } from "@/components/sixtel/StorySection";
import { VisitSection } from "@/components/sixtel/VisitSection";

// Single-page marketing home: each top-nav item scroll-jumps to one of these
// sections (`/#taps`, `/#events`, …). The former standalone routes now
// 301-redirect to the matching anchor (see next.config.ts). AnnouncementBanner
// stays above the Hero — it's the documented thin top band and returns null when
// nothing is active.
export default function Home() {
  return (
    <>
      <AnnouncementBanner />
      <Hero />
      <TapsSection />
      <EventsSection />
      <RewardsSection />
      <StorySection />
      <VisitSection />
    </>
  );
}
