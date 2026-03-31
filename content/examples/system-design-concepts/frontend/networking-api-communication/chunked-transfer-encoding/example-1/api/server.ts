import express from "express";
const app = express();
app.get("/stream", async (_req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  for (const chunk of ["headline ready", "summary ready", "recommendations ready"]) {
    res.write(chunk);
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  res.end();
});
app.listen(Number(process.env.PORT || 4310), () => console.log("Chunked stream API on http://localhost:4310"));
