/* =========================
   Journals
========================= */

export interface JournalStats {
    journal_id: number;
    name: string;
    articleCount: number;
    totalCitations: number;
    avgCitations: number | null;
  }
  
  export interface CitationVolatilityPoint {
    journal_id: number;
    year: number;
    avgCitations: number | null;
  }
  
  export interface JournalsInsights {
    topJournals: JournalStats[];
    citationVolatility: CitationVolatilityPoint[];
  }
  