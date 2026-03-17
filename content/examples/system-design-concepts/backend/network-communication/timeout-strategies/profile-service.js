import express from "express";
const app = express();

app.get("/profile", (req, res) => {
  setTimeout(() => res.json({ user: "Ava", tier: "pro" }), 120);
});

app.listen(4401, () => console.log("profile on :4401"));