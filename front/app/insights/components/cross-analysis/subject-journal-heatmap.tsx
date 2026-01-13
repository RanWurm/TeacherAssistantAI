import { Grid3x3 } from 'lucide-react';
import type { TimeRange } from '../../types/insights.types';
import { useTranslation } from 'react-i18next';
import { useInsightsCross } from '@/hooks/insights/useInsightsCross';

interface SubjectJournalHeatmapProps {
  timeRange: TimeRange;
}

function truncateLabel(label: string, maxLen = 30): { display: string; full: string } {
  if (label.length <= maxLen) return { display: label, full: label };
  return {
    display: label.slice(0, maxLen - 3) + '...',
    full: label,
  };
}

// Use the logic from TopJournalsTable for direction-aware alignment class.
export function SubjectJournalHeatmap({ timeRange }: SubjectJournalHeatmapProps) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const textAlignClass = isRtl ? 'text-right' : 'text-left';

  const { data, loading } = useInsightsCross(timeRange);

  // SAFE: handle no data (not yet loaded)
  const heatmap = data?.subjectJournalHeatmap ?? [];
  // Get all unique subjects & journals from live data
  const subjects = Array.from(new Set(heatmap.map(h => h.subject)));
  const journals = Array.from(new Set(heatmap.map(h => h.journal)));
  const maxCount = heatmap.length > 0 ? Math.max(...heatmap.map(h => h.articleCount)) : 0;

  const intensityLevels = [
    { i18nKey: 'high', color: 'bg-blue-700' },
    { i18nKey: 'medium', color: 'bg-blue-500' },
    { i18nKey: 'low', color: 'bg-blue-300' },
    { i18nKey: 'veryLow', color: 'bg-blue-100' },
  ];

  const heatmapMap = new Map<string, number>();
  heatmap.forEach(item => {
    heatmapMap.set(`${item.subject}-${item.journal}`, item.articleCount);
  });

  const getIntensityClass = (count: number) => {
    if (!count || maxCount === 0) return 'bg-gray-50';
    const pct = (count / maxCount) * 100;
    if (pct >= 75) return 'bg-blue-700 text-white';
    if (pct >= 50) return 'bg-blue-500 text-white';
    if (pct >= 25) return 'bg-blue-300 text-gray-900';
    return 'bg-blue-100 text-gray-800';
  };

  const getAccessibleLabel = (count: number, subject: string, journal: string) => {
    if (count === 0) {
      return t('insights.cross.subjectJournalHeatmap.accessibleLabel.none', {
        subject,
        journal,
        defaultValue: '{{subject}} × {{journal}}: no articles',
      });
    }
    return t('insights.cross.subjectJournalHeatmap.accessibleLabel.articles', {
      subject,
      journal,
      count: count,
      defaultValue: '{{subject}} × {{journal}}: {{count}} articles',
    });
  };

  // column width: same for all, for header and body
  const COL_W = 'w-[130px]';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Grid3x3 className="w-4 h-4 text-gray-500" />
        <h3 className="text-sm font-semibold text-gray-900">
          {t('insights.cross.subjectJournalHeatmap.title')}
        </h3>
      </div>

      <p className="text-xs text-gray-600 mb-4 max-w-3xl">
        {t('insights.cross.subjectJournalHeatmap.description')}
      </p>

      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
        <span className="text-xs text-gray-500">
          {t('insights.cross.subjectJournalHeatmap.topSubjectsNote')}
        </span>
        <span className="text-xs text-gray-500">
          {t('insights.cross.subjectJournalHeatmap.topJournalsNote')}
        </span>
      </div>

      {loading ? (
        <div className="overflow-x-auto border border-gray-100 rounded-md">
          <table className="w-full text-xs min-w-max border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className={`sticky left-0 bg-gray-50 z-10 px-3 py-2 font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap text-left ${COL_W}`}>
                  <div className="h-4 w-20 bg-blue-100 rounded animate-pulse" />
                </th>
                {[...Array(5)].map((_, idx) => (
                  <th key={idx} className={`px-3 py-2 text-center ${COL_W}`}>
                    <div className="h-4 w-20 mx-auto bg-blue-100 rounded animate-pulse" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(7)].map((_, row) => (
                <tr key={row} className="border border-gray-100">
                  <td className={`sticky left-0 z-20 bg-white px-3 py-2 font-medium text-gray-800 whitespace-nowrap text-left ${COL_W}`} style={{ boxShadow: '2px 0 0 0 rgb(229 231 235)' }}>
                    <div className="h-4 w-28 bg-blue-50 rounded animate-pulse" />
                  </td>
                  {[...Array(5)].map((_, col) => (
                    <td key={col} className={`relative px-3 py-2 text-center ${COL_W}`}>
                      <div className="h-4 w-10 mx-auto bg-blue-50 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-100 rounded-md">
          <table className="w-full text-xs min-w-max border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className={`sticky left-0 bg-gray-50 z-10 px-3 py-2 font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap ${textAlignClass} ${COL_W}`}>
                  {t('insights.cross.subjectJournalHeatmap.subjectLabel')}
                </th>
                {journals.map(journal => {
                  const tLabel = truncateLabel(journal, 30);
                  return (
                    <th
                      key={journal}
                      className={`px-3 py-2 font-medium text-gray-700 whitespace-nowrap text-center ${COL_W}`}
                      title={tLabel.full !== tLabel.display ? tLabel.full : undefined}
                    >
                      <span
                        style={{
                          display: 'inline-block',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          verticalAlign: 'bottom',
                        }}
                        title={tLabel.full !== tLabel.display ? tLabel.full : undefined}
                      >
                        {tLabel.display}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {subjects.map(subject => {
                const tSubject = truncateLabel(subject, 30);
                return (
                  <tr key={subject} className="border border-gray-100">
                    <td
                      className={`
                        sticky left-0 z-20
                        bg-white
                        px-3 py-2
                        font-medium text-gray-800
                        whitespace-nowrap
                        ${textAlignClass}
                        ${COL_W}
                      `}
                      style={{
                        boxShadow: '2px 0 0 0 rgb(229 231 235)', // gray-200
                      }}
                      title={tSubject.full !== tSubject.display ? tSubject.full : undefined}
                    >
                      <span
                        style={{
                          display: 'inline-block',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                        }}
                        title={tSubject.full !== tSubject.display ? tSubject.full : undefined}
                      >
                        {tSubject.display}
                      </span>
                    </td>
                    {journals.map(journal => {
                      const count = heatmapMap.get(`${subject}-${journal}`) ?? 0;
                      return (
                        <td
                          key={journal}
                          className={`relative px-3 py-2 text-center transition-colors ${getIntensityClass(
                            count
                          )} ${COL_W}`}
                          title={getAccessibleLabel(count, subject, journal)}
                        >
                          {count > 0 ? count.toLocaleString() : '—'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600">
        <div className="flex items-center gap-4">
          {intensityLevels.map(d => (
            <span key={d.i18nKey} className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded ${d.color}`} />
              {t(`insights.cross.subjectJournalHeatmap.intensity.${d.i18nKey}`)}
            </span>
          ))}
        </div>
        <span className="text-gray-500">
          {t('insights.cross.subjectJournalHeatmap.maxCellLabel')}: <b className="text-gray-800">{maxCount.toLocaleString()}</b>
        </span>
      </div>
    </div>
  );
}
