import React from 'react';
import { Filter } from 'lucide-react';
import { MOCK_PAPERS, LANGUAGES, TYPES } from '../data/mock';

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
}

export function FiltersSidebar({
  selectedTopics, setSelectedTopics,
  selectedAuthors, setSelectedAuthors,
  selectedJournal, setSelectedJournal,
  selectedType, setSelectedType,
  yearRange, setYearRange,
  minCitations, setMinCitations,
  minImpact, setMinImpact,
  selectedLanguage, setSelectedLanguage,
}: FiltersSidebarProps) {
  const topics = Array.from(new Set(MOCK_PAPERS.flatMap(p => p.topics)));
  const authors = Array.from(new Set(MOCK_PAPERS.flatMap(p => p.authors)));
  const journals = Array.from(new Set(MOCK_PAPERS.map(p => p.journal).filter(Boolean)));

  // CollapsibleList is a local helper for showing "show more/less" behavior
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
          className="ml-2 mt-1 text-xs text-[color:var(--primary-600)] hover:underline focus:underline focus:outline-none transition"
          aria-expanded={open}
          aria-label={open ? `Show less items` : `Show all items`}
        >
          {open ? 'Show less' : `Show all (${items.length})`}
        </button>
      </>
    );
  }

  return (
    <aside
      className="w-full space-y-6"
      style={{
        minHeight: 'min(100dvh, 100%)',
        // Remove vertical overflow restriction, allow full height
        overflowY: 'visible',
        overflowX: 'hidden',
      }}
    >
      <header className="flex items-center gap-2 mb-2 px-2">
        <Filter className="w-5 h-5 text-[color:var(--primary-700)]" />
        <span className="font-bold text-lg text-[color:var(--text-primary)]">Filters</span>
      </header>
      {/* CollapsibleList component for Topics and Authors */}
      <>
        <Section title="Topics">
          <CollapsibleList
            items={topics}
            renderItem={t => (
              <li key={t} className="list-none">{checkbox(t, selectedTopics, setSelectedTopics)}</li>
            )}
            threshold={3}
          />
        </Section>

        <Section title="Authors">
          <CollapsibleList
            items={authors}
            renderItem={a => (
              <li key={a} className="list-none">{checkbox(a, selectedAuthors, setSelectedAuthors)}</li>
            )}
            threshold={3}
          />
        </Section>
      </>

      <Section title="Journal">
        <select
          value={selectedJournal}
          onChange={e => setSelectedJournal(e.target.value)}
          className="w-full border rounded-lg py-1.5 px-2 bg-[color:var(--surface-alt)] focus:ring focus:ring-[color:var(--primary-500)]/20"
          style={{ overflowX: 'hidden' }}
        >
          <option value="all">All Journals</option>
          {journals.map(j => <option key={j}>{j}</option>)}
        </select>
      </Section>

      <Section title="Type">
        <select
          value={selectedType}
          onChange={e => setSelectedType(e.target.value)}
          className="w-full border rounded-lg py-1.5 px-2 bg-[color:var(--surface-alt)] focus:ring focus:ring-[color:var(--primary-500)]/20"
          style={{ overflowX: 'hidden' }}
        >
          <option value="all">All Types</option>
          {TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
      </Section>

      <div className="grid grid-cols-2 gap-4">
        <Section title="Impact Factor">
          <div className="relative flex items-center">
            <input
              type="number"
              min={0}
              step={0.1}
              value={minImpact}
              onChange={e => setMinImpact(+e.target.value)}
              className="w-full border rounded-lg py-1.5 px-2 bg-[color:var(--surface-alt)] focus:ring focus:ring-[color:var(--primary-500)]/20"
              placeholder="Min"
            />
            <span className="absolute right-2 text-xs text-[color:var(--text-secondary)]">min</span>
          </div>
        </Section>

        <Section title="Citations">
          <div className="relative flex items-center">
            <input
              type="number"
              min={0}
              value={minCitations}
              onChange={e => setMinCitations(+e.target.value)}
              className="w-full border rounded-lg py-1.5 px-2 bg-[color:var(--surface-alt)] focus:ring focus:ring-[color:var(--primary-500)]/20"
              placeholder="Min"
            />
            <span className="absolute right-2 text-xs text-[color:var(--text-secondary)]">min</span>
          </div>
        </Section>
      </div>

      <Section title="Year Range">
        <div className="flex gap-2">
          <input
            type="number"
            value={yearRange.min}
            min={1900}
            max={yearRange.max}
            onChange={e => setYearRange({ ...yearRange, min: +e.target.value })}
            className="w-1/2 border rounded-lg py-1.5 px-2 bg-[color:var(--surface-alt)] focus:ring focus:ring-[color:var(--primary-500)]/20"
            placeholder="From"
          />
          <span className="px-2 text-[color:var(--text-secondary)] text-sm font-medium flex items-center">–</span>
          <input
            type="number"
            value={yearRange.max}
            min={yearRange.min}
            max={2100}
            onChange={e => setYearRange({ ...yearRange, max: +e.target.value })}
            className="w-1/2 border rounded-lg py-1.5 px-2 bg-[color:var(--surface-alt)] focus:ring focus:ring-[color:var(--primary-500)]/20"
            placeholder="To"
          />
        </div>
      </Section>

      <Section title="Language">
        <select
          value={selectedLanguage}
          onChange={e => setSelectedLanguage(e.target.value)}
          className="w-full border rounded-lg py-1.5 px-2 bg-[color:var(--surface-alt)] focus:ring focus:ring-[color:var(--primary-500)]/20"
          style={{ overflowX: 'hidden' }}
        >
          {LANGUAGES.map(l => <option key={l}>{l}</option>)}
        </select>
      </Section>
    </aside>
  );
}

// Improved checkbox: nicer spacing and modern toggle style
function checkbox(value: string, list: string[], set: (v: string[]) => void) {
  return (
    <label key={value} className="flex items-center gap-2 text-[color:var(--text-primary)] text-sm py-0.5 cursor-pointer" style={{ overflowX: 'hidden' }}>
      <input
        type="checkbox"
        checked={list.includes(value)}
        onChange={() =>
          set(list.includes(value)
            ? list.filter(v => v !== value)
            : [...list, value])
        }
        className="accent-[color:var(--primary-500)] rounded border-gray-300 focus:ring-[color:var(--primary-400)]"
      />
      <span className="truncate">{value}</span>
    </label>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-2 last:mb-0" style={{ overflowX: 'hidden' }}>
      <h3 className="font-semibold text-[color:var(--text-secondary)] text-xs uppercase tracking-wider mb-1 px-1">{title}</h3>
      <div>{children}</div>
    </section>
  );
}
