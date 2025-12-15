import {
  Building2,
  FileText,
  TrendingUp,
  BookOpen,
  Layers,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  const initials = researcher.name
    .split(' ')
    .map(n => n[0])
    .join('');

  // Compute insight label (i18n)
  let insightKey: string;
  if (researcher.uniqueSubjects >= 6) {
    insightKey = 'insights.researchers.topResearchers.researcher.insight.multidisciplinary';
  } else if (researcher.avgCitationsPerArticle > 30) {
    if (timeRange === '1y') {
      insightKey = 'insights.researchers.topResearchers.researcher.insight.recentHighImpact';
    } else {
      insightKey = 'insights.researchers.topResearchers.researcher.insight.consistentlyHighImpact';
    }
  } else {
    insightKey = 'insights.researchers.topResearchers.researcher.insight.focusedProfile';
  }

  // Rank label (i18n)
  let rankLabel: string;
  if (rank === 1) {
    rankLabel = t('insights.researchers.topResearchers.researcher.rankGold');
  } else if (rank === 2) {
    rankLabel = t('insights.researchers.topResearchers.researcher.rankSilver');
  } else if (rank === 3) {
    rankLabel = t('insights.researchers.topResearchers.researcher.rankBronze');
  } else {
    rankLabel = t('insights.researchers.topResearchers.researcher.rankOther', { rank });
  }

  // i18n metrics
  const affiliation = researcher.affiliation || t('insights.researchers.topResearchers.researcher.affiliationFallback');
  const articleCountLabel = t('insights.researchers.topResearchers.researcher.articles', { count: researcher.articleCount });
  const avgCitationsLabel = t('insights.researchers.topResearchers.researcher.avgCitations', { count: researcher.avgCitationsPerArticle });
  const journalsLabel = t('insights.researchers.topResearchers.researcher.journals', { count: researcher.uniqueJournals });
  const subjectsLabel = t('insights.researchers.topResearchers.researcher.subjects', { count: researcher.uniqueSubjects });

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
            {affiliation}
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 mb-3">
        <div className="flex items-center gap-1">
          <FileText className="w-3 h-3" />
          {articleCountLabel}
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {avgCitationsLabel}
        </div>
        <div className="flex items-center gap-1">
          <BookOpen className="w-3 h-3" />
          {journalsLabel}
        </div>
        <div className="flex items-center gap-1">
          <Layers className="w-3 h-3" />
          {subjectsLabel}
        </div>
      </div>

      {/* Insight */}
      <div className="text-xs font-medium text-blue-700 bg-blue-50 inline-block px-2 py-1 rounded">
        {t(insightKey)}
      </div>
    </div>
  );
}
