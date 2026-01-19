import { BookOpen, Users, Layers } from 'lucide-react';
import type { TimeRange } from '../../types/insights.types';
import { useTranslation } from 'react-i18next';
import { useInsightsSources } from '@/hooks/insights/useInsightsSources';
import type { SourceStats } from '@/lib/types/insights/Sources';

interface TopSourcesTableProps {
  timeRange: TimeRange;
}

/* ============================
   Skeleton Row
============================ */
function TopSourcesTableRowSkeleton() {
  return (
    <tr>
      <td className="px-2 py-2 text-xs md:px-6 md:py-4"><div className="w-7 h-3 bg-gray-100 rounded mx-auto" /></td>
      <td className="px-2 py-2 md:px-6 md:py-4"><div className="h-4 bg-gray-100 rounded w-32" /></td>
      <td className="px-2 py-2 md:px-6 md:py-4"><div className="h-3 bg-gray-100 rounded w-20" /></td>
      <td className="px-2 py-2 text-center"><div className="h-3 bg-blue-50 rounded w-8 mx-auto" /></td>
      <td className="px-2 py-2 text-center"><div className="h-3 bg-teal-50 rounded w-8 mx-auto" /></td>
      <td className="px-2 py-2 text-center"><div className="h-3 bg-orange-50 rounded w-8 mx-auto" /></td>
      <td className="px-2 py-2 text-center"><div className="h-3 bg-yellow-100 rounded w-12 mx-auto" /></td>
      <td className="px-2 py-2 text-center"><div className="h-3 bg-green-100 rounded w-12 mx-auto" /></td>
    </tr>
  );
}

