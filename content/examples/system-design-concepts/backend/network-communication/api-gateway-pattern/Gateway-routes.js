const routes = [
  { prefix: "/api/users", target: "http://localhost:3001" },
  { prefix: "/api/orders", target: "http://localhost:3002" },
];

export function routeFor(path) {
  return routes.find((r) => path.startsWith(r.prefix));
}