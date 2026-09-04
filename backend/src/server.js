import express from "express";
import cors from "cors";
import dns from "dns";
import dotenv from "dotenv";
import path from "path";

import notesRoutes from "./routes/notesRoutes.js";
import ownersRoutes from "./routes/ownersRoutes.js";
import { connectDB } from "./config/db.js";
import { apiRateLimiter, ownerRateLimiter } from "./middleware/rateLimiter.js";
import identifyOwner from "./middleware/identifyOwner.js";

dotenv.config();

if (process.env.NODE_ENV !== "production") {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
}

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// hosting platforms put a proxy in front of us, so without this req.ip would
// be the proxy's address and every visitor would share one rate limit bucket
app.set("trust proxy", 1);

// middleware
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
    }),
  );
}
app.use(express.json()); // this middleware will parse JSON bodies: req.body

// only the api is rate limited: static files shouldn't eat a visitor's budget
app.use("/api", apiRateLimiter);

// simple custom middleware
app.use((req, res, next) => {
  console.log(`Req method is ${req.method} & Req URL is ${req.url}`);
  next();
});

// left unprotected on purpose: you can't need an owner id to be given one
app.use("/api/owners", ownerRateLimiter, ownersRoutes);
app.use("/api/notes", identifyOwner, notesRoutes);

// an unknown api path should say so instead of falling through to index.html
app.use("/api", (req, res) => {
  res.status(404).json({ message: "Not found" });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
  });
});
