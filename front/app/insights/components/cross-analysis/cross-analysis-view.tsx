import { SubjectSourceHeatmap } from './subject-source-heatmap';
import { LanguageImpactBarChart } from './language-impact-bar-chart';
import { MultidisciplinaryVsSingle } from './multidisciplinary-vs-single';
import type { TimeRange } from '../../types/insights.types';
import { useTranslation } from 'react-i18next';

interface CrossAnalysisViewProps {
  timeRange: TimeRange;
}

export function CrossAnalysisView({ timeRange }: CrossAnalysisViewProps) {
  const { t } = useTranslation();
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {t('insights.cross.title')}
          </h2>
          <p className="text-sm text-gray-600 mt-0.5">
            {t('insights.cross.subtitle')}
          </p>
        </div>
      </div>

      <SubjectSourceHeatmap timeRange={timeRange} />
      <LanguageImpactBarChart timeRange={timeRange} />
      <MultidisciplinaryVsSingle timeRange={timeRange} />
    </div>
  );
}