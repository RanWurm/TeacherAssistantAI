import { useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { TimeRange } from '../../types/insights.types';
import { useInsightsTrends } from '@/hooks/insights/useInsightsTrends';

interface KeywordGrowthTableProps {
  timeRange: TimeRange;
}

type GrowthRow = {
  keyword: string;
  year: number;
  articleCount: number;
  previousYearCount: number;
  growth: number;
};

const LIMIT = 3;

// Gentle loading color gradients analogous to publications-timeline.tsx
const skeletonYearClass =
  'w-12 h-3 bg-gradient-to-r from-blue-50 via-blue-100 to-purple-50 rounded';
const skeletonKeywordClass =
  'h-3 w-16 bg-gradient-to-r from-purple-50 via-blue-100 to-blue-50 rounded';
const skeletonMainBarClass =
  'h-2 w-10 rounded bg-gradient-to-r from-blue-100 via-blue-200 to-purple-100';
const skeletonSubBarClass =
  'h-3 w-8 rounded bg-gradient-to-r from-purple-100 via-blue-100 to-blue-100';
const skeletonPercentBarBg =
  'relative h-1.5 bg-gradient-to-r from-blue-100 via-blue-50 to-purple-100 rounded-full overflow-hidden';

export function KeywordGrowthTable({ timeRange }: KeywordGrowthTableProps) {
  const { t } = useTranslation();
  const { data, loading } = useInsightsTrends(timeRange);

  const FROM_YEAR_MAP: Record<TimeRange, number | undefined> = {
    '1y': new Date().getFullYear() - 1,
    '3y': new Date().getFullYear() - 3,
    '5y': new Date().getFullYear() - 5,
    'all': undefined,
  };

  const displayFromYear = FROM_YEAR_MAP[timeRange];

  const processed = useMemo(() => {
    const allRows = data?.keywordGrowth ?? [];
    const trending = data?.trendingTopics ?? [];

    if (!trending.length || !allRows.length) return [];

    // Map: keyword -> GrowthRow[]
    const byKeyword = new Map<string, GrowthRow[]>();

    allRows.forEach(({ keyword, year, articleCount }) => {
      if (!byKeyword.has(keyword)) byKeyword.set(keyword, []);
      byKeyword.get(keyword)!.push({
        keyword,
        year,
        articleCount,
        previousYearCount: 0,
        growth: 0,
      });
    });

    // Compute previousYearCount and growth, sort years (newest → oldest)
    byKeyword.forEach(rows => {
      rows.sort((a, b) => b.year - a.year);

      rows.forEach((row, i) => {
        const prev = rows[i + 1];
        row.previousYearCount = prev ? prev.articleCount : 0;
        row.growth = row.articleCount - row.previousYearCount;
      });
    });

    // Order by trendingTopics order
    return trending
      .map(topic => {
        const rows = byKeyword.get(topic.keyword);
        if (!rows) return null;

        const filtered =
          displayFromYear == null
            ? rows
            : rows.filter(r => r.year >= displayFromYear);

        return filtered.length
          ? ([topic.keyword, filtered] as [string, GrowthRow[]])
          : null;
      })
      .filter(Boolean)
      .slice(0, LIMIT) as [string, GrowthRow[]][];
  }, [data, displayFromYear]);

  const maxCount = useMemo(() => {
    return Math.max(
      1,
      ...(data?.keywordGrowth.map(r => r.articleCount) ?? [1])
    );
  }, [data]);

  return (
    <div className="bg-linear-to-br from-blue-50 via-white to-violet-50 border border-blue-100 rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-1.5">
        <BarChart3 className="w-4 h-4 text-gray-500" />
        <h3 className="text-sm font-semibold text-gray-900">
          {t('insights.trends.keywordGrowthTable.title')}
        </h3>
      </div>
      <p className="text-xs text-gray-600 mb-3">
        {t('insights.trends.keywordGrowthTable.subtitle')}
      </p>

      {loading ? (
        // Skeleton inspired by publications-timeline.tsx: gentle blues/purples, animating
        <div className="space-y-3 flex-1 animate-pulse">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="space-y-2">
              <div className={skeletonKeywordClass} />
              {[...Array(2)].map((__, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 -mx-1 px-1 py-1.5 rounded"
                >
                  <div className={skeletonYearClass} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className={skeletonMainBarClass} />
                        <div className={skeletonSubBarClass} />
                      </div>
                      <div className="w-9 h-4 rounded bg-linear-to-r from-green-50 to-green-100" />
                    </div>
                    <div className={skeletonPercentBarBg}>
                      <div
                        className="absolute left-0 top-0 h-1.5 bg-linear-to-r from-blue-300 via-purple-100 to-blue-200 rounded-full"
                        style={{ width: `${70 - idx * 10 - i * 15}%`, opacity: 0.85 }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : !processed.length ? (
        <div className="text-sm text-gray-400">
          {t('insights.trends.keywordGrowthTable.noData')}
        </div>
      ) : (
        <div className="space-y-4">
          {processed.map(([keyword, rows]) => (
            <div key={keyword} className="space-y-2">
              <div className="text-xs font-semibold text-gray-700 mb-2">
                {keyword}
              </div>

              {rows.map((item) => {
                const percent = (item.articleCount / maxCount) * 100;
                const isPositive = item.growth >= 0;

                return (
                  <div
                    key={item.year}
                    className="flex items-center gap-3 hover:bg-gray-50 -mx-1 px-1 py-1.5 rounded"
                  >
                    <div className="w-12 text-xs text-gray-600">{item.year}</div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {t('insights.trends.keywordGrowthTable.previous', {
                              count: item.previousYearCount,
                            })}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {item.articleCount.toLocaleString()}
                          </span>
                        </div>

                        <span
                          dir="ltr"
                          className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                            isPositive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {isPositive ? '+' : ''}
                          {item.growth}
                        </span>
                      </div>

                      <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${
                            isPositive ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
