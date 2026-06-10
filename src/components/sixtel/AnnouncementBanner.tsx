import Markdown from "react-markdown";

import { getActiveAnnouncement } from "@/lib/announcement-data";

// Thin warm-toned band between the Header and the Hero on the home page.
// Returns null when no announcement is active, so the layout closes the gap.
export async function AnnouncementBanner() {
  const announcement = await getActiveAnnouncement();
  if (!announcement) return null;

  return (
    <div className="border-b border-sixtel-copper/25 bg-sixtel-copper/10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-x-3 gap-y-1 px-4 py-3 text-center sm:flex-row sm:justify-center sm:px-6 lg:px-8">
        <p className="font-semibold text-sixtel-ink">{announcement.title}</p>
        {announcement.body && (
          <div className="text-sm text-muted-foreground [&_a]:text-sixtel-copper [&_a]:underline [&_p]:inline [&_strong]:font-semibold [&_strong]:text-sixtel-ink">
            <Markdown>{announcement.body}</Markdown>
          </div>
        )}
        {announcement.linkUrl && announcement.linkLabel && (
          <a
            href={announcement.linkUrl}
            className="text-sm font-medium text-sixtel-copper underline underline-offset-2"
          >
            {announcement.linkLabel} →
          </a>
        )}
      </div>
    </div>
  );
}
