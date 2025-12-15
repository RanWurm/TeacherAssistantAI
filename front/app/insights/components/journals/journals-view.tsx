import { TopJournalsTable } from './top-journals-table';
import { CitationVolatilityChart } from './citation-volatility-table';
import type { TimeRange } from '../../types/insights.types';
import { useTranslation } from 'react-i18next';

interface JournalsViewProps {
  timeRange: TimeRange;
}

export function JournalsView({ timeRange }: JournalsViewProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {t('insights.journals.topJournalsTable.title')}
          </h2>
          <p className="text-sm text-gray-600 mt-0.5">
            {t('insights.journals.topJournalsTable.subtitle')}
          </p>
        </div>
      </div>
      <TopJournalsTable timeRange={timeRange} />
      <CitationVolatilityChart />
    </div>
  );
}
