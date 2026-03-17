import express from "express";
const app = express();

app.get("/users/1", (req, res) => {
  res.json({
    id: "1",
    name: "Ava",
    profile: { plan: "basic", region: "us-east-1", flags: ["beta"] },
  });
});

app.listen(4102, () => console.log("v2 on :4102"));