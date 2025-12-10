import { Award } from 'lucide-react';
import { MOCK_RESEARCHERS } from '../../data/mock';

export function ResearchersTable() {
  const rankColors = [
    "text-[color:var(--rank-first)]",
    "text-[color:var(--rank-second)]",
    "text-[color:var(--rank-third)]",
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-[color:var(--table-header-bg)]">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[color:var(--table-header-text)]">Rank</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[color:var(--table-header-text)]">Researcher</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[color:var(--table-header-text)]">Papers</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[color:var(--table-header-text)]">Citations</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[color:var(--table-header-text)]">h-Index</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[color:var(--border-color-light)]">
          {MOCK_RESEARCHERS.map((researcher, idx) => (
            <tr key={idx} className="hover:bg-[color:var(--table-row-hover)] transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  {idx < 3 ? (
                    <Award className={`w-5 h-5 ${rankColors[idx]}`} />
                  ) : (
                    <span className="text-sm font-medium text-[color:var(--list-rank-muted)]">#{idx + 1}</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--metric-blue-s)] to-[var(--metric-blue-e)] flex items-center justify-center font-semibold" style={{ color: "var(--on-primary)" }}>
                    {researcher.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="font-medium text-[color:var(--text-main)]">{researcher.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-[color:var(--text-main)] font-medium">{researcher.papers.toLocaleString()}</td>
              <td className="px-6 py-4 text-sm text-[color:var(--text-main)] font-medium">{researcher.citations.toLocaleString()}</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-3 py-1 rounded-lg bg-[color:var(--badge-blue-bg)] text-[color:var(--badge-blue-text)] text-sm font-semibold">
                  {researcher.hIndex}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

