import { useEffect, useState } from "react";
import { fetchOverviewInsights } from "@/lib/api/insights.api";
import type { OverviewInsights } from "@/lib/types/insights/Overview";
import type { TimeRange } from "@/lib/api/insights.api";

export function useInsightsOverview(timeRange: TimeRange) {
  const [data, setData] = useState<OverviewInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchOverviewInsights(timeRange)
      .then(setData)
      .finally(() => setLoading(false));
  }, [timeRange]);

  return { data, loading };
}
