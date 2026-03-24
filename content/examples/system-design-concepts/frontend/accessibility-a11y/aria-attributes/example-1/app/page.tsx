"use client";

import { Tabs } from "@/components/Tabs";

export default function Page() {
  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">ARIA attributes: Tabs</h1>
        <p className="mt-2 text-slate-300">
          This implements the ARIA Tab pattern. Try keyboard: ArrowLeft/ArrowRight and Home/End.
        </p>
      </header>

      <Tabs
        label="Settings"
        tabs={[
          {
            id: "profile",
            title: "Profile",
            content:
              "Profile content. In the DOM this is a tabpanel labelled by the selected tab via aria-labelledby."
          },
          {
            id: "billing",
            title: "Billing",
            content: "Billing content. Tabs are buttons with role=tab and aria-selected."
          },
          {
            id: "security",
            title: "Security",
            content: "Security content. Panels are not removed from DOM; inactive panels are hidden."
          }
        ]}
      />

      <section className="rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
        <h2 className="text-base font-semibold text-slate-100">Production notes</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            Prefer native semantics first. Use ARIA patterns for custom widgets (tabs, combobox), not for styling divs.
          </li>
          <li>
            Keep the selected tab focusable; other tabs should still be reachable with arrow keys.
          </li>
          <li>
            Ensure tab titles are meaningful; they become the accessible name of the tab.
          </li>
        </ul>
      </section>
    </main>
  );
}

