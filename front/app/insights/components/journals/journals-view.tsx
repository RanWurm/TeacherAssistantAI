import { JournalsTable } from './journals-table';

export function JournalsView() {
  return (
    <div className="bg-[color:var(--card-bg)] rounded-2xl border border-[color:var(--border-color)] shadow-sm overflow-hidden">
      <div className="p-6 border-b border-[color:var(--border-color-light)]">
        <h2 className="text-lg font-semibold text-[color:var(--card-text)] mb-1">Top Academic Journals</h2>
        <p className="text-sm text-[color:var(--card-sub-text)]">Leading journals by publications and impact factor</p>
      </div>
      <JournalsTable />
    </div>
  );
}

