'use client';

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useFilterOptions } from "@/hooks/useFilterOptions";
import { useTranslation } from "react-i18next";

interface Props {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  fetcher: (q: string, limit: number, offset: number) => Promise<string[]>;
}

const PAGE_SIZE = 50;
const HEADER_CLASS =
  "text-xs font-semibold uppercase tracking-wider text-(--text-secondary)";

export function AsyncMultiSelect({ label, value, onChange, fetcher }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  // Ref for the scrollable dropdown panel
  const dropdownPanelRef = useRef<HTMLDivElement>(null);

  const { options, loading, hasMore, loadMore } =
    useFilterOptions(query, fetcher, open);

  // store scroll position before load more, restore after
  const scrollTopBeforeFetchRef = useRef(0);
  // Used to skip restoring scroll on the first open or on closing
  const shouldRestoreScrollRef = useRef(false);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function toggle(item: string) {
    onChange(
      value.includes(item)
        ? value.filter(v => v !== item)
        : [...value, item]
    );
  }

  function remove(item: string) {
    onChange(value.filter(v => v !== item));
  }

  // Filtering is intentionally left here (client) for consistency.
  const normalizedQuery = query.toLowerCase();

  const filtered = options
    .filter(o => o.toLowerCase().includes(normalizedQuery))
    .sort((a, b) => {
      const A = a.toLowerCase();
      const B = b.toLowerCase();
  
      // 1. exact match
      if (A === normalizedQuery && B !== normalizedQuery) return -1;
      if (B === normalizedQuery && A !== normalizedQuery) return 1;
  
      // 2. prefix match
      const aStarts = A.startsWith(normalizedQuery);
      const bStarts = B.startsWith(normalizedQuery);
      if (aStarts && !bStarts) return -1;
      if (bStarts && !aStarts) return 1;
  
      // 3. contains (fallback to alphabetical)
      return A.localeCompare(B);
    });
  
  // When the dropdown is opened, always scroll to top (optional, can keep if desired)
  useEffect(() => {
    if (open && dropdownPanelRef.current) {
      // New query: scroll to top, unless restoring from load more
      if (!shouldRestoreScrollRef.current) {
        dropdownPanelRef.current.scrollTop = 0;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, query]);
  
  // Restore the scroll position after loading more results
  useEffect(() => {
    if (!loading && shouldRestoreScrollRef.current && dropdownPanelRef.current) {
      dropdownPanelRef.current.scrollTop = scrollTopBeforeFetchRef.current;
      shouldRestoreScrollRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, loading]);

  // Handle Show more button click, preserve scroll
  function handleShowMore() {
    if (dropdownPanelRef.current) {
      // keep the current scroll position so we can restore after new results load
      scrollTopBeforeFetchRef.current = dropdownPanelRef.current.scrollTop;
      shouldRestoreScrollRef.current = true;
    }
    loadMore();
  }

  function getPlaceholder() {
    if (t) {
      return t('search.filters.inputPlaceholder', { label });
    }
    return `Search ${label}`;
  }
  function getLoadingLabel() {
    return t ? t('search.filters.loading') : "Loading…";
  }
  function getNoResultsLabel() {
    return t ? t('search.filters.noResults') : "No results";
  }
  function getShowMoreLabel() {
    return t ? t('search.filters.showMore') : "Show more";
  }
  function getSelectedLabel(count: number) {
    return t ? t('search.filters.selected', { count }) : `${count} selected`;
  }

  return (
    <div ref={rootRef} className="space-y-2 relative">
      <label className={HEADER_CLASS}>{label}</label>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map(v => (
            <span
              key={v}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs
                         bg-blue-100 text-blue-800 border border-blue-200"
            >
              {v}
              <button
                type="button"
                onClick={() => remove(v)}
                className="hover:text-red-500 cursor-pointer"
                aria-label={t ? t('search.filters.selected', { count: 1 }) : "Remove"}
              >
                ×
              </button>
            </span>
          ))}
          {/* Optional: show how many selected */}
          {value.length > 1 && (
            <span className="text-xs text-gray-500 pl-1">{getSelectedLabel(value.length)}</span>
          )}
        </div>
      )}

      <div
        className="flex items-center gap-2 border rounded-lg px-2 py-1.5
                   bg-(--surface-alt) cursor-text"
        onClick={() => setOpen(true)}
      >
        <input
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={getPlaceholder()}
          aria-label={label}
          className="flex-1 bg-transparent outline-none text-sm"
        />
        <ChevronDown
          className="w-4 h-4 text-gray-400 cursor-pointer"
          aria-label={open ? t ? t('search.filters.inputPlaceholder', { label }) : `Close` : t ? t('search.filters.inputPlaceholder', { label }) : `Open`}
          onClick={e => {
            e.stopPropagation();
            setOpen(open => open ? false : true);
          }}
        />
      </div>

      {open && (
        <div
          ref={dropdownPanelRef}
          className="absolute z-30 w-full mt-1 max-h-56 overflow-auto
                        rounded-lg border bg-white shadow-md"
          role="listbox"
          aria-multiselectable="true"
        >
          {loading && (
            <>
              <div className="px-3 py-2 text-sm text-gray-400">{getLoadingLabel()}</div>
            </>
          )}

          {!loading && filtered.length === 0 && (
            <>
              <div className="px-3 py-2 text-sm text-gray-400">{getNoResultsLabel()}</div>
            </>
          )}

          {!loading && filtered.length > 0 && filtered.map(opt => (
            <div
              key={opt}
              onClick={() => {
                toggle(opt);
              }}
              role="option"
              aria-selected={value.includes(opt)}
              className={`px-3 py-2 text-sm cursor-pointer
                ${value.includes(opt)
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "hover:bg-gray-50"}`}
            >
              {opt}
            </div>
          ))}

          {hasMore && !loading && (
            <button
              type="button"
              onClick={handleShowMore}
              className="w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50"
            >
              {getShowMoreLabel()}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
