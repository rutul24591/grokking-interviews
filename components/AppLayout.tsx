"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "@/features/sidebar/Sidebar";
import { TopBar } from "@/components/TopBar";
import { ContentArea } from "@/components/ContentArea";
import { useSidebarStore } from "@/features/sidebar/sidebar.store";
import { useSyncUrlToState } from "@/lib/hooks/useSyncUrlToState";
import { FrontendDataProvider } from "@/lib/frontend-data-context";
import type { SubCategoryItem } from "@/types/content";

type AppLayoutProps = {
  children: React.ReactNode;
  frontendSubCategories: SubCategoryItem[];
};

export function AppLayout({ children, frontendSubCategories }: AppLayoutProps) {
  const mobileOpen = useSidebarStore((state) => state.mobileOpen);
  const setMobileOpen = useSidebarStore((state) => state.setMobileOpen);

  // Sync URL with sidebar state
  useSyncUrlToState();

  return (
    <div className="app-shell flex flex-col bg-theme text-theme">
      <TopBar />
      <div className="mx-auto flex min-h-0 w-full max-w-[1400px] flex-1 gap-6 px-4 py-6 lg:px-6">
        <aside className="hidden h-full w-[280px] flex-shrink-0 rounded-2xl border border-theme bg-panel shadow-soft-theme lg:block">
          <Sidebar frontendSubCategories={frontendSubCategories} />
        </aside>
        <ContentArea>
          <FrontendDataProvider data={frontendSubCategories}>
            {children}
          </FrontendDataProvider>
        </ContentArea>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex items-start justify-start bg-black/40 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.aside
              className="m-4 h-[calc(var(--app-vh)-2rem)] w-[min(85vw,320px)] rounded-2xl border border-theme bg-panel shadow-strong-theme"
              initial={{ x: -24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -24, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
            >
              <Sidebar frontendSubCategories={frontendSubCategories} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
