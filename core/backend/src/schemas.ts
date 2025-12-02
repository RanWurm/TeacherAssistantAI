// backend/src/schemas.ts
export interface Journal {
  journal_id: number;
  name: string;
  impact_factor: number | null;
  publisher: string | null;
}

export interface Article {
  article_id: number;
  title: string;
  year: number | null;
  language: string | null;
  type: string | null;
  citation_count: number | null;
  journal_id: number | null;
}

export interface Author {
  author_id: number;
  name: string;
  affiliation: string | null;
}

export interface Subject {
  subject_id: number;
  subject_name: string;
}

export interface Keyword {
  keyword_id: number;
  keyword: string;
}

export interface ArticleAuthor {
  article_id: number;
  author_id: number;
}

export interface ArticleSubject {
  article_id: number;
  subject_id: number;
}

export interface ArticleKeyword {
  article_id: number;
  keyword_id: number;
}
