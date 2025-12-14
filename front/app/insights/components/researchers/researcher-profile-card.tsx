import {
    Building2,
    FileText,
    TrendingUp,
    BookOpen,
    Layers,
  } from 'lucide-react';
  
  interface ResearcherProfileCardProps {
    researcher: {
      authorId: string;
      name: string;
      affiliation?: string;
      articleCount: number;
      totalCitations: number;
      avgCitationsPerArticle: number;
      uniqueJournals: number;
      uniqueSubjects: number;
    };
    rank: number;
    maxCitations: number;
    timeRange: '1y' | '3y' | '5y' | 'all';
  }
  
  export function ResearcherProfileCard({
    researcher,
    rank,
    maxCitations,
    timeRange,
  }: ResearcherProfileCardProps) {
    const initials = researcher.name
      .split(' ')
      .map(n => n[0])
      .join('');
  
    const impactRatio = researcher.totalCitations / maxCitations;
    const ringAngle = Math.min(impactRatio * 360, 360);
  
    const insight =
      researcher.uniqueSubjects >= 6
        ? 'Highly multidisciplinary'
        : researcher.avgCitationsPerArticle > 30
        ? timeRange === '1y'
          ? 'Recent high impact'
          : 'Consistently high impact'
        : 'Focused research profile';
  
    const rankLabel =
      rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
  
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition relative">
        {/* Rank badge */}
        <div className="absolute top-4 right-4 text-base font-bold text-gray-800 bg-gray-100 px-4 py-2 rounded-lg shadow-sm">
          {rankLabel}
        </div>
  
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          {/* Impact ring */}
          <div className="relative w-14 h-14 rounded-full flex items-center justify-center">
            <div className="w-11 h-11 rounded-full bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-base">
              {initials}
            </div>
          </div>
  
          <div>
            <div className="font-semibold text-gray-900 leading-tight">
              {researcher.name}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Building2 className="w-3 h-3" />
              {researcher.affiliation || 'N/A'}
            </div>
          </div>
        </div>
  
        {/* Metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 mb-3">
          <div className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {researcher.articleCount} papers
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {researcher.avgCitationsPerArticle.toFixed(1)} avg
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {researcher.uniqueJournals} journals
          </div>
          <div className="flex items-center gap-1">
            <Layers className="w-3 h-3" />
            {researcher.uniqueSubjects} subjects
          </div>
        </div>
  
        {/* Insight */}
        <div className="text-xs font-medium text-blue-700 bg-blue-50 inline-block px-2 py-1 rounded">
          {insight}
        </div>
      </div>
    );
  }
  