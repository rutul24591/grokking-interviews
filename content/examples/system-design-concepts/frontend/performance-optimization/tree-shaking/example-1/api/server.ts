import express from "express";
const app = express();
app.get("/report", (_req, res) => res.json([
  { module: "date-utils.ts", imported: "formatDate", shakenOut: ["parseDate", "diffDays"], note: "Named ESM exports let the bundler drop unused helpers." },
  { module: "charting.ts", imported: "MiniChart", shakenOut: ["Heatmap", "BigLegend"], note: "Side-effect-free modules shrink cleanly when imports stay narrow." },
  { module: "icons/index.ts", imported: "SearchIcon", shakenOut: ["EditIcon", "TrashIcon"], note: "Barrel files can still shake if they remain pure re-exports." },
]));
app.listen(Number(process.env.PORT || 4230), () => console.log("Tree shaking API on http://localhost:4230"));
