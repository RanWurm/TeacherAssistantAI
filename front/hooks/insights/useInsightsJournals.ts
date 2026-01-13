import { useEffect, useState } from "react";
import { fetchJournalsInsights } from "@/lib/api/insights.api";
import type { JournalsInsights } from "@/lib/types/insights/Journals";
import type { TimeRange } from "@/lib/api/insights.api";

export function useInsightsJournals(timeRange: TimeRange) {
  const [data, setData] = useState<JournalsInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchJournalsInsights(timeRange)
      .then(setData)
      .finally(() => setLoading(false));
  }, [timeRange]);

  return { data, loading };
}
