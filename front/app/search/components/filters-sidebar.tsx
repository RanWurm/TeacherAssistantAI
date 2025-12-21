import React from 'react';
import { Filter } from 'lucide-react';
import { MOCK_PAPERS, LANGUAGES, TYPES } from '../data/mock';

// --- i18n import and hook setup ---
import { useTranslation } from 'react-i18next';

interface FiltersSidebarProps {
  selectedTopics: string[];
  setSelectedTopics: (v: string[]) => void;

  selectedAuthors: string[];
  setSelectedAuthors: (v: string[]) => void;

  selectedJournal: string;
  setSelectedJournal: (v: string) => void;

  selectedType: string;
  setSelectedType: (v: string) => void;

  yearRange: { min: number; max: number };
  setYearRange: (v: { min: number; max: number }) => void;

  minCitations: number;
  setMinCitations: (v: number) => void;

  minImpact: number;
  setMinImpact: (v: number) => void;

  selectedLanguage: string;
  setSelectedLanguage: (v: string) => void;

  // Optional: Accept a callback for when Apply Filters is clicked
  onApplyFilters?: () => void;
}

// --- Responsive adjustment classes ---
// We'll use 'sm:' for default, and everything else will be smaller

export function FiltersSidebar({
  selectedTopics, setSelectedTopics,
  selectedAuthors, setSelectedAuthors,
  selectedJournal, setSelectedJournal,
  selectedType, setSelectedType,
  yearRange, setYearRange,
  minCitations, setMinCitations,
  minImpact, setMinImpact,
  selectedLanguage, setSelectedLanguage,
  onApplyFilters,
}: FiltersSidebarProps) {
  const { t, i18n } = useTranslation();
  const topics = Array.from(new Set(MOCK_PAPERS.flatMap(p => p.topics)));
  const authors = Array.from(new Set(MOCK_PAPERS.flatMap(p => p.authors)));
  const journals = Array.from(new Set(MOCK_PAPERS.map(p => p.journal).filter(Boolean)));

  function CollapsibleList<T>({
    items,
    renderItem,
    threshold = 3,
  }: {
    items: T[];
    renderItem: (item: T) => React.ReactNode;
    threshold?: number;
  }) {
    const [open, setOpen] = React.useState(false);
    if (items.length <= threshold) {
      return (
        <ul className="flex flex-col gap-0.5" style={{ maxHeight: 'none', overflowY: 'visible', overflowX: 'hidden', margin: 0, padding: 0 }}>
          {items.map(renderItem)}
        </ul>
      );
    }
    return (
      <>
        <ul className="flex flex-col gap-0.5" style={{ maxHeight: 'none', overflowY: 'visible', overflowX: 'hidden', margin: 0, padding: 0 }}>
          {(open ? items : items.slice(0, threshold)).map(renderItem)}
        </ul>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="ml-2 mt-1 text-xs sm:text-xs text-[11px] text-(--primary-600) hover:underline focus:underline focus:outline-none transition"
          aria-expanded={open}
          aria-label={open ? t('search.filters.showLess', { defaultValue: 'Show less items' }) : t('search.filters.showAll', { defaultValue: `Show all items` })}
        >
          {open
            ? t('search.filters.showLess', { defaultValue: 'Show less' })
            : t('search.filters.showAll', { defaultValue: `Show all (${items.length})`, count: items.length, total: items.length })
          }
        </button>
      </>
    );
  }

  return (
    <aside
      className="w-full space-y-6 sm:space-y-6"
      style={{
        minHeight: 'min(100dvh, 100%)',
        overflowY: 'visible',
        overflowX: 'hidden',
      }}
    >
      <header className="flex items-center gap-2 mb-2 sm:mb-2 px-2">
        <Filter className="w-5 h-5 sm:w-5 sm:h-5 text-(--primary-700)" />
        <span className="font-bold text-lg sm:text-lg text-(--text-primary)">
          {t('search.filters.title', { defaultValue: 'Filters' })}
        </span>
      </header>
      {/* CollapsibleList component for Topics and Authors */}
      <>
        <Section title={t('search.filters.topics', { defaultValue: 'Topics' })}>
          <CollapsibleList
            items={topics}
            renderItem={tpc => (
              <li key={tpc} className="list-none">{checkbox(tpc, selectedTopics, setSelectedTopics)}</li>
            )}
            threshold={3}
          />
        </Section>

        <Section title={t('search.filters.authors', { defaultValue: 'Authors' })}>
          <CollapsibleList
            items={authors}
            renderItem={a => (
              <li key={a} className="list-none">{checkbox(a, selectedAuthors, setSelectedAuthors)}</li>
            )}
            threshold={3}
          />
        </Section>
      </>

      <Section title={t('search.filters.journal', { defaultValue: 'Journal' })}>
        <select
          value={selectedJournal}
          onChange={e => setSelectedJournal(e.target.value)}
          className="w-full border rounded-lg py-1.5 px-2 sm:py-1.5 sm:px-2 text-sm sm:text-sm bg-(--surface-alt) focus:ring focus:ring-(--primary-500)/20"
          style={{ overflowX: 'hidden' }}
        >
          <option value="all">{t('search.filters.allJournals', { defaultValue: 'All Journals' })}</option>
          {journals.map(j => <option key={j}>{j}</option>)}
        </select>
      </Section>

      <Section title={t('search.filters.type', { defaultValue: 'Type' })}>
        <select
          value={selectedType}
          onChange={e => setSelectedType(e.target.value)}
          className="w-full border rounded-lg py-1.5 px-2 sm:py-1.5 sm:px-2 text-sm sm:text-sm bg-(--surface-alt) focus:ring focus:ring-(--primary-500)/20"
          style={{ overflowX: 'hidden' }}
        >
          <option value="all">{t('search.filters.allTypes', { defaultValue: 'All Types' })}</option>
          {TYPES.map(tval => <option key={tval}>{tval}</option>)}
        </select>
      </Section>

      <Section
        title={
          i18n.language === 'he'
            ? t('search.filters.minImpact')
            : t('search.filters.minImpact', { defaultValue: 'Min Impact Factor' })
        }
      >
        <div className="flex items-end">
          <div className="relative w-full flex items-center">
            <input
              type="number"
              min={0}
              step={0.1}
              value={minImpact}
              onChange={e => setMinImpact(+e.target.value)}
              className="w-full border rounded-lg py-1.5 px-2 sm:py-1.5 sm:px-2 text-sm sm:text-sm bg-(--surface-alt)
                     focus:ring focus:ring-(--primary-500)/20"
              placeholder={
                i18n.language === 'he'
                  ? t('search.filters.minImpact')
                  : t('search.filters.minImpact', { defaultValue: 'Min Impact Factor' })
              }
            />
            <span
              className={`absolute text-xs sm:text-xs text-[11px] text-(--text-secondary)
            ${i18n.language === 'he' ? 'left-2' : 'right-2'}`}
            >
              {i18n.language === 'he'
                ? t('search.filters.minShort')
                : t('search.filters.minShort', { defaultValue: 'min' })}
            </span>
          </div>
        </div>
      </Section>

      <Section title={t('search.filters.minCitations', { defaultValue: 'Min Citations' })}>
        <div className="flex items-end">
          <div className="relative w-full flex items-center">
            <input
              type="number"
              min={0}
              value={minCitations}
              onChange={e => setMinCitations(+e.target.value)}
              className="w-full border rounded-lg py-1.5 px-2 sm:py-1.5 sm:px-2 text-sm sm:text-sm bg-(--surface-alt)
                     focus:ring focus:ring-(--primary-500)/20"
              placeholder={t('search.filters.minCitations', { defaultValue: 'Min Citations' })}
            />
            <span
              className={`absolute text-xs sm:text-xs text-[11px] text-(--text-secondary)
            ${i18n.language === 'he' ? 'left-2' : 'right-2'}`}
            >
              {i18n.language === 'he'
                ? t('search.filters.minShort')
                : t('search.filters.minShort', { defaultValue: 'min' })}
            </span>
          </div>
        </div>
      </Section>

      <Section title={t('search.filters.yearRange', { defaultValue: 'Year Range' })}>
        <div className="flex gap-2 sm:gap-2">
          <input
            type="number"
            value={yearRange.min}
            min={1900}
            max={yearRange.max}
            onChange={e => setYearRange({ ...yearRange, min: +e.target.value })}
            className="w-1/2 border rounded-lg py-1.5 px-2 sm:py-1.5 sm:px-2 text-sm sm:text-sm bg-(--surface-alt) focus:ring focus:ring-(--primary-500)/20"
            placeholder={t('search.filters.yearFrom', { defaultValue: 'From' })}
          />
          <span className="px-2 sm:px-2 text-(--text-secondary) text-sm sm:text-sm font-medium flex items-center">–</span>
          <input
            type="number"
            value={yearRange.max}
            min={yearRange.min}
            max={2100}
            onChange={e => setYearRange({ ...yearRange, max: +e.target.value })}
            className="w-1/2 border rounded-lg py-1.5 px-2 sm:py-1.5 sm:px-2 text-sm sm:text-sm bg-(--surface-alt) focus:ring focus:ring-(--primary-500)/20"
            placeholder={t('search.filters.yearTo', { defaultValue: 'To' })}
          />
        </div>
      </Section>

      <Section title={t('search.filters.language', { defaultValue: 'Language' })}>
        <select
          value={selectedLanguage}
          onChange={e => setSelectedLanguage(e.target.value)}
          className="w-full border rounded-lg py-1.5 px-2 sm:py-1.5 sm:px-2 text-sm sm:text-sm bg-(--surface-alt) focus:ring focus:ring-(--primary-500)/20"
          style={{ overflowX: 'hidden' }}
        >
          {LANGUAGES.map(l => <option key={l}>{l}</option>)}
        </select>
      </Section>

      {/* Apply Filters Button */}
      <div className="pt-3 pb-2 flex">
        <button
          type="button"
          className="w-full bg-(--primary-600) hover:bg-(--primary-700) text-white rounded-lg py-2 px-4 font-semibold text-sm sm:text-sm shadow transition"
          onClick={onApplyFilters}
          aria-label={t('search.filters.applyButton', { defaultValue: 'Apply Filters' })}
        >
          {t('search.filters.applyButton', { defaultValue: 'Apply Filters' })}
        </button>
      </div>
    </aside>
  );
}

