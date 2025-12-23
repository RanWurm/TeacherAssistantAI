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
import { MOCK_OVERVIEW_METRICS } from "../../data/mock";
import type { TimeRange } from "../../types/insights.types";
import { useTranslation } from "react-i18next";

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

export function MetricsCards({}: MetricsCardsProps) {
  const { t } = useTranslation();

  const m = MOCK_OVERVIEW_METRICS;
  const cards: MetricCard[] = [
    {
      i18nKey: "insights.overview.metricsCards.articles",
      value: m.totalArticles,
      icon: FileText,
      colorIdx: 0,
    },
    {
      i18nKey: "insights.overview.metricsCards.authors",
      value: m.totalAuthors,
      icon: Users,
      colorIdx: 1,
    },
    {
      i18nKey: "insights.overview.metricsCards.journals",
      value: m.totalJournals,
      icon: BookOpen,
      colorIdx: 2,
    },
    {
      i18nKey: "insights.overview.metricsCards.avgCitations",
      value: m.avgCitationsPerArticle,
      icon: TrendingUp,
      colorIdx: 3,
      format: (v) => v.toFixed(1),
    },
    {
      i18nKey: "insights.overview.metricsCards.subjects",
      value: m.totalSubjects,
      icon: Hash,
      colorIdx: 1,
    },
    {
      i18nKey: "insights.overview.metricsCards.keywords",
      value: m.totalKeywords,
      icon: Tag,
      colorIdx: 2,
    },
    {
      i18nKey: "insights.overview.metricsCards.multiSubject",
      value: m.articlesWithMultipleSubjects,
      icon: Layers,
      colorIdx: 3,
    },
    {
      i18nKey: "insights.overview.metricsCards.multiAuthor",
      value: m.articlesWithMultipleAuthors,
      icon: UserCheck,
      colorIdx: 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
      {cards.map((metric, idx) => {
        const Icon = metric.icon;
        const gradient =
          metricGradients[metric.colorIdx % metricGradients.length];
        const displayValue = metric.format
          ? metric.format(metric.value)
          : metric.value.toLocaleString();
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