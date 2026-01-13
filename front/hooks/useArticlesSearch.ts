// hooks/useArticlesSearch.ts
'use client';

import { useState } from 'react';
import { searchArticles } from '@/lib/api/articles.api';
import type { Article } from '@/lib/types/article';
import type { ArticleSearchFilters } from '@/lib/types/filters/ArticleSearchFilters';

/**
 * Splits a CSV string into an array of non-empty, trimmed strings.
 * Empty input, undefined, or non-string values return [].
 * Accepts both Paper["authors"] and similar group_concat-style fields.
 */
export function splitCSV(value: unknown): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.map(v => String(v).trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value.split(',').map(v => v.trim()).filter(Boolean);
  }

  return [];
}


export function useArticlesSearch() {
  const [data, setData] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  async function search(filters: ArticleSearchFilters) {
    setLoading(true);
    console.log('[useArticlesSearch] Search started. Filters:', filters);
    try {
      const res = await searchArticles(filters);
      console.log('[useArticlesSearch] Search result:', res);
      setData(res);
    } catch (error) {
      console.error('[useArticlesSearch] Search error:', error);
      throw error;
    } finally {
      setLoading(false);
      console.log('[useArticlesSearch] Search ended. Loading:', false);
    }
  }

  return { data, loading, search };
}
