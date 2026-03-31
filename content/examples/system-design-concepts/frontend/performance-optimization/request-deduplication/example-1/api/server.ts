import express from "express";
const app = express();
app.get("/user", async (_req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 250));
  console.log("origin hit /user");
  res.json({ name: "Rina", role: "Staff Engineer", unreadCount: 7, bio: "Writes system design deep dives." });
});
app.listen(Number(process.env.PORT || 4210), () => console.log("Request dedup API on http://localhost:4210"));
