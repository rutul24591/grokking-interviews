import express from "express";

const app = express();

app.get("/bootstrap", (req, res) => {
  if (req.query.mode === "down") {
    return res.status(200).json({
      provider: "SupportFlow",
      sdkUrl: "https://cdn.supportflow.example/widget.js",
      articleContext: "oauth-integration"
    });
  }
  res.json({
    provider: "SupportFlow",
    sdkUrl: "https://cdn.supportflow.example/widget.js",
    articleContext: "oauth-integration"
  });
});

app.listen(Number(process.env.PORT || 4472), () => {
  console.log("Chat widget bootstrap API on http://localhost:4472");
});
