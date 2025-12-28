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
    single: number;
    multi: number;
  }
  
  export interface CrossInsights {
    subjectJournalHeatmap: SubjectJournalHeatmapCell[];
    languageImpact: LanguageImpact[];
    multidisciplinaryVsSingle: MultidisciplinaryVsSingle | null;
  }
  