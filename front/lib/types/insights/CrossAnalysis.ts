/* =========================
   Cross Analysis
========================= */

export interface SubjectJournalHeatmapCell {
    subject: string;
    journal: string;
    articleCount: number;
  }
  
  export interface LanguageImpact {
    language: string | null;
    articleCount: number;
    avgCitations: number | null;
  }
  
  export interface MultidisciplinaryVsSingle {
    type: 'single' | 'multi';
    articles: number;
    avgCitations: number;
    totalCitations: number;
    authors: number;
    journals: number;
  }
  
  export interface CrossInsights {
    subjectJournalHeatmap: SubjectJournalHeatmapCell[];
    languageImpact: LanguageImpact[];
    multidisciplinaryVsSingle: MultidisciplinaryVsSingle | null;
  }
  