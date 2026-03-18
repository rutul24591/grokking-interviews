"use client";

import { useEffect, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { ContentArea } from "@/components/ContentArea";
import { parseHierarchy } from "@/lib/parseHierarchy";
import hierarchyData from "@/lib/hierarchy-data.json";
import type { Domain } from "@/features/sidebar/sidebar.store";

type AppLayoutProps = {
  children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const [domains, setDomains] = useState<Domain[]>([]);

  useEffect(() => {
    // Parse hierarchy data on mount
    const parsed = parseHierarchy(hierarchyData.content);
    setDomains(parsed);
  }, []);

  // Dynamically import Sidebar to avoid SSR issues
  const [Sidebar, setSidebar] = useState<React.ComponentType<{ domains: Domain[] }> | null>(null);

  useEffect(() => {
    import("@/features/sidebar/Sidebar").then((mod) => {
      setSidebar(() => mod.Sidebar);
    });
  }, []);

  return (
    <div className="app-shell flex flex-col">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        {Sidebar && domains.length > 0 && <Sidebar domains={domains} />}
        <ContentArea>{children}</ContentArea>
      </div>
    </div>
  );
}
