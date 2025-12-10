import { Filter, X } from 'lucide-react';
import { MOCK_PAPERS, LANGUAGES, Paper } from '../data/mock';

interface FiltersSidebarProps {
  selectedTopics: string[];
  toggleTopic: (topic: string) => void;
  yearRange: { min: number; max: number };
  setYearRange: (range: { min: number; max: number }) => void;
  minCitations: number;
  setMinCitations: (value: number) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  clearFilters: () => void;
}

export function FiltersSidebar({
  selectedTopics,
  toggleTopic,
  yearRange,
  setYearRange,
  minCitations,
  setMinCitations,
  selectedLanguage,
  setSelectedLanguage,
  clearFilters,
}: FiltersSidebarProps) {
  const allTopics = Array.from(new Set(MOCK_PAPERS.flatMap(p => p.topics)));
  const hasActiveFilters = selectedTopics.length > 0 || minCitations > 0 || selectedLanguage !== 'all';

  return (
    <aside className="w-80 shrink-0">
      <div className="sticky top-24 bg-[color:var(--surface)] rounded-2xl border border-[color:var(--border-color)] shadow-sm">
        <div className="p-5 border-b border-[color:var(--border-color-light)]">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-semibold text-[color:var(--text-primary)] flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </h2>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-[color:var(--primary-600)] hover:text-[color:var(--primary-700)] font-medium"
              >
                Clear all
              </button>
            )}
          </div>
          <p className="text-xs text-[color:var(--text-secondary)]">Refine your search results</p>
        </div>

        <div className="p-5 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Topics Filter */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-3">Topics</label>
            <div className="space-y-2">
              {allTopics.map((topic) => (
                <label
                  key={topic}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-[color:var(--surface-hover)] cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedTopics.includes(topic)}
                    onChange={() => toggleTopic(topic)}
                    className="w-4 h-4 rounded border-[color:var(--border-strong)] text-[color:var(--primary-600)] focus:ring-2 focus:ring-[color:var(--primary-500)]"
                  />
                  <span className="text-sm text-[color:var(--text-primary)]">{topic}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Year Range */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-3">Publication Year</label>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-[color:var(--text-secondary)] mb-1 block">From</label>
                <input
                  type="number"
                  value={yearRange.min}
                  onChange={(e) => setYearRange({ ...yearRange, min: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-[color:var(--border-color)] focus:border-[color:var(--primary-500)] focus:ring-2 focus:ring-[color:var(--primary-500)]/20 outline-none text-sm bg-[color:var(--input-bg)] text-[color:var(--text-primary)]"
                />
              </div>
              <div>
                <label className="text-xs text-[color:var(--text-secondary)] mb-1 block">To</label>
                <input
                  type="number"
                  value={yearRange.max}
                  onChange={(e) => setYearRange({ ...yearRange, max: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-[color:var(--border-color)] focus:border-[color:var(--primary-500)] focus:ring-2 focus:ring-[color:var(--primary-500)]/20 outline-none text-sm bg-[color:var(--input-bg)] text-[color:var(--text-primary)]"
                />
              </div>
            </div>
          </div>

          {/* Minimum Citations */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-3">
              Minimum Citations ({minCitations}+)
            </label>
            <input
              type="range"
              min="0"
              max="1000"
              step="50"
              value={minCitations}
              onChange={(e) => setMinCitations(parseInt(e.target.value))}
              className="w-full"
              style={{ accentColor: "var(--primary-600)" }}
            />
            <div className="flex justify-between text-xs text-[color:var(--text-secondary)] mt-1">
              <span>0</span>
              <span>1000+</span>
            </div>
          </div>

          {/* Language Filter */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-3">Language</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[color:var(--border-color)] focus:border-[color:var(--primary-500)] focus:ring-2 focus:ring-[color:var(--primary-500)]/20 outline-none text-sm bg-[color:var(--input-bg)] text-[color:var(--text-primary)]"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang === 'all' ? 'All Languages' : lang}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </aside>
  );
}

