import { Calendar } from 'lucide-react';
import { MOCK_PUBLICATIONS_TIMELINE } from '../../data/mock';
import type { TimeRange } from '../../types/insights.types';
import { useTranslation } from 'react-i18next';

interface PublicationsTimelineProps {
  timeRange: TimeRange;
}

export function PublicationsTimeline({ timeRange }: PublicationsTimelineProps) {
  const { t, i18n } = useTranslation();
  const timeline = MOCK_PUBLICATIONS_TIMELINE;
  const maxArticles = Math.max(...timeline.map(t => t.articleCount));
  const isRtl = i18n.dir() === 'rtl';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-5">
        <Calendar className="w-5 h-5 text-purple-600" />
        <h3 className="text-base font-semibold text-gray-900">
          {t('insights.overview.publicationsTimeline.title')}
        </h3>
      </div>
      <div className="space-y-3">
        {timeline.map((point, idx) => {
          const articlePercent = (point.articleCount / maxArticles) * 100;
          const prevPoint = idx > 0 ? timeline[idx - 1] : null;
          const growth =
            prevPoint && prevPoint.articleCount > 0
              ? ((point.articleCount - prevPoint.articleCount) / prevPoint.articleCount) * 100
              : null;

          // Compose main metric (year + bar + info) positions per direction
          const yearElem = (
            <div className="w-12 text-sm font-medium text-gray-700">{point.year}</div>
          );
          const mainInfo = (
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-900">
                {point.articleCount.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500">
                {t('insights.overview.publicationsTimeline.articles')}
              </span>
              {growth !== null && Number.isFinite(growth) && (
                <span
                  className={`text-xs font-medium ${
                    growth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                  dir="ltr"
                >
                  {growth >= 0 ? '+' : ''}
                  {growth.toFixed(1)}%
                  {` `}
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
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>
                {t('insights.overview.publicationsTimeline.authors', {
                  count: point.authorCount,
                })}
              </span>
              <span>
                {t('insights.overview.publicationsTimeline.journals', {
                  count: point.journalCount,
                })}
              </span>
            </div>
          );

          return (
            <div
              key={point.year}
              className={`flex items-center gap-3 group hover:bg-gray-50 -mx-2 px-2 py-1.5 rounded transition-colors ${
                isRtl ? 'flex-row-reverse' : ''
              }`}
              dir={isRtl ? 'rtl' : 'ltr'}
            >
              {/* Year on appropriate side */}
              {!isRtl ? yearElem : null}
              <div className="flex-1 min-w-0">
                <div
                  className={`flex items-center justify-between mb-1 ${
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
                <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
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
      </div>
    </div>
  );
}
