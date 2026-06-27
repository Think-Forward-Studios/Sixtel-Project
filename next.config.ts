import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The marketing site is a single-page scroll layout: the former standalone
  // routes are now sections on the home page. 301-redirect the old paths to
  // their anchors so existing links, bookmarks, and search results keep working.
  async redirects() {
    return [
      { source: "/taps", destination: "/#taps", permanent: true },
      { source: "/events", destination: "/#events", permanent: true },
      { source: "/rewards", destination: "/#rewards", permanent: true },
      { source: "/story", destination: "/#story", permanent: true },
      { source: "/visit", destination: "/#visit", permanent: true },
    ];
  },
};

export default nextConfig;
