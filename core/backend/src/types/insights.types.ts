// backend/src/types/insights.types.ts

/* ---------- Overview ---------- */

export interface OverviewMetrics {
    articles: number;
    authors: number;
    journals: number;
    subjects: number;
    keywords: number;
    avgCitations: number;
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
    avgSubjectsPerArticle: number;
  }
  
  export interface OverviewInsights {
    metrics: OverviewMetrics | null;
    timeline: PublicationsTimelinePoint[];
    multidisciplinary: MultidisciplinarySummary | null;
  }
  
  /* ---------- Trends ---------- */
  
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
    articleCount: number;
    subjects: string[];
  }
  
  export interface TrendsInsights {
    trendingTopics: TrendingTopic[];
    keywordGrowth: KeywordGrowth[];
    keywordCrossDomain: KeywordCrossDomain[];
  }
  
  /* ---------- Researchers ---------- */
  
  export interface ResearcherStats {
    author_id: number;
    name: string;
    affiliation: string | null;
    articleCount: number;
    totalCitations: number;
    avgCitationsPerArticle: number | null;
    uniqueJournals: number;
    uniqueSubjects: number;
    mostCitedArticleCitations?: number;
    firstPublicationYear?: number;
    lastPublicationYear?: number;
  }
  
  export interface ResearchersInsights {
    topResearchers: ResearcherStats[];
    multidisciplinaryResearchers: ResearcherStats[];
  }  
  /* ---------- Journals ---------- */
  
  export interface JournalStats {
    journal_id: number;
    name: string;
    articleCount: number;
    totalCitations: number;
    avgCitations: number;
  }
  
  export interface CitationVolatilityPoint {
    journal_id: number;
    year: number;
    avgCitations: number;
  }
  
  export interface JournalsInsights {
    topJournals: JournalStats[];
    citationVolatility: CitationVolatilityPoint[];
  }
  
  /* ---------- Cross ---------- */
  
  export interface SubjectJournalHeatmapCell {
    subject: string;
    journal: string;
    articleCount: number;
  }
  
  export interface LanguageImpact {
    language: string;
    articleCount: number;
    avgCitations: number;
  }
  
  export interface MultidisciplinaryVsSingle {
    single: number;
    multi: number;
  }
  
  export interface CrossInsights {
    subjectJournalHeatmap: SubjectJournalHeatmapCell[];
    languageImpact: LanguageImpact[];
    multidisciplinaryVsSingle: MultidisciplinaryVsSingle | null;
  }
  