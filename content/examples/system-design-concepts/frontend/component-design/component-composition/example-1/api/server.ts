import express from "express";

const app = express();
app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/layout", (_, res) => {
  res.json({
    hero: "Composition lets the page shell stay generic while feature blocks evolve independently.",
    body: [
      "Instead of subclassing a page component, each screen passes hero, body, and rail content into a shared shell.",
      "Composition keeps feature logic at the leaves while the shell owns spacing, breakpoints, and accessibility landmarks.",
      "The same shell can render article pages, problem sets, or onboarding flows by swapping slot content only."
    ],
    rail: ["Example navigation", "Related interview questions", "Saved reading state"],
    notes: [
      "Slots are contracts; document what each slot can assume about layout.",
      "Prefer composition when features need to extend structure without forking the base component."
    ]
  });
});

app.listen(4522, () => {
  console.log("Composition API on http://localhost:4522");
});
