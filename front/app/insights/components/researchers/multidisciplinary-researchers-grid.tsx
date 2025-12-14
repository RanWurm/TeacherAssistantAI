import { MOCK_MULTIDISCIPLINARY_RESEARCHERS } from '../../data/mock';
import type { TimeRange } from '../../types/insights.types';
import { MultidisciplinaryResearcherCard } from './multidisciplinary-researcher-card';

interface MultidisciplinaryResearchersGridProps {
  timeRange: TimeRange;
}

export function MultidisciplinaryResearchersGrid({
  timeRange,
}: MultidisciplinaryResearchersGridProps) {
  const researchers = MOCK_MULTIDISCIPLINARY_RESEARCHERS;

  const maxSubjects = Math.max(
    ...researchers.map(r => r.subjectCount)
  );

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1.5">
        Multidisciplinary Researchers
      </h3>
      <div className="text-xs text-gray-600 mb-3">
        Researchers with the broadest disciplinary spread across domains.
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
