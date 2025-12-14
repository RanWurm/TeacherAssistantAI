import { MOCK_TOP_RESEARCHERS } from '../../data/mock';
import { ResearcherProfileCard } from './researcher-profile-card';
import type { TimeRange } from '../../types/insights.types';

interface ResearcherGridProps {
  timeRange: TimeRange;
}

export function ResearcherGrid({ timeRange }: ResearcherGridProps) {
  // Sort researchers by total citations in descending order
  const sorted = [...MOCK_TOP_RESEARCHERS].sort(
    (a, b) => b.totalCitations - a.totalCitations
  );

  // Find the maximum total citations count (used for relative metrics/rank display)
  const maxCitations = Math.max(...sorted.map(r => r.totalCitations));

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1.5">
        Top Researcher
      </h3>
      <div className="text-xs text-gray-600 mb-3">
        Explore top researchers ranked by total citations. Each card highlights their publication and impact metrics, research breadth (journals and subjects), and key distinguishing features.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sorted.map((r, idx) => (
          <ResearcherProfileCard
            key={String(r.authorId)}
            rank={idx + 1}
            maxCitations={maxCitations}
            timeRange={timeRange}
            researcher={{
              authorId: String(r.authorId),
              name: r.name,
              affiliation: r.affiliation ?? undefined,
              articleCount: r.articleCount,
              totalCitations: r.totalCitations,
              avgCitationsPerArticle: r.avgCitationsPerArticle,
              uniqueJournals: r.uniqueJournals,
              uniqueSubjects: r.uniqueSubjects,
            }}
          />
        ))}
      </div>
    </div>
  );
}
