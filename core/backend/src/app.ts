// backend/src/app.ts
import express from "express";
import dotenv from "dotenv";
import agentRoutes from "./routes/agent";
import { router as articlesRouter } from "./routes/articles";
import { router as authorsRouter } from "./routes/authors";
import { router as journalsRouter } from "./routes/journals";
import { router as keywordsRouter } from "./routes/keywords";
import { router as subjectsRouter } from "./routes/subjects";

dotenv.config();

const app = express();
app.use(express.json());

// Health check
app.get("/api/health", (_, res) => {
  res.json({ status: "ok" });
});

// Register routers
app.use("/api/articles", articlesRouter);
app.use("/api/authors", authorsRouter);
app.use("/api/journals", journalsRouter);
app.use("/api/keywords", keywordsRouter);
app.use("/api/subjects", subjectsRouter);
app.use("/agent", agentRoutes);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
