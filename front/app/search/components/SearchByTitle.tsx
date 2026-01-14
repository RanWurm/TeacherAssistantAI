'use client';

import React, { useState, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useArticlesSearch } from '@/hooks/useArticlesSearch';
import { ResultsList } from './results-list';
import type { Paper } from '../page';

/**
 * "Search by Title" UI component using translations per he.json.
 */
export default function SearchByTitle() {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data, loading, search } = useArticlesSearch();

  async function handleSearch() {
    if (!title.trim()) {
      inputRef.current?.focus();
      return;
    }
    setSearched(true);
    await search({ query: title.trim() } as any);
  }

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  // Cast data to Paper[]
  const papers: Paper[] = useMemo(
    () => (data as unknown as Paper[]),
    [data]
  );

  // Helper to show correct result state (including "noResults" string)
  function renderResults() {
    if (!searched) {
      return (
        <div className="text-(--text-secondary) italic text-center py-12 w-full text-xl">
          {t('search.searchByTitle.prompt', 'Type a title and press Enter to search')}
        </div>
      );
    }
    if (!loading && searched && Array.isArray(papers) && papers.length === 0) {
      return (
        <div className="text-(--text-secondary) italic text-center py-12 w-full text-xl">
          {t('search.searchByTitle.noResults', 'No articles found with this title.')}
        </div>
      );
    }
    return (
      <div className="flex-1 overflow-auto w-full">
        <ResultsList papers={papers} loading={loading} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-2">
      <div className="w-full max-w-5xl flex flex-col items-center gap-10">
        <div className="flex items-center gap-6 w-full">
          <input
            ref={inputRef}
            className="bg-white border border-blue-500 px-6 py-3 rounded-2xl w-full focus:outline-none focus:ring-2 focus:ring-blue-300 text-xl"
            type="text"
            placeholder={t('search.searchByTitle.inputPlaceholder', 'הזן כותרת מאמר...')}
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={onInputKeyDown}
            autoFocus
            aria-label={t('search.searchByTitle.inputAriaLabel', 'חפש לפי כותרת המאמר')}
          />
          <button
            className="bg-(--primary-600) hover:bg-(--primary-700) text-white px-8 py-3 rounded-xl transition disabled:opacity-60 text-lg font-semibold"
            onClick={handleSearch}
            disabled={!title.trim() || loading}
            aria-label={t('search.searchByTitle.button', 'חיפוש')}
            style={{ minWidth: 110 }}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-6 w-6 text-white inline-block align-middle" viewBox="0 0 24 24">
                  <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-80" fill="currentColor"
                    d="M4 12a8 8 0 017.96-8V1.5a10.5 10.5 0 100 21V20a8 8 0 01-7.96-8z" />
                </svg>
                <span className="ml-2">{t('search.searchByTitle.loading', 'מחפש...')}</span>
              </>
            ) : (
              t('search.searchByTitle.button', 'חיפוש')
            )}
          </button>
        </div>
        {renderResults()}
      </div>
    </div>
  );
}
