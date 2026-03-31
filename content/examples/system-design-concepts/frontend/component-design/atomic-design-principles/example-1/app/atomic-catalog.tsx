"use client";

import { useEffect, useState } from "react";

type Inventory = {
  atoms: string[];
  molecules: { name: string; atoms: string[] }[];
  organisms: { name: string; molecules: string[]; purpose: string }[];
  templates: { id: string; name: string; headline: string; sections: string[] }[];
  notes: string[];
};

function Atom({ label }: { label: string }) {
  return <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">{label}</span>;
}

function MoleculeCard({ title, atoms }: { title: string; atoms: string[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-950">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">{atoms.map((atom) => <Atom key={atom} label={atom} />)}</div>
    </div>
  );
}

function OrganismPanel({ title, molecules, purpose }: { title: string; molecules: string[]; purpose: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{purpose}</p>
      <div className="mt-4 grid gap-3">{molecules.map((molecule) => <MoleculeCard key={molecule} title={molecule} atoms={["Button", "Text", "Icon"]} />)}</div>
    </div>
  );
}

export default function AtomicCatalog() {
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [templateId, setTemplateId] = useState<string>("");

  useEffect(() => {
    void (async () => {
      const response = await fetch("http://localhost:4521/inventory");
      const result = (await response.json()) as Inventory;
      setInventory(result);
      setTemplateId(result.templates[0]?.id ?? "");
    })();
  }, []);

  const activeTemplate = inventory?.templates.find((template) => template.id === templateId) ?? inventory?.templates[0];
  const activeOrganisms = inventory?.organisms.slice(0, 2) ?? [];

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Inventory by layer</h2>
        <div className="mt-4 space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Atoms</p>
            <div className="mt-3 flex flex-wrap gap-2">{inventory?.atoms.map((atom) => <Atom key={atom} label={atom} />)}</div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Molecules</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">{inventory?.molecules.map((molecule) => <MoleculeCard key={molecule.name} title={molecule.name} atoms={molecule.atoms} />)}</div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Template selector</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {inventory?.templates.map((template) => (
                <button
                  key={template.id}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${template.id === activeTemplate?.id ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700"}`}
                  onClick={() => setTemplateId(template.id)}
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </article>

      <article className="space-y-6">
        {activeOrganisms.map((organism) => (
          <OrganismPanel key={organism.name} title={organism.name} molecules={organism.molecules} purpose={organism.purpose} />
        ))}
        <div className="rounded-3xl border border-slate-200 bg-indigo-50 p-6">
          <h2 className="text-xl font-semibold text-slate-950">Active page assembly</h2>
          <p className="mt-3 text-sm text-slate-700">{activeTemplate?.headline}</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">{activeTemplate?.sections.map((section) => <li key={section}>• {section}</li>)}</ul>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">{inventory?.notes.map((note) => <li key={note}>• {note}</li>)}</ul>
        </div>
      </article>
    </section>
  );
}
