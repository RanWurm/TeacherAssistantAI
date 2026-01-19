// backend/src/schemas.ts
export interface Source {
  source_id: number;
  name: string;
  type: string | null;
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
  source_id: number | null;
}

export interface Author {
  author_id: number;
  name: string;
}

export interface Institution {
  institution_id: number;
  openalex_institution_id: string;
  name: string;
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

export interface ArticleAuthorInstitution {
  article_id: number;
  author_id: number;
  institution_id: number;
}

export interface ArticleSubject {
  article_id: number;
  subject_id: number;
}

export interface ArticleKeyword {
  article_id: number;
  keyword_id: number;
}