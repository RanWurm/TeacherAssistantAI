'use client';

import { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/variables.css';

import { SearchHeader } from './components/search-header';
import { FiltersSidebar } from './components/filters-sidebar';
import { ResultsHeader } from './components/results-header';
import { ResultsList } from './components/results-list';
import { useArticlesSearch } from '@/hooks/useArticlesSearch';

export interface Paper {
  article_id: number;
  openalex_id: string;
  title: string;
  year: number;
  language: string;
  type: string;
  citation_count: number;
  article_url?: string | null;
  journal?: string | null;
  publisher?: string | null;
  impact_factor?: number | null;
  authors?: string | null;
  subjects?: string | null;
  keywords?: string | null;
}

const INITIAL_YEAR_RANGE = { min: 2015, max: 2024 };
type SortOption = 'citations' | 'year' | 'impact';

export default function SearchPage() {
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [yearRange, setYearRange] = useState(INITIAL_YEAR_RANGE);
  const [sortBy, setSortBy] = useState<SortOption>('citations');

  const { data, loading, search } = useArticlesSearch();
  const [appliedFilters, setAppliedFilters] = useState<any>(null);
  const [guidedQuery, setGuidedQuery] = useState('');

  const apiFilters = useMemo(
    () => ({
      subjects: selectedTopics.length ? selectedTopics : undefined,
      authors: selectedAuthors.length ? selectedAuthors : undefined,
      keywords: searchQuery.length ? searchQuery : undefined,
      type: selectedType !== 'all' ? selectedType : undefined,
      language: selectedLanguage !== 'all' ? selectedLanguage : undefined,
      fromYear: yearRange.min,
      toYear: yearRange.max,
      sortBy: sortBy === 'citations' || sortBy === 'year' ? sortBy : 'year',
    }),
    [
      selectedTopics,
      selectedAuthors,
      searchQuery,
      selectedType,
      selectedLanguage,
      yearRange,
      sortBy,
    ]
  );

  const onApplyFilters = () => {
    setAppliedFilters(apiFilters);
  };

  useEffect(() => {
    search(apiFilters);
    setAppliedFilters(apiFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!appliedFilters) return;
    search(appliedFilters);
  }, [appliedFilters]);

  useEffect(() => {
    if (!appliedFilters) return;

    setAppliedFilters({
      ...appliedFilters,
      sortBy: sortBy === 'citations' || sortBy === 'year' ? sortBy : 'year',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  const papers: Paper[] = useMemo(
    () => data as unknown as Paper[],
    [data]
  );

  const shouldShowEmptyState = !loading && papers.length === 0;

  return (
    <div className="flex flex-col">
      <SearchHeader />

      <div className="flex-1 flex flex-col md:flex-row md:gap-10 gap-6 max-w-7xl w-full mx-auto px-4 md:px-6 py-6 overflow-hidden min-h-0">
        <aside
          className={`
            md:w-72 w-full
            md:sticky md:top-8
            bg-(--surface)
            border border-(--border-color)
            rounded-2xl p-4
            shadow-md
            h-fit
            relative
            ${loading ? 'pointer-events-none opacity-60' : ''}
          `}
        >
          <FiltersSidebar
            loading={loading}
            guidedQuery={guidedQuery}
            subject={selectedTopics}
            setSubject={setSelectedTopics}
            author={selectedAuthors}
            setAuthor={setSelectedAuthors}
            keyword={searchQuery}
            setKeyword={setSearchQuery}
            type={selectedType}
            setType={setSelectedType}
            language={selectedLanguage}
            setLanguage={setSelectedLanguage}
            yearRange={{
              from: yearRange.min,
              to: yearRange.max,
            }}
            setYearRange={v =>
              setYearRange({
                min: typeof v.from === 'number' ? v.from : yearRange.min,
                max: typeof v.to === 'number' ? v.to : yearRange.max,
              })
            }
            onApplyFilters={onApplyFilters}
          />
        </aside>

        <main
          className="
            flex-1
            bg-(--surface)
            border border-(--border-color)
            rounded-2xl p-4 shadow-lg
            flex flex-col
            min-h-[60vh]
            overflow-hidden
          "
        >
          <div className="sticky top-0 z-10 bg-(--surface) pb-2">
            <ResultsHeader
              count={papers.length}
              sortBy={sortBy}
              setSortBy={(v: string) => {
                if (v === 'citations' || v === 'year' || v === 'impact') {
                  setSortBy(v);
                }
              }}
            />
          </div>

          <div className="flex-1 overflow-auto">
            {shouldShowEmptyState ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center py-16 text-(--text-secondary)">
                <h2 className="text-2xl font-semibold mb-2">
                  {t('search.empty.title', 'No papers found')}
                </h2>
                <p className="text-base">
                  {t(
                    'search.empty.subtitle',
                    'Try relaxing your filters or searching for another topic.'
                  )}
                </p>
              </div>
            ) : (
              <ResultsList papers={papers} loading={loading} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
