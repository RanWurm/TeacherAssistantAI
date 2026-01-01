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
    <div className="space-y-12">
      {/* Top Researchers Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          {t('insights.researchers.topResearchers.title')}
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          {t('insights.researchers.topResearchers.subtitle')}
        </p>
        <ResearcherGrid timeRange={timeRange} />
      </section>

      {/* Multidisciplinary Researchers Section */}
      <section>
        <MultidisciplinaryResearchersGrid timeRange={timeRange} />
      </section>
    </div>
  );
}
