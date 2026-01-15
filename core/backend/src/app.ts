// backend/src/app.ts
import express from "express";
import dotenv from "dotenv";
import { router as articlesRouter } from "./routes/articles";
import { router as filtersRouter } from "./routes/filters";
import { router as insightsRouter } from "./routes/insights";
import chatRouter from "./routes/chat";

import cors, { type CorsOptions } from "cors";
import { createOrchestrator, Orchestrator } from "./agent/agents/orchestrator";

dotenv.config();

const app = express();

/* ======================
   CORS
====================== */
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map(o => o.trim())
  .filter(Boolean);

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server / curl / postman
    if (!origin) return callback(null, true);

    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

/* ======================
   Routes
====================== */
app.get("/api/health", (_, res) => {
  res.json({ status: "ok" });
});

/* ======================
   Session Management
====================== */
const sessions = new Map<string, Orchestrator>();

function getOrCreateSession(sessionId: string): Orchestrator {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, createOrchestrator({ debug: true }));
  }
  return sessions.get(sessionId)!;
}
// Register routers
app.use("/api/articles", articlesRouter);
app.use("/api/filters", filtersRouter);
app.use("/api/insights", insightsRouter);
app.use("/chat", chatRouter);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
