import { useState, useEffect } from 'react';
import { ResearcherProfileCard } from './researcher-profile-card';
import type { TimeRange } from '../../types/insights.types';
import { useTranslation } from 'react-i18next';
import { fetchResearchersInsights } from '@/lib/api/insights.api';
import type { ResearcherStats } from '@/lib/types/insights/Researchers';

const profileGradients = [
  "bg-gradient-to-br from-[var(--metric-blue-s)] to-[var(--metric-blue-e)]",
  "bg-gradient-to-br from-[var(--metric-purple-s)] to-[var(--metric-pink-e)]",
  "bg-gradient-to-br from-[var(--metric-green-s)] to-[var(--metric-green-e)]",
  "bg-gradient-to-br from-[var(--metric-orange-s)] to-[var(--metric-red-e)]",
];

interface ResearcherGridProps {
  timeRange: TimeRange;
}

export function ResearcherGrid({ timeRange }: ResearcherGridProps) {
  const { t, i18n } = useTranslation();
  const [researchers, setResearchers] = useState<ResearcherStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchResearchersInsights(timeRange)
      .then(data => {
        const parsed = Array.isArray(data?.topResearchers)
          ? data.topResearchers.map((r: any) => ({
              ...r,
              institutions:
                typeof r.institutions === 'string'
                  ? r.institutions.split('||')
                  : Array.isArray(r.institutions)
                    ? r.institutions
                    : [],
            }))
          : [];
        setResearchers(parsed);
      })
      .catch(err => {
        setError(
          t('insights.researchers.errorLoading', { error: err?.message || String(err) })
        );
      })
      .finally(() => setLoading(false));
  }, [timeRange, t]);

  const sorted = [...researchers].sort(
    (a, b) => b.totalCitations - a.totalCitations
  );

  const maxCitations =
    sorted.length > 0 ? Math.max(...sorted.map(r => r.totalCitations)) : 0;

  const isRtl = i18n.dir() === 'rtl';

  return (
    <div>
      {loading ? (
        <div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          dir={isRtl ? 'rtl' : 'ltr'}
          data-testid="researcher-loading-skeletons"
        >
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="
                bg-(--card-bg) rounded-xl border border-(--border-color) shadow-sm
                p-2 sm:p-4
                flex flex-col gap-3 animate-pulse
                opacity-80
                min-h-[158px]
              "
            >
              <div className="flex flex-row items-center gap-3 sm:gap-4">
                <div
                  className={`
                    w-9 h-9 sm:w-12 sm:h-12
                    rounded-lg flex items-center justify-center shadow
                    ${profileGradients[idx % profileGradients.length]}
                  `}
                >{" "}</div>
                <div className="flex-1 min-w-0">
                  <div className="h-3 bg-slate-300 rounded w-32 mb-1" />
                  <div className="h-3 bg-slate-200 rounded w-16" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-300 mb-2 sm:mb-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div className="flex items-center gap-1" key={i}>
                    <div className="w-3 h-3 bg-slate-100 rounded" />
                    <div className="w-14 h-3 bg-slate-100 rounded" />
                  </div>
                ))}
              </div>
              <div className="h-4 w-28 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-6">{error}</div>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          {sorted.map((r, idx) => (
            <ResearcherProfileCard
              key={r.author_id}
              rank={idx + 1}
              maxCitations={maxCitations}
              timeRange={timeRange}
              researcher={r}
            />
          ))}
        </div>
      )}
    </div>
  );
}