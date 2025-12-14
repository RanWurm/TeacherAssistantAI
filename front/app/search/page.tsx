'use client';

import { useMemo, useState, useCallback } from 'react';
import '../../styles/variables.css';
import { SearchHeader } from './components/search-header';
import { FiltersSidebar } from './components/filters-sidebar';
import { ResultsHeader } from './components/results-header';
import { ResultsList } from './components/results-list';
import { MOCK_PAPERS } from './data/mock';

const INITIAL_YEAR_RANGE = { min: 2015, max: 2024 };
type SortOption = 'citations' | 'year' | 'impact';

export default function SearchPage() {
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

  const filterBySearch = useCallback(
    (p: any) => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.authors.some((a: string) => a.toLowerCase().includes(q)) ||
        p.keywords.some((k: string) => k.toLowerCase().includes(q))
      );
    },
    [searchQuery]
  );
  const filterByTopics = useCallback(
    (p: any) => selectedTopics.length === 0 || selectedTopics.every((t) => p.topics.includes(t)),
    [selectedTopics]
  );
  const filterByAuthors = useCallback(
    (p: any) => selectedAuthors.length === 0 || selectedAuthors.some((a) => p.authors.includes(a)),
    [selectedAuthors]
  );
  const filterByJournal = useCallback(
    (p: any) => selectedJournal === 'all' || p.journal === selectedJournal,
    [selectedJournal]
  );
  const filterByType = useCallback(
    (p: any) => selectedType === 'all' || p.type === selectedType,
    [selectedType]
  );
  const filterByYear = useCallback(
    (p: any) => p.year >= yearRange.min && p.year <= yearRange.max,
    [yearRange]
  );
  const filterByCitations = useCallback(
    (p: any) => p.citations >= minCitations,
    [minCitations]
  );
  const filterByImpact = useCallback(
    (p: any) => (p.impactFactor ?? 0) >= minImpact,
    [minImpact]
  );
  const filterByLanguage = useCallback(
    (p: any) => selectedLanguage === 'all' || p.language === selectedLanguage,
    [selectedLanguage]
  );
  const sortPapers = useCallback(
    (a: any, b: any) => {
      if (sortBy === 'citations') return b.citations - a.citations;
      if (sortBy === 'year') return b.year - a.year;
      if (sortBy === 'impact') return (b.impactFactor ?? 0) - (a.impactFactor ?? 0);
      return 0;
    },
    [sortBy]
  );

  const papers = useMemo(() => {
    return MOCK_PAPERS
      .filter(filterBySearch)
      .filter(filterByTopics)
      .filter(filterByAuthors)
      .filter(filterByJournal)
      .filter(filterByType)
      .filter(filterByYear)
      .filter(filterByCitations)
      .filter(filterByImpact)
      .filter(filterByLanguage)
      .sort(sortPapers);
  }, [
    filterBySearch,
    filterByTopics,
    filterByAuthors,
    filterByJournal,
    filterByType,
    filterByYear,
    filterByCitations,
    filterByImpact,
    filterByLanguage,
    sortPapers,
  ]);

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
            bg-[color:var(--surface)]
            border border-[color:var(--border-color)]
            rounded-2xl p-4
            shadow-md md:self-start self-auto
            mb-4 md:mb-0
            h-full
          "
          tabIndex={-1}
        >
          <FiltersSidebar {...filterProps} />
        </aside>

        {/* Main content fills remaining height and scrolls as needed */}
        <main
          className="
            flex-1
            bg-[color:var(--surface)]
            border border-[color:var(--border-color)]
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
          <div className="flex flex-col gap-4 sticky top-0 z-10 bg-[color:var(--surface)] pb-2 md:-mx-4 md:px-4">
            <ResultsHeader
              count={papers.length}
              sortBy={sortBy}
              setSortBy={(v: string) => {
                if (v === 'citations' || v === 'year' || v === 'impact') setSortBy(v);
              }}
            />
          </div>

          <div className="flex-1 min-h-0 overflow-auto">
            {papers.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center text-[color:var(--text-secondary)]">
                <span className="text-xl font-semibold mb-2">No papers found</span>
                <span className="text-sm">Try relaxing your filters or searching for another topic.</span>
              </div>
            ) : (
              <ResultsList papers={papers} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
