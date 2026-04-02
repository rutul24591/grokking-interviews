type Inputs = { query?: string; header?: string; accept?: string };

function pick(i: Inputs) {
  // Explicit policy: query > header > accept > default
  if (i.query === "1" || i.query === "2") return Number(i.query);
  if (i.header === "1" || i.header === "2") return Number(i.header);
  const m = i.accept?.match(/v(\d+)\+json/i);
  if (m?.[1] === "1" || m?.[1] === "2") return Number(m[1]);
  return 2;
}

console.log(
  JSON.stringify(
    {
      cases: [
        { in: { query: "1", header: "2" }, out: pick({ query: "1", header: "2" }) },
        { in: { header: "1", accept: "application/vnd.x.v2+json" }, out: pick({ header: "1", accept: "application/vnd.x.v2+json" }) },
        { in: { accept: "application/vnd.x.v1+json" }, out: pick({ accept: "application/vnd.x.v1+json" }) }
      ]
    },
    null,
    2,
  ),
);

