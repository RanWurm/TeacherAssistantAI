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
  impactFactor: number | null;
}

export interface SubjectImpactPoint {
  journal_id: number;
  journalName: string;
  subjectCount: number;
  impactFactor: number;
  articleCount: number;
}

export interface JournalsInsights {
  topJournals: JournalStats[];
  subjectImpact: SubjectImpactPoint[];
}

