// backend/src/controllers/insightsController.ts
import { Request, Response } from "express";
import {
  getOverviewInsights,
  getTrendsInsights,
  getResearchersInsights,
  getSourcesInsights,
  getCrossInsights,
} from "../services/insightsService";

function extractTimeRange(req: Request) {
  const { timeRange } = req.body;
  if (!timeRange) {
    throw new Error("timeRange is required");
  }
  return timeRange;
}

export async function overviewInsightsHandler(req: Request, res: Response) {
  try {
    const timeRange = extractTimeRange(req);
    const data = await getOverviewInsights(timeRange);
    res.json(data);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message || "Overview insights failed" });
  }
}

export async function trendsInsightsHandler(req: Request, res: Response) {
  try {
    const timeRange = extractTimeRange(req);
    const data = await getTrendsInsights(timeRange);
    res.json(data);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message || "Trends insights failed" });
  }
}

export async function researchersInsightsHandler(req: Request, res: Response) {
  try {
    const timeRange = extractTimeRange(req);
    const data = await getResearchersInsights(timeRange);
    res.json(data);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message || "Researchers insights failed" });
  }
}

export async function sourcesInsightsHandler(req: Request, res: Response) {
  try {
    const timeRange = extractTimeRange(req);
    const data = await getSourcesInsights(timeRange);
    res.json(data);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message || "Sources insights failed" });
  }
}

export async function crossInsightsHandler(req: Request, res: Response) {
  try {
    const timeRange = extractTimeRange(req);
    const data = await getCrossInsights(timeRange);
    res.json(data);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message || "Cross insights failed" });
  }
}