import { Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import type { TimeRange } from '@/lib/api/insights.api';
import type { PublicationsTimelinePoint } from '@/lib/types/insights/Overview';
import { fetchOverviewInsights } from '@/lib/api/insights.api';

interface PublicationsTimelineProps {
  timeRange: TimeRange;
}

export function PublicationsTimeline({ timeRange }: PublicationsTimelineProps) {
  const { t, i18n } = useTranslation();
  const [timeline, setTimeline] = useState<PublicationsTimelinePoint[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [order, setOrder] = useState<'desc' | 'asc'>('desc');
  const [showCount, setShowCount] = useState<number>(5);
  const isRtl = i18n.dir() === 'rtl';

  // Load data
  useEffect(() => {
    let cancelled = false;
    setShowCount(5); // reset when timeRange changes
    setLoading(true);
    setTimeline(null);

    fetchOverviewInsights(timeRange)
      .then(data => {
        if (!cancelled && data && Array.isArray(data.timeline)) {
          setTimeline(data.timeline as PublicationsTimelinePoint[]);
        }
      })
      .catch(() => {
        // log removed
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [timeRange]);

  // Defensive clone and sort for order
  const ordered = timeline ? [...timeline] : [];
  if (order === 'desc') {
    ordered.sort((a, b) => b.year - a.year);
  } else {
    ordered.sort((a, b) => a.year - b.year);
  }

  // Only first N visible
  const visibleTimeline = ordered.slice(0, showCount);

  const maxArticles =
    timeline && timeline.length > 0
      ? Math.max(...timeline.map((t) => t.articleCount))
      : 1;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-2 sm:p-4">
      <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-5">
        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
        <h3 className="text-sm sm:text-base font-semibold text-gray-900">
          {t('insights.overview.publicationsTimeline.title')}
        </h3>
        <div className="ml-auto flex gap-1">
          {/* Order toggle button */}
          <button
            className={`text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded border ${
              order === 'desc'
                ? 'bg-purple-100 border-purple-300 text-purple-700'
                : 'bg-white border-gray-300 text-gray-600'
            }`}
            aria-pressed={order === 'desc'}
            onClick={() => setOrder('desc')}
            title={t('insights.overview.publicationsTimeline.orderNewest', 'Newest first')}
            type="button"
          >
            {t('insights.overview.publicationsTimeline.orderNewest', 'Newest')}
          </button>
          <button
            className={`text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded border ${
              order === 'asc'
                ? 'bg-purple-100 border-purple-300 text-purple-700'
                : 'bg-white border-gray-300 text-gray-600'
            }`}
            aria-pressed={order === 'asc'}
            onClick={() => setOrder('asc')}
            title={t('insights.overview.publicationsTimeline.orderOldest', 'Oldest first')}
            type="button"
          >
            {t('insights.overview.publicationsTimeline.orderOldest', 'Oldest')}
          </button>
        </div>
      </div>
      <div className="space-y-3 sm:space-y-3">
        {loading || !timeline ? (
          // Show skeleton loading (5 skeleton rows)
          Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-1.5 sm:gap-3 group animate-pulse -mx-1.5 sm:-mx-2 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded transition-colors`}
              dir={isRtl ? 'rtl' : 'ltr'}
            >
              {!isRtl ? (
                <div className="w-9 sm:w-12 text-xs sm:text-sm font-medium text-gray-200 bg-gray-100 rounded h-5" />
              ) : null}
              <div className="flex-1 min-w-0">
                <div
                  className={`flex items-center justify-between mb-0.5 sm:mb-1 ${
                    isRtl ? 'flex-row-reverse' : ''
                  }`}
                >
                  {/* main skeleton */}
                  {!isRtl ? (
                    <>
                      <div className="flex items-center gap-2 sm:gap-3 w-28 sm:w-36">
                        <div className="h-3 w-10 sm:w-16 bg-gray-200 rounded" />
                        <div className="h-2 w-7 sm:w-10 bg-gray-100 rounded" />
                        <div className="h-2 w-8 bg-gray-100 rounded" />
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="h-2 w-12 sm:w-16 bg-gray-100 rounded" />
                        <div className="h-2 w-12 sm:w-16 bg-gray-100 rounded" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="h-2 w-12 sm:w-16 bg-gray-100 rounded" />
                        <div className="h-2 w-12 sm:w-16 bg-gray-100 rounded" />
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 w-28 sm:w-36">
                        <div className="h-3 w-10 sm:w-16 bg-gray-200 rounded" />
                        <div className="h-2 w-7 sm:w-10 bg-gray-100 rounded" />
                        <div className="h-2 w-8 bg-gray-100 rounded" />
                      </div>
                    </>
                  )}
                </div>
                <div className="relative h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`absolute inset-y-0 ${isRtl ? 'right-0' : 'left-0'} bg-blue-200 rounded-full transition-all duration-700`}
                    style={{ width: `70%` }}
                  />
                </div>
              </div>
              {isRtl ? (
                <div className="w-9 sm:w-12 text-xs sm:text-sm font-medium text-gray-200 bg-gray-100 rounded h-5" />
              ) : null}
            </div>
          ))
        ) : (
          <>
            {visibleTimeline.map((point, idx) => {
              // get index in ordered array for prevPoint (NOT the timeline)
              const prevPoint =
                idx > 0
                  ? visibleTimeline[idx - 1]
                  : null;
              const articlePercent = maxArticles > 0 ? (point.articleCount / maxArticles) * 100 : 0;
              const growth =
                prevPoint && prevPoint.articleCount > 0
                  ? ((point.articleCount - prevPoint.articleCount) / prevPoint.articleCount) * 100
                  : null;

              const yearElem = (
                <div className="w-9 sm:w-12 text-xs sm:text-sm font-medium text-gray-700">{point.year}</div>
              );
              const mainInfo = (
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xs sm:text-sm font-semibold text-gray-900">
                    {point.articleCount.toLocaleString()}
                  </span>
                  <span className="text-[10px] sm:text-xs text-gray-500">
                    {t('insights.overview.publicationsTimeline.articles')}
                  </span>
                  {growth !== null && Number.isFinite(growth) && (
                    <span
                      className={`text-[10px] sm:text-xs font-medium ${
                        growth >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                      dir="ltr"
                    >
                      {growth >= 0 ? '+' : ''}
                      {growth.toFixed(1)}%
                      {' '}
                      <span className="sr-only">
                        {t('insights.overview.publicationsTimeline.growthRate', {
                          percent: growth.toFixed(1),
                        })}
                      </span>
                    </span>
                  )}
                </div>
              );
              const subInfo = (
                <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-gray-500">
                  <span>
                    {t('insights.overview.publicationsTimeline.authors', {
                      count: point.authorCount,
                    })}
                  </span>
                  <span>
                  {t('insights.overview.publicationsTimeline.sources', {
                    count: point.sourceCount,
                  })}
                </span>
                </div>
              );

              return (
                <div
                  key={point.year}
                  className={`flex items-center gap-1.5 sm:gap-3 group hover:bg-gray-50 -mx-1.5 sm:-mx-2 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded transition-colors ${
                    isRtl ? 'flex-row-reverse' : ''
                  }`}
                  dir={isRtl ? 'rtl' : 'ltr'}
                >
                  {/* Year on appropriate side */}
                  {!isRtl ? yearElem : null}
                  <div className="flex-1 min-w-0">
                    <div
                      className={`flex items-center justify-between mb-0.5 sm:mb-1 ${
                        isRtl ? 'flex-row-reverse' : ''
                      }`}
                    >
                      {/* Info order: articles left, sub-info right (in LTR); reverse for RTL */}
                      {!isRtl ? (
                        <>
                          {mainInfo}
                          {subInfo}
                        </>
                      ) : (
                        <>
                          {subInfo}
                          {mainInfo}
                        </>
                      )}
                    </div>
                    <div className="relative h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`absolute inset-y-0 ${
                          isRtl ? 'right-0' : 'left-0'
                        } bg-blue-500 rounded-full transition-all duration-700`}
                        style={{ width: `${articlePercent}%` }}
                      />
                    </div>
                  </div>
                  {/* Year on opposite side if RTL */}
                  {isRtl ? yearElem : null}
                </div>
              );
            })}
            {/* Show More button */}
            {timeline && showCount < timeline.length && (
              <div className="flex justify-center pt-2">
                <button
                  className="px-3 py-1 rounded bg-purple-50 border border-purple-100 text-purple-700 text-xs sm:text-sm font-medium hover:bg-purple-100 transition"
                  onClick={() => setShowCount((c) => Math.min(c + 5, timeline.length))}
                  type="button"
                >
                  {t('insights.overview.publicationsTimeline.showMore', 'Show more')}
                </button>
              </div>
            )}
            {/* No results */}
            {timeline.length === 0 && (
              <div className="text-gray-400 text-xs py-4 text-center">
                {t('insights.overview.publicationsTimeline.loading')}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
