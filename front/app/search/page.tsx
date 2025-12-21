'use client';

import { useMemo, useState, useEffect  } from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/variables.css';
import { SearchHeader } from './components/search-header';
import { FiltersSidebar } from './components/filters-sidebar';
import { ResultsHeader } from './components/results-header';
import { ResultsList } from './components/results-list';
import { Paper } from './data/mock';
import { useArticlesSearch } from '@/hooks/useArticlesSearch';

const INITIAL_YEAR_RANGE = { min: 2015, max: 2024 };
type SortOption = 'citations' | 'year' | 'impact';


function mapArticleToPaper(article: any): Paper {
  return {
    id: String(article.article_id),          // ✅ key יציב
    title: article.title,
    authors: article.authors ?? [],          // זמני
    affiliations: [],
    year: article.year ?? 0,
    citations: article.citation_count ?? 0,
    doi: article.doi ?? '',
    topics: article.subjects ?? [],
    keywords: article.keywords ?? [],
    journal: article.journal_name ?? undefined,
    publisher: article.publisher ?? undefined,
    impactFactor: article.impact_factor ?? undefined,
    language: article.language ?? 'English',
    type: article.type ?? 'Journal Article',
  };
}

export default function SearchPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [selectedJournal, setSelectedJournal] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [yearRange, setYearRange] = useState(INITIAL_YEAR_RANGE);
  const [minCitations, setMinCitations] = useState(0);
  const [minImpact, setMinImpact] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('citations');

  /* ======================
     API
  ====================== */
  const { data, loading, search } = useArticlesSearch();
  const [appliedFilters, setAppliedFilters] = useState<any>(null);

  /* ======================
     Build API filters
  ====================== */
  const apiFilters = useMemo(() => ({
    subject: selectedTopics[0],
    author: selectedAuthors[0],
    type: selectedType !== 'all' ? selectedType : undefined,
    language: selectedLanguage !== 'all' ? selectedLanguage : undefined,
    fromYear: yearRange.min,
    toYear: yearRange.max,
    minCitations,
    minImpact,
  }), [
    selectedTopics,
    selectedAuthors,
    selectedType,
    selectedLanguage,
    yearRange,
    minCitations,
    minImpact,
  ]);

  /* ======================
     Apply Filters
  ====================== */
  const onApplyFilters = () => {
    setAppliedFilters(apiFilters);
  };

  // Initial load – run once on mount
  useEffect(() => {
    search(apiFilters);
    setAppliedFilters(apiFilters); // שומר סנכרון עם Apply
  }, []);

  /* ======================
     Trigger API search
  ====================== */
  useEffect(() => {
    if (!appliedFilters) return;
    search(appliedFilters);
  }, [appliedFilters]);

  /* ======================
     Map API → UI
  ====================== */
  const papers = useMemo(
    () => data.map(mapArticleToPaper),
    [data]
  );
  
  const filterProps = {
    selectedTopics,
    setSelectedTopics,
    selectedAuthors,
    setSelectedAuthors,
    selectedJournal,
    setSelectedJournal,
    selectedType,
    setSelectedType,
    yearRange,
    setYearRange,
    minCitations,
    setMinCitations,
    minImpact,
    setMinImpact,
    selectedLanguage,
    setSelectedLanguage,
  };

  // Fix to screen: force the entire app to fill the screen vertically and allow main layout to scroll as needed.
  return (
    <div className="flex flex-col ">
      {/* Header */}
      <SearchHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Layout container; flex to allow sidebar+main scroll */}
      <div className="flex-1 flex flex-col md:flex-row md:gap-10 gap-6 max-w-7xl w-full mx-auto px-4 md:px-6 py-6 overflow-hidden min-h-0">
        {/* Filters Sidebar */}
        <aside
          className="
            md:w-72 w-full
            md:sticky md:top-8
            bg-(--surface)
            border border-(--border-color)
            rounded-2xl p-4
            shadow-md md:self-start self-auto
            mb-4 md:mb-0
            h-full
          "
          tabIndex={-1}
        >
        <FiltersSidebar
          {...filterProps}
          onApplyFilters={onApplyFilters}
        />
        </aside>

        {/* Main content fills remaining height and scrolls as needed */}
        <main
          className="
            flex-1
            bg-(--surface)
            border border-(--border-color)
            rounded-2xl p-4 shadow-lg
            overflow-hidden
            flex flex-col
            relative
            min-h-[60vh]
            max-h-full
          "
          style={{ minHeight: 0, display: 'flex', flexDirection: 'column' }}
        >
          {/* Header & sort sticky on desktop for recall */}
          <div className="flex flex-col gap-4 sticky top-0 z-10 bg-(--surface) pb-2 md:-mx-4 md:px-4">
            <ResultsHeader
              count={papers.length}
              sortBy={sortBy}
              setSortBy={(v: string) => {
                if (v === 'citations' || v === 'year' || v === 'impact') setSortBy(v);
              }}
            />
          </div>

          <div className="flex-1 min-h-0 overflow-auto">
            <ResultsList papers={papers} />
          </div>
        </main>
      </div>
    </div>
  );
}

