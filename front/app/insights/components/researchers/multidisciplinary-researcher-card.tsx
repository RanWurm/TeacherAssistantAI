import {
  Network,
  Building2,
  FileText,
  TrendingUp,
} from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface MultidisciplinaryResearcherCardProps {
  researcher: {
    authorId: string;
    name: string;
    affiliation?: string;
    subjectCount: number;
    articleCount: number;
    avgCitationsPerArticle: number;
    subjects: string[];
  };
}

// Helper component to show more subjects in a popover/list
function ShowMoreSubjects({
  subjects,
  start,
  authorId,
  showMoreLabel,
}: {
  subjects: string[];
  start: number;
  authorId: string;
  showMoreLabel: (count: number) => string;
}) {
  const [showAll, setShowAll] = useState(false);

  if (subjects.length <= start) return null;

  return (
    <>
      {!showAll ? (
        <button
          className="text-[11px] px-2 py-0.5 rounded-full cursor-pointer underline"
          onClick={() => setShowAll(true)}
          aria-label={showMoreLabel(subjects.length - start)}
          type="button"
        >
          {showMoreLabel(subjects.length - start)}
        </button>
      ) : (
        subjects.slice(start).map((subject, idx) => (
          <span
            key={`${authorId}-subject-${start + idx}`}
            className="text-[11px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200"
          >
            {subject}
          </span>
        ))
      )}
    </>
  );
}

export function MultidisciplinaryResearcherCard({
  researcher,
}: MultidisciplinaryResearcherCardProps) {
  const { t } = useTranslation();

  // i18n: fallback for affiliation
  const affiliation =
    researcher.affiliation ||
    t('insights.researchers.multidisciplinaryResearchers.affiliationFallback');
  // i18n: badge for count of domains
  const domainsLabel = t(
    'insights.researchers.multidisciplinaryResearchers.domains',
    { count: researcher.subjectCount }
  );
  // i18n: show more label
  const showMoreLabel = (count: number) =>
    t('insights.researchers.multidisciplinaryResearchers.subjectsShowMore', {
      count,
    });
  // i18n: articles count
  const articleCountLabel = t(
    'insights.researchers.multidisciplinaryResearchers.articles',
    { count: researcher.articleCount }
  );
  // i18n: avg citations
  const avgCitationsLabel = t(
    'insights.researchers.multidisciplinaryResearchers.avgCitations',
    { count: researcher.avgCitationsPerArticle }
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="font-semibold text-gray-900">
            {researcher.name}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Building2 className="w-3 h-3" />
            {affiliation}
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-1 rounded">
          <Network className="w-3 h-3" />
          {domainsLabel}
        </div>
      </div>

      {/* Subjects preview */}
      <div className="flex flex-wrap gap-1 mb-2">
        {researcher.subjects.slice(0, 4).map((subject, idx) => (
          <span
            key={idx}
            className="text-[11px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200"
          >
            {subject}
          </span>
        ))}
        <ShowMoreSubjects
          subjects={researcher.subjects}
          start={4}
          authorId={researcher.authorId}
          showMoreLabel={showMoreLabel}
        />
      </div>

      {/* Footer metrics */}
      <div className="flex items-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <FileText className="w-3 h-3" />
          {articleCountLabel}
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {avgCitationsLabel}
        </div>
      </div>
    </div>
  );
}
