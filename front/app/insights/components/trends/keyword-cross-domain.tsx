import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Network } from 'lucide-react';
import { MOCK_KEYWORD_CROSS_DOMAIN } from '../../data/mock';
import type { TimeRange } from '../../types/insights.types';

interface KeywordCrossDomainProps {
  timeRange: TimeRange;
}

export function KeywordCrossDomain({ }: KeywordCrossDomainProps) {
  const { t } = useTranslation();
  const crossDomain = MOCK_KEYWORD_CROSS_DOMAIN;
  // Track which keywords are "expanded" to show all subjects
  const [expanded, setExpanded] = useState<{ [keyword: string]: boolean }>({});

  const handleExpand = (keyword: string) => {
    setExpanded(prev => ({ ...prev, [keyword]: true }));
  };

  return (
    <div className="bg-linear-to-br from-blue-50 via-white to-violet-50 border border-blue-100 rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Network className="w-4 h-4 text-gray-500" />
        <h3 className="text-sm font-semibold text-gray-900">
          {t('insights.trends.keywordCrossDomain.title')}
        </h3>
      </div>
      <div className="space-y-4">
        {crossDomain.map((item, idx) => {
          const isExpanded = expanded[item.keyword];
          const displaySubjects = isExpanded ? item.subjects : item.subjects.slice(0, 5);
          const hasMore = item.subjects.length > 5 && !isExpanded;
          const remainingCount = item.subjects.length - 5;

          return (
            <div
              key={idx}
              className="p-3 border border-gray-100 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              {/* Keyword + domain count */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base font-medium text-gray-900">{item.keyword}</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 border border-purple-100 text-xs font-semibold text-purple-700">
                    {t('insights.trends.keywordCrossDomain.domains', { count: item.subjectCount })}
                  </span>
                </div>
                <span className="text-xs text-gray-500 font-normal">
                  {t('insights.trends.keywordCrossDomain.articles', { count: item.articleCount })}
                </span>
              </div>

              {/* Clustered subject chips */}
              <div className="flex flex-wrap gap-2 mb-1">
                {displaySubjects.map((subject, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-2 py-0.5 text-xs font-medium bg-white border border-gray-300 text-gray-700 rounded-full shadow-sm whitespace-nowrap"
                  >
                    {subject}
                  </span>
                ))}
                {hasMore && (
                  <button
                    type="button"
                    className="px-2 py-0.5 text-xs text-gray-500 border border-dashed border-gray-300 bg-white rounded-full hover:bg-gray-100 focus:outline-none transition"
                    aria-label={t('insights.trends.keywordCrossDomain.showMore', { count: remainingCount })}
                    onClick={() => handleExpand(item.keyword)}
                  >
                    {t('insights.trends.keywordCrossDomain.showMore', { count: remainingCount })}
                  </button>
                )}
              </div>
              
              {/* Reveal hint for more subjects */}
              {hasMore && (
                <div className="mt-0.5 text-xs text-gray-400 italic">
                  {t('insights.trends.keywordCrossDomain.revealHint')}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