/* ============================
   Table
============================ */
export function TopSourcesTable({ timeRange }: TopSourcesTableProps) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const { data, loading } = useInsightsSources(timeRange);

  const textAlignClass = isRtl ? 'text-right' : 'text-left';

  const columns = [
    { key: 'rank', label: t('insights.sources.topSourcesTable.rank') },
    { key: 'source', label: t('insights.sources.topSourcesTable.source') },
    { key: 'publisher', label: t('insights.sources.topSourcesTable.publisher') },
    { key: 'articles', label: t('insights.sources.topSourcesTable.articles') },
    { key: 'authors', label: t('insights.sources.topSourcesTable.authors') },
    { key: 'subjects', label: t('insights.sources.topSourcesTable.subjects') },
    { key: 'citations', label: t('insights.sources.topSourcesTable.citations') },
    { key: 'impactScore', label: t('insights.sources.topSourcesTable.impactScore') },
  ];

  return (
    <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
      <table className="w-full">
        <thead className="bg-(--table-header-bg)">
          <tr>
            {columns.map(({ key, label }) => (
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
                {key === 'impactScore' ? (
                  <span className="flex items-center gap-0.5">
                    {label}
                    <span className="relative group">
                      <button
                        tabIndex={0}
                        type="button"
                        aria-label={t('insights.sources.topSourcesTable.impactScoreInfoLabel')}
                        className="outline-none focus:ring-1 focus:ring-indigo-200"
                        style={{ lineHeight: 0, padding: 0, marginLeft: '0.15rem' }}
                      >
                        <svg
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <circle cx="8" cy="8" r="7" stroke="currentColor" fill="white" />
                          <text
                            x="8"
                            y="12"
                            textAnchor="middle"
                            fontSize="11"
                            fill="currentColor"
                            fontFamily="sans-serif"
                            pointerEvents="none"
                          >
                            i
                          </text>
                        </svg>
                      </button>
                      <div
                        className={`
                          fixed left-1/2
                          bg-blue-50 border border-blue-200 rounded-xl shadow-2xl
                          px-10 py-5 text-base text-blue-900 w-[540px] min-w-[380px] z-40
                          opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity
                          pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto
                          ring-2 ring-blue-200
                        `}
                        style={{
                          whiteSpace: 'normal',
                          transform: 'translateX(-50%)',
                        }}
                      >
                        <div className="flex items-center mb-1 gap-1 font-semibold">
                          <svg className="inline-block" width="14" height="14" fill="none" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" fill="#dbeafe" />
                            <text
                              x="12"
                              y="17"
                              textAnchor="middle"
                              fontSize="11"
                              fill="#2563eb"
                              fontFamily="sans-serif"
                              fontWeight="bold"
                            >
                              i
                            </text>
                          </svg>
                          <span className="whitespace-normal wrap-break-word truncate block max-w-md">
                            {t('insights.sources.topSourcesTable.impactScoreInfo')}
                          </span>
                        </div>
                        <div className="mt-1 text-blue-800 italic border-t border-blue-100 pt-1">
                          <span className="whitespace-normal wrap-break-word truncate block max-w-md">
                            {t('insights.sources.topSourcesTable.impactScoreFormula')}
                          </span>
                        </div>
                      </div>
                    </span>
                  </span>
                ) : (
                  label
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-(--border-color-light)">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <TopSourcesTableRowSkeleton key={i} />)
          ) : data?.topSources?.length ? (
            data.topSources.map((source: SourceStats, idx: number) => (
              <tr key={source.source_id} className="hover:bg-(--table-row-hover)">
                {/* Rank */}
                <td className="px-2 py-2 text-xs md:px-6 md:py-4">
                  <span className={idx < 3 ? 'text-yellow-700 font-bold' : 'text-gray-500'}>
                    {idx < 3 ? '⭐' : `#${idx + 1}`}
                  </span>
                </td>

                {/* Source */}
                <td className="px-2 py-2 md:px-6 md:py-4">
                  {source.name.length > 25 ? (
                    <span className="font-semibold truncate max-w-[240px]" title={source.name}>
                      {source.name.slice(0, 25)}…
                    </span>
                  ) : (
                    <span className="font-semibold truncate max-w-[240px]">
                      {source.name}
                    </span>
                  )}
                </td>

                {/* Publisher */}
                <td className="px-2 py-2 md:px-6 md:py-4 min-w-32 text-xs text-gray-500">
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
                    {source.publisher?.trim() ? (
                      <span className="truncate max-w-[120px]" title={source.publisher}>
                        {source.publisher}
                      </span>
                    ) : (
                      <span className="italic text-gray-400">
                        {t('insights.sources.topSourcesTable.na')}
                      </span>
                    )}
                  </span>
                </td>

                {/* Articles */}
                <td className="px-2 py-2 text-xs md:px-6 md:py-4 md:text-sm text-center">
                  <span className="flex items-center gap-1 justify-center">
                    <BookOpen size={14} className="inline-block text-indigo-400" />
                    {t('insights.sources.topSourcesTable.articleCount', { count: source.articleCount })}
                  </span>
                </td>

                {/* Authors */}
                <td className="px-2 py-2 text-xs md:px-6 md:py-4 md:text-sm text-center">
                  <span className="flex items-center gap-1 justify-center">
                    <Users size={14} className="inline-block text-teal-500" />
                    {t('insights.sources.topSourcesTable.authorCount', { count: source.authorCount })}
                  </span>
                </td>

                {/* Subjects */}
                <td className="px-2 py-2 text-xs md:px-6 md:py-4 md:text-sm text-center">
                  <span className="flex items-center gap-1 justify-center">
                    <Layers size={14} className="inline-block text-orange-400" />
                    {t('insights.sources.topSourcesTable.subjectCount', { count: source.subjectCount })}
                  </span>
                </td>

                {/* Citations */}
                <td className="px-2 py-2 text-center font-semibold">
                  {source.totalCitations}
                </td>

                 {/* Impact */}
                 <td className="px-2 py-2 md:px-6 md:py-4 text-center">
                    {source.impactScore !== null && source.impactScore !== undefined ? (
                      <span
                        className={`text-xs md:text-base font-semibold bg-(--badge-green-bg) text-(--badge-green-text) px-3 py-1 rounded-lg`}
                        title={
                          t('insights.sources.topSourcesTable.impactTooltip')
                        }
                      >
                        {Number(source.impactScore).toFixed(2)}
                      </span>
                    ) : (
                      t('insights.sources.topSourcesTable.na')
                    )}
                  </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="py-10 text-center text-gray-400">
                {t('insights.sources.topSourcesTable.noData')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
