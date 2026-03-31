import express from "express";

const app = express();

const placeholder = (label: string, fill: string) =>
  `data:image/svg+xml;base64,${Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="${fill}"/><text x="60" y="110" fill="white" font-size="48" font-family="Arial" font-weight="700">${label}</text></svg>`,
  ).toString("base64")}`;

app.get("/assets", (_req, res) => {
  res.json([
    {
      id: "hero",
      title: "Production article hero",
      alt: "Editorial dashboard hero image",
      src: "/hero-editorial.svg",
      width: 1600,
      height: 900,
      priority: true,
      placeholder: placeholder("Hero placeholder", "#8b5e34"),
      note: "The hero is highest-value content, so it gets priority loading and large-screen sizing hints.",
    },
    {
      id: "thumb-1",
      title: "Responsive gallery card",
      alt: "Responsive article card illustration",
      src: "/diagram-card.svg",
      width: 1200,
      height: 800,
      placeholder: placeholder("Card placeholder", "#334155"),
      note: "The gallery image is still sharp, but its `sizes` hint keeps the browser from fetching hero-sized bytes.",
    },
    {
      id: "thumb-2",
      title: "Blur placeholder handoff",
      alt: "Blur placeholder illustration",
      src: "/placeholder-card.svg",
      width: 1200,
      height: 800,
      placeholder: placeholder("Blur placeholder", "#6d28d9"),
      note: "A placeholder paints immediately so layout is stable even before the optimized file is decoded.",
    },
  ]);
});

const port = Number(process.env.PORT || 4160);
app.listen(port, () => {
  console.log(`Image optimization API on http://localhost:${port}`);
});
