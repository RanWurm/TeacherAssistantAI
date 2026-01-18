'use client';

import React, { useMemo } from 'react';
import { Filter } from 'lucide-react';
import { AsyncMultiSelect } from './AsyncMultiSelect';
import { fetchSubjects, fetchAuthors, fetchKeywords } from "@/lib/api/filters.api";
import { useTranslation } from "react-i18next";

interface FiltersSidebarProps {
  loading: boolean;

  guidedQuery: string;

  subject: string[];
  setSubject: (v: string[]) => void;

  author: string[];
  setAuthor: (v: string[]) => void;

  keyword: string[];
  setKeyword: (v: string[]) => void;

  type: string;
  setType: (v: string) => void;

  language: string;
  setLanguage: (v: string) => void;

  yearRange: { from?: number; to?: number };
  setYearRange: (v: { from?: number; to?: number }) => void;

  onApplyFilters: () => void;
}

const HEADER_CLASS =
  'text-xs font-semibold uppercase tracking-wider text-(--text-secondary)';

export function FiltersSidebar({
  loading,
  guidedQuery,

  subject,
  setSubject,
  author,
  setAuthor,
  keyword,
  setKeyword,

  type,
  setType,
  language,
  setLanguage,
  yearRange,
  setYearRange,
  onApplyFilters,
}: FiltersSidebarProps) {
  const { t } = useTranslation();

  const tokens = useMemo(
    () =>
      guidedQuery
        .split(/\s+/)
        .map(token => token.trim())
        .filter(Boolean),
    [guidedQuery]
  );

  function addToken(
    token: string,
    list: string[],
    setter: (v: string[]) => void
  ) {
    if (!list.includes(token)) {
      setter([...list, token]);
    }
  }

  return (
    <aside className="w-full space-y-6">
      <header className="flex items-center gap-2 px-2">
        <Filter className="w-5 h-5 text-(--primary-700)" />
        <span className="font-bold text-lg text-(--text-primary)">
          {t('search.filters.title')}
        </span>
      </header>

      {tokens.length > 0 && (
        <section>
          <h3 className={HEADER_CLASS}>{t('search.filters.suggested')}</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {tokens.map(token => (
              <div
                key={token}
                className="flex items-center gap-1 text-xs border rounded-full px-3 py-1 bg-(--surface-alt)"
              >
                <span>{token}</span>
                <button
                  type="button"
                  onClick={() => addToken(token, subject, setSubject)}
                  className="text-(--primary-600)"
                >
                  {t('search.filters.subject')}
                </button>
                <button
                  type="button"
                  onClick={() => addToken(token, author, setAuthor)}
                  className="text-(--primary-600)"
                >
                  {t('search.filters.author')}
                </button>
                <button
                  type="button"
                  onClick={() => addToken(token, keyword, setKeyword)}
                  className="text-(--primary-600)"
                >
                  {t('search.filters.keyword')}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <AsyncMultiSelect
        label={t('search.filters.subject')}
        value={subject}
        onChange={setSubject}
        fetcher={fetchSubjects}
      />
      <AsyncMultiSelect
        label={t('search.filters.author')}
        value={author}
        onChange={setAuthor}
        fetcher={fetchAuthors}
      />
      <AsyncMultiSelect
        label={t('search.filters.keyword')}
        value={keyword}
        onChange={setKeyword}
        fetcher={fetchKeywords}
      />

      <section>
        <h3 className={HEADER_CLASS}>{t('search.filters.type')}</h3>
        <select
          disabled={loading}
          value={type}
          onChange={e => setType(e.target.value)}
          className="w-full border rounded-lg py-1.5 px-2 text-sm bg-(--surface-alt)"
        >
          <option value="all">{t('search.filters.all')}</option>
          <option value="article">{t('search.filters.type.article')}</option>
          <option value="review">{t('search.filters.type.review')}</option>
          <option value="conference-paper">{t('search.filters.type.conferencePaper')}</option>
        </select>
      </section>

      <section>
        <h3 className={HEADER_CLASS}>{t('search.filters.language')}</h3>
        <select
          disabled={loading}
          value={language}
          onChange={e => setLanguage(e.target.value)}
          className="w-full border rounded-lg py-1.5 px-2 text-sm bg-(--surface-alt)"
        >
          <option value="all">{t('search.filters.all')}</option>
          <option value="en">{t('search.filters.language.en')}</option>
          <option value="he">{t('search.filters.language.he')}</option>
          <option value="fr">{t('search.filters.language.fr')}</option>
          <option value="de">{t('search.filters.language.de')}</option>
        </select>
      </section>

      <section>
        <h3 className={HEADER_CLASS}>{t('search.filters.yearRange')}</h3>
        <div className="flex gap-2">
          <input
            disabled={loading}
            type="number"
            placeholder={t('search.filters.yearFrom')}
            value={yearRange.from ?? ''}
            onChange={e =>
              setYearRange({
                ...yearRange,
                from: e.target.value ? +e.target.value : undefined,
              })
            }
            className="w-1/2 border rounded-lg py-1.5 px-2 text-sm bg-(--surface-alt)"
          />
          <input
            disabled={loading}
            type="number"
            placeholder={t('search.filters.yearTo')}
            value={yearRange.to ?? ''}
            onChange={e =>
              setYearRange({
                ...yearRange,
                to: e.target.value ? +e.target.value : undefined,
              })
            }
            className="w-1/2 border rounded-lg py-1.5 px-2 text-sm bg-(--surface-alt)"
          />
        </div>
      </section>

      <button
        type="button"
        disabled={loading}
        onClick={onApplyFilters}
        className="w-full bg-(--primary-600) hover:bg-(--primary-700)
                   disabled:opacity-60
                   text-white rounded-lg py-2 px-4 font-semibold text-sm"
      >
        {t('search.filters.apply')}
      </button>
    </aside>
  );
}
