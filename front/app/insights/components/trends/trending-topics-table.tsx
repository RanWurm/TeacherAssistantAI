import { useMemo, useState } from 'react';
import {
  Crown,
  ArrowUpRight,
  ArrowRight,
  ArrowDownRight,
  Info,
  TrendingUp,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MOCK_TRENDING_TOPICS } from '../../data/mock';
import type { TimeRange } from '../../types/insights.types';

interface TrendingTopicsTableProps {
  timeRange: TimeRange;
}

type Topic = typeof MOCK_TRENDING_TOPICS[number];

function GrowthArrow({ rate }: { rate: number }) {
  if (rate > 2) return <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 drop-shadow" />;
  if (rate < -2) return <ArrowDownRight className="w-3.5 h-3.5 text-rose-500 drop-shadow" />;
  return <ArrowRight className="w-3.5 h-3.5 text-gray-400 drop-shadow" />;
}

/* ---------- Tooltip ---------- */
function TopicTooltip({
  topic,
  timeRange,
  children,
}: {
  topic: Topic;
  timeRange: TimeRange;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={0}
    >
      {children}
      {open && (
        <div className="absolute z-40 left-1/2 top-full mt-3 -translate-x-1/2 w-64 rounded-xl border border-blue-100 bg-white/90 shadow-2xl px-3 py-3 text-[11px] transition-all">
          <div className="flex items-center gap-1.5 mb-2 font-semibold text-slate-800">
            <Info className="w-3.5 h-3.5 text-sky-500" />
            <span className="truncate">{topic.keyword}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-gray-400">{t('insights.trends.trendingTopicsTable.period')}</span>
            <span className="font-medium text-gray-700">{topic.firstAppearanceYear}–{topic.latestYear}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-gray-400">{t('insights.trends.trendingTopicsTable.articles')}</span>
            <span className="font-medium text-gray-700">{topic.articleCount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-gray-400">{t('insights.trends.trendingTopicsTable.growth')}</span>
            <span className="flex items-center gap-1 text-gray-800" dir="ltr">
              {topic.growthRate > 0 ? '+' : ''}
              {topic.growthRate.toFixed(1)}%
              <GrowthArrow rate={topic.growthRate} />
            </span>
          </div>
          <div className="flex justify-between py-0.5 text-gray-300 border-t border-dashed border-blue-100 mt-1.5 pt-1.5">
            <span>{t('insights.trends.trendingTopicsTable.timeRange')}</span>
            <span>{t(`insights.timeRanges.${timeRange}`)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Main Component ---------- */
export function TrendingTopicsTable({ timeRange }: TrendingTopicsTableProps) {
  const { t } = useTranslation();
  const ranked = useMemo(() => {
    return [...MOCK_TRENDING_TOPICS].sort((a, b) =>
      b.articleCount !== a.articleCount
        ? b.articleCount - a.articleCount
        : b.growthRate - a.growthRate
    );
  }, [timeRange]);

  const podium = ranked.slice(0, 3);
  const rest = ranked.slice(3);

  return (
    <div className="bg-linear-to-br from-blue-50 via-white to-violet-50 border border-blue-100 rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-sky-100">
          <TrendingUp className="w-5 h-5 text-sky-500" />
        </span>
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
          {t('insights.trends.trendingTopicsTable.title')}
        </h3>
      </div>
      <p className="text-sm text-gray-500 mb-7">
        {t('insights.trends.trendingTopicsTable.subtitle')}
      </p>

      {/* ---------- PODIUM ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end mb-8">
        {/* Second Place */}
        <PodiumItem
          topic={podium[1]}
          place={2}
          size="md"
          timeRange={timeRange}
        />
        {/* First Place */}
        <PodiumItem
          topic={podium[0]}
          place={1}
          size="lg"
          highlight
          timeRange={timeRange}
        />
        {/* Third Place */}
        <PodiumItem
          topic={podium[2]}
          place={3}
          size="sm"
          timeRange={timeRange}
        />
      </div>

      {/* ---------- CONTENDERS ---------- */}
      <div className="flex flex-col items-center gap-3">
        {rest.map((topic, idx) => (
          <TopicTooltip key={topic.keyword} topic={topic} timeRange={timeRange}>
            <div className="flex items-center gap-2 px-4 py-1.5 bg-white/80 border border-blue-100 rounded-2xl shadow-md text-sm hover:bg-blue-50/80 transition cursor-pointer w-[340px]">
              <span className="mr-2 min-w-[22px] text-xs font-bold text-slate-400 text-center select-none">
                {idx + 4}
              </span>
              <span className="font-semibold truncate max-w-[140px] text-slate-800">
                {topic.keyword}
              </span>
              <span className="text-gray-400 font-mono text-[11px] bg-gray-100 rounded px-1 py-0.5 ml-auto">
                {topic.articleCount.toLocaleString()}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[11px] font-semibold ml-2 ${
                  topic.growthRate > 2
                    ? 'bg-green-100 text-green-700'
                    : topic.growthRate < -2
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-500'
                }`}
                dir="ltr"
              >
                {topic.growthRate > 0 ? '+' : ''}
                {topic.growthRate.toFixed(1)}%
              </span>
              <GrowthArrow rate={topic.growthRate} />
            </div>
          </TopicTooltip>
        ))}
      </div>
    </div>
  );
}

/* ---------- Podium Item ---------- */
function PodiumItem({
  topic,
  place,
  size,
  highlight,
  timeRange,
}: {
  topic?: Topic;
  place: 1 | 2 | 3;
  size: 'lg' | 'md' | 'sm';
  highlight?: boolean;
  timeRange: TimeRange;
}) {
  const { t } = useTranslation();

  if (!topic) return <div />;

  const sizeMap = {
    lg: 'h-44 min-h-[9.5rem]',
    md: 'h-36 min-h-[7.5rem]',
    sm: 'h-28 min-h-[5.5rem]',
  };

  // i18n place labels
  const placeLabel = t(`insights.trends.trendingTopicsTable.placeLabels.${place}`);

  // Color and effect for podium
  const borderColor =
    place === 1
      ? 'border-yellow-400 bg-gradient-to-b from-yellow-50/70 to-yellow-100 shadow-xl'
      : place === 2
      ? 'border-sky-400 bg-gradient-to-b from-sky-50/75 to-blue-100 shadow-lg'
      : 'border-violet-300 bg-gradient-to-b from-violet-50/70 to-violet-100 shadow-lg';

  return (
    <TopicTooltip topic={topic} timeRange={timeRange}>
      <div
        className={`
          flex flex-col items-center justify-end
          rounded-3xl border-2
          px-5 py-3
          ${sizeMap[size]}
          ${highlight ? 'ring-2 ring-yellow-200 scale-[1.025]' : ''}
          ${borderColor}
          transition-transform duration-200 hover:scale-105 relative
          group
        `}
      >
        {place === 1 && (
          <Crown className="absolute top-5 w-7 h-7 text-yellow-400 drop-shadow-md" />
        )}
        <span className="text-sm font-semibold mb-1 text-slate-800">{topic.keyword}</span>
        <span className="text-lg font-bold text-blue-900 mb-1">
          {topic.articleCount.toLocaleString()}
        </span>
        <span className="flex items-center gap-1 text-sm mt-0.5" dir="ltr">
          {topic.growthRate > 0 ? '+' : ''}
          {topic.growthRate.toFixed(1)}%
          <GrowthArrow rate={topic.growthRate} />
        </span>
      </div>
      <div className="flex justify-center mb-1 mt-2">
        <span className="text-[11px] tracking-tight bg-white/70 rounded-full px-1.5 py-0.5 text-gray-700 border border-gray-200 shadow">
          {placeLabel}
        </span>
      </div>
    </TopicTooltip>
  );
}
