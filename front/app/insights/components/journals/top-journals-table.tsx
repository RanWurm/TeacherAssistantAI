import { Star, Building2, FileText, Users, Layers } from 'lucide-react';
import { MOCK_TOP_JOURNALS } from '../../data/mock';
import type { TimeRange } from '../../types/insights.types';

interface TopJournalsTableProps {
  timeRange: TimeRange;
}

// Mix of "journals-table" row/column structure with line bars + highlight/impact details for each row.
export function TopJournalsTable({ }: TopJournalsTableProps) {
  const journals = MOCK_TOP_JOURNALS;

  return (
    <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
      <table className="w-full">
        <thead className="bg-(--table-header-bg)">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-(--table-header-text)">Rank</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-(--table-header-text)">Journal</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-(--table-header-text)">Publisher</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-(--table-header-text)">Articles</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-(--table-header-text)">Authors</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-(--table-header-text)">Subjects</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-(--table-header-text)">Citations</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-(--table-header-text)">Impact Factor</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-(--table-header-text)"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-(--border-color-light)">
          {journals.map((journal, idx) => {
            const isHighImpact = journal.impactFactor && journal.impactFactor > 30;
            return (
              <tr key={journal.journalId} className="hover:bg-(--table-row-hover) transition-colors group">
                {/* Rank with highlight for top 3 */}
                <td className="px-6 py-4 align-top">
                  <span className={`text-sm font-medium ${
                    idx < 3 ? 'text-yellow-700 font-bold' : 'text-(--list-rank-muted)'
                  }`}>
                    {idx < 3 ? '★' : `#${idx + 1}`}
                  </span>
                </td>
                {/* Journal name + impact factor badge */}
                <td className="px-6 py-4 align-top">
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <span className="font-semibold text-(--text-main) whitespace-nowrap truncate">{journal.name}</span>
                    <div className="flex items-center gap-1">
                      {journal.impactFactor && (
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium rounded ${
                          isHighImpact ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                        }`}>
                          <Star className="w-3 h-3" />
                          {journal.impactFactor.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                {/* Publisher */}
                <td className="px-6 py-4 align-top">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Building2 className="w-3 h-3" />
                    <span>{journal.publisher || 'N/A'}</span>
                  </div>
                </td>
                {/* Article Count */}
                <td className="px-6 py-4 align-top text-sm text-gray-700">
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span>{journal.articleCount.toLocaleString()}</span>
                  </div>
                </td>
                {/* Authors */}
                <td className="px-6 py-4 align-top text-sm text-gray-700">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>{journal.uniqueAuthors?.toLocaleString?.() ?? '—'}</span>
                  </div>
                </td>
                {/* Subjects */}
                <td className="px-6 py-4 align-top text-sm text-gray-700">
                  <div className="flex items-center gap-1">
                    <Layers className="w-4 h-4 text-gray-400" />
                    <span>{journal.uniqueSubjects}</span>
                  </div>
                </td>
                {/* Citations + percent bar */}
                <td className="px-6 py-4 align-top">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-gray-900">{journal.totalCitations.toLocaleString()}</span>
                    <div className="text-xs text-gray-500">citations</div>
                  </div>
                </td>
                {/* Impact Factor for table view, repeated for clarity */}
                <td className="px-6 py-4 align-top">
                  <span className="inline-flex items-center px-3 py-1 rounded-lg bg-(--badge-green-bg) text-(--badge-green-text) text-sm font-semibold">
                    {journal.impactFactor ? journal.impactFactor.toFixed(2) : 'N/A'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
