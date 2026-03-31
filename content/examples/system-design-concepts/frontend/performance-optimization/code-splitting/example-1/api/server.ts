import express from "express";

const app = express();

app.get("/topics", (_req, res) => {
  res.json([
    {
      id: "c1",
      title: "Route shell stays light",
      summary: "The feed route avoids heavy comparison and graphing code until the user drills in.",
    },
    {
      id: "c2",
      title: "User-intent boundary",
      summary: "The split point is aligned with a branch in user behavior, not just file size.",
    },
    {
      id: "c3",
      title: "Secondary chunk loading",
      summary: "Loading and parse cost move off the critical navigation path.",
    },
  ]);
});

const port = Number(process.env.PORT || 4120);
app.listen(port, () => {
  console.log(`Code-splitting API on http://localhost:${port}`);
});

