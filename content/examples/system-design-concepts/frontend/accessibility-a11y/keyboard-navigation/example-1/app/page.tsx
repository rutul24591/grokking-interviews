"use client";

import { useMemo, useState } from "react";
import { Toolbar } from "@/components/Toolbar";

export default function Page() {
  const actions = useMemo(
    () => [
      { id: "bold", label: "Bold" },
      { id: "italic", label: "Italic" },
      { id: "underline", label: "Underline" },
      { id: "code", label: "Code" },
      { id: "link", label: "Link" }
    ],
    []
  );
  const [active, setActive] = useState(actions[0]!.id);

  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Keyboard navigation: roving tabindex</h1>
        <p className="mt-2 text-slate-300">
          Tab once to enter the toolbar. Use Arrow keys to move focus between controls.
        </p>
      </header>

      <Toolbar
        label="Formatting"
        items={actions}
        activeId={active}
        onActivate={(id) => setActive(id)}
      />

      <section className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
        <h2 className="text-base font-semibold text-slate-100">Why roving tabindex</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Prevents Tab from stopping on every item in a dense widget.</li>
          <li>Keeps Arrow keys for internal navigation, matching platform conventions.</li>
          <li>Scales to toolbars, listboxes, menus, and composite widgets.</li>
        </ul>
      </section>
    </main>
  );
}

