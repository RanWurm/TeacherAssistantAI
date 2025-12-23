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
  const { t, i18n } = useTranslation();

  const isRtl = i18n.dir() === 'rtl';

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

  // Responsive sizing: use smaller paddings, fonts, and gaps on small screens
  return (
    <div className="
      bg-white border border-gray-200 rounded-xl
      p-3 sm:p-4
      shadow-sm hover:shadow-md transition relative
      text-sm sm:text-base
      "
    >
      {/* Rank badge */}
      <div
        className={`absolute top-2 sm:top-4 ${isRtl ? 'left-2 sm:left-4' : 'right-2 sm:right-4'} 
        text-xs sm:text-base font-bold text-gray-800 bg-gray-100 
        px-2 py-1 sm:px-4 sm:py-2 rounded-lg shadow-sm`}
      >
        {rankLabel}
      </div>

      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
        {/* Impact ring */}
        <div className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center">
          <div className="
            w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-linear-to-br from-blue-500 to-blue-700
            flex items-center justify-center text-white font-bold text-xs sm:text-base
          ">
            {initials}
          </div>
        </div>

        <div>
          <div className="font-semibold text-gray-900 leading-tight text-base sm:text-lg">
            {researcher.name}
          </div>
          <div className="flex items-center gap-1 text-[11px] sm:text-xs text-gray-500">
            <Building2 className="w-3 h-3" />
            {affiliation}
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-700 mb-2 sm:mb-3">
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
      <div className="text-[11px] sm:text-xs font-medium text-blue-700 bg-blue-50 inline-block px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">
        {t(insightKey)}
      </div>
    </div>
  );
}
