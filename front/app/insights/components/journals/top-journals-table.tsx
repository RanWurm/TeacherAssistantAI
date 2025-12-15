import { Star, Building2, FileText, Users, Layers } from 'lucide-react';
import { MOCK_TOP_JOURNALS } from '../../data/mock';
import type { TimeRange } from '../../types/insights.types';
import { useTranslation } from 'react-i18next';

interface TopJournalsTableProps {
  timeRange: TimeRange;
}

// Mix of "journals-table" row/column structure with line bars + highlight/impact details for each row.
export function TopJournalsTable({ }: TopJournalsTableProps) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const journals = MOCK_TOP_JOURNALS;

  const textAlignClass = isRtl ? 'text-right' : 'text-left';

  return (
    <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
      <table className="w-full">
        <thead className="bg-(--table-header-bg)">
          <tr>
            <th
              className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider text-(--table-header-text) ${textAlignClass}`}
            >
              {t('insights.journals.topJournalsTable.rank')}
            </th>
            <th
              className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider text-(--table-header-text) ${textAlignClass}`}
            >
              {t('insights.journals.topJournalsTable.journal')}
            </th>
            <th
              className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider text-(--table-header-text) ${textAlignClass}`}
            >
              {t('insights.journals.topJournalsTable.publisher')}
            </th>
            <th
              className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider text-(--table-header-text) ${textAlignClass}`}
            >
              {t('insights.journals.topJournalsTable.articles')}
            </th>
            <th
              className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider text-(--table-header-text) ${textAlignClass}`}
            >
              {t('insights.journals.topJournalsTable.authors')}
            </th>
            <th
              className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider text-(--table-header-text) ${textAlignClass}`}
            >
              {t('insights.journals.topJournalsTable.subjects')}
            </th>
            <th
              className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider text-(--table-header-text) ${textAlignClass}`}
            >
              {t('insights.journals.topJournalsTable.citations')}
            </th>
            <th
              className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider text-(--table-header-text) ${textAlignClass}`}
            >
              <div className="relative inline-flex items-center gap-1 group">
                <span>
                  {t('insights.journals.topJournalsTable.impactFactor')}
                </span>
                {/* Info icon */}
                <span className="cursor-help text-(--text-secondary)">ⓘ</span>

                {/* Tooltip */}
                <div
                  className={`
                    absolute z-50
                    top-full mt-2
                    ${isRtl ? 'right-1/2 translate-x-[90%]' : 'right-1/2 -translate-x-[10%]'}

                    max-w-[180px] w-max
                    rounded-lg border border-(--border-color)
                    bg-white p-3 text-[11px] leading-relaxed
                    text-(--text-primary) shadow-lg

                    opacity-0 scale-95
                    transition-all duration-150
                    group-hover:opacity-100 group-hover:scale-100

                    ${isRtl ? 'text-right' : 'text-left'}
                  `}
                >
                  <strong className="block mb-1">
                    {t('insights.journals.topJournalsTable.impactFactor')}
                  </strong>
                  <p className="mb-1">
                    {t('insights.journals.topJournalsTable.impactTooltip')}
                  </p>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-(--border-color-light)">
          {journals.length === 0 ? (
            <tr>
              <td colSpan={9}>
                <div className="py-12 text-center text-gray-400 text-sm">
                  {t('insights.journals.topJournalsTable.noData')}
                </div>
              </td>
            </tr>
          ) : (
            journals.map((journal, idx) => {
              const isHighImpact = journal.impactFactor && journal.impactFactor > 30;
              return (
                <tr key={journal.journalId} className="hover:bg-(--table-row-hover) transition-colors group">
                  {/* Rank with highlight for top 3 */}
                  <td className="px-6 py-4 align-top">
                    <span className={`text-sm font-medium ${idx < 3 ? 'text-yellow-700 font-bold' : 'text-(--list-rank-muted)'
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
                          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium rounded ${isHighImpact ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                            }`}>
                            <Star className="w-3 h-3" />
                            {journal.impactFactor.toFixed(2)}
                          </span>
                        )}
                        {isHighImpact && (
                          <span className="ml-2 inline-block text-[10px] font-semibold text-orange-700 bg-orange-50 rounded px-1.5 py-0.5">
                            {t('insights.journals.topJournalsTable.highImpact')}
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
                      <span>
                        {t('insights.journals.topJournalsTable.articleCount', { count: journal.articleCount })}
                      </span>
                    </div>
                  </td>
                  {/* Authors */}
                  <td className="px-6 py-4 align-top text-sm text-gray-700">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>
                        {journal.uniqueAuthors != null
                          ? t('insights.journals.topJournalsTable.authorCount', { count: journal.uniqueAuthors })
                          : '—'}
                      </span>
                    </div>
                  </td>
                  {/* Subjects */}
                  <td className="px-6 py-4 align-top text-sm text-gray-700">
                    <div className="flex items-center gap-1">
                      <Layers className="w-4 h-4 text-gray-400" />
                      <span>
                        {t('insights.journals.topJournalsTable.subjectCount', { count: journal.uniqueSubjects })}
                      </span>
                    </div>
                  </td>
                  {/* Citations + percent bar */}
                  <td className="px-6 py-4 align-top">
                    <div className="flex flex-col gap-1">
                      <div className="text-xs text-gray-500">
                        <span className="text-sm font-semibold text-gray-900">
                          {t('insights.journals.topJournalsTable.citationVolume', { count: journal.totalCitations })}
                        </span>
                      </div>
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
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
