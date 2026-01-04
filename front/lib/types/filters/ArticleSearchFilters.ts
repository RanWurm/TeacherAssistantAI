export interface ArticleSearchFilters {
  query?: string;
  authors?: string[];
  subjects?: string[];
  keywords?: string[];

  language?: string;
  type?: string;
  fromYear?: number;
  toYear?: number;

  limit?: number;
  offset?: number;

  sortBy?: 'citations' | 'year';
}
