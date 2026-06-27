import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ActiveSectionProvider } from "@/components/layout/ActiveSectionContext";
import { ActiveSectionTracker } from "@/components/layout/ActiveSectionTracker";

// Marketing-site chrome. Lives in the (site) route group so the admin portal
// (which has its own shell) does not inherit the public header/footer. The
// ActiveSection provider + tracker drive nav highlighting on the single-page home.
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ActiveSectionProvider>
      <ActiveSectionTracker />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </ActiveSectionProvider>
  );
}
