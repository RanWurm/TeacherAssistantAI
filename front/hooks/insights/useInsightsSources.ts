import { useEffect, useState } from "react";
import { fetchSourcesInsights } from "@/lib/api/insights.api";
import type { SourcesInsights } from "@/lib/types/insights/Sources";
import type { TimeRange } from "@/lib/api/insights.api";

export function useInsightsSources(timeRange: TimeRange) {
  const [data, setData] = useState<SourcesInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchSourcesInsights(timeRange)
      .then(setData)
      .finally(() => setLoading(false));
  }, [timeRange]);

  return { data, loading };
}