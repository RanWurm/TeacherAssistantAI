/* =========================
   Researchers
========================= */

export interface ResearcherStats {
  author_id: number;
  name: string;
  institutions?: string[];
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