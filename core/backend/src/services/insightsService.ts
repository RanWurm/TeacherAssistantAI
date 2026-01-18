import { query } from "../db";
import {
  OverviewInsights,
  TrendsInsights,
  ResearchersInsights,
  JournalsInsights,
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
  buildTopResearchersDetailsQuery,
  buildTopResearchersCandidatesQuery,
  buildMultidisciplinaryResearchersDetailsQuery,
  buildMultidisciplinaryResearchersCandidatesQuery,
} from "../db/insights/researchersQueries";

// ---- Journals queries ----
import {
  buildTopJournalsQuery,
  buildSubjectImpactQuery,
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

  // Fetch trending topics
  const trendingQ = buildTrendingTopicsQuery(fromYear, 5);
  const trendingTopics = await query<any>(trendingQ.sql, trendingQ.params);

  const topKeywords = trendingTopics.map(t => t.keyword);

  // Growth only for trending topics
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

  // ----- Top Researchers -----
  const candidatesQ = buildTopResearchersCandidatesQuery(fromYear, 5);
  const candidates = await query<any>(candidatesQ.sql, candidatesQ.params);
  const authorIds = candidates.map((r) => r.author_id);

  const detailsQ = buildTopResearchersDetailsQuery(authorIds, fromYear);
  const topResearchers = detailsQ.sql
    ? await query<any>(detailsQ.sql, detailsQ.params)
    : [];

  // ----- Multidisciplinary Researchers -----
  const multiCandidatesQ =
    buildMultidisciplinaryResearchersCandidatesQuery(fromYear, 3, 5);

  const multiCandidates = await query<any>(
    multiCandidatesQ.sql,
    multiCandidatesQ.params
  );

  const multiIds = multiCandidates.map((r) => r.author_id);

  const multiDetailsQ =
    buildMultidisciplinaryResearchersDetailsQuery(multiIds, fromYear);

  const multidisciplinaryResearchersRaw = multiDetailsQ.sql
    ? await query<any>(multiDetailsQ.sql, multiDetailsQ.params)
    : [];

  const multidisciplinaryResearchers = multidisciplinaryResearchersRaw.map(
    (r) => ({
      author_id: r.author_id,
      name: r.name,
      affiliation: r.affiliation ?? null,
      articleCount: Number(r.articleCount),
      totalCitations: Number(r.totalCitations),
      avgCitationsPerArticle: Number(r.avgCitationsPerArticle),
      uniqueJournals: Number(r.uniqueJournals ?? 0),
      uniqueSubjects: Number(r.subjectCount ?? 0),
      mostCitedArticleCitations: r.mostCitedArticleCitations
        ? Number(r.mostCitedArticleCitations)
        : undefined,
      firstPublicationYear: r.firstPublicationYear
        ? Number(r.firstPublicationYear)
        : undefined,
      lastPublicationYear: r.lastPublicationYear
        ? Number(r.lastPublicationYear)
        : undefined,
      subjects:
        typeof r.subjects === "string" && r.subjects.length > 0
          ? r.subjects.split("||")
          : [],
    })
  );

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
  const volQ = buildSubjectImpactQuery(fromYear);

  const topJournals = await query<any>(topQ.sql, topQ.params);
  const subjectImpact = await query<any>(volQ.sql, volQ.params);

  return {
    topJournals,
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

  const heatmapQ = buildSubjectJournalHeatmapQuery(fromYear);
  const languageQ = buildLanguageImpactQuery(fromYear);
  const multiQ = buildMultidisciplinaryVsSingleQuery(fromYear);

  const subjectJournalHeatmap = await query<any>(
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
      journals: Number(row.journals),
    }));

  return {
    subjectJournalHeatmap,
    languageImpact,
    multidisciplinaryVsSingle,
  };
}
