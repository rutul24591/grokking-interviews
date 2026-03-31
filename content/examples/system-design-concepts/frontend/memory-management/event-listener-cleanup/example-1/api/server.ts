import express from "express";

const app = express();
app.use(express.json());
type ListenerRecord = { active: boolean; staleClosure: boolean; duplicateRisk: boolean };
type PanelRecord = { label: string; listeners: Record<string, ListenerRecord> };

function createPanels(): Record<string, PanelRecord> {
  return {
    analytics: {
      label: "Analytics panel",
      listeners: {
        visibilitychange: { active: true, staleClosure: false, duplicateRisk: false },
        pagehide: { active: true, staleClosure: false, duplicateRisk: false }
      }
    },
    shortcuts: {
      label: "Keyboard shortcuts",
      listeners: {
        keydown: { active: true, staleClosure: false, duplicateRisk: false }
      }
    }
  };
}

let panels = createPanels();
const logs: string[] = [];

app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  next();
});
app.options("*", (_, res) => res.sendStatus(204));

app.get("/state", (_, res) => {
  const panelEntries = Object.entries(panels).map(([panelId, panel]) => ({
    panelId,
    label: panel.label,
    listeners: Object.entries(panel.listeners).map(([event, record]) => ({ event, ...record }))
  }));
  const activeListeners = panelEntries.flatMap((panel) => panel.listeners).filter((listener) => listener.active).length;
  const added = panelEntries.flatMap((panel) => panel.listeners).filter((listener) => listener.active || listener.duplicateRisk).length;
  const removed = panelEntries.flatMap((panel) => panel.listeners).filter((listener) => !listener.active && !listener.duplicateRisk).length;
  res.json({ activeListeners, added, removed, panels: panelEntries, logs: logs.slice(0, 8) });
});

app.post("/listener/action", (req, res) => {
  const actionId = String(req.body?.actionId ?? "");
  const panelId = String(req.body?.panelId ?? "");
  const event = String(req.body?.event ?? "");
  const panel = panels[panelId];
  if (!panel) return res.status(404).json({ error: "Panel not found" });

  if (actionId === "detach-panel") {
    Object.values(panel.listeners).forEach((listener) => {
      listener.active = false;
      listener.duplicateRisk = false;
    });
    logs.unshift(`Detached listeners for ${panel.label}.`);
  }

  if (actionId === "attach-panel") {
    Object.values(panel.listeners).forEach((listener) => {
      if (listener.active) listener.duplicateRisk = true;
      listener.active = true;
    });
    logs.unshift(`Attached listeners for ${panel.label}.`);
  }

  if (actionId === "toggle-stale" && panel.listeners[event]) {
    panel.listeners[event].staleClosure = !panel.listeners[event].staleClosure;
    logs.unshift(`${panel.label} ${event} closure ${panel.listeners[event].staleClosure ? "captured stale state" : "refreshed dependencies"}.`);
  }

  if (actionId === "cycle-remount") {
    panels = createPanels();
    panels.analytics.listeners.pagehide.active = false;
    panels.analytics.listeners.pagehide.duplicateRisk = false;
    logs.unshift("Simulated remount cycle. Verified only current listeners stay active.");
  }

  res.json({ ok: true });
});

app.listen(4532, () => {
  console.log("Listener cleanup API on http://localhost:4532");
});
