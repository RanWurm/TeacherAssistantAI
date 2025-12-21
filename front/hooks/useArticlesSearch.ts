'use client';

import { useState } from 'react';
import { searchArticles } from '@/lib/api/articles.api';
import type { Article } from '@/lib/types/article';
import type { ArticleSearchFilters } from '@/lib/types/filters/ArticleSearchFilters';

export function useArticlesSearch() {
  const [data, setData] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  async function search(filters: ArticleSearchFilters) {
    setLoading(true);
    try {
      const res = await searchArticles(filters);
      console.log('API response:', res);
      setData(res);
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, search };
}
