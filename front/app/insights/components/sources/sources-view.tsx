import { TopSourcesTable } from './top-sources-table';
import { SubjectImpactChart } from './citation-volatility-table';
import type { TimeRange } from '../../types/insights.types';
import { useTranslation } from 'react-i18next';

interface SourcesViewProps {
  timeRange: TimeRange;
}

export function SourcesView({ timeRange }: SourcesViewProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {t('insights.sources.topSourcesTable.title')}
          </h2>
          <p className="text-sm text-gray-600 mt-0.5">
            {t('insights.sources.topSourcesTable.subtitle')}
          </p>
        </div>
      </div>
      <TopSourcesTable timeRange={timeRange} />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            {t('insights.sources.subjectImpactChart.title')}
          </h2>
          <p className="text-sm text-gray-600 mb-2">
            {t('insights.sources.subjectImpactChart.subtitle')}
          </p>
        </div>
      </div>
      <SubjectImpactChart timeRange={timeRange} />
    </div>
  );
}