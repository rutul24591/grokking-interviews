import express from "express";
const app = express();
app.use(express.json());

app.get("/users/:id", (req, res) => {
  res.json({ id: req.params.id, name: "Ava" });
});

app.listen(3001, () => console.log("users service on :3001"));