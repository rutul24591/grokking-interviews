import express from "express";

const app = express();
app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

const articles = [
  {
    title: "Render Props",
    category: "frontend",
    summary: "Render props let multiple consumers share one behavior layer while keeping rendering fully customizable.",
    bullets: [
      "The loader owns fetch timing and state transitions.",
      "Each consumer chooses its own markup and formatting.",
      "This is useful when hooks are not the desired surface area for the abstraction."
    ]
  },
  {
    title: "Bulkhead Pattern",
    category: "backend",
    summary: "The same loader can serve different article types while views render them differently.",
    bullets: [
      "Shared data fetching remains centralized.",
      "Rendering stays caller-defined.",
      "The abstraction works across domains."
    ]
  }
];

app.get("/articles", (req, res) => {
  const category = typeof req.query.category === "string" ? req.query.category : "frontend";
  res.json(articles.filter((article) => article.category === category));
});

app.listen(4527, () => {
  console.log("Render props API on http://localhost:4527");
});
