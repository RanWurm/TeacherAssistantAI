'use client';

import { useCallback, useState } from 'react';
import { searchArticles } from '@/lib/api/articles.api';
import type { Article } from '@/lib/types/article';
import type { ArticleSearchFilters } from '@/lib/types/filters/ArticleSearchFilters';

/**
 * Splits a CSV value into a trimmed string array, handling edge cases like quotes and whitespace.
 */
export function splitCSV(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map(v => String(v).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    // Handle quoted CSV cells, e.g. 'foo,"bar, baz",buzz'
    // This is a basic implementation and may not handle all edge cases.
    const result: string[] = [];
    let str = value;
    let curr = '';
    let inQuotes = false;

    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      if (char === '"') {
        // If two quotes in a row, treat as literal quote
        if (inQuotes && str[i + 1] === '"') {
          curr += '"';
          i++;
          continue;
        }
        inQuotes = !inQuotes;
        continue;
      }
      if (char === ',' && !inQuotes) {
        if (curr.trim()) result.push(curr.trim());
        curr = '';
        continue;
      }
      curr += char;
    }
    if (curr.trim()) result.push(curr.trim());
    return result;
  }
  return [];
}

const PAGE_SIZE = 6;

export function useArticlesSearch() {
  const [data, setData] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const search = useCallback(
    async (filters: ArticleSearchFilters, pageOverride?: number) => {
      const pageToUse = pageOverride ?? page;
  
      setLoading(true);
      try {
        const res = await searchArticles({
          ...filters,
          page: pageToUse,
          pageSize: PAGE_SIZE,
        });
  
        setData(res.data);
        setTotal(res.total);
      } finally {
        setLoading(false);
      }
    },
    [page]
  );
  

  return {
    data,
    total,
    page,
    loading,
    search,
    setPage,
  };
}
