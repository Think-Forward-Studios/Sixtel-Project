"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

// Publishes the id of the home-page section currently under the sticky header so
// the nav can highlight it. Split into value + setter contexts so the setter (a
// stable useState dispatch) never re-renders consumers that only read the value.
const ActiveSectionContext = createContext<string | null>(null);
const SetActiveSectionContext = createContext<(id: string | null) => void>(() => {});

export function ActiveSectionProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  return (
    <SetActiveSectionContext.Provider value={setActiveId}>
      <ActiveSectionContext.Provider value={activeId}>
        {children}
      </ActiveSectionContext.Provider>
    </SetActiveSectionContext.Provider>
  );
}

export function useActiveSection() {
  return useContext(ActiveSectionContext);
}

export function useSetActiveSection() {
  return useContext(SetActiveSectionContext);
}
