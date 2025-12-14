import { TopJournalsTable } from './top-journals-table';
import { CitationVolatilityChart } from './citation-volatility-table';
import type { TimeRange } from '../../types/insights.types';

interface JournalsViewProps {
  timeRange: TimeRange;
}

export function JournalsView({ timeRange }: JournalsViewProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Journals</h2>
          <p className="text-sm text-gray-600 mt-0.5">Top journals and citation analysis</p>
        </div>
      </div>
      <TopJournalsTable timeRange={timeRange} />
      <CitationVolatilityChart />
    </div>
  );
}
