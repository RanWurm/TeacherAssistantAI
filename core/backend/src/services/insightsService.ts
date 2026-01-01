import { query } from "../db";
import {
  OverviewInsights,
  TrendsInsights,
  ResearchersInsights,
  JournalsInsights,
  CrossInsights,
} from "../types/insights.types";

// ---- Overview queries ----
import {
  buildOverviewMetricsQuery,
  buildPublicationsTimelineQuery,
  buildMultidisciplinarySummaryQuery,
  buildMostCommonSubjectCombinationQuery
} from "../db/insights/overviewQueries";

// ---- Trends queries ----
import {
  buildTrendingTopicsQuery,
  buildKeywordGrowthQuery,
  buildKeywordCrossDomainQuery,
} from "../db/insights/trendsQueries";

// ---- Researchers queries ----
import {
  buildTopResearchersQuery,
  buildMultidisciplinaryResearchersQuery,
} from "../db/insights/researchersQueries";

// ---- Journals queries ----
import {
  buildTopJournalsQuery,
  buildCitationVolatilityQuery,
} from "../db/insights/journalsQueries";

// ---- Cross queries ----
import {
  buildSubjectJournalHeatmapQuery,
  buildLanguageImpactQuery,
  buildMultidisciplinaryVsSingleQuery,
} from "../db/insights/crossQueries";

/* =========================
   TimeRange → fromYear
========================= */

function timeRangeToFromYear(timeRange: string): number | undefined {
  const currentYear = new Date().getFullYear();

  switch (timeRange) {
    case "1y":
      return currentYear - 1;
    case "3y":
      return currentYear - 3;
    case "5y":
      return currentYear - 5;
    case "all":
      return undefined;
    default:
      throw new Error(`Invalid timeRange: ${timeRange}`);
  }
}

/* =========================
   Overview
========================= */

export async function getOverviewInsights(
  timeRange: string
): Promise<OverviewInsights> {
  const fromYear = timeRangeToFromYear(timeRange);

  const metricsQ = buildOverviewMetricsQuery(fromYear);
  const timelineQ = buildPublicationsTimelineQuery(fromYear);
  const multiQ = buildMultidisciplinarySummaryQuery(fromYear);

  const [metrics] = await query<any>(metricsQ.sql, metricsQ.params);
  const timeline = await query<any>(timelineQ.sql, timelineQ.params);
  const [multidisciplinary] = await query<any>(multiQ.sql, multiQ.params);

  const commonQ = buildMostCommonSubjectCombinationQuery(fromYear);
  const [common] = await query<any>(commonQ.sql, commonQ.params);
  
  return {
    metrics: metrics || null,
    timeline,
    multidisciplinary: {
      ...multidisciplinary,
      mostCommonSubjectCombination: common
        ? {
            subjects: common.subjects.split(","),
            articleCount: common.articleCount,
          }
        : null,
    },
  };
}

/* =========================
   Trends
========================= */

export async function getTrendsInsights(
  timeRange: string
): Promise<TrendsInsights> {
  const fromYear = timeRangeToFromYear(timeRange);

  // 1️⃣ מביאים Trending
  const trendingQ = buildTrendingTopicsQuery(fromYear, 5);
  const trendingTopics = await query<any>(trendingQ.sql, trendingQ.params);

  const topKeywords = trendingTopics.map(t => t.keyword);

  // 2️⃣ Growth רק עבורם
  const growthQ = buildKeywordGrowthQuery(topKeywords, fromYear);
  const keywordGrowth = growthQ.sql
    ? await query<any>(growthQ.sql, growthQ.params)
    : [];

    const crossQ = buildKeywordCrossDomainQuery(topKeywords, fromYear);

    const keywordCrossDomainRaw = crossQ.sql
      ? await query<any>(crossQ.sql, crossQ.params)
      : [];

    const keywordCrossDomain = keywordCrossDomainRaw.map(row => ({
      keyword: row.keyword,
      subjectCount: Number(row.subjectCount),
      articleCount: Number(row.articleCount),
      subjects:
      typeof row.subjects === 'string' && row.subjects.length > 0
        ? row.subjects.split('||')
        : [],
    }));

  return {
    trendingTopics,
    keywordGrowth,
    keywordCrossDomain,
  };
}

/* =========================
   Researchers
========================= */

export async function getResearchersInsights(
  timeRange: string
): Promise<ResearchersInsights> {
  const fromYear = timeRangeToFromYear(timeRange);

  const topQ = buildTopResearchersQuery(fromYear);
  const multiQ = buildMultidisciplinaryResearchersQuery(fromYear);

  const topResearchers = await query<any>(topQ.sql, topQ.params);
  const multidisciplinaryResearchersRaw = await query<any>(
    multiQ.sql,
    multiQ.params
  );

  // Adapter to the ResearcherStats type
  const multidisciplinaryResearchers = multidisciplinaryResearchersRaw.map(r => ({
    author_id: r.author_id,
    name: r.name,
    affiliation: r.affiliation ?? null,
    articleCount: r.articleCount,
    subjectCount: r.subjectCount,
    totalCitations: r.totalCitations,
    avgCitationsPerArticle: r.avgCitationsPerArticle,
    subjects:
      typeof r.subjects === 'string' && r.subjects.length > 0
        ? r.subjects.split('||')
        : [],
    // If these fields are missing in the SQL response, default to 0 or []
    uniqueJournals: Array.isArray(r.uniqueJournals)
      ? r.uniqueJournals
      : [],
    uniqueSubjects: Array.isArray(r.uniqueSubjects)
      ? r.uniqueSubjects
      : [],
  }));

  return {
    topResearchers,
    multidisciplinaryResearchers,
  };
}

/* =========================
   Journals
========================= */

export async function getJournalsInsights(
  timeRange: string
): Promise<JournalsInsights> {
  const fromYear = timeRangeToFromYear(timeRange);

  const topQ = buildTopJournalsQuery(fromYear);
  const volQ = buildCitationVolatilityQuery(fromYear);

  const topJournals = await query<any>(topQ.sql, topQ.params);
  const citationVolatility = await query<any>(volQ.sql, volQ.params);

  return {
    topJournals,
    citationVolatility,
  };
}

/* =========================
   Cross
========================= */

export async function getCrossInsights(
  timeRange: string
): Promise<CrossInsights> {
  const fromYear = timeRangeToFromYear(timeRange);

  const heatmapQ = buildSubjectJournalHeatmapQuery(fromYear);
  const languageQ = buildLanguageImpactQuery(fromYear);
  const multiQ = buildMultidisciplinaryVsSingleQuery(fromYear);

  const subjectJournalHeatmap = await query<any>(
    heatmapQ.sql,
    heatmapQ.params
  );
  const languageImpact = await query<any>(languageQ.sql, languageQ.params);
  const [multidisciplinaryVsSingle] = await query<any>(
    multiQ.sql,
    multiQ.params
  );

  return {
    subjectJournalHeatmap,
    languageImpact,
    multidisciplinaryVsSingle: multidisciplinaryVsSingle || null,
  };
}
