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
  articleCount: number;
  totalCitations: number;
  avgCitationsPerArticle: number | null;
  uniqueSources: number;
  uniqueSubjects: number;
  mostCitedArticleCitations?: number;
  firstPublicationYear?: number;
  lastPublicationYear?: number;
}

export interface ResearchersInsights {
  topResearchers: ResearcherStats[];
  multidisciplinaryResearchers: ResearcherStats[];
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
  impactFactor: number | null;
}

export interface SubjectImpactPoint {
  source_id: number;
  sourceName: string;
  sourceType: string | null;
  subjectCount: number;
  impactFactor: number | null;
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