import {
  FileText,
  Users,
  BookOpen,
  TrendingUp,
  Tag,
  Hash,
  Layers,
  UserCheck,
  LucideIcon,
} from "lucide-react";
import type { TimeRange } from "../../types/insights.types";
import { useTranslation } from "react-i18next";
import { useInsightsOverview } from "@/hooks/insights/useInsightsOverview";
import { useEffect } from "react";

const metricGradients = [
  "bg-gradient-to-br from-[var(--metric-blue-s)] to-[var(--metric-blue-e)]",
  "bg-gradient-to-br from-[var(--metric-purple-s)] to-[var(--metric-pink-e)]",
  "bg-gradient-to-br from-[var(--metric-green-s)] to-[var(--metric-green-e)]",
  "bg-gradient-to-br from-[var(--metric-orange-s)] to-[var(--metric-red-e)]",
];

interface MetricCard {
  i18nKey: string;
  value: number;
  icon: LucideIcon;
  colorIdx: number;
  format?: (v: number) => string;
}

interface MetricsCardsProps {
  timeRange: TimeRange;
}

export function MetricsCards({ timeRange }: MetricsCardsProps) {
  const { t } = useTranslation();

  const { data, loading } = useInsightsOverview(timeRange);

  useEffect(() => {
    // logs removed
  }, [loading, data, timeRange]);

  const metrics = data?.metrics;
  const multidisciplinary = data?.multidisciplinary;

  // logs removed

  const cards: MetricCard[] =
    metrics && multidisciplinary
      ? [
          {
            i18nKey: "insights.overview.metricsCards.articles",
            value: metrics.articles,
            icon: FileText,
            colorIdx: 0,
          },
          {
            i18nKey: "insights.overview.metricsCards.authors",
            value: metrics.authors,
            icon: Users,
            colorIdx: 1,
          },
          {
            i18nKey: "insights.overview.metricsCards.journals",
            value: metrics.journals,
            icon: BookOpen,
            colorIdx: 2,
          },
          {
            i18nKey: "insights.overview.metricsCards.avgCitations",
            value:
              typeof metrics.avgCitations === "number"
                ? metrics.avgCitations
                : 0,
            icon: TrendingUp,
            colorIdx: 3,
            format: () =>
              metrics.avgCitations == null
                ? "—"
                : Number(metrics.avgCitations).toFixed(1),
          },
          {
            i18nKey: "insights.overview.metricsCards.subjects",
            value: metrics.subjects,
            icon: Hash,
            colorIdx: 1,
          },
          {
            i18nKey: "insights.overview.metricsCards.keywords",
            value: metrics.keywords,
            icon: Tag,
            colorIdx: 2,
          },
          {
            i18nKey: "insights.overview.metricsCards.multiSubject",
            value: multidisciplinary.multiSubjectArticles,
            icon: Layers,
            colorIdx: 3,
          },
          {
            i18nKey: "insights.overview.metricsCards.multiAuthor",
            value: multidisciplinary.singleSubjectArticles,
            icon: UserCheck,
            colorIdx: 0,
          },
        ]
      : [];

  useEffect(() => {
    // logs removed
  }, [cards]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
      {loading || !metrics || !multidisciplinary
        ? Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="
                bg-(--card-bg) rounded-xl border border-(--border-color) shadow-sm
                p-2 sm:p-4
                flex items-center gap-2 sm:gap-3 animate-pulse
                opacity-80
              "
            >
              <div
                className={`
                  w-6 h-6 sm:w-8 sm:h-8 
                  rounded-lg flex items-center justify-center shadow
                  ${metricGradients[idx % metricGradients.length]}
                `}
              >
                {" "}
              </div>
              <div className="flex-1 min-w-0">
                <div className="h-3 bg-slate-300 rounded w-2/3 mb-1" />
                <div className="h-4 bg-slate-200 rounded w-1/3" />
              </div>
            </div>
          ))
        : cards.map((metric, idx) => {
            const Icon = metric.icon;
            const gradient =
              metricGradients[metric.colorIdx % metricGradients.length];
            const displayValue =
              metric.format !== undefined
                ? metric.format(metric.value)
                : metric.value.toLocaleString();

            // logs removed

            return (
              <div
                key={idx}
                className="
                  bg-(--card-bg) rounded-xl border border-(--border-color) shadow-sm
                  p-2 sm:p-4
                  flex items-center gap-2 sm:gap-3
                "
              >
                <div
                  className={`
                    w-6 h-6 sm:w-8 sm:h-8 
                    rounded-lg flex items-center justify-center shadow 
                    ${gradient}
                  `}
                >
                  <Icon
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                    style={{ color: "var(--on-primary)" }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-(--card-sub-text) leading-none truncate">
                    {t(metric.i18nKey)}
                  </p>
                  <div className="h-1 sm:h-1" />
                  <p className="text-base sm:text-lg font-bold text-(--card-text) leading-none">
                    {displayValue}
                  </p>
                </div>
              </div>
            );
          })}
    </div>
  );
}