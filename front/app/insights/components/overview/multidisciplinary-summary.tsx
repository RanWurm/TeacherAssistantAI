import { Layers } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import type { TimeRange } from "@/lib/api/insights.api";
import type { OverviewInsights } from "@/lib/types/insights/Overview";
import { fetchOverviewInsights } from "@/lib/api/insights.api";

interface MultidisciplinarySummaryProps {
  timeRange: TimeRange;
}

// Add responsive classes: default = small, sm: = original
function ProgressBar({
  percent,
  color,
  label,
  count,
  highlight = false,
}: {
  percent: number;
  color: string;
  label: string;
  count: number;
  highlight?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-0.5 sm:mb-1">
        <span className="text-[11px] sm:text-xs text-gray-600">{label}</span>
        <span
          className={`text-[11px] sm:text-xs font-medium ${highlight ? "text-purple-600" : "text-gray-800"
            }`}
        >
          {`${percent.toFixed(1)}%`}
        </span>
      </div>
      <div className="flex items-end gap-1.5 sm:gap-2">
        <div className="w-14 sm:w-20 text-base sm:text-lg font-semibold text-gray-900">
          {count.toLocaleString()}
        </div>
        <div className="flex-1 h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${color}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// useInsightsOverview hook definition (per prompt)
function useInsightsOverview(timeRange: TimeRange) {
  const [data, setData] = useState<OverviewInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchOverviewInsights(timeRange)
      .then((res) => {
        setData(res);
      })
      .catch(() => {
        // Intentionally no-op
      })
      .finally(() => {
        setLoading(false);
      });
  }, [timeRange]);

  return { data, loading };
}

// Helper component to show more subjects as a tooltip/popover
function ShowMoreSubjects({ subjects }: { subjects: string[] }) {
  const [show, setShow] = useState(false);

  if (!subjects.length) return null;

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      tabIndex={0}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      <button
        type="button"
        className="px-1.5 sm:px-2 py-[1.5px] sm:py-0.5 text-[11px] sm:text-xs font-medium bg-purple-50 text-purple-800 rounded border border-purple-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-200"
        aria-label={`+${subjects.length} more subjects`}
      >
        +{subjects.length}
      </button>
      {show && (
        <div className="absolute left-1/2 top-full z-20 mt-1 -translate-x-1/2 whitespace-nowrap bg-white border border-gray-200 shadow-lg rounded px-2 py-1 text-xs text-gray-800 min-w-max">
          {subjects.map((subject, idx) => (
            <span
              key={idx}
              className="inline-block mr-2 mb-1 px-1.5 py-[1.5px] bg-purple-50 text-purple-800 rounded border border-purple-100"
            >
              {subject}
            </span>
          ))}
        </div>
      )}
    </span>
  );
}

export function MultidisciplinarySummary({
  timeRange,
}: MultidisciplinarySummaryProps) {
  const { t } = useTranslation();
  const { data, loading } = useInsightsOverview(timeRange);

  const summary = data?.multidisciplinary ?? null;
  const mostCommon = (data as any)?.multidisciplinary?.mostCommonSubjectCombination;

  // Defensive: compute derived values only when summary is available
  const singleArticles = Number(summary?.singleSubjectArticles ?? 0);
  const multiArticles = Number(summary?.multiSubjectArticles ?? 0);
  const totalArticles = singleArticles + multiArticles;

  const singlePercent =
    totalArticles > 0 ? (singleArticles / totalArticles) * 100 : 0;

  const multiPercent =
    totalArticles > 0 ? (multiArticles / totalArticles) * 100 : 0;

  // Always render the header, just like @publications-timeline.tsx
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-2 sm:p-4">
      <div className="flex items-center gap-1 sm:gap-2 mb-3 sm:mb-5">
        <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
        <h3 className="text-sm sm:text-base font-semibold text-gray-900">
          {t("insights.overview.multidisciplinarySummary.title")}
        </h3>
      </div>

      {loading ? (
        <div className="animate-pulse min-h-[180px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 mb-2 sm:mb-4 items-end">
            <div className="h-12 bg-slate-100 rounded" />
            <div className="h-12 bg-slate-100 rounded" />
            <div className="h-12 bg-slate-100 rounded" />
          </div>
          <div className="h-5 w-2/3 bg-slate-100 rounded mt-2" />
        </div>
      ) : !summary ? (
        <div className="text-center text-gray-400">
          {t("insights.overview.multidisciplinarySummary.noData", {
            defaultValue: "Not enough data.",
          })}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 mb-2 sm:mb-4 items-end">
            <ProgressBar
              percent={singlePercent}
              color="bg-gray-400"
              label={t(
                "insights.overview.multidisciplinarySummary.singleSubject"
              )}
              count={summary.singleSubjectArticles}
            />
            <ProgressBar
              percent={multiPercent}
              color="bg-purple-500"
              label={t(
                "insights.overview.multidisciplinarySummary.multiSubject"
              )}
              count={summary.multiSubjectArticles}
              highlight
            />
            <div className="flex flex-col items-start justify-between gap-0.5 sm:gap-1">
              <div className="text-[11px] sm:text-xs text-gray-600 mb-0.5">
                {t(
                  "insights.overview.multidisciplinarySummary.avgSubjectsPerArticle"
                )}
              </div>
              <div className="text-base sm:text-lg font-bold text-purple-700 leading-tight">
                {summary.avgSubjectsPerArticle !== null &&
                summary.avgSubjectsPerArticle !== undefined
                  ? Number(summary.avgSubjectsPerArticle).toFixed(1)
                  : "0.0"}
              </div>
              <div className="text-[9px] sm:text-[10px] text-gray-400">
                {typeof summary.avgSubjectsPerArticle === "number" &&
                summary.avgSubjectsPerArticle >= 2
                  ? t(
                      "insights.overview.multidisciplinarySummary.highMultidisciplinarity"
                    )
                  : t(
                      "insights.overview.multidisciplinarySummary.lowerMultidisciplinarity"
                    )}
              </div>
            </div>
          </div>

          {mostCommon && Array.isArray(mostCommon.subjects) && (
            <div className="pt-2 sm:pt-4 border-t border-gray-100">
              <div className="text-[11px] sm:text-xs text-gray-600 mb-1.5 sm:mb-2">
                {t(
                  "insights.overview.multidisciplinarySummary.mostCommonCombination"
                )}
              </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                {(mostCommon.subjects.slice(0, 5)).map(
                  (subject: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-1.5 sm:px-2 py-[1.5px] sm:py-0.5 text-[11px] sm:text-xs font-medium bg-purple-50 text-purple-800 rounded border border-purple-100"
                    >
                      {subject}
                    </span>
                  )
                )}
                {mostCommon.subjects.length > 5 && (
                  <ShowMoreSubjects subjects={mostCommon.subjects.slice(5)} />
                )}
                <span className="text-[11px] sm:text-xs text-gray-500 ml-0.5 sm:ml-1">
                  {t(
                    "insights.overview.multidisciplinarySummary.articlesLabel",
                    {
                      count: mostCommon.articleCount,
                    }
                  )}
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
