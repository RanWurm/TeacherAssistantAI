// backend/src/types/insights.types.ts

/* ---------- Overview ---------- */

export interface OverviewMetrics {
  articles: number;
  authors: number;
  sources: number;
  subjects: number;
  keywords: number;
  avgCitations: number;
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

export interface KeywordGrowthPoint {
  keyword: string;
  year: number;
  articleCount: number;
}

export interface KeywordCrossDomainStats {
  keyword: string;
  subjectCount: number;
  articleCount: number;
  subjects: string[];
}

export interface TrendsInsights {
  trendingTopics: TrendingTopic[];
  keywordGrowth: KeywordGrowthPoint[];
  keywordCrossDomain: KeywordCrossDomainStats[];
}


/* ---------- Researchers ---------- */

export interface TopResearcherStats {
  author_id: number;
  name: string;
  articleCount: number;
  totalCitations: number;
  avgCitationsPerArticle: number | null;
  uniqueJournals: number;
  uniqueSubjects: number;
  mostCitedArticleCitations: number;
  firstPublicationYear: number | null;
  lastPublicationYear: number | null;
}

export interface MultidisciplinaryResearcherStats {
  author_id: number;
  name: string;
  articleCount: number;
  subjectCount: number;
  totalCitations: number;
  avgCitationsPerArticle: number | null;
  subjects: string[];
}

export interface ResearchersInsights {
  topResearchers: TopResearcherStats[];
  multidisciplinaryResearchers: MultidisciplinaryResearcherStats[];
}

/* ---------- Sources ---------- */

export interface SourceStats {
  source_id: number;
  name: string;
  type: string | null;
  publisher: string | null;

  articleCount: number;
  authorCount: number;
  subjectCount: number;

  totalCitations: number;
}

export interface SubjectImpactPoint {
  source_id: number;
  sourceName: string;
  sourceType: string | null;
  subjectCount: number;
  articleCount: number;
}

export interface SourcesInsights {
  topSources: SourceStats[];
  subjectImpact: SubjectImpactPoint[];
}

/* ---------- Cross ---------- */

export interface SubjectSourceHeatmapCell {
  subject: string;
  source: string;
  articleCount: number;
}

export interface LanguageImpact {
  language: string;
  articleCount: number;
  avgCitations: number;
}

export interface MultidisciplinaryVsSingle {
  type: 'single' | 'multi';
  articles: number;
  avgCitations: number | null;
  totalCitations: number;
  authors: number;
  sources: number;
}

export interface CrossInsights {
  subjectSourceHeatmap: SubjectSourceHeatmapCell[];
  languageImpact: LanguageImpact[];
  multidisciplinaryVsSingle: MultidisciplinaryVsSingle[];
}