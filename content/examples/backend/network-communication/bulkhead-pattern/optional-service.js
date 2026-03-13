import express from "express";
const app = express();

app.get("/optional", (req, res) => {
  setTimeout(() => res.send("optional-ok"), 300);
});

app.listen(5002, () => console.log("optional on :5002"));