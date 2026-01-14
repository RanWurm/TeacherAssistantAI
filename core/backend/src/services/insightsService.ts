import { query } from "../db";
import {
  OverviewInsights,
  TrendsInsights,
  ResearchersInsights,
  SourcesInsights,
  CrossInsights,
  MultidisciplinaryVsSingle,
} from "../types/insights.types";

// ---- Overview queries ----
import {
  buildOverviewMetricsQuery,
  buildPublicationsTimelineQuery,
  buildMultidisciplinarySummaryQuery,
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

// ---- Sources queries ----
import {
  buildTopSourcesQuery,
  buildSubjectImpactQuery,
} from "../db/insights/sourcesQueries";

// ---- Cross queries ----
import {
  buildSubjectSourceHeatmapQuery,
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

  return {
    metrics: metrics || null,
    timeline,
    multidisciplinary
  };
}

/* =========================
   Trends
========================= */

export async function getTrendsInsights(
  timeRange: string
): Promise<TrendsInsights> {
  const fromYear = timeRangeToFromYear(timeRange);

  const trendingQ = buildTrendingTopicsQuery(fromYear, 5);
  const trendingTopics = await query<any>(trendingQ.sql, trendingQ.params);

  const topKeywords = trendingTopics.map(t => t.keyword);

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

  const topResearchersRaw = await query<any>(topQ.sql, topQ.params);
  const multidisciplinaryResearchersRaw = await query<any>(
    multiQ.sql,
    multiQ.params
  );

  const topResearchers = topResearchersRaw.map(r => ({
    ...r,
    institutions:
  typeof r.institutions === 'string'
    ? r.institutions.split('||')
    : Array.isArray(r.institutions)
      ? r.institutions
      : [],
  }));
  console.log("--------------------", multidisciplinaryResearchersRaw[0])
  const multidisciplinaryResearchers = multidisciplinaryResearchersRaw.map(r => ({
  
  author_id: Number(r.author_id),
  name: r.name,
  articleCount: Number(r.articleCount),
  totalCitations: Number(r.totalCitations),
  avgCitationsPerArticle: r.avgCitationsPerArticle === null ? null : Number(r.avgCitationsPerArticle),

  uniqueSources: Number(r.uniqueSources ?? 0),
  uniqueSubjects: Number(r.uniqueSubjects ?? 0),

  institutions: typeof r.institutions === "string" && r.institutions.length > 0 ? r.institutions.split("||") : [],
}));


  return {
    topResearchers,
    multidisciplinaryResearchers,
  };
}
/* =========================
   Sources
========================= */

export async function getSourcesInsights(
  timeRange: string
): Promise<SourcesInsights> {
  const fromYear = timeRangeToFromYear(timeRange);

  const topQ = buildTopSourcesQuery(fromYear);
  const volQ = buildSubjectImpactQuery(fromYear);

  const topSources = await query<any>(topQ.sql, topQ.params);
  const subjectImpact = await query<any>(volQ.sql, volQ.params);

  return {
    topSources,
    subjectImpact,
  };
}

/* =========================
   Cross
========================= */

export async function getCrossInsights(
  timeRange: string
): Promise<CrossInsights> {
  const fromYear = timeRangeToFromYear(timeRange);

  const heatmapQ = buildSubjectSourceHeatmapQuery(fromYear);
  const languageQ = buildLanguageImpactQuery(fromYear);
  const multiQ = buildMultidisciplinaryVsSingleQuery(fromYear);

  const subjectSourceHeatmap = await query<any>(
    heatmapQ.sql,
    heatmapQ.params
  );

  const languageImpact = await query<any>(
    languageQ.sql,
    languageQ.params
  );

  const multidisciplinaryVsSingleRaw = await query<any>(
    multiQ.sql,
    multiQ.params
  );

  const multidisciplinaryVsSingle: MultidisciplinaryVsSingle[] =
    multidisciplinaryVsSingleRaw.map((row) => ({
      type: row.type,
      articles: Number(row.articles),
      avgCitations: Number(row.avgCitations),
      totalCitations: Number(row.totalCitations),
      authors: Number(row.authors),
      sources: Number(row.sources),
    }));

  return {
    subjectSourceHeatmap,
    languageImpact,
    multidisciplinaryVsSingle,
  };
}