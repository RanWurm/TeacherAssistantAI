import { ResearchersTable } from './researchers-table';

export function ResearchersView() {
  return (
    <div className="bg-[color:var(--card-bg)] rounded-2xl border border-[color:var(--border-color)] shadow-sm overflow-hidden">
      <div className="p-6 border-b border-[color:var(--border-color-light)]">
        <h2 className="text-lg font-semibold text-[color:var(--card-text)] mb-1">Top Researchers</h2>
        <p className="text-sm text-[color:var(--card-sub-text)]">Most influential researchers by citations and h-index</p>
      </div>
      <ResearchersTable />
    </div>
  );
}

