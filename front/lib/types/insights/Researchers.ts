/* =========================
   Researchers
========================= */

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
  