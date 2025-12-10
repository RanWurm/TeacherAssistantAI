import { Search, SlidersHorizontal } from 'lucide-react';

interface SearchHeaderProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function SearchHeader({ showFilters, setShowFilters, searchQuery, setSearchQuery }: SearchHeaderProps) {
  return (
    <header className="border-b border-[color:var(--border-color)] bg-transparent">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary-600)] to-[var(--primary-500)] flex items-center justify-center shadow-lg">
              <Search className="w-5 h-5" style={{ color: "var(--on-primary)" }} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[color:var(--text-primary)] text-center">Academic Search</h1>
              <p className="text-xs text-[color:var(--text-secondary)] text-center">Explore millions of research papers</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4 flex justify-center">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[color:var(--text-secondary)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, author, keywords, or topic..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-[color:var(--border-color)] focus:border-[color:var(--primary-500)] focus:ring-4 focus:ring-[color:var(--primary-500)]/10 outline-none transition-all text-sm bg-[color:var(--surface)] shadow-sm text-[color:var(--text-primary)] max-w-2xl mx-auto"
          />
        </div>

        {/* Always Show Filters Prompt */}
        <div className="flex items-center gap-2 mb-2 justify-center">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-sm font-medium text-[color:var(--text-primary)]">Filters are always shown</span>
        </div>
      </div>
    </header>
  );
}
