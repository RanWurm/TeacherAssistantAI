import { useTranslation } from 'react-i18next';

interface ResultsHeaderProps {
  total: number;
  sortBy: string;
  setSortBy: (v: string) => void;
}

export function ResultsHeader({ total, sortBy, setSortBy }: ResultsHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between mb-4 items-end">
      <span>
        {t('search.resultsHeader.resultsCount', {
          count: total,
          defaultValue: '{{count}} papers found',
        })}
      </span>
      <label className="flex items-center gap-2 text-sm text-(--text-secondary)">
        <span className="font-medium">{t('search.resultsHeader.sortLabel', { defaultValue: 'Sort:' })}</span>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="border border-(--border-color) rounded-md px-3 py-1 bg-(--surface) text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-(--primary-300) transition"
          aria-label={t('search.resultsHeader.sortLabel', { defaultValue: 'Sort:' })}
        >
          <option value="citations">{t('search.sort.citations', { defaultValue: 'Most Cited' })}</option>
          <option value="year">{t('search.sort.year', { defaultValue: 'Most Recent' })}</option>
        </select>
      </label>
    </div>
  );
}
