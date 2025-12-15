import { Grid3x3 } from 'lucide-react';
import { MOCK_SUBJECT_JOURNAL_HEATMAP } from '../../data/mock';
import type { TimeRange } from '../../types/insights.types';
import { useTranslation } from 'react-i18next';

interface SubjectJournalHeatmapProps {
  timeRange: TimeRange;
}

const intensityLevels = [
  { i18nKey: 'high', color: 'bg-blue-700' },
  { i18nKey: 'medium', color: 'bg-blue-500' },
  { i18nKey: 'low', color: 'bg-blue-300' },
  { i18nKey: 'veryLow', color: 'bg-blue-100' },
];

export function SubjectJournalHeatmap({ timeRange }: SubjectJournalHeatmapProps) {
  const { t } = useTranslation();
  const heatmap = MOCK_SUBJECT_JOURNAL_HEATMAP;
  const maxCount = Math.max(...heatmap.map(h => h.articleCount));
  const subjects = Array.from(new Set(heatmap.map(h => h.subjectName)));
  const journals = Array.from(new Set(heatmap.map(h => h.journalName)));

  const heatmapMap = new Map<string, number>();
  heatmap.forEach(item => {
    heatmapMap.set(`${item.subjectName}-${item.journalName}`, item.articleCount);
  });

  const getIntensityClass = (count: number) => {
    if (!count) return 'bg-gray-50';
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

      <div className="overflow-x-auto border border-gray-100 rounded-md">
        <table className="w-full text-xs min-w-max border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="sticky left-0 bg-gray-50 z-10 text-left px-3 py-2 font-semibold text-gray-700 border-r border-gray-200">
                {t('insights.cross.subjectJournalHeatmap.subjectLabel')}
              </th>
              {journals.map(journal => (
                <th
                  key={journal}
                  className="px-3 py-2 text-center font-medium text-gray-700 whitespace-nowrap"
                >
                  {journal}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {subjects.map(subject => (
              <tr key={subject} className="border-t border-gray-100">
                <td className="sticky left-0 bg-white z-10 px-3 py-2 font-medium text-gray-800 border-r border-gray-200 whitespace-nowrap">
                  {subject}
                </td>

                {journals.map(journal => {
                  const count = heatmapMap.get(`${subject}-${journal}`) ?? 0;
                  return (
                    <td
                      key={journal}
                      className={`relative px-3 py-2 text-center transition-colors ${getIntensityClass(
                        count
                      )}`}
                      title={getAccessibleLabel(count, subject, journal)}
                    >
                      {count > 0 ? count.toLocaleString() : '—'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
