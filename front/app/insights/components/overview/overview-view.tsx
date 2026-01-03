import { useTranslation } from 'react-i18next';
import { MetricsCards } from './metrics-cards';
import { PublicationsTimeline } from './publications-timeline';
import type { TimeRange } from '../../types/insights.types';

interface OverviewViewProps {
  timeRange: TimeRange;
}

export function OverviewView({ timeRange }: OverviewViewProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {t('insights.overview.overviewView.title')}
          </h2>
          <p className="text-sm text-gray-600 mt-0.5">
            {t('insights.overview.overviewView.subtitle')}
          </p>
        </div>
      </div>
      <MetricsCards timeRange={timeRange} />
      <PublicationsTimeline timeRange={timeRange} />
    </div>
  );
}
