import { MOCK_JOURNALS } from '../../data/mock';

export function JournalsTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-[color:var(--table-header-bg)]">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[color:var(--table-header-text)]">Rank</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[color:var(--table-header-text)]">Journal</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[color:var(--table-header-text)]">Papers</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[color:var(--table-header-text)]">Avg Citations</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[color:var(--table-header-text)]">Impact Factor</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[color:var(--border-color-light)]">
          {MOCK_JOURNALS.map((journal, idx) => (
            <tr key={idx} className="hover:bg-[color:var(--table-row-hover)] transition-colors">
              <td className="px-6 py-4">
                <span className="text-sm font-medium text-[color:var(--list-rank-muted)]">#{idx + 1}</span>
              </td>
              <td className="px-6 py-4">
                <span className="font-medium text-[color:var(--text-main)]">{journal.name}</span>
              </td>
              <td className="px-6 py-4 text-sm text-[color:var(--text-main)] font-medium">{journal.papers.toLocaleString()}</td>
              <td className="px-6 py-4 text-sm text-[color:var(--text-main)] font-medium">{journal.avgCitations}</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-3 py-1 rounded-lg bg-[color:var(--badge-green-bg)] text-[color:var(--badge-green-text)] text-sm font-semibold">
                  {journal.impactFactor}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

