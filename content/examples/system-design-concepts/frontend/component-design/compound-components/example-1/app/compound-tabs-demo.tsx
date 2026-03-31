"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type TabDef = { id: string; label: string; body: string; stats: string[] };
const TabsContext = createContext<{ active: string; setActive: (id: string) => void; tabs: TabDef[] } | null>(null);

function Tabs({ defaultActive, tabs, children }: { defaultActive: string; tabs: TabDef[]; children: ReactNode }) {
  const [active, setActive] = useState(defaultActive);
  const value = useMemo(() => ({ active, setActive, tabs }), [active, tabs]);
  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
}
function TabList({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}
function Tab({ id, children }: { id: string; children: ReactNode }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tab must be used within Tabs");
  return <button className={`rounded-full px-4 py-2 text-sm font-semibold ${context.active === id ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700"}`} onClick={() => context.setActive(id)}>{children}</button>;
}
function TabPanels({ tabs }: { tabs: TabDef[] }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabPanels must be used within Tabs");
  const active = tabs.find((tab) => tab.id === context.active) ?? tabs[0];
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-950">{active.label}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-700">{active.body}</p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {active.stats.map((stat) => <li key={stat} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">{stat}</li>)}
      </ul>
    </div>
  );
}
function ActiveSummary() {
  const context = useContext(TabsContext);
  if (!context) throw new Error("ActiveSummary must be used within Tabs");
  const current = context.tabs.find((tab) => tab.id === context.active);
  return <div className="rounded-3xl border border-slate-200 bg-indigo-50 p-5 text-sm text-slate-700">Active section: <span className="font-semibold text-slate-950">{current?.label}</span></div>;
}

export default function CompoundTabsDemo() {
  const [tabs, setTabs] = useState<TabDef[]>([]);
  useEffect(() => {
    void (async () => {
      const response = await fetch("http://localhost:4524/tabs");
      setTabs((await response.json()) as TabDef[]);
    })();
  }, []);
  if (tabs.length === 0) return null;
  return (
    <section className="mt-8 space-y-5">
      <Tabs defaultActive={tabs[0].id} tabs={tabs}>
        <TabList>{tabs.map((tab) => <Tab key={tab.id} id={tab.id}>{tab.label}</Tab>)}</TabList>
        <ActiveSummary />
        <TabPanels tabs={tabs} />
      </Tabs>
    </section>
  );
}
