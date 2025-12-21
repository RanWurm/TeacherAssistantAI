import { apiRequest } from './client';
import type { Article } from '../types/article';
import type { ArticleSearchFilters } from '../types/filters/ArticleSearchFilters';

export function searchArticles(filters: ArticleSearchFilters) {
  return apiRequest<Article[]>('/api/articles/search', 'POST', filters);
}
