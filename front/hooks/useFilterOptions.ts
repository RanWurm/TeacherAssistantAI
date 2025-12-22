'use client';

import { useEffect, useState } from "react";

const PAGE_SIZE = 50;

export function useFilterOptions(
  query: string,
  fetcher: (q: string, limit: number, offset: number) => Promise<string[]>,
  enabled: boolean
) {
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // reset on query change
  useEffect(() => {
    setOptions([]);
    setOffset(0);
    setHasMore(true);
  }, [query]);

  useEffect(() => {
    if (!enabled || !hasMore) return;

    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetcher(query, PAGE_SIZE, offset);

        setOptions(prev =>
          offset === 0 ? res : [...prev, ...res]
        );

        if (res.length < PAGE_SIZE) {
          setHasMore(false);
        }
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(t);
  }, [query, offset, enabled, hasMore, fetcher]);

  return {
    options,
    loading,
    hasMore,
    loadMore: () => setOffset(o => o + PAGE_SIZE),
  };
}
