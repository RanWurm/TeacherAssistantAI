import {
  Building2,
  FileText,
  TrendingUp,
  BookOpen,
  Layers,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { ResearcherStats } from '@/lib/types/insights/Researchers';

interface ResearcherProfileCardProps {
  researcher: ResearcherStats;
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

  let insightKey: string;
  if (researcher.uniqueSubjects >= 6) {
    insightKey = 'insights.researchers.topResearchers.researcher.insight.multidisciplinary';
  } else if (
    researcher.avgCitationsPerArticle != null &&
    researcher.avgCitationsPerArticle > 30
  ) {
    if (timeRange === '1y') {
      insightKey = 'insights.researchers.topResearchers.researcher.insight.recentHighImpact';
    } else {
      insightKey = 'insights.researchers.topResearchers.researcher.insight.consistentlyHighImpact';
    }
  } else {
    insightKey = 'insights.researchers.topResearchers.researcher.insight.focusedProfile';
  }

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

  const institutionsDisplay =
  Array.isArray(researcher.institutions) && researcher.institutions.length > 0
    ? researcher.institutions[0]
    : t('insights.researchers.topResearchers.researcher.institutionFallback');
  const metrics = [
    {
      key: `articles-${researcher.articleCount}`,
      icon: FileText,
      label: t('insights.researchers.topResearchers.researcher.articles', {
        count: researcher.articleCount,
      }),
    },
    {
      key: `avgCitations-${researcher.avgCitationsPerArticle ?? 0}`,
      icon: TrendingUp,
      label: t('insights.researchers.topResearchers.researcher.avgCitations', {
        count: researcher.avgCitationsPerArticle ?? 0,
      }),
    },
    {
      key: `sources-${researcher.uniqueSources}`,
      icon: BookOpen,
      label: t('insights.researchers.topResearchers.researcher.sources', {
        count: researcher.uniqueSources,
      }),
    },
    {
      key: `subjects-${researcher.uniqueSubjects}`,
      icon: Layers,
      label: t('insights.researchers.topResearchers.researcher.subjects', {
        count: researcher.uniqueSubjects,
      }),
    },
  ];

  return (
    <div
      className="
      bg-white border border-gray-200 rounded-xl
      p-3 sm:p-4
      shadow-sm hover:shadow-md transition relative
      text-sm sm:text-base
      "
    >
      <div
        className={`absolute top-2 sm:top-4 ${isRtl ? 'left-2 sm:left-4' : 'right-2 sm:right-4'
          } 
        text-xs sm:text-base font-bold text-gray-800 bg-gray-100 
        px-2 py-1 sm:px-4 sm:py-2 rounded-lg shadow-sm`}
      >
        {rankLabel}
      </div>

      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
        <div className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center">
          <div
            className="
            w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-linear-to-br from-blue-500 to-blue-700
            flex items-center justify-center text-white font-bold text-xs sm:text-base
          "
          >
            {initials}
          </div>
        </div>

        <div>
          <div className="font-semibold text-gray-900 leading-tight text-base sm:text-lg">
            {researcher.name}
          </div>
          <div className="flex items-center gap-1 text-[11px] sm:text-xs text-gray-500">
            <Building2 className="w-3 h-3" />
            {typeof institutionsDisplay === 'string' && institutionsDisplay.length > 30
              ? `${institutionsDisplay.slice(0, 27)}...`
              : institutionsDisplay}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-700 mb-2 sm:mb-3">
        {metrics.map(({ key, icon: Icon, label }) => (
          <div className="flex items-center gap-1" key={key}>
            <Icon className="w-3 h-3" />
            {label}
          </div>
        ))}
      </div>

      <div className="text-[11px] sm:text-xs font-medium text-blue-700 bg-blue-50 inline-block px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">
        {t(insightKey)}
      </div>
    </div>
  );
}