import { ResearcherGrid } from './researcher-grid';
import { MultidisciplinaryResearchersGrid } from './multidisciplinary-researchers-grid';
import type { TimeRange } from '../../types/insights.types';
import { useTranslation } from 'react-i18next';

interface ResearchersViewProps {
  timeRange: TimeRange;
}

export function ResearchersView({ timeRange }: ResearchersViewProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {t('insights.researchers.topResearchers.title')}
          </h2>
          <p className="text-sm text-gray-600 mt-0.5">
            {t('insights.researchers.topResearchers.subtitle')}
          </p>
        </div>
      </div>

      <ResearcherGrid timeRange={timeRange} />
      <MultidisciplinaryResearchersGrid timeRange={timeRange} />
    </div>
  );
}
