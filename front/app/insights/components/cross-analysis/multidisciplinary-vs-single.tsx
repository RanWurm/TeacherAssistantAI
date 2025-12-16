import { BarChart3, Layers, Network } from 'lucide-react';
import { MOCK_MULTIDISCIPLINARY_COMPARISON } from '../../data/mock';
import type { TimeRange } from '../../types/insights.types';
import { useTranslation } from 'react-i18next';

interface MultidisciplinaryVsSingleProps {
  timeRange: TimeRange;
}

export function MultidisciplinaryVsSingle({ }: MultidisciplinaryVsSingleProps) {
  const { t, i18n } = useTranslation();
  const comparison = MOCK_MULTIDISCIPLINARY_COMPARISON;
  const maxCitations = Math.max(...comparison.map(c => c.totalCitations));
  const isRtl = i18n.dir() === 'rtl';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-4">
      <div className="flex items-center gap-2 mb-4 sm:mb-4">
        <BarChart3 className="w-4 h-4 sm:w-4 sm:h-4 text-gray-500" />
        <h3 className="text-sm font-semibold text-gray-900 sm:text-sm">
          {t('insights.cross.multidisciplinaryVsSingle.title')}
        </h3>
      </div>

      <p className="text-xs text-gray-600 mb-3 sm:mb-3 sm:text-xs text-[11px]">
        {t('insights.cross.multidisciplinaryVsSingle.description')}
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4">
        {comparison.map((item, idx) => {
          const isMulti = item.category === 'multi-subject';
          const citationPercent = (item.totalCitations / maxCitations) * 100;
          // Determine correct direction for the fill bar
          const positionClass = isRtl
            ? "absolute inset-y-0 right-0 rounded-full transition-all duration-700"
            : "absolute inset-y-0 left-0 rounded-full transition-all duration-700";
          const fillColorClass = isMulti ? 'bg-purple-500' : 'bg-blue-500';

          return (
            <div
              key={idx}
              className={`p-3 rounded-lg border ${
                isMulti ? 'border-purple-200 bg-purple-50/30' : 'border-blue-200 bg-blue-50/30'
              } sm:p-3 p-2`}
            >
              <div className="flex items-center gap-2 mb-3 sm:mb-3">
                {isMulti ? (
                  <Network className="w-4 h-4 sm:w-4 sm:h-4 text-purple-600" />
                ) : (
                  <Layers className="w-4 h-4 sm:w-4 sm:h-4 text-blue-600" />
                )}
                <span className={`text-sm font-semibold ${
                  isMulti ? 'text-purple-900' : 'text-blue-900'
                } sm:text-sm text-xs`}>
                  {isMulti
                    ? t('insights.cross.multidisciplinaryVsSingle.multiSubject')
                    : t('insights.cross.multidisciplinaryVsSingle.singleSubject')}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-3 sm:gap-3 sm:mb-3">
                <div>
                  <div className="text-xs text-gray-600 mb-0.5 sm:text-xs text-[11px] sm:mb-0.5">
                    {t('insights.cross.multidisciplinaryVsSingle.articlesLabel')}
                  </div>
                  <div className="text-lg font-semibold text-gray-900 sm:text-lg">{item.articleCount.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-0.5 sm:text-xs text-[11px] sm:mb-0.5">
                    {t('insights.cross.multidisciplinaryVsSingle.avgCitationsLabel')}
                  </div>
                  <div className="text-lg font-semibold text-gray-900 sm:text-lg">{item.avgCitations.toFixed(1)}</div>
                </div>
              </div>

              <div className="space-y-1.5 mb-3 sm:space-y-1.5 sm:mb-3">
                <div className="flex items-center justify-between text-xs text-gray-600 sm:text-xs text-[11px]">
                  <span>{t('insights.cross.multidisciplinaryVsSingle.citationsLabel')}</span>
                  <span className="font-medium">{item.totalCitations.toLocaleString()}</span>
                </div>
                <div className="relative h-2 bg-white rounded-full overflow-hidden border border-gray-200 sm:h-2">
                  <div
                    className={`${positionClass} ${fillColorClass}`}
                    style={{ width: `${citationPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-200 text-xs text-gray-600 sm:pt-2 sm:text-xs text-[11px]">
                <span>
                  {t('insights.cross.multidisciplinaryVsSingle.authorsLabel', { count: item.uniqueAuthors })}
                </span>
                <span>
                  {t('insights.cross.multidisciplinaryVsSingle.journalsLabel', { count: item.uniqueJournals })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
