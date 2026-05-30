import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sixtel/Hero";
import { TapsTeaser } from "@/components/sixtel/TapsTeaser";
import { StoryStrip } from "@/components/sixtel/StoryStrip";
import { EventsTeaser } from "@/components/sixtel/EventsTeaser";
import { VisitStrip } from "@/components/sixtel/VisitStrip";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <TapsTeaser />
        <StoryStrip />
        <EventsTeaser />
        <VisitStrip />
      </main>
      <Footer />
    </>
  );
}
