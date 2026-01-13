import { useEffect, useState } from "react";
import { fetchResearchersInsights } from "@/lib/api/insights.api";
import type { ResearchersInsights } from "@/lib/types/insights/Researchers";
import type { TimeRange } from "@/lib/api/insights.api";

export function useInsightsResearchers(timeRange: TimeRange) {
  const [data, setData] = useState<ResearchersInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchResearchersInsights(timeRange)
      .then(setData)
      .finally(() => setLoading(false));
  }, [timeRange]);

  return { data, loading };
}
