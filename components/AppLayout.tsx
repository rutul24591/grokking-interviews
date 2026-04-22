import { TopBar } from "@/components/TopBar";
import { ContentArea } from "@/components/ContentArea";
import { Sidebar } from "@/features/sidebar/Sidebar";
import sidebarData from "@/lib/sidebar-data.json";
import type { Domain } from "@/features/sidebar/sidebar.store";

interface RawSubcategory {
  name: string;
  slug: string;
}

interface RawCategory {
  name: string;
  slug: string;
  subcategories: RawSubcategory[];
}

interface RawDomain {
  name: string;
  slug: string;
  categories: RawCategory[];
}

interface RawSidebarData {
  domains: RawDomain[];
}

type AppLayoutProps = {
  children: React.ReactNode;
};

const typedSidebarData = sidebarData as unknown as RawSidebarData;
const domains: Domain[] = typedSidebarData.domains.map((domain) => ({
  id: `domain-${domain.slug}`,
  name: domain.name,
  slug: domain.slug,
  categories: domain.categories.map((cat) => ({
    id: `domain-${domain.slug}-cat-${cat.slug}`,
    name: cat.name,
    slug: cat.slug,
    subcategories: cat.subcategories.map((sub) => ({
      id: `domain-${domain.slug}-cat-${cat.slug}-sub-${sub.slug}`,
      name: sub.name,
      slug: sub.slug,
      topics: [],
    })),
  })),
}));

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="app-shell flex flex-col">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar domains={domains} />
        <ContentArea>{children}</ContentArea>
      </div>
    </div>
  );
}
