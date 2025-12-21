// src/types/ArticleSearchFilters.ts
export interface ArticleSearchFilters {
  subject?: string;
  author?: string;
  keyword?: string;
  language?: string;
  type?: string;
  fromYear?: number;
  toYear?: number;
  limit?: number;
  offset?: number;
}
