/* =========================
   Cross Analysis
========================= */

export interface SubjectSourceHeatmapCell {
    subject: string;
    source: string;
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
    sources: number;
  }
  
  export interface CrossInsights {
    subjectSourceHeatmap: SubjectSourceHeatmapCell[];
    languageImpact: LanguageImpact[];
    multidisciplinaryVsSingle: MultidisciplinaryVsSingle | null;
  }
  