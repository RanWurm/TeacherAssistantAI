import { SubjectJournalHeatmap } from './subject-journal-heatmap';
import { LanguageImpactBarChart } from './LanguageImpactBarChart';
import { MultidisciplinaryVsSingle } from './multidisciplinary-vs-single';
import type { TimeRange } from '../../types/insights.types';

interface CrossAnalysisViewProps {
  timeRange: TimeRange;
}

export function CrossAnalysisView({ timeRange }: CrossAnalysisViewProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Cross-Analysis</h2>
          <p className="text-sm text-gray-600 mt-0.5">Cross-domain relationships and comparisons</p>
        </div>
      </div>
      
      <SubjectJournalHeatmap timeRange={timeRange} />
      <LanguageImpactBarChart timeRange={timeRange} />
      <MultidisciplinaryVsSingle timeRange={timeRange} />
    </div>
  );
}

