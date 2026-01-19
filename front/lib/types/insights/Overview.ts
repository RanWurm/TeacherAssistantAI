/* =========================
   Overview
========================= */

export interface OverviewMetrics {
  articles: number;
  authors: number;
  sources: number;
  subjects: number;
  keywords: number;
  avgCitations: number | null;
}

export interface PublicationsTimelinePoint {
  year: number;
  articleCount: number;
  authorCount: number;
  sourceCount: number;
}

export interface MultidisciplinarySummary {
  singleSubjectArticles: number;
  multiSubjectArticles: number;
  avgSubjectsPerArticle: number | null;
}

export interface OverviewInsights {
  metrics: OverviewMetrics | null;
  timeline: PublicationsTimelinePoint[];
  multidisciplinary: MultidisciplinarySummary | null;
}