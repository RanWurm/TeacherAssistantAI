import { SlidersHorizontal } from "lucide-react";

interface SearchHeaderProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
}

export function SearchHeader({ searchQuery, setSearchQuery }: SearchHeaderProps) {
  return (
    <header className="border-b border-(--border-color) bg-linear-to-b from-(--surface) to-transparent shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-5">
        {/* Title and subtitle */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-(--primary-700) to-(--primary-400) flex items-center justify-center shadow-xl border-2 border-(--primary-200) animate-pulse-slow">
              {/* Keep a logo here if needed */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-search w-6 h-6"
                style={{ color: "var(--on-primary)" }}
              >
                <path d="m21 21-4.34-4.34"></path>
                <circle cx="11" cy="11" r="8"></circle>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-linear-to-r from-(--primary-600) to-(--primary-400) bg-clip-text text-transparent">Academic Search</h1>
              <p className="text-xs sm:text-sm text-(--text-secondary) text-center mt-0.5">
                Discover and analyze millions of scholarly papers
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative flex justify-center mb-2">
          <div className="relative w-full sm:w-[525px] max-w-2xl mx-auto">
            <form
              onSubmit={e => {
                e.preventDefault();
                // Optionally, you could trigger a prop function here if needed
              }}
              role="search"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, author, keywords, or topic..."
                className="
                  w-full
                  pl-14 pr-16 py-4
                  rounded-2xl border border-(--border-color)
                  focus:border-(--primary-600)
                  focus:ring-4 focus:ring-(--primary-400)/20
                  outline-none
                  transition-all duration-200
                  text-base
                  bg-(--surface-alt)
                  shadow-md hover:shadow-lg
                  text-(--text-primary)
                  placeholder:text-(--text-secondary)/80
                  "
                aria-label="Search academic papers"
              />
              {/* SVG icon inside the input bar */}
              <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-search w-5 h-5 text-(--primary-500)"
                  aria-hidden="true"
                >
                  <path d="m21 21-4.34-4.34"></path>
                  <circle cx="11" cy="11" r="8"></circle>
                </svg>
              </span>
              {/* Enter button */}
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-(--primary-700) hover:text-(--primary-900) px-3 py-1 rounded-lg bg-transparent transition-colors focus:outline-none cursor-pointer"
                aria-label="Submit search"
                tabIndex={0}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={22}
                  height={22}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  {/* Rightward arrow for Enter */}
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Filters Callout */}
        <div className="flex items-center gap-2 justify-center">
          <span className="rounded-lg bg-(--surface-alt) px-2.5 py-1 flex items-center gap-2 shadow border border-(--border-color) text-(--primary-700) font-medium text-sm tracking-tight">
            <SlidersHorizontal className="w-4 h-4" />
            Filters always visible
          </span>
        </div>
      </div>
    </header>
  );
}
