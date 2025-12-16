import { useMemo, useState } from 'react';
import {
  Medal,
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
  if (rate > 2)
    return <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 drop-shadow" />;
  if (rate < -2)
    return <ArrowDownRight className="w-3.5 h-3.5 text-rose-500 drop-shadow" />;
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

  // Detect small screens by window width < 640px
  const isSmallScreen =
    typeof window !== 'undefined'
      ? window.innerWidth < 640
      : false;

  // For accessibility and keyboard navigation,
  // also support Esc to close for mobile touch/keyboard

  // For small screens, use a fixed, in-area centered modal; for large, use popover
  return (
    <div
      className="relative"
      onMouseEnter={() => !isSmallScreen && setOpen(true)}
      onMouseLeave={() => !isSmallScreen && setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={0}
      // For mobile: open on click/tap only
      onClick={() => isSmallScreen && setOpen(true)}
    >
      {children}
      {open && (
        isSmallScreen ? (
          <div
            className={`
              fixed inset-0 z-50 flex items-center justify-center
              bg-black/30
            `}
            // Dismiss on click outside or Esc
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <div
              className="
                w-[94vw] max-w-sm 
                bg-white border border-blue-100 rounded-xl shadow-2xl 
                text-[13px] 
                px-4 py-4
                relative
                max-h-[92vh] overflow-y-auto
              "
              onClick={e => e.stopPropagation()}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
            >
              <button
                className="absolute top-1.5 right-2 text-gray-400 hover:text-gray-600 text-lg font-bold"
                aria-label="Close"
                onClick={() => setOpen(false)}
                tabIndex={0}
              >
                ×
              </button>

              <div className="flex items-center gap-1.5 mb-2 font-semibold text-slate-800">
                <Info className="w-4 h-4 text-sky-500" />
                <span className="truncate">{topic.keyword}</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-gray-400">
                  {t('insights.trends.trendingTopicsTable.period')}
                </span>
                <span className="font-medium text-gray-700">
                  {topic.firstAppearanceYear}–{topic.latestYear}
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-gray-400">
                  {t('insights.trends.trendingTopicsTable.articles')}
                </span>
                <span className="font-medium text-gray-700">
                  {topic.articleCount.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-gray-400">
                  {t('insights.trends.trendingTopicsTable.growth')}
                </span>
                <span className="flex items-center gap-1 text-gray-800" dir="ltr">
                  {topic.growthRate > 0 ? '+' : ''}
                  {topic.growthRate.toFixed(1)}%
                  <GrowthArrow rate={topic.growthRate} />
                </span>
              </div>

              <div className="flex justify-between py-1 text-gray-300 border-t border-dashed border-blue-100 mt-1.5 pt-1.5">
                <span>{t('insights.trends.trendingTopicsTable.timeRange')}</span>
                <span>{t(`insights.timeRanges.${timeRange}`)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute z-40 left-1/2 top-full mt-3 -translate-x-1/2 w-64 rounded-xl border border-blue-100 bg-white/90 shadow-2xl px-3 py-3 text-[11px]">
            <div className="flex items-center gap-1.5 mb-2 font-semibold text-slate-800">
              <Info className="w-3.5 h-3.5 text-sky-500" />
              <span className="truncate">{topic.keyword}</span>
            </div>

            <div className="flex justify-between py-0.5">
              <span className="text-gray-400">
                {t('insights.trends.trendingTopicsTable.period')}
              </span>
              <span className="font-medium text-gray-700">
                {topic.firstAppearanceYear}–{topic.latestYear}
              </span>
            </div>

            <div className="flex justify-between py-0.5">
              <span className="text-gray-400">
                {t('insights.trends.trendingTopicsTable.articles')}
              </span>
              <span className="font-medium text-gray-700">
                {topic.articleCount.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between py-0.5">
              <span className="text-gray-400">
                {t('insights.trends.trendingTopicsTable.growth')}
              </span>
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
        )
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

      {/* ---------- PODIUM (RANK BADGE STYLE) ---------- */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-8">
        {podium.map((topic, index) => (
          <RankCard
            key={topic.keyword}
            topic={topic}
            rank={index + 1 as 1 | 2 | 3}
            timeRange={timeRange}
          />
        ))}
      </div>

      {/* ---------- CONTENDERS ---------- */}
      <div className="flex flex-col items-center gap-3">
        {rest.map((topic, idx) => (
          <TopicTooltip key={topic.keyword} topic={topic} timeRange={timeRange}>
            <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 bg-white/80 border border-blue-100 rounded-2xl shadow-md text-sm hover:bg-blue-50/80 transition cursor-pointer w-full max-w-[98vw] sm:w-[340px]">
              <span className="mr-2 min-w-[22px] text-xs font-bold text-slate-400 text-center select-none">
                {idx + 4}
              </span>
              <span className="font-semibold truncate max-w-[90px] sm:max-w-[140px] text-slate-800">
                {topic.keyword}
              </span>
              <span className="text-gray-400 font-mono text-[11px] bg-gray-100 rounded px-1 py-0.5 ml-auto">
                {topic.articleCount.toLocaleString()}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[11px] font-semibold ml-2 ${topic.growthRate > 2
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

/* ---------- Rank Card ---------- */
function RankCard({
  topic,
  rank,
  timeRange,
}: {
  topic: Topic;
  rank: 1 | 2 | 3;
  timeRange: TimeRange;
}) {
  const medalColor =
    rank === 1
      ? 'text-yellow-400'
      : rank === 2
        ? 'text-slate-400'
        : 'text-amber-700';

  const highlight =
    rank === 1
      ? 'ring-2 ring-yellow-200 bg-yellow-50/70'
      : 'bg-white/80';

  return (
    <TopicTooltip topic={topic} timeRange={timeRange}>
      <div
        className={`
          relative flex flex-col items-center justify-center
          rounded-2xl border border-blue-100 shadow-md
          px-4 py-4 sm:py-6
          ${highlight}
          transition-transform duration-200 sm:hover:scale-105
        `}
      >
        <div className="relative mb-2">
          <Medal className={`w-6 h-6 ${medalColor}`} />

          <span
            className="
              absolute -top-1 -right-1
              w-4 h-4
              rounded-full
              bg-slate-900 text-white
              text-[10px] font-bold
              flex items-center justify-center
              leading-none
            "
          >
            {rank}
          </span>
        </div>

        <span className="text-xs sm:text-sm font-semibold text-slate-800 text-center truncate max-w-full">
          {topic.keyword}
        </span>

        <span className="text-base sm:text-lg font-bold text-blue-900 mt-1">
          {topic.articleCount.toLocaleString()}
        </span>

        <span className="flex items-center gap-1 text-sm mt-1" dir="ltr">
          {topic.growthRate > 0 ? '+' : ''}
          {topic.growthRate.toFixed(1)}%
          <GrowthArrow rate={topic.growthRate} />
        </span>
      </div>
    </TopicTooltip>
  );
}
