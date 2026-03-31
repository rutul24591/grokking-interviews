import express from "express";

const app = express();
app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/inventory", (_, res) => {
  res.json({
    atoms: ["Button", "Heading", "Icon", "Avatar", "Tag"],
    molecules: [
      { name: "Article card", atoms: ["Heading", "Tag", "Button"] },
      { name: "Filter pill group", atoms: ["Button", "Tag"] },
      { name: "Author byline", atoms: ["Avatar", "Text", "Tag"] },
      { name: "Empty state notice", atoms: ["Icon", "Heading", "Button"] }
    ],
    organisms: [
      { name: "Sidebar recommendations", molecules: ["Article card", "Filter pill group"], purpose: "Packages discovery widgets into a reusable learning rail." },
      { name: "Article hero", molecules: ["Author byline", "Filter pill group"], purpose: "Combines metadata and primary actions into the above-the-fold shell." },
      { name: "Example tabs", molecules: ["Filter pill group", "Empty state notice"], purpose: "Coordinates tab selection and empty-state guidance." }
    ],
    templates: [
      {
        id: "article",
        name: "Article Template",
        headline: "Templates assemble organisms into a page shell without hard-coding article content.",
        sections: ["Hero region", "Article content body", "Recommendations rail", "Example drawer"]
      },
      {
        id: "problem-set",
        name: "Problem Set Template",
        headline: "The same atomic inventory can assemble a problem-solving layout with prompts, hints, and evaluation widgets.",
        sections: ["Prompt header", "Solution workspace", "Hint rail", "Review checklist"]
      }
    ],
    notes: [
      "Atoms stay intentionally generic so they can be reused across themes.",
      "Organisms own layout, not token-level styling concerns.",
      "Templates define page structure; pages inject actual article data."
    ]
  });
});

app.listen(4521, () => {
  console.log("Atomic design API on http://localhost:4521");
});
