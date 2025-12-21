// backend/src/app.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { router as articlesRouter } from "./routes/articles";
import { router as authorsRouter } from "./routes/authors";
import { router as journalsRouter } from "./routes/journals";
import { router as keywordsRouter } from "./routes/keywords";
import { router as subjectsRouter } from "./routes/subjects";

dotenv.config();

const app = express();

/* ======================
   CORS
====================== */
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map(o => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow server-to-server / curl / postman requests with no origin
      if (!origin) return callback(null, true);

      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

/* ======================
   Routes
====================== */
app.get("/api/health", (_, res) => {
  res.json({ status: "ok" });
});

// Register routers
app.use("/api/articles", articlesRouter);
app.use("/api/authors", authorsRouter);
app.use("/api/journals", journalsRouter);
app.use("/api/keywords", keywordsRouter);
app.use("/api/subjects", subjectsRouter);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
