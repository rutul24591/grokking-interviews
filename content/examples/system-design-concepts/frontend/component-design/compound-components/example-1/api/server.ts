import express from "express";

const app = express();
app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/tabs", (_, res) => {
  res.json([
    {
      id: "api",
      label: "API Design",
      body: "Compound components let the parent own coordination while children stay declarative.",
      stats: ["Single source of truth", "Low prop surface", "Composable child API"]
    },
    {
      id: "accessibility",
      label: "Accessibility",
      body: "Shared context centralizes focus, selection, and ARIA state instead of duplicating it across each child.",
      stats: ["Shared active state", "Keyboard-safe switching", "Centralized semantics"]
    },
    {
      id: "extensibility",
      label: "Extensibility",
      body: "Consumers compose Tab, TabList, and TabPanels without memorizing a large prop surface.",
      stats: ["Optional summary child", "No prop drilling", "Scales to variants"]
    }
  ]);
});

app.listen(4524, () => {
  console.log("Compound components API on http://localhost:4524");
});
