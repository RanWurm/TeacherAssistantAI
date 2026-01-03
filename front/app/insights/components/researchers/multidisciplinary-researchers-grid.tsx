import React from 'react';
import { useTranslation } from 'react-i18next';
import { MultidisciplinaryResearcherCard } from './multidisciplinary-researcher-card';
import type { TimeRange } from '../../types/insights.types';
import { fetchResearchersInsights } from '@/lib/api/insights.api';

interface MultidisciplinaryResearchersGridProps {
  timeRange: TimeRange;
}

export function MultidisciplinaryResearchersGrid({
  timeRange,
}: MultidisciplinaryResearchersGridProps) {
  const { t, i18n } = useTranslation();

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [data, setData] = React.useState<any>(null);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setData(null);

    fetchResearchersInsights(timeRange)
      .then(res => {
        if (!cancelled) setData(res);
      })
      .catch(err => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [timeRange]);

  const researchers =
    data?.multidisciplinaryResearchers?.map((r: any) => ({
      authorId: String(r.author_id),
      name: r.name,
      affiliation: (r as any).affiliation ?? undefined,
      subjectCount: r.subjectCount,
      articleCount: r.articleCount,
      avgCitationsPerArticle:
        'avgCitationsPerArticle' in r
          ? (r as any).avgCitationsPerArticle
          : r.avgCitations ?? 0,
      subjects: typeof r.subjects === 'string'
        ? (r.subjects as string).split('||')
        : Array.isArray((r as any).subjects)
          ? (r as any).subjects
          : [],
    })) ?? [];

  const isRtl = i18n.dir() === 'rtl';

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-1">
        {t('insights.researchers.multidisciplinaryResearchers.title')}
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        {t('insights.researchers.multidisciplinaryResearchers.description')}
      </p>

      <div className="space-y-3">
        {loading ? (
          // show 5 skeleton cards, with direction and structure like PublicationsTimeline
          Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 sm:gap-4 animate-pulse group px-2 py-2 rounded border border-gray-100 bg-white`}
              dir={isRtl ? 'rtl' : 'ltr'}
            >
              {/* Main profile avatar/initials */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gray-100 rounded-full flex items-center justify-center" />
              </div>
              {/* Main info: lines and blocks */}
              <div className="flex-1 min-w-0">
                <div className="mb-2 space-y-1">
                  <div className="h-3 w-2/5 bg-gray-100 rounded" />
                  <div className="h-2 w-1/4 bg-gray-100 rounded" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] sm:text-xs mb-2">
                  <div className="flex items-center gap-1">
                    <div className="bg-gray-100 w-4 h-2 rounded" />
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="bg-gray-100 w-6 h-2 rounded" />
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="bg-gray-100 w-5 h-2 rounded" />
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="bg-gray-100 w-7 h-2 rounded" />
                  </div>
                </div>
                {/* Insight pill skeleton */}
                <div className="h-4 w-20 bg-blue-100 rounded" />
              </div>
            </div>
          ))
        ) : error ? (
          <div className="py-6 text-center text-red-700">
            {t('insights.error')}
          </div>
        ) : (
          <>
            {researchers.map((r: any) => (
              <MultidisciplinaryResearcherCard
                key={r.authorId}
                researcher={r}
              />
            ))}
            {researchers.length === 0 && (
              <div className="py-6 text-center text-gray-500">
                {t('insights.noData')}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}