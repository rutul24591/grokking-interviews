import express from "express";
const app = express();
app.use(express.json());
app.post("/graphql", (req, res) => {
  const fields = (req.body?.fields || []) as string[];
  const article = { title: "GraphQL for article screens", author: "Rina", readingTime: 12 };
  const result = Object.fromEntries(fields.map((field) => [field, article[field as keyof typeof article]]));
  res.json(result);
});
app.listen(Number(process.env.PORT || 4340), () => console.log("GraphQL demo API on http://localhost:4340"));
