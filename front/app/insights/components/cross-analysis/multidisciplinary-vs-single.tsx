import { BarChart3, Layers, Network } from 'lucide-react';
import { MOCK_MULTIDISCIPLINARY_COMPARISON } from '../../data/mock';
import type { TimeRange } from '../../types/insights.types';

interface MultidisciplinaryVsSingleProps {
  timeRange: TimeRange;
}

export function MultidisciplinaryVsSingle({ timeRange }: MultidisciplinaryVsSingleProps) {
  const comparison = MOCK_MULTIDISCIPLINARY_COMPARISON;
  const maxArticles = Math.max(...comparison.map(c => c.articleCount));
  const maxCitations = Math.max(...comparison.map(c => c.totalCitations));

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-4 h-4 text-gray-500" />
        <h3 className="text-sm font-semibold text-gray-900">Multidisciplinary vs Single-Subject</h3>
      </div>

      <p className="text-xs text-gray-600 mb-3">
        Comparing breadth-driven research with focused single-subject publications.
      </p>

      
      <div className="grid grid-cols-2 gap-4">
        {comparison.map((item, idx) => {
          const isMulti = item.category === 'multi-subject';
          const articlePercent = (item.articleCount / maxArticles) * 100;
          const citationPercent = (item.totalCitations / maxCitations) * 100;
          
          return (
            <div
              key={idx}
              className={`p-3 rounded-lg border ${
                isMulti ? 'border-purple-200 bg-purple-50/30' : 'border-blue-200 bg-blue-50/30'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                {isMulti ? (
                  <Network className="w-4 h-4 text-purple-600" />
                ) : (
                  <Layers className="w-4 h-4 text-blue-600" />
                )}
                <span className={`text-sm font-semibold ${
                  isMulti ? 'text-purple-900' : 'text-blue-900'
                }`}>
                  {isMulti ? 'Multi-Subject' : 'Single-Subject'}
                </span>
              </div>
              

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="text-xs text-gray-600 mb-0.5">Articles</div>
                  <div className="text-lg font-semibold text-gray-900">{item.articleCount.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-0.5">Avg Citations</div>
                  <div className="text-lg font-semibold text-gray-900">{item.avgCitations.toFixed(1)}</div>
                </div>
              </div>

              <div className="space-y-1.5 mb-3">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Citations</span>
                  <span className="font-medium">{item.totalCitations.toLocaleString()}</span>
                </div>
                <div className="relative h-2 bg-white rounded-full overflow-hidden border border-gray-200">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${
                      isMulti ? 'bg-purple-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${citationPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-200 text-xs text-gray-600">
                <span>{item.uniqueAuthors.toLocaleString()} authors</span>
                <span>{item.uniqueJournals.toLocaleString()} journals</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
