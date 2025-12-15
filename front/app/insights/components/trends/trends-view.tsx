import { useTranslation } from 'react-i18next';
import { TrendingTopicsTable } from './trending-topics-table';
import { KeywordGrowthTable } from './keyword-growth-table';
import { KeywordCrossDomain } from './keyword-cross-domain';
import type { TimeRange } from '../../types/insights.types';

interface TrendsViewProps {
  timeRange: TimeRange;
}

export function TrendsView({ timeRange }: TrendsViewProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{t('insights.tabs.trends')}</h2>
          <p className="text-sm text-gray-600 mt-0.5">{t('insights.trends.trendingTopicsTable.subtitle')}</p>
        </div>
      </div>
      <TrendingTopicsTable timeRange={timeRange} />
      <KeywordGrowthTable timeRange={timeRange} />
      <KeywordCrossDomain timeRange={timeRange} />
    </div>
  );
}
