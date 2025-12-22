export interface ArticleSearchFilters {
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
