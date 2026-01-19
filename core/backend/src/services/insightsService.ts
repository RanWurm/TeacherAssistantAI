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
  buildTopResearchersCandidatesQuery,
  buildTopResearchersDetailsQuery,
  buildMultidisciplinaryResearchersCandidatesQuery,
  buildMultidisciplinaryResearchersDetailsQuery
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

  // 1. Get trending topics (top N keywords)
  const trendingQ = buildTrendingTopicsQuery(fromYear, 5);
  const trendingTopics = await query<any>(trendingQ.sql, trendingQ.params);
  const topKeywords = trendingTopics.map(t => t.keyword);

  // 2. Get their keyword growth (yearly article counts per keyword)
  let keywordGrowth: any[] = [];
  if (topKeywords.length) {
    const growthQ = buildKeywordGrowthQuery(topKeywords, fromYear);
    if (growthQ.sql) {
      keywordGrowth = await query<any>(growthQ.sql, growthQ.params);
    }
  }

  // 3. Get their cross-domain stats (count of unique subjects for each keyword)
  let keywordCrossDomain: any[] = [];
  if (topKeywords.length) {
    // Use buildKeywordCrossDomainQuery directly (from file_context_1)
    const crossDomainQ = buildKeywordCrossDomainQuery(topKeywords, fromYear, 2); // at least 2 subjects
    if (crossDomainQ.sql) {
      const resultRows = await query<any>(crossDomainQ.sql, crossDomainQ.params);
      keywordCrossDomain = resultRows.map(row => ({
        keyword: row.keyword,
        subjectCount: Number(row.subjectCount),
        articleCount: Number(row.articleCount),
        subjects:
          typeof row.subjects === 'string' && row.subjects.length > 0
            ? row.subjects.split('||')
            : [],
      }));
    }
  }

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

  // Step 1: Top researchers (by citations)
  // Get candidate top researcher IDs
  const candidatesQuery = buildTopResearchersCandidatesQuery(fromYear, 5);
  const candidateRows = await query<any>(candidatesQuery.sql, candidatesQuery.params);
  const candidateIds = candidateRows.map((row: any) => Number(row.author_id));

  // Now get full stats for these top researchers
  const topQ = buildTopResearchersDetailsQuery(candidateIds, fromYear);
  const topResearchersRaw = topQ.sql ? (await query<any>(topQ.sql, topQ.params)) : [];

  // Step 2: Multidisciplinary researchers (multiple subjects)
  // Get candidate multidisciplinary researcher IDs
  const multiCandidatesQuery = buildMultidisciplinaryResearchersCandidatesQuery(fromYear, 3, 5);
  const multiCandidateRows = await query<any>(multiCandidatesQuery.sql, multiCandidatesQuery.params);
  const multiCandidateIds = multiCandidateRows.map((row: any) => Number(row.author_id));

  // Now get full stats for multidisciplinary researchers
  const multiQ = buildMultidisciplinaryResearchersDetailsQuery(multiCandidateIds, fromYear);
  const multidisciplinaryResearchersRaw = multiQ.sql ? (await query<any>(multiQ.sql, multiQ.params)) : [];

  // Format "top researchers"
  const topResearchers = topResearchersRaw.map(r => ({
    author_id: Number(r.author_id),
    name: r.name,
    articleCount: Number(r.articleCount ?? 0),
    totalCitations: Number(r.totalCitations ?? 0),
    avgCitationsPerArticle:
      r.avgCitationsPerArticle === null || r.avgCitationsPerArticle === undefined
        ? null
        : Number(r.avgCitationsPerArticle),
    uniqueJournals: Number(r.uniqueJournals ?? 0),
    uniqueSubjects: Number(r.uniqueSubjects ?? 0),
    mostCitedArticleCitations:
      typeof r.mostCitedArticleCitations === 'number'
        ? r.mostCitedArticleCitations
        : Number(r.mostCitedArticleCitations ?? 0),
    firstPublicationYear:
      r.firstPublicationYear ? Number(r.firstPublicationYear) : null,
    lastPublicationYear:
      r.lastPublicationYear ? Number(r.lastPublicationYear) : null,
  }));

  // Format "multidisciplinary researchers"
  const multidisciplinaryResearchers = multidisciplinaryResearchersRaw.map(r => ({
    author_id: Number(r.author_id),
    name: r.name,
    articleCount: Number(r.articleCount ?? 0),
    subjectCount: Number(r.subjectCount ?? 0),
    totalCitations: Number(r.totalCitations ?? 0),
    avgCitationsPerArticle:
      r.avgCitationsPerArticle === null || r.avgCitationsPerArticle === undefined
        ? null
        : Number(r.avgCitationsPerArticle),
    subjects:
      typeof r.subjects === "string" && r.subjects.length > 0
        ? r.subjects.split("||")
        : [],
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