/* =========================
   Trends
========================= */

export interface TrendingTopic {
  keyword: string;
  articleCount: number;
  firstAppearanceYear: number | null;
  latestYear: number | null;
}
  
  export interface KeywordGrowth {
    keyword: string;
    year: number;
    articleCount: number;
  }
  
  export interface KeywordCrossDomain {
    keyword: string;
    subjectCount: number;
  }
  
  export interface TrendsInsights {
    trendingTopics: TrendingTopic[];
    keywordGrowth: KeywordGrowth[];
    keywordCrossDomain: KeywordCrossDomain[];
  }
  