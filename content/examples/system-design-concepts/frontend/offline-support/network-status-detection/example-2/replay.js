import { initialState, nextState } from "./stateMachine.js";

function print(label, state) {
  const hb = state.lastHeartbeat
    ? state.lastHeartbeat.outcome === "ok"
      ? `ok(${state.lastHeartbeat.latencyMs}ms)`
      : `fail(${state.lastHeartbeat.reason})`
    : "none";
  // eslint-disable-next-line no-console
  console.log(`${label.padEnd(18)} status=${state.status.padEnd(8)} navigator.onLine=${String(state.browserOnline).padEnd(5)} hb=${hb}`);
}

const scenarios = [
  {
    name: "Captive portal-ish",
    events: [
      { type: "BROWSER_ONLINE" },
      { type: "HEARTBEAT_FAIL", reason: "tls-error" },
      { type: "HEARTBEAT_FAIL", reason: "dns-fail" },
      { type: "HEARTBEAT_OK", latencyMs: 120 }
    ]
  },
  {
    name: "Slow network",
    events: [
      { type: "BROWSER_ONLINE" },
      { type: "HEARTBEAT_OK", latencyMs: 80 },
      { type: "HEARTBEAT_OK", latencyMs: 1200 }
    ]
  },
  {
    name: "True offline",
    events: [
      { type: "BROWSER_OFFLINE" },
      { type: "HEARTBEAT_FAIL", reason: "abort" },
      { type: "BROWSER_ONLINE" },
      { type: "HEARTBEAT_OK", latencyMs: 150 }
    ]
  }
];

for (const scenario of scenarios) {
  // eslint-disable-next-line no-console
  console.log(`\n=== ${scenario.name}`);
  let s = initialState();
  print("start", s);
  for (const [i, e] of scenario.events.entries()) {
    s = nextState(s, e);
    print(`event#${i + 1}`, s);
  }
}

