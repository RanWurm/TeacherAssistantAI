import { BarChart3, Layers, Network } from 'lucide-react';
import type { TimeRange } from '../../types/insights.types';
import { useTranslation } from 'react-i18next';
import { useInsightsCross } from '@/hooks/insights/useInsightsCross';

interface MultidisciplinaryVsSingleProps {
  timeRange: TimeRange;
}

// Helper for API response structure (array or object)
function getMultiSingle(data: any) {
  let single, multi;
  if (!data) return { single, multi };
  if (Array.isArray(data)) {
    single = data.find((d) => d.type === 'single');
    multi = data.find((d) => d.type === 'multi');
  } else if (typeof data === 'object') {
    if (data.type === 'single') single = data;
    if (data.type === 'multi') multi = data;
  }
  return { single, multi };
}

function MultiSingleCard({
  card,
  isRtl,
  t,
}: {
  card: any;
  isRtl: boolean;
  t: any;
}) {
  const percent = card.percent;
  const positionClass = isRtl ? 'right-0' : 'left-0';
  return (
    <div
      key={card.key}
      className={`p-3 rounded-lg border ${card.borderClass} ${card.bgClass ?? 'bg-white'} sm:p-3 p-2 flex flex-col h-full`}
    >
      {/* Header: icon + title */}
      <div className="flex items-center gap-2 mb-4">
        {card.icon}
        <span className={`text-sm font-semibold ${card.textColor}`}>
          {card.title}
        </span>
      </div>
      {/* Main metrics row: Articles (large), Avg. Citations */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs text-gray-600 mb-0.5">
            {t('insights.cross.multidisciplinaryVsSingle.articlesLabel')}
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {card.count.toLocaleString()}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-600 mb-0.5">
            {t('insights.cross.multidisciplinaryVsSingle.avgCitationsLabel')}
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {card.avgCitations.toLocaleString(undefined, { maximumFractionDigits: 1 })}
          </div>
        </div>
      </div>
      {/* Progress section: Citations label, bar, total citations */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1 text-xs text-gray-600">
          <span>
            {t('insights.cross.multidisciplinaryVsSingle.totalCitationsLabel')}
          </span>
          <span className={`font-medium ${isRtl ? 'order-first' : ''}`}>
            {card.totalCitations.toLocaleString()}
          </span>
        </div>
        <div className="relative h-2 rounded-full overflow-hidden border border-gray-200 bg-white">
          <div
            className={`absolute top-0 ${positionClass} h-2 ${card.fillClass}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
      {/* Footer stats row: Authors + Journals */}
      <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-2 border-t border-gray-100">
        <div>
          <div className="font-medium text-gray-900">
            {card.uniqueAuthors.toLocaleString()}
          </div>
          <div>
            {t('insights.cross.multidisciplinaryVsSingle.uniqueAuthorsLabel')}
          </div>
        </div>
        <div>
          <div className="font-medium text-gray-900">
            {card.uniqueJournals.toLocaleString()}
          </div>
          <div>
            {t('insights.cross.multidisciplinaryVsSingle.uniqueJournalsLabel')}
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton UI for loading state
function MultiSingleCardSkeleton({ type }: { type: 'single' | 'multi' }) {
  const bgCard =
    type === 'single'
      ? 'bg-blue-50/80 border-blue-100'
      : 'bg-purple-50/80 border-purple-100';
  const bgLoading = 'bg-gray-200';

  return (
    <div className={`p-3 rounded-lg border ${bgCard} sm:p-3 p-2 flex flex-col h-full animate-pulse`}>
      {/* Icon + title skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-4 h-4 rounded-full ${bgLoading}`} />
        <div className="h-4 w-24 rounded bg-gray-200" />
      </div>
      {/* Article count + avg citations skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="h-3 w-16 rounded bg-gray-200 mb-1" />
          <div className={`h-6 w-14 rounded ${bgLoading}`} />
        </div>
        <div className="text-right">
          <div className="h-3 w-16 rounded bg-gray-200 mb-1" />
          <div className={`h-5 w-10 rounded ${bgLoading} inline-block`} />
        </div>
      </div>
      {/* Progress bar skeleton */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1 text-xs text-gray-400">
          <div className="h-3 w-20 rounded bg-gray-200" />
          <div className="h-3 w-10 rounded bg-gray-200" />
        </div>
        <div className="relative h-2 rounded-full overflow-hidden border border-gray-200 bg-gray-100">
          <div className={`absolute top-0 left-0 h-2 ${bgLoading} rounded`} style={{ width: `60%` }} />
        </div>
      </div>
      {/* Footer: authors & journals skeleton */}
      <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-2 border-t border-gray-100">
        <div>
          <div className={`h-4 w-10 ${bgLoading} rounded mb-1`} />
          <div className="h-3 w-16 bg-gray-200 rounded" />
        </div>
        <div>
          <div className={`h-4 w-10 ${bgLoading} rounded mb-1`} />
          <div className="h-3 w-16 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export function MultidisciplinaryVsSingle({ timeRange }: MultidisciplinaryVsSingleProps) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const { data: crossData, loading } = useInsightsCross(timeRange);

  const { single: singleData, multi: multiData } = getMultiSingle(crossData?.multidisciplinaryVsSingle);

  const single = singleData?.articles ?? 0;
  const multi = multiData?.articles ?? 0;
  const total = single + multi;

  function getCardProps(type: 'single' | 'multi') {
    const data = type === 'single' ? singleData : multiData;
    return {
      key: type,
      icon:
        type === 'single' ? (
          <Layers className="w-4 h-4 sm:w-4 sm:h-4 text-blue-600" />
        ) : (
          <Network className="w-4 h-4 sm:w-4 sm:h-4 text-purple-600" />
        ),
      title: t(
        `insights.cross.multidisciplinaryVsSingle.${type}Subject`
      ),
      borderClass: type === 'single' ? 'border-blue-200' : 'border-purple-200',
      textColor: type === 'single' ? 'text-blue-900' : 'text-purple-900',
      fillClass: type === 'single' ? 'bg-blue-500' : 'bg-purple-500',
      bgClass: type === 'single' ? 'bg-blue-50/40' : 'bg-purple-50/40',
      count: type === 'single' ? single : multi,
      articleCount: data?.articles ?? 0,
      avgCitations: data?.avgCitations ?? 0,
      totalCitations: data?.totalCitations ?? 0,
      uniqueAuthors: data?.authors ?? 0,
      uniqueJournals: data?.journals ?? 0,
      percent: total ? ((type === 'single' ? single : multi) / total) * 100 : 0,
    };
  }

  const cards = [getCardProps('single'), getCardProps('multi')];

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-4 min-h-[200px]">
        <div className="flex items-center gap-2 mb-4 sm:mb-4 animate-pulse">
          <BarChart3 className="w-4 h-4 sm:w-4 sm:h-4 text-gray-300" />
          <h3 className="text-sm font-semibold text-transparent sm:text-sm bg-gray-100 rounded w-40 h-5" />
        </div>
        <div className="mb-3 sm:mb-3 sm:text-xs text-[11px] h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4">
          <MultiSingleCardSkeleton type="single" />
          <MultiSingleCardSkeleton type="multi" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-4">
      <div className="flex items-center gap-2 mb-4 sm:mb-4">
        <BarChart3 className="w-4 h-4 sm:w-4 sm:h-4 text-gray-500" />
        <h3 className="text-sm font-semibold text-gray-900 sm:text-sm">
          {t('insights.cross.multidisciplinaryVsSingle.title')}
        </h3>
      </div>
      <p className="text-xs text-gray-600 mb-3 sm:mb-3 sm:text-xs text-[11px]">
        {t('insights.cross.multidisciplinaryVsSingle.description')}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4">
        {cards.map((card) => (
          <div key={card.key} className="transition-shadow duration-150 hover:shadow-[0_6px_32px_0_rgba(100,64,230,0.10)]">
            <MultiSingleCard card={card} isRtl={isRtl} t={t} />
          </div>
        ))}
      </div>
    </div>
  );
}