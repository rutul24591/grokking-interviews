"use client";

import { useEffect, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { ContentArea } from "@/components/ContentArea";
import sidebarData from "@/lib/sidebar-data.json";
import type { Domain } from "@/features/sidebar/sidebar.store";

type AppLayoutProps = {
  children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const [domains, setDomains] = useState<Domain[]>([]);

  useEffect(() => {
    // Convert sidebar JSON to Domain format for sidebar component
    const parsed = sidebarData.domains.map((domain: any) => ({
      id: `domain-${domain.slug}`,
      name: domain.name,
      slug: domain.slug,
      categories: domain.categories.map((cat: any) => ({
        id: `domain-${domain.slug}-cat-${cat.slug}`,
        name: cat.name,
        slug: cat.slug,
        subcategories: cat.subcategories.map((sub: any) => ({
          id: `domain-${domain.slug}-cat-${cat.slug}-sub-${sub.slug}`,
          name: sub.name,
          slug: sub.slug,
          topics: [], // Topics will be loaded from registry
        })),
      })),
    }));
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
