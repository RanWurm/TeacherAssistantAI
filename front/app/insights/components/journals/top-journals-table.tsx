import { Star, Building2, FileText, Users, Layers } from 'lucide-react';
import { MOCK_TOP_JOURNALS } from '../../data/mock';
import type { TimeRange } from '../../types/insights.types';
import { useTranslation } from 'react-i18next';

interface TopJournalsTableProps {
  timeRange: TimeRange;
}

export function TopJournalsTable({}: TopJournalsTableProps) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const journals = MOCK_TOP_JOURNALS;

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
            ].map(key => (
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
                {t(`insights.journals.topJournalsTable.${key}`)}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-(--border-color-light)">
          {journals.map((journal, idx) => {
            const isHighImpact = journal.impactFactor && journal.impactFactor > 30;

            return (
              <tr
                key={journal.journalId}
                className="hover:bg-(--table-row-hover) transition-colors"
              >
                {/* Rank */}
                <td className="px-2 py-2 text-xs md:px-6 md:py-4 md:text-sm">
                  <span className={idx < 3 ? 'text-yellow-700 font-bold' : 'text-gray-500'}>
                    {idx < 3 ? '★' : `#${idx + 1}`}
                  </span>
                </td>

                {/* Journal */}
                <td className="px-2 py-2 md:px-6 md:py-4">
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="font-semibold truncate text-xs md:text-lg">
                      {journal.name}
                    </span>

                    {journal.impactFactor && (
                      <div className="flex items-center gap-1">
                        <span
                          className={`
                            inline-flex items-center gap-1
                            px-1.5 py-0.5 rounded
                            text-[10px] md:text-sm
                            ${
                              isHighImpact
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-green-100 text-green-700'
                            }
                          `}
                        >
                          <Star className="w-3 h-3" />
                          {journal.impactFactor.toFixed(2)}
                        </span>

                        {isHighImpact && (
                          <span className="text-[9px] md:text-xs text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded">
                            {t('insights.journals.topJournalsTable.highImpact')}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </td>

                {/* Publisher */}
                <td className="px-2 py-2 text-xs md:px-6 md:py-4 md:text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    {journal.publisher || 'N/A'}
                  </div>
                </td>

                {/* Articles */}
                <td className="px-2 py-2 text-xs md:px-6 md:py-4 md:text-sm">
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4 text-gray-400" />
                    {journal.articleCount}
                  </div>
                </td>

                {/* Authors */}
                <td className="px-2 py-2 text-xs md:px-6 md:py-4 md:text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-gray-400" />
                    {journal.uniqueAuthors ?? '—'}
                  </div>
                </td>

                {/* Subjects */}
                <td className="px-2 py-2 text-xs md:px-6 md:py-4 md:text-sm">
                  <div className="flex items-center gap-1">
                    <Layers className="w-4 h-4 text-gray-400" />
                    {journal.uniqueSubjects}
                  </div>
                </td>

                {/* Citations */}
                <td className="px-2 py-2 text-xs md:px-6 md:py-4 md:text-sm font-semibold">
                  {journal.totalCitations}
                </td>

                {/* Impact */}
                <td className="px-2 py-2 md:px-6 md:py-4">
                  <span className="text-xs md:text-base font-semibold bg-(--badge-green-bg) text-(--badge-green-text) px-3 py-1 rounded-lg">
                    {journal.impactFactor?.toFixed(2) ?? 'N/A'}
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
