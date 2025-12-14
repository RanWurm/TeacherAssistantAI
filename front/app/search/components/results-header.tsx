import { X } from 'lucide-react';

interface ResultsHeaderProps {
  count: number;
  sortBy: string;
  setSortBy: (v: string) => void;
}

export function ResultsHeader({ count, sortBy, setSortBy }: ResultsHeaderProps) {
  return (
    <div className="flex justify-between mb-4">
      <span>{count} papers found</span>
      <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
        <option value="citations">Most Cited</option>
        <option value="year">Most Recent</option>
        <option value="impact">Highest Impact</option>
      </select>
    </div>
  );
}
