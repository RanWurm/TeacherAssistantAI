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
  
  export interface MostCommonSubjectCombination {
    subjects: string[];
    articleCount: number;
  }
  
  export interface MultidisciplinarySummary {
    singleSubjectArticles: number;
    multiSubjectArticles: number;
    avgSubjectsPerArticle: number | null;
    mostCommonSubjectCombination?: MostCommonSubjectCombination | null;
  }
  
  
  export interface OverviewInsights {
    metrics: OverviewMetrics | null;
    timeline: PublicationsTimelinePoint[];
    multidisciplinary: MultidisciplinarySummary | null;
  }
  