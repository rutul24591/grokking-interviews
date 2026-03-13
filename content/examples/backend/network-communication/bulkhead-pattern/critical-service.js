import express from "express";
const app = express();

app.get("/critical", (req, res) => {
  setTimeout(() => res.send("critical-ok"), 50);
});

app.listen(5001, () => console.log("critical on :5001"));