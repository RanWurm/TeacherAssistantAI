/* =========================
   Overview
========================= */

export interface OverviewMetrics {
    articles: number;
    authors: number;
    journals: number;
    subjects: number;
    keywords: number;
    avgCitations: number | null;
  }
  
  export interface PublicationsTimelinePoint {
    year: number;
    articleCount: number;
    authorCount: number;
    journalCount: number;
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
  