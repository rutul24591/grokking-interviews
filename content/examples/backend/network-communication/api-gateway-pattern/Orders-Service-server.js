import express from "express";
const app = express();
app.use(express.json());

app.get("/orders", (req, res) => {
  res.json([{ id: "o1", amount: 42 }]);
});

app.listen(3002, () => console.log("orders service on :3002"));