// Responsive/small: make checkbox font, gap and padding smaller
function checkbox(value: string, list: string[], set: (v: string[]) => void) {
  return (
    <label
      key={value}
      className="flex items-center gap-2 sm:gap-2 text-(--text-primary) text-sm sm:text-sm py-0.5 sm:py-0.5 cursor-pointer"
      style={{ overflowX: 'hidden' }}
    >
      <input
        type="checkbox"
        checked={list.includes(value)}
        onChange={() =>
          set(list.includes(value)
            ? list.filter(v => v !== value)
            : [...list, value])
        }
        className="accent-(--primary-500) rounded border-gray-300 focus:ring-(--primary-400)"
        style={{ width: '1em', height: '1em', minWidth: 0, minHeight: 0, maxWidth: '1.25em', maxHeight: '1.25em' }}
      />
      <span className="truncate">{value}</span>
    </label>
  );
}

// Title: use smaller text-xs on small screens, text-sm for normal (sm:) and some mb/padding tweaks
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-2 last:mb-0 sm:mb-2" style={{ overflowX: 'hidden' }}>
      <h3 className="font-semibold text-(--text-secondary) text-xs sm:text-xs text-[11px] uppercase tracking-wider mb-1 px-1">{title}</h3>
      <div>{children}</div>
    </section>
  );
}
