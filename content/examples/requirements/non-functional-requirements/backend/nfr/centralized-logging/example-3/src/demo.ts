function metricKey(name: string, labels: Record<string, string>) {
  const entries = Object.entries(labels).sort(([a], [b]) => a.localeCompare(b));
  return name + "{" + entries.map(([k, v]) => `${k}=${v}`).join(",") + "}";
}

const safe = metricKey("http_requests_total", { route: "/api/order", status: "200" });
const dangerous = metricKey("http_requests_total", { userId: "u_123456", status: "200" });

console.log(
  JSON.stringify(
    {
      safe,
      dangerous,
      note: [
        "Logs can include high-cardinality fields; metrics usually should not.",
        "Cardinality explosions can take down monitoring backends."
      ]
    },
    null,
    2,
  ),
);

