import { BookOpen, Users, Layers } from 'lucide-react';
import type { TimeRange } from '../../types/insights.types';
import { useTranslation } from 'react-i18next';
import { useInsightsJournals } from '@/hooks/insights/useInsightsJournals';
import type { JournalStats } from '@/lib/types/insights/Journals';

interface TopJournalsTableProps {
  timeRange: TimeRange;
}

// Skeleton for top journals table row
function TopJournalsTableRowSkeleton({ idx }: { idx?: number }) {
  return (
    <tr>
      {/* Rank */}
      <td className="px-2 py-2 text-xs md:px-6 md:py-4 md:text-sm">
        <div className="w-7 h-3 bg-emerald-50 rounded mx-auto" />
      </td>
      {/* Journal */}
      <td className="px-2 py-2 md:px-6 md:py-4 min-w-[8rem]">
        <div className="h-4 bg-gray-100 rounded w-32 mb-1" />
      </td>
      {/* Publisher */}
      <td className="px-2 py-2 md:px-6 md:py-4 min-w-[8rem] text-xs text-gray-500">
        <div className="h-3 bg-gray-100 rounded w-20" />
      </td>
      {/* Articles */}
      <td className="px-2 py-2 text-xs md:px-6 md:py-4 md:text-sm text-center">
        <div className="h-3 bg-blue-50 rounded w-8 mx-auto" />
      </td>
      {/* Authors */}
      <td className="px-2 py-2 text-xs md:px-6 md:py-4 md:text-sm text-center">
        <div className="h-3 bg-teal-50 rounded w-8 mx-auto" />
      </td>
      {/* Subjects */}
      <td className="px-2 py-2 text-xs md:px-6 md:py-4 md:text-sm text-center">
        <div className="h-3 bg-orange-50 rounded w-8 mx-auto" />
      </td>
      {/* Citations */}
      <td className="px-2 py-2 text-xs md:px-6 md:py-4 md:text-sm font-semibold text-center">
        <div className="h-3 bg-green-100 rounded w-14 mx-auto" />
      </td>
      {/* Impact Factor */}
      <td className="px-2 py-2 md:px-6 md:py-4 text-center">
        <div className="h-3 bg-emerald-100 rounded w-8 mx-auto" />
      </td>
    </tr>
  );
}

