import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, "public")));

const port = Number(process.env.PORT || 4370);
app.listen(port, () => {
  console.log(`IntersectionObserver lazy-load demo on http://localhost:${port}`);
});
