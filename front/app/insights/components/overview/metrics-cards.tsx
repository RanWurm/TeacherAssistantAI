import { FileText, Users, BookOpen, TrendingUp, Tag, Hash, Layers, UserCheck, LucideIcon } from 'lucide-react';
import { MOCK_OVERVIEW_METRICS } from '../../data/mock';
import type { TimeRange } from '../../types/insights.types';

const metricGradients = [
  "bg-gradient-to-br from-[var(--metric-blue-s)] to-[var(--metric-blue-e)]",
  "bg-gradient-to-br from-[var(--metric-purple-s)] to-[var(--metric-pink-e)]",
  "bg-gradient-to-br from-[var(--metric-green-s)] to-[var(--metric-green-e)]",
  "bg-gradient-to-br from-[var(--metric-orange-s)] to-[var(--metric-red-e)]",
];

interface MetricCard {
  label: string;
  value: number;
  icon: LucideIcon;
  colorIdx: number;
  format?: (v: number) => string;
}

interface MetricsCardsProps {
  timeRange: TimeRange;
}

export function MetricsCards({ }: MetricsCardsProps) {
  const m = MOCK_OVERVIEW_METRICS;
  const cards: MetricCard[] = [
    { label: 'Articles', value: m.totalArticles, icon: FileText, colorIdx: 0 },
    { label: 'Authors', value: m.totalAuthors, icon: Users, colorIdx: 1 },
    { label: 'Journals', value: m.totalJournals, icon: BookOpen, colorIdx: 2 },
    { label: 'Avg Citations', value: m.avgCitationsPerArticle, icon: TrendingUp, colorIdx: 3, format: v => v.toFixed(1) },
    { label: 'Subjects', value: m.totalSubjects, icon: Hash, colorIdx: 1 },
    { label: 'Keywords', value: m.totalKeywords, icon: Tag, colorIdx: 2 },
    { label: 'Multi-Subject', value: m.articlesWithMultipleSubjects, icon: Layers, colorIdx: 3 },
    { label: 'Multi-Author', value: m.articlesWithMultipleAuthors, icon: UserCheck, colorIdx: 0 },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((metric, idx) => {
        const Icon = metric.icon;
        const gradient = metricGradients[metric.colorIdx % metricGradients.length];
        const displayValue = metric.format ? metric.format(metric.value) : metric.value.toLocaleString();
        return (
          <div
            key={idx}
            className="bg-(--card-bg) rounded-xl border border-(--border-color) shadow-sm p-4 flex items-center gap-3"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow ${gradient}`}>
              <Icon className="w-4 h-4" style={{ color: 'var(--on-primary)' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-(--card-sub-text) leading-none truncate">{metric.label}</p>
              <div className="h-1" />
              <p className="text-lg font-bold text-(--card-text) leading-none">{displayValue}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}