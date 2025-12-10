import { MetricsGrid } from './metrics-grid';
import { Timeline } from './timeline';

export function OverviewView() {
  return (
    <div className="space-y-6">
      <MetricsGrid />
      <Timeline />
    </div>
  );
}

