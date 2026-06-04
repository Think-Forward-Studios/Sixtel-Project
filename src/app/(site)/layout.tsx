import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Marketing-site chrome. Lives in the (site) route group so the admin portal
// (which has its own shell) does not inherit the public header/footer.
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
