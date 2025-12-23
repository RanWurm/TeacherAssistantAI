// src/types/article.ts
export interface Article {
  article_id: number;
  title: string;
  year: number | null;
  citation_count: number | null;
  language: string | null;
  type: string | null;
  journal_id: number | null;
}
