import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.listen(Number(process.env.PORT || 4380), () => console.log("Resource hints demo on http://localhost:4380"));
