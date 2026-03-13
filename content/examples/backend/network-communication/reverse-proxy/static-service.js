import express from "express";
const app = express();

app.get("/static/logo.svg", (req, res) => {
  res.send("<svg>logo</svg>");
});

app.listen(4601, () => console.log("static service on :4601"));