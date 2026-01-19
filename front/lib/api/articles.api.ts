import { apiRequest } from './client';
import type { Article } from '../types/article';
import type { ArticleSearchFilters } from '../types/filters/ArticleSearchFilters';

interface SearchArticlesResponse {
  data: Article[];
  total: number;
  page: number;
  pageSize: number;
}

export function searchArticles(
  filters: ArticleSearchFilters & {
    page?: number;
    pageSize?: number;
  }
) {
  return apiRequest<SearchArticlesResponse>('/api/articles/search', 'POST', filters);
}

export async function increaseViews(articleId: number): Promise<void> {
  try {
    await apiRequest<void>(`/api/articles/${articleId}/increment-view`, 'POST');
  } catch (err) {
  }
}
