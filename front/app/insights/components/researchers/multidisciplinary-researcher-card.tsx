import {
  Network,
  Building2,
  FileText,
  TrendingUp,
} from 'lucide-react';
import React, { useState } from 'react';

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
  maxSubjects: number;
}

// Helper component to show more subjects in a popover/list
function ShowMoreSubjects({
  subjects,
  start,
  authorId,
}: {
  subjects: string[];
  start: number;
  authorId: string;
}) {
  const [showAll, setShowAll] = useState(false);

  if (subjects.length <= start) return null;

  return (
    <>
      {!showAll ? (
        <button
          className="text-[11px] px-2 py-0.5 rounded-full cursor-pointer underline"
          onClick={() => setShowAll(true)}
          aria-label="Show all subjects"
          type="button"
        >
          +{subjects.length - start} more
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
  maxSubjects,
}: MultidisciplinaryResearcherCardProps) {
  const subjectRatio = researcher.subjectCount / maxSubjects;

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
            {researcher.affiliation || 'N/A'}
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-1 rounded">
          <Network className="w-3 h-3" />
          {researcher.subjectCount} domains
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
        />
      </div>

      {/* Footer metrics */}
      <div className="flex items-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <FileText className="w-3 h-3" />
          {researcher.articleCount} articles
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {researcher.avgCitationsPerArticle.toFixed(1)} avg citations
        </div>
      </div>
    </div>
  );
}
