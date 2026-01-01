import { useMemo, useState, useEffect, useRef } from "react";
import {
  Medal,
  Info,
  TrendingUp,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { TimeRange } from "../../types/insights.types";
import { useInsightsTrends } from "@/hooks/insights/useInsightsTrends";
import type { TrendingTopic } from "@/lib/types/insights/Trends";

interface TrendingTopicsTableProps {
  timeRange: TimeRange;
}
type Topic = TrendingTopic;

function useIsSmallScreen() {
  const [isSmall, setIsSmall] = useState(false);
  useEffect(() => {
    const handler = () =>
      setIsSmall(typeof window !== "undefined" && window.innerWidth < 640);
    handler();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isSmall;
}

function TopicTooltip({
  topic,
  timeRange,
  children,
}: {
  topic: Topic;
  timeRange: TimeRange;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const isSmallScreen = useIsSmallScreen();
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  useEffect(() => {
    if (open && isSmallScreen && contentRef.current) {
      contentRef.current.focus();
    }
  }, [open, isSmallScreen]);

  const triggerProps = isSmallScreen
    ? {
        onClick: () => setOpen(true),
        tabIndex: 0,
        role: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": open,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") setOpen(true);
        },
      }
    : {
        onMouseEnter: () => setOpen(true),
        onMouseLeave: () => setOpen(false),
        onFocus: () => setOpen(true),
        onBlur: () => setOpen(false),
        tabIndex: 0,
        "aria-haspopup": "dialog",
        "aria-expanded": open,
      };

  return (
    <div className="relative" {...triggerProps} aria-haspopup="dialog">
      {children}
      {open &&
        (isSmallScreen ? (
          <div
            className={`
              fixed inset-0 z-50 flex items-center justify-center
              bg-black/30
            `}
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
            aria-modal="true"
            role="dialog"
          >
            <div
              ref={contentRef}
              className="
                w-[94vw] max-w-sm 
                bg-white border border-blue-100 rounded-xl shadow-2xl 
                text-[13px] 
                px-4 py-4
                relative
                max-h-[92vh] overflow-y-auto
                outline-none
              "
              onClick={(e) => e.stopPropagation()}
              tabIndex={-1}
              aria-label={t(
                "insights.trends.trendingTopicsTable.topicDetails"
              )}
            >
              <button
                className="absolute top-1.5 right-2 text-gray-400 hover:text-gray-600 text-lg font-bold"
                aria-label={t("insights.close")}
                onClick={() => setOpen(false)}
                tabIndex={0}
              >
                ×
              </button>
              <TopicTooltipContent topic={topic} timeRange={timeRange} />
            </div>
          </div>
        ) : (
          <div
            className="absolute z-40 left-1/2 top-full mt-3 -translate-x-1/2 w-64 rounded-xl border border-blue-100 bg-white/90 shadow-2xl px-3 py-3 text-[11px]"
            role="dialog"
            aria-label={t("insights.trends.trendingTopicsTable.topicDetails")}
          >
            <TopicTooltipContent topic={topic} timeRange={timeRange} />
          </div>
        ))}
    </div>
  );
}

function TopicTooltipContent({
  topic,
  timeRange,
}: {
  topic: Topic;
  timeRange: TimeRange;
}) {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex items-center gap-1.5 mb-2 font-semibold text-slate-800">
        <Info className="w-4 h-4 text-sky-500" aria-hidden="true" />
        <span className="truncate">{topic.keyword}</span>
      </div>

      <div className="flex justify-between py-1">
        <span className="text-gray-400">
          {t("insights.trends.trendingTopicsTable.period")}
        </span>
        <span className="font-medium text-gray-700">
          {(topic as any).firstAppearanceYear != null &&
          (topic as any).latestYear != null
            ? `${(topic as any).firstAppearanceYear}–${
                (topic as any).latestYear
              }`
            : t("insights.trends.trendingTopicsTable.unknownPeriod")}
        </span>
      </div>

      <div className="flex justify-between py-1">
        <span className="text-gray-400">
          {t("insights.trends.trendingTopicsTable.articles")}
        </span>
        <span className="font-medium text-gray-700">
          {typeof topic.articleCount === "number"
            ? topic.articleCount.toLocaleString()
            : "-"}
        </span>
      </div>

      <div className="flex justify-between py-1 text-gray-300 border-t border-dashed border-blue-100 mt-1.5 pt-1.5">
        <span>{t("insights.trends.trendingTopicsTable.timeRange")}</span>
        <span>{t(`insights.timeRanges.${timeRange}`)}</span>
      </div>
    </>
  );
}

export function TrendingTopicsTable({ timeRange }: TrendingTopicsTableProps) {
  const { t } = useTranslation();
  const { data, loading } = useInsightsTrends(timeRange);

  const trendingTopics: Topic[] = data?.trendingTopics ?? [];

  // Sort: descending by articleCount, preserve stable order otherwise
  const ranked = useMemo(() => {
    return [...trendingTopics].sort((a, b) => {
      const c = (b.articleCount ?? 0) - (a.articleCount ?? 0);
      return c;
    });
  }, [trendingTopics]);

  const podium = ranked.slice(0, 3);
  const rest = ranked.slice(3);

  // ---- START NEW LOADING PLACEHOLDER ----
  if (loading) {
    // Use same style as metrics-cards.tsx loading
    return (
      <div className="bg-linear-to-br from-blue-50 via-white to-violet-50 border border-blue-100 rounded-2xl shadow-lg p-6">
        {/* Podium loading */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-8">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="
                relative flex flex-col items-center justify-center
                rounded-2xl border border-blue-100 shadow-md
                bg-white/60
                px-4 py-4 sm:py-6
                animate-pulse
                opacity-80
              "
            >
              <div className="relative mb-2">
                <div className="w-6 h-6 bg-slate-200 rounded-full" />
                <span
                  className="
                    absolute -top-1 -right-1
                    w-4 h-4
                    rounded-full
                    bg-slate-300
                  "
                ></span>
              </div>
              <div className="h-3 bg-slate-200 rounded w-2/3 mb-1" />
              <div className="h-4 bg-slate-100 rounded w-1/3" />
            </div>
          ))}
        </div>
        {/* Rest loading */}
        <div className="flex flex-col items-center gap-3">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-3 sm:px-4 py-1.5 bg-white/80 border border-blue-100 rounded-2xl shadow-md text-sm w-full max-w-[98vw] sm:w-[340px] animate-pulse opacity-80"
            >
              <div className="mr-2 min-w-[22px] h-3 bg-slate-200 rounded" />
              <div className="font-semibold truncate max-w-[90px] sm:max-w-[140px] h-3 bg-slate-100 rounded" />
              <div className="ml-auto h-3 w-10 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  // ---- END NEW LOADING PLACEHOLDER ----

  if (!ranked.length) {
    return (
      <div className="bg-linear-to-br from-blue-50 via-white to-violet-50 border border-blue-100 rounded-2xl shadow-lg p-6 flex items-center justify-center min-h-[240px]">
        <span className="text-gray-400">
          {t("insights.trends.trendingTopicsTable.noData")}
        </span>
      </div>
    );
  }

  return (
    <div
      className="bg-linear-to-br from-blue-50 via-white to-violet-50 border border-blue-100 rounded-2xl shadow-lg p-6"
      aria-live="polite"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-sky-100">
          <TrendingUp className="w-5 h-5 text-sky-500" aria-hidden="true" />
        </span>
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
          {t("insights.trends.trendingTopicsTable.title")}
        </h3>
      </div>

      <p className="text-sm text-gray-500 mb-7">
        {t("insights.trends.trendingTopicsTable.subtitle")}
      </p>

      {/* ---------- PODIUM (RANK BADGE STYLE) ---------- */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-8">
        {podium.map((topic, index) => (
          <RankCard
            key={topic.keyword}
            topic={topic}
            rank={(index + 1) as 1 | 2 | 3}
            timeRange={timeRange}
          />
        ))}
      </div>

      {/* ---------- CONTENDERS ---------- */}
      <div className="flex flex-col items-center gap-3">
        {rest.map((topic, idx) => {
          return (
            <TopicTooltip
              key={topic.keyword}
              topic={topic}
              timeRange={timeRange}
            >
              <div
                className="flex items-center gap-2 px-3 sm:px-4 py-1.5 bg-white/80 border border-blue-100 rounded-2xl shadow-md text-sm hover:bg-blue-50/80 transition cursor-pointer w-full max-w-[98vw] sm:w-[340px]"
                tabIndex={0}
                aria-label={t(
                  "insights.trends.trendingTopicsTable.topicRow",
                  { keyword: topic.keyword }
                )}
              >
                <span className="mr-2 min-w-[22px] text-xs font-bold text-slate-400 text-center select-none">
                  {idx + 4}
                </span>
                <span className="font-semibold truncate max-w-[90px] sm:max-w-[140px] text-slate-800">
                  {topic.keyword}
                </span>
                <span className="text-gray-400 font-mono text-[11px] bg-gray-100 rounded px-1 py-0.5 ml-auto">
                  {typeof topic.articleCount === "number"
                    ? topic.articleCount.toLocaleString()
                    : "-"}
                </span>
              </div>
            </TopicTooltip>
          );
        })}
      </div>
    </div>
  );
}

function RankCard({
  topic,
  rank,
  timeRange,
}: {
  topic: Topic;
  rank: 1 | 2 | 3;
  timeRange: TimeRange;
}) {
  const { t } = useTranslation();

  const medalColor =
    rank === 1
      ? "text-yellow-400"
      : rank === 2
      ? "text-slate-400"
      : "text-amber-700";

  const highlight =
    rank === 1 ? "ring-2 ring-yellow-200 bg-yellow-50/70" : "bg-white/80";

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
        tabIndex={0}
        aria-label={t(
          "insights.trends.trendingTopicsTable.podiumCard",
          { rank, keyword: topic.keyword }
        )}
      >
        <div className="relative mb-2">
          <Medal className={`w-6 h-6 ${medalColor}`} aria-hidden="true" />

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
          {typeof topic.articleCount === "number"
            ? topic.articleCount.toLocaleString()
            : "-"}
        </span>
      </div>
    </TopicTooltip>
  );
}
