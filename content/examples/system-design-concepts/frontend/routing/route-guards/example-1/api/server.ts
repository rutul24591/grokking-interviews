import express from "express";

const app = express();
app.use(express.json());

const roles = ["guest", "member", "admin"] as const;
const routes = [
  { path: "/feed", minimumRole: "guest", fallback: "/login" },
  { path: "/billing", minimumRole: "member", fallback: "/upgrade" },
  { path: "/admin", minimumRole: "admin", fallback: "/forbidden" }
];
let role: (typeof roles)[number] = "guest";
let activePath = "/feed";
const logs = ["Initialized route guards as guest."];

app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  next();
});
app.options("*", (_, res) => res.sendStatus(204));

function roleRank(value: string) {
  return roles.indexOf(value as (typeof roles)[number]);
}

app.get("/state", (_, res) => res.json({ role, activePath, routes, logs: logs.slice(0, 8) }));
app.post("/action", (req, res) => {
  const actionId = String(req.body?.actionId ?? "");
  if (actionId === "set-role") {
    role = String(req.body?.role ?? role) as (typeof roles)[number];
    logs.unshift(`Switched role to ${role}.`);
  }
  if (actionId === "navigate") {
    const path = String(req.body?.path ?? activePath);
    const route = routes.find((entry) => entry.path === path) ?? routes[0];
    if (roleRank(role) >= roleRank(route.minimumRole)) {
      activePath = route.path;
      logs.unshift(`Allowed ${role} to enter ${route.path}.`);
    } else {
      activePath = route.fallback;
      logs.unshift(`Blocked ${role} from ${route.path}; redirected to ${route.fallback}.`);
    }
  }
  res.json({ ok: true });
});

app.listen(4548, () => console.log("Route guards API on http://localhost:4548"));
