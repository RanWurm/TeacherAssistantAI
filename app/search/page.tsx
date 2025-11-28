'use client';

import { useState } from 'react';
import { Search, Filter, X, ExternalLink, TrendingUp, Calendar, Users, BookOpen, ChevronDown, SlidersHorizontal } from 'lucide-react';

interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  citations: number;
  doi: string;
  topics: string[];
  journal?: string;
  language: string;
}

const MOCK_PAPERS: Paper[] = [
  {
    id: '1',
    title: 'Deep Learning Approaches for Natural Language Processing: A Comprehensive Survey',
    authors: ['Smith, J.', 'Johnson, M.', 'Williams, R.'],
    year: 2023,
    citations: 342,
    doi: '10.1234/example.2023.001',
    topics: ['Machine Learning', 'Natural Language Processing'],
    journal: 'Journal of AI Research',
    language: 'English',
  },
  {
    id: '2',
    title: 'Quantum Computing Applications in Cryptography',
    authors: ['Brown, A.', 'Davis, K.'],
    year: 2024,
    citations: 128,
    doi: '10.1234/example.2024.002',
    topics: ['Quantum Computing', 'Cryptography'],
    journal: 'Quantum Science Journal',
    language: 'English',
  },
  {
    id: '3',
    title: 'Climate Change Impact on Marine Ecosystems',
    authors: ['Garcia, L.', 'Martinez, C.', 'Rodriguez, P.', 'Lopez, M.'],
    year: 2023,
    citations: 567,
    doi: '10.1234/example.2023.003',
    topics: ['Climate Science', 'Marine Biology'],
    journal: 'Environmental Research Letters',
    language: 'English',
  },
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [papers, setPapers] = useState<Paper[]>(MOCK_PAPERS);
  const [showFilters, setShowFilters] = useState(true);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState({ min: 2020, max: 2024 });
  const [minCitations, setMinCitations] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('all');

  const allTopics = Array.from(new Set(MOCK_PAPERS.flatMap(p => p.topics)));
  const languages = ['all', 'English', 'Hebrew', 'Spanish', 'French'];

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-lg bg-white/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Academic Search</h1>
                <p className="text-xs text-slate-500">Explore millions of research papers</p>
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-sm font-medium text-slate-700"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, keywords, or topic..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm bg-white shadow-sm"
            />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="w-80 shrink-0">
              <div className="sticky top-24 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="p-5 border-b border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Filters
                    </h2>
                    {(selectedTopics.length > 0 || minCitations > 0 || selectedLanguage !== 'all') && (
                      <button
                        onClick={clearFilters}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">Refine your search results</p>
                </div>

                <div className="p-5 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {/* Topics Filter */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Topics</label>
                    <div className="space-y-2">
                      {allTopics.map((topic) => (
                        <label
                          key={topic}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedTopics.includes(topic)}
                            onChange={() => toggleTopic(topic)}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm text-slate-700">{topic}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Year Range */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Publication Year</label>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">From</label>
                        <input
                          type="number"
                          value={yearRange.min}
                          onChange={(e) => setYearRange({ ...yearRange, min: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">To</label>
                        <input
                          type="number"
                          value={yearRange.max}
                          onChange={(e) => setYearRange({ ...yearRange, max: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Minimum Citations */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Minimum Citations ({minCitations}+)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="50"
                      value={minCitations}
                      onChange={(e) => setMinCitations(parseInt(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>0</span>
                      <span>1000+</span>
                    </div>
                  </div>

                  {/* Language Filter */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Language</label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm bg-white"
                    >
                      {languages.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang === 'all' ? 'All Languages' : lang}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Results */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">
                    Found <span className="font-semibold text-slate-900">{papers.length.toLocaleString()}</span> papers
                  </p>
                  {selectedTopics.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedTopics.map((topic) => (
                        <span
                          key={topic}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium"
                        >
                          {topic}
                          <button onClick={() => toggleTopic(topic)}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <select className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Most Cited</option>
                  <option>Most Recent</option>
                  <option>Relevance</option>
                </select>
              </div>
            </div>

            {/* Papers List */}
            <div className="space-y-4">
              {papers.map((paper) => (
                <article
                  key={paper.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all p-6 group"
                >
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {paper.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-3">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4" />
                          <span className="line-clamp-1">{paper.authors.join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          <span>{paper.year}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="w-4 h-4" />
                          <span className="font-medium">{paper.citations} citations</span>
                        </div>
                        {paper.journal && (
                          <div className="flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4" />
                            <span className="line-clamp-1">{paper.journal}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {paper.topics.map((topic) => (
                          <span
                            key={topic}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <a
                        href={`https://doi.org/${paper.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <button className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                Previous
              </button>
              <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
                1
              </button>
              <button className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                2
              </button>
              <button className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                3
              </button>
              <button className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                Next
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}