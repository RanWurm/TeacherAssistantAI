'use client';

import { useState } from 'react';
import '../../styles/variables.css';
import { SearchHeader } from './components/search-header';
import { FiltersSidebar } from './components/filters-sidebar';
import { ResultsHeader } from './components/results-header';
import { ResultsList } from './components/results-list';
import { Pagination } from './components/pagination';
import { MOCK_PAPERS, Paper } from './data/mock';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [papers, setPapers] = useState<Paper[]>(MOCK_PAPERS);
  const [showFilters, setShowFilters] = useState(true);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState({ min: 2020, max: 2024 });
  const [minCitations, setMinCitations] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('all');

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const clearFilters = () => {
    setSelectedTopics([]);
    setYearRange({ min: 2020, max: 2024 });
    setMinCitations(0);
    setSelectedLanguage('all');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-start)] via-[var(--bg-via)] to-[var(--bg-end)]">
      <SearchHeader
        showFilters={true}
        setShowFilters={() => {}}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-6">
          {showFilters && (
            <FiltersSidebar
              selectedTopics={selectedTopics}
              toggleTopic={toggleTopic}
              yearRange={yearRange}
              setYearRange={setYearRange}
              minCitations={minCitations}
              setMinCitations={setMinCitations}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              clearFilters={clearFilters}
            />
          )}
          <main className="flex-1">
            <ResultsHeader count={papers.length} selectedTopics={selectedTopics} toggleTopic={toggleTopic} />
            <ResultsList papers={papers} />
            <Pagination />
          </main>
        </div>
      </div>
    </div>
  );
}
