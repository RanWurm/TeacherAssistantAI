/* =========================
   Researchers
========================= */

export interface ResearcherStats {
    author_id: number;
    name: string;
    articleCount: number;
    totalCitations: number;
    avgCitations: number | null;
    journalCount: number;
    subjectCount: number;
  }
  
  export interface ResearchersInsights {
    topResearchers: ResearcherStats[];
    multidisciplinaryResearchers: ResearcherStats[];
  }
  