/* =========================
   Journals
========================= */

export interface JournalStats {
  journal_id: number;
  name: string;
  publisher: string | null;

  articleCount: number;
  authorCount: number;
  subjectCount: number;

  totalCitations: number;
  impactScore: number;
}

export interface SubjectImpactPoint {
  journal_id: number;
  journalName: string;
  subjectCount: number;
  impactScore: number;
  articleCount: number;
}

export interface JournalsInsights {
  topJournals: JournalStats[];
  subjectImpact: SubjectImpactPoint[];
}

