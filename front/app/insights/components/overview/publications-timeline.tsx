import { Calendar } from 'lucide-react';
import { MOCK_PUBLICATIONS_TIMELINE } from '../../data/mock';
import type { TimeRange } from '../../types/insights.types';

interface PublicationsTimelineProps {
  timeRange: TimeRange;
}

export function PublicationsTimeline({ timeRange }: PublicationsTimelineProps) {
  const timeline = MOCK_PUBLICATIONS_TIMELINE;
  const maxArticles = Math.max(...timeline.map(t => t.articleCount));

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-gray-500" />
        <h3 className="text-sm font-semibold text-gray-900">Publications Timeline</h3>
      </div>
      <div className="space-y-3">
        {timeline.map((point, idx) => {
          const articlePercent = (point.articleCount / maxArticles) * 100;
          const prevPoint = idx > 0 ? timeline[idx - 1] : null;
          const growth = prevPoint ? ((point.articleCount - prevPoint.articleCount) / prevPoint.articleCount * 100) : null;

          return (
            <div key={point.year} className="flex items-center gap-3 group hover:bg-gray-50 -mx-2 px-2 py-1.5 rounded transition-colors">
              <div className="w-12 text-sm font-medium text-gray-700">{point.year}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-900">{point.articleCount.toLocaleString()}</span>
                    <span className="text-xs text-gray-500">articles</span>
                    {growth !== null && (
                      <span className={`text-xs font-medium ${
                        growth >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{point.authorCount.toLocaleString()} authors</span>
                    <span>{point.journalCount.toLocaleString()} journals</span>
                  </div>
                </div>
                <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-blue-500 rounded-full transition-all duration-700"
                    style={{ width: `${articlePercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

