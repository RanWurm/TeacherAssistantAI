import { Layers } from 'lucide-react';
import { MOCK_MULTIDISCIPLINARY_SUMMARY } from '../../data/mock';
import type { TimeRange } from '../../types/insights.types';
import { useTranslation } from 'react-i18next';

interface MultidisciplinarySummaryProps {
  timeRange: TimeRange;
}

function ProgressBar({
  percent,
  color,
  label,
  count,
  highlight = false,
}: {
  percent: number;
  color: string;
  label: string;
  count: number;
  highlight?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-600">{label}</span>
        <span className={`text-xs font-medium ${highlight ? 'text-purple-600' : 'text-gray-800'}`}>
          {((percent > 0.5 && percent < 99.5) ? percent.toFixed(1) : Math.round(percent))}%
        </span>
      </div>
      <div className="flex items-end gap-2">
        <div className="w-20 text-lg font-semibold text-gray-900">{count.toLocaleString()}</div>
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${color}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function MultidisciplinarySummary({ timeRange }: MultidisciplinarySummaryProps) {
  const { t } = useTranslation();
  const summary = MOCK_MULTIDISCIPLINARY_SUMMARY;
  const totalArticles = summary.singleSubjectArticles + summary.multiSubjectArticles;
  const singlePercent = totalArticles > 0 ? (summary.singleSubjectArticles / totalArticles) * 100 : 0;
  const multiPercent = totalArticles > 0 ? (summary.multiSubjectArticles / totalArticles) * 100 : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-5">
        <Layers className="w-5 h-5 text-purple-600" />
        <h3 className="text-base font-semibold text-gray-900">{t('insights.overview.multidisciplinarySummary.title')}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end">
        <ProgressBar
          percent={singlePercent}
          color="bg-gray-400"
          label={t('insights.overview.multidisciplinarySummary.singleSubject')}
          count={summary.singleSubjectArticles}
        />
        <ProgressBar
          percent={multiPercent}
          color="bg-purple-500"
          label={t('insights.overview.multidisciplinarySummary.multiSubject')}
          count={summary.multiSubjectArticles}
          highlight
        />
        <div className="flex flex-col items-start justify-between gap-1">
          <div className="text-xs text-gray-600 mb-0.5">{t('insights.overview.multidisciplinarySummary.avgSubjectsPerArticle')}</div>
          <div className="text-2xl font-bold text-purple-700 leading-tight">
            {summary.avgSubjectsPerArticle.toFixed(1)}
          </div>
          <div className="text-[10px] text-gray-400">
            {summary.avgSubjectsPerArticle >= 2
              ? t('insights.overview.multidisciplinarySummary.highMultidisciplinarity')
              : t('insights.overview.multidisciplinarySummary.lowerMultidisciplinarity')}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-600 mb-2">{t('insights.overview.multidisciplinarySummary.mostCommonCombination')}</div>
        <div className="flex items-center gap-2 flex-wrap">
          {summary.mostCommonSubjectCombination.subjects.map((subject, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 text-xs font-medium bg-purple-50 text-purple-800 rounded border border-purple-100"
            >
              {subject}
            </span>
          ))}
          <span className="text-xs text-gray-500 ml-1">
            {t('insights.overview.multidisciplinarySummary.articlesLabel', { count: summary.mostCommonSubjectCombination.articleCount })}
          </span>
        </div>
      </div>
    </div>
  );
}