export function TopJournalsTable({ timeRange }: TopJournalsTableProps) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const { data, loading } = useInsightsJournals(timeRange);

  const textAlignClass = isRtl ? 'text-right' : 'text-left';

  return (
    <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
      <table className="w-full">
        <thead className="bg-(--table-header-bg)">
          <tr>
            {[
              'rank',
              'journal',
              'publisher',
              'articles',
              'authors',
              'subjects',
              'citations',
              'impactFactor',
            ].map((key) => (
              <th
                key={key}
                className={`
                  px-2 py-2 text-[10px]
                  md:px-6 md:py-4 md:text-xs
                  font-semibold uppercase tracking-wider
                  text-(--table-header-text)
                  ${textAlignClass}
                `}
              >
                {key === 'impactFactor' ? (
                  <span className="flex items-center gap-1">
                    {t('insights.journals.topJournalsTable.impactFactor')}
                    <span className="relative group">
                      <button
                        tabIndex={0}
                        type="button"
                        aria-label={t('insights.journals.topJournalsTable.impactFactorInfoLabel') || 'Info'}
                        className="outline-none focus:ring-2 focus:ring-indigo-300"
                        style={{ lineHeight: 0, padding: 0, marginLeft: '0.2rem' }}
                      >
                        <svg width="12" height="12" fill="currentColor" className="text-gray-400 hover:text-gray-500">
                          <circle cx="6" cy="6" r="5.5" stroke="currentColor" fill="white" />
                          <text x="6" y="9" textAnchor="middle" fontSize="8" fill="currentColor" fontFamily="sans-serif" pointerEvents="none">
                            i
                          </text>
                        </svg>
                      </button>
                      <div
                        className={`
                          fixed left-1/2
                          bg-blue-50 border-2 border-blue-300 rounded-lg shadow-xl
                          px-4 py-3 text-sm text-blue-900 w-max min-w-[16rem] z-30
                          opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity
                          pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto
                          ring-1 ring-blue-200
                        `}
                        style={{
                          whiteSpace: 'normal',
                          transform: 'translateX(-50%)',
                        }}
                      >
                        <div className="flex items-center mb-2 gap-2 font-semibold">
                          <svg className="inline-block" width="16" height="16" fill="none" viewBox="0 0 20 20">
                            <circle cx="10" cy="10" r="8" fill="#dbeafe" />
                            <text
                              x="10"
                              y="14"
                              textAnchor="middle"
                              fontSize="11"
                              fill="#2563eb"
                              fontFamily="sans-serif"
                              fontWeight="bold"
                            >
                              i
                            </text>
                          </svg>
                          {t('insights.journals.topJournalsTable.impactFactorInfo')}
                        </div>
                        <div className="mt-1 text-blue-800 italic border-t border-blue-200 pt-2">
                          {t('insights.journals.topJournalsTable.impactFactorFormula')}
                        </div>
                      </div>
                    </span>
                  </span>
                ) : (
                  t(`insights.journals.topJournalsTable.${key}`)
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-(--border-color-light)">
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <TopJournalsTableRowSkeleton key={idx} idx={idx} />
            ))
          ) : data && data.topJournals && data.topJournals.length > 0 ? (
            data.topJournals.map((journal: JournalStats, idx: number) => {
              const impact = journal.impactFactor;
              const isHighImpact = typeof impact === 'number' && impact > 30;
              return (
                <tr key={journal.journal_id} className="hover:bg-(--table-row-hover) transition-colors">
                  {/* Rank */}
                  <td className="px-2 py-2 text-xs md:px-6 md:py-4 md:text-sm">
                    <span className={idx < 3 ? 'text-yellow-700 font-bold' : 'text-gray-500'}>
                      {idx < 3 ? '★' : `#${idx + 1}`}
                    </span>
                  </td>

                  {/* Journal */}
                  <td className="px-2 py-2 md:px-6 md:py-4 min-w-[8rem]">
                    <span className="font-semibold text-xs md:text-lg flex items-center">
                      {journal.name.length > 40 ? (
                        <span className="truncate" title={journal.name}>
                          {journal.name.slice(0, 40)}…
                        </span>
                      ) : (
                        <span className="truncate">{journal.name}</span>
                      )}
                    </span>
                  </td>

                  {/* Publisher */}
                  <td className="px-2 py-2 md:px-6 md:py-4 min-w-[8rem] text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg
                        className="inline-block"
                        height={14}
                        width={14}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="2" y="7" width="20" height="14" rx="2" />
                        <path d="M16 3v4" />
                        <path d="M8 3v4" />
                      </svg>
                      {journal.publisher || <span className="italic text-gray-300">N/A</span>}
                    </span>
                  </td>

                  {/* Articles */}
                  <td className="px-2 py-2 text-xs md:px-6 md:py-4 md:text-sm text-center">
                    <span className="flex items-center gap-1 justify-center">
                      <BookOpen size={14} className="inline-block text-indigo-400" />
                      {journal.articleCount}
                    </span>
                  </td>

                  {/* Authors */}
                  <td className="px-2 py-2 text-xs md:px-6 md:py-4 md:text-sm text-center">
                    <span className="flex items-center gap-1 justify-center">
                      <Users size={14} className="inline-block text-teal-500" />
                      {journal.authorCount}
                    </span>
                  </td>

                  {/* Subjects */}
                  <td className="px-2 py-2 text-xs md:px-6 md:py-4 md:text-sm text-center">
                    <span className="flex items-center gap-1 justify-center">
                      <Layers size={14} className="inline-block text-orange-400" />
                      {journal.subjectCount}
                    </span>
                  </td>

                  {/* Citations */}
                  <td className="px-2 py-2 text-xs md:px-6 md:py-4 md:text-sm font-semibold text-center">
                    <span className="flex items-center gap-1 justify-center">
                      <svg
                        className="inline-block text-green-500"
                        height={14}
                        width={14}
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 2v6H5.5a4.5 4.5 0 1 0 0 9h2M11 18v-6h3.5a4.5 4.5 0 1 0 0-9h-2" />
                      </svg>
                      {journal.totalCitations}
                    </span>
                  </td>

                  {/* Impact */}
                  <td className="px-2 py-2 md:px-6 md:py-4 text-center">
                    {impact !== null && impact !== undefined ? (
                      <span
                        className={`text-xs md:text-base font-semibold bg-(--badge-green-bg) text-(--badge-green-text) px-3 py-1 rounded-lg ${
                          isHighImpact ? 'bg-orange-100 text-orange-700' : ''
                        }`}
                      >
                        {Number(impact).toFixed(2)}
                        {isHighImpact && (
                          <span className="ml-2 text-[9px] md:text-xs text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded">
                            {t('insights.journals.topJournalsTable.highImpact')}
                          </span>
                        )}
                      </span>
                    ) : (
                      'N/A'
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={8} className="py-10 text-center text-gray-400">
                {t('insights.journals.topJournalsTable.noData')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
