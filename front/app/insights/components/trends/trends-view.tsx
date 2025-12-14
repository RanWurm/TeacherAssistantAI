import { TrendingTopicsTable } from './trending-topics-table';
import { KeywordGrowthTable } from './keyword-growth-table';
import { KeywordCrossDomain } from './keyword-cross-domain';
import type { TimeRange } from '../../types/insights.types';

interface TrendsViewProps {
  timeRange: TimeRange;
}

export function TrendsView({ timeRange }: TrendsViewProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Trends</h2>
          <p className="text-sm text-gray-600 mt-0.5">Emerging topics and keyword analysis</p>
        </div>
      </div>
      <TrendingTopicsTable timeRange={timeRange} />
      <KeywordGrowthTable timeRange={timeRange} />
      <KeywordCrossDomain timeRange={timeRange} />
    </div>
  );
}

