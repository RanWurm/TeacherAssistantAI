import { BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MOCK_KEYWORD_GROWTH } from '../../data/mock';
import type { TimeRange } from '../../types/insights.types';

interface KeywordGrowthTableProps {
  timeRange: TimeRange;
}

export function KeywordGrowthTable({ }: KeywordGrowthTableProps) {
  const { t } = useTranslation();
  const growth = MOCK_KEYWORD_GROWTH;
  const maxCount = Math.max(...growth.map(g => g.articleCount));
  const keywords = Array.from(new Set(growth.map(g => g.keyword)));

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
      <div className="space-y-4">
        {keywords.map((keyword) => {
          const keywordData = growth
            .filter(g => g.keyword === keyword)
            .sort((a, b) => a.year - b.year);

          return (
            <div key={keyword} className="space-y-2">
              <div className="text-xs font-semibold text-gray-700 mb-2">{keyword}</div>
              {keywordData.map((item, idx) => {
                const percent = (item.articleCount / maxCount) * 100;
                const isPositive = item.growth >= 0;

                return (
                  <div key={idx} className="flex items-center gap-3 group hover:bg-gray-50 -mx-1 px-1 py-1.5 rounded">
                    <div className="w-12 text-xs text-gray-600">{item.year}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {t('insights.trends.keywordGrowthTable.previous', { count: item.previousYearCount })}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">{item.articleCount.toLocaleString()}</span>
                        </div>
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                          isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
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
          );
        })}
      </div>
    </div>
  );
}
