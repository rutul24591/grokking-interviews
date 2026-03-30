import { create } from "zustand";

type Incident = { id: string; title: string; severity: "high" | "medium"; owner: string | null };
type Store = {
  user: { name: string; role: string };
  theme: "dark" | "night";
  incidents: Incident[];
  toggleTheme: () => void;
  claimIncident: (id: string) => void;
  resolveIncident: (id: string) => void;
};

export const useOpsStore = create<Store>((set) => ({
  user: { name: "Alex Chen", role: "Incident commander" },
  theme: "dark",
  incidents: [
    { id: "inc-1", title: "Checkout latency spike", severity: "high", owner: null },
    { id: "inc-2", title: "Search cache mismatch", severity: "medium", owner: "Mina" }
  ],
  toggleTheme: () => set((state) => ({ theme: state.theme === "dark" ? "night" : "dark" })),
  claimIncident: (id) => set((state) => ({ incidents: state.incidents.map((incident) => incident.id === id ? { ...incident, owner: state.user.name } : incident) })),
  resolveIncident: (id) => set((state) => ({ incidents: state.incidents.filter((incident) => incident.id !== id) }))
}));
