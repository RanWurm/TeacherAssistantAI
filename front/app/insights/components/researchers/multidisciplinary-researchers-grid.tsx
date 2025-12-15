import { MOCK_MULTIDISCIPLINARY_RESEARCHERS } from '../../data/mock';
import type { TimeRange } from '../../types/insights.types';
import { MultidisciplinaryResearcherCard } from './multidisciplinary-researcher-card';
import { useTranslation } from 'react-i18next';

interface MultidisciplinaryResearchersGridProps {
  timeRange: TimeRange;
}

export function MultidisciplinaryResearchersGrid({
  timeRange,
}: MultidisciplinaryResearchersGridProps) {
  const { t } = useTranslation();
  const researchers = MOCK_MULTIDISCIPLINARY_RESEARCHERS;

  const maxSubjects = Math.max(...researchers.map(r => r.subjectCount));

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1.5">
        {t('insights.researchers.multidisciplinaryResearchers.title')}
      </h3>
      <div className="text-xs text-gray-600 mb-3">
        {t('insights.researchers.multidisciplinaryResearchers.description')}
      </div>

      <div className="space-y-3">
        {researchers.map(r => (
          <MultidisciplinaryResearcherCard
            key={String(r.authorId)}
            maxSubjects={maxSubjects}
            researcher={{
              authorId: String(r.authorId),
              name: r.name,
              affiliation: r.affiliation ?? undefined,
              subjectCount: r.subjectCount,
              articleCount: r.articleCount,
              avgCitationsPerArticle: r.avgCitationsPerArticle,
              subjects: r.subjects,
            }}
          />
        ))}
      </div>
    </div>
  );
}
