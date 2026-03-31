import express from "express";
const app = express();
app.get("/hints", (_req, res) => res.json([
  { rel: "preload", href: "/hero.avif", note: "Use for a confirmed LCP asset only." },
  { rel: "preconnect", href: "https://cdn.example.com", note: "Warm up DNS, TCP, and TLS before critical media fetches." },
  { rel: "prefetch", href: "/guides/caching", note: "Use for likely next navigation, not the current page." },
  { rel: "dns-prefetch", href: "https://analytics.example.com", note: "Low-cost early hint for secondary origins." },
]));
app.listen(Number(process.env.PORT || 4220), () => console.log("Resource hints API on http://localhost:4220"));
