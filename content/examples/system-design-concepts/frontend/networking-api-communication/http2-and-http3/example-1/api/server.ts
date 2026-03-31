import express from "express";

const app = express();

const protocolProfiles = {
  h1: {
    multiplier: 1.2,
    observations: [
      "HTTP/1.1 creates more artificial waterfalls because fewer requests progress in parallel.",
      "A large hero image can delay smaller article-side requests behind connection limits."
    ]
  },
  h2: {
    multiplier: 0.9,
    observations: [
      "HTTP/2 multiplexes the article asset graph on a shared connection and reduces queueing.",
      "Loss recovery still happens at the TCP layer, so bad links can hurt all streams together."
    ]
  },
  h3: {
    multiplier: 0.82,
    observations: [
      "HTTP/3 keeps multiplexing and improves tail latency on lossy links by avoiding TCP head-of-line blocking.",
      "The gain is strongest on cold or unstable mobile networks and smaller on warm stable paths."
    ]
  }
} as const;

const assets = [
  { name: "document", sizeKb: 22, baseMs: 120 },
  { name: "critical css", sizeKb: 12, baseMs: 70 },
  { name: "article api", sizeKb: 28, baseMs: 105 },
  { name: "hero image", sizeKb: 220, baseMs: 260 },
  { name: "recommendations api", sizeKb: 18, baseMs: 95 }
] as const;

app.get("/session", async (req, res) => {
  const protocol = String(req.query.protocol || "h2") as keyof typeof protocolProfiles;
  const profile = protocolProfiles[protocol] ?? protocolProfiles.h2;
  res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");

  for (const asset of assets) {
    const durationMs = Math.round(asset.baseMs * profile.multiplier);
    await new Promise((resolve) => setTimeout(resolve, durationMs));
    res.write(`${JSON.stringify({ name: asset.name, sizeKb: asset.sizeKb, durationMs })}\n`);
  }

  res.end();
});

app.get("/summary", (req, res) => {
  const protocol = String(req.query.protocol || "h2") as keyof typeof protocolProfiles;
  const profile = protocolProfiles[protocol] ?? protocolProfiles.h2;
  res.json({ observations: profile.observations });
});

app.listen(Number(process.env.PORT || 4350), () => {
  console.log("HTTP protocol API on http://localhost:4350");
});
