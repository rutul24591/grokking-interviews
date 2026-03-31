import express from "express";

const app = express();
app.use(express.json());
type WidgetId = "feed" | "sync" | "reminder";
type WidgetState = { label: string; intervalActive: boolean; timeoutActive: boolean; ticks: number };

function createWidgets(): Record<WidgetId, WidgetState> {
  return {
    feed: { label: "Feed poller", intervalActive: true, timeoutActive: true, ticks: 0 },
    sync: { label: "Background sync", intervalActive: false, timeoutActive: false, ticks: 0 },
    reminder: { label: "Reminder badge", intervalActive: false, timeoutActive: false, ticks: 0 }
  };
}

let widgets = createWidgets();
const logs: string[] = [];

app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  next();
});
app.options("*", (_, res) => res.sendStatus(204));

app.get("/state", (_, res) => {
  const widgetEntries = Object.entries(widgets).map(([widgetId, widget]) => ({ widgetId, ...widget }));
  res.json({
    intervals: widgetEntries.filter((widget) => widget.intervalActive).length,
    timeouts: widgetEntries.filter((widget) => widget.timeoutActive).length,
    widgets: widgetEntries,
    logs: logs.slice(0, 8)
  });
});

app.post("/timer/action", (req, res) => {
  const actionId = String(req.body?.actionId ?? "");
  const widgetId = String(req.body?.widgetId ?? "") as WidgetId;
  const widget = widgets[widgetId];

  if (actionId === "toggle-widget" && widget) {
    const nextActive = !(widget.intervalActive || widget.timeoutActive);
    widget.intervalActive = nextActive;
    widget.timeoutActive = nextActive;
    logs.unshift(`${widget.label} ${nextActive ? "mounted with new interval and timeout" : "unmounted and timers cleared"}.`);
  }

  if (actionId === "tick" && widget) {
    if (widget.intervalActive) widget.ticks += 1;
    logs.unshift(`${widget.label} interval tick ${widget.ticks}.`);
  }

  if (actionId === "timeout" && widget) {
    widget.timeoutActive = false;
    logs.unshift(`${widget.label} timeout completed and released.`);
  }

  if (actionId === "cleanup-all") {
    widgets = {
      feed: { ...widgets.feed, intervalActive: false, timeoutActive: false },
      sync: { ...widgets.sync, intervalActive: false, timeoutActive: false },
      reminder: { ...widgets.reminder, intervalActive: false, timeoutActive: false }
    };
    logs.unshift("Cleared all active timers before route transition.");
  }

  if (actionId === "reset") {
    widgets = createWidgets();
    logs.unshift("Reset timer registry to initial state.");
  }

  res.json({ ok: true });
});

app.listen(4536, () => {
  console.log("Timer cleanup API on http://localhost:4536");
});
