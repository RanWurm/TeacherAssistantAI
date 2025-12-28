import { useEffect, useState } from "react";
import { fetchTrendsInsights } from "@/lib/api/insights.api";
import type { TrendsInsights } from "@/lib/types/insights/Trends";
import type { TimeRange } from "@/lib/api/insights.api";

export function useInsightsTrends(timeRange: TimeRange) {
  const [data, setData] = useState<TrendsInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchTrendsInsights(timeRange)
      .then(setData)
      .finally(() => setLoading(false));
  }, [timeRange]);

  return { data, loading };
}
