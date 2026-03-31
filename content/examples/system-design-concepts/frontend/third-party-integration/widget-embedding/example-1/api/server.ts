import express from "express";

const app = express();

app.use(express.static("public"));

app.listen(Number(process.env.PORT || 4477), () => {
  console.log("Widget host API on http://localhost:4477");
});
