// backend/src/routes/insights.ts
import { Router } from "express";
import {
  overviewInsightsHandler,
  trendsInsightsHandler,
  researchersInsightsHandler,
  journalsInsightsHandler,
  crossInsightsHandler,
} from "../controllers/insightsController";

const router = Router();

router.post("/overview", overviewInsightsHandler);
router.post("/trends", trendsInsightsHandler);
router.post("/researchers", researchersInsightsHandler);
router.post("/journals", journalsInsightsHandler);
router.post("/cross", crossInsightsHandler);

export { router };
