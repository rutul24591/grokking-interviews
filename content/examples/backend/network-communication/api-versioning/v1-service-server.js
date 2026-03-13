import express from "express";
const app = express();

app.get("/users/1", (req, res) => {
  res.json({ id: "1", name: "Ava", plan: "basic" });
});

app.listen(4101, () => console.log("v1 on :4101"));