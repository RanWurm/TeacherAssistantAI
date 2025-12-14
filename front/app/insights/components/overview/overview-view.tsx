import { MetricsCards } from './metrics-cards';
import { PublicationsTimeline } from './publications-timeline';
import { MultidisciplinarySummary } from './multidisciplinary-summary';
import type { TimeRange } from '../../types/insights.types';

interface OverviewViewProps {
  timeRange: TimeRange;
}

export function OverviewView({ timeRange }: OverviewViewProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Overview</h2>
          <p className="text-sm text-gray-600 mt-0.5">
            System-wide research distribution and activity.
          </p>
        </div>
      </div>
      <MetricsCards timeRange={timeRange} />
      <PublicationsTimeline timeRange={timeRange} />
      <MultidisciplinarySummary timeRange={timeRange} />
    </div>
  );
}
