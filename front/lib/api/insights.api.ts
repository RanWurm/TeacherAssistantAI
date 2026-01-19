import { apiRequest } from "./client";
import type { OverviewInsights } from "../types/insights/Overview";
import type { TrendsInsights } from "../types/insights/Trends";
import type { ResearchersInsights } from "../types/insights/Researchers";
import type { SourcesInsights } from "../types/insights/Sources";
import type { CrossInsights } from "../types/insights/CrossAnalysis";

export type TimeRange = "1y" | "3y" | "5y" | "all";

type TimeRangeBody = {
  timeRange: TimeRange;
};

/* =========================
   Insights API
========================= */

export function fetchOverviewInsights(timeRange: TimeRange) {
  return apiRequest<OverviewInsights>(
    "/api/insights/overview",
    "POST",
    { timeRange } satisfies TimeRangeBody
  );
}

export function fetchTrendsInsights(timeRange: TimeRange) {
  return apiRequest<TrendsInsights>(
    "/api/insights/trends",
    "POST",
    { timeRange } satisfies TimeRangeBody
  );
}

export function fetchResearchersInsights(timeRange: TimeRange) {
  return apiRequest<ResearchersInsights>(
    "/api/insights/researchers",
    "POST",
    { timeRange } satisfies TimeRangeBody
  );
}

export function fetchSourcesInsights(timeRange: TimeRange) {
  return apiRequest<SourcesInsights>(
    "/api/insights/sources",
    "POST",
    { timeRange } satisfies TimeRangeBody
  );
}

export function fetchCrossInsights(timeRange: TimeRange) {
  return apiRequest<CrossInsights>(
    "/api/insights/cross",
    "POST",
    { timeRange } satisfies TimeRangeBody
  );
}