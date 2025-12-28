import { useEffect, useState } from "react";
import { fetchCrossInsights } from "@/lib/api/insights.api";
import type { CrossInsights } from "@/lib/types/insights/CrossAnalysis";
import type { TimeRange } from "@/lib/api/insights.api";

export function useInsightsCross(timeRange: TimeRange) {
  const [data, setData] = useState<CrossInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchCrossInsights(timeRange)
      .then(setData)
      .finally(() => setLoading(false));
  }, [timeRange]);

  return { data, loading };
}
