/* =========================
   Sources
========================= */

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
  impactFactor: number;
  articleCount: number;
}

export interface SourcesInsights {
  topSources: SourceStats[];
  subjectImpact: SubjectImpactPoint[];
}