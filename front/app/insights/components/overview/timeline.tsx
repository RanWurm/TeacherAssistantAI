import { Calendar } from 'lucide-react';
import { YEARLY_DATA, YearlyData } from '../../data/mock';

export function Timeline() {
  const maxPapers = Math.max(...YEARLY_DATA.map(d => d.papers));

  return (
    <div className="bg-[color:var(--card-bg)] rounded-2xl border border-[color:var(--border-color)] shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-[color:var(--card-text)] mb-1">Publications Over Time</h2>
          <p className="text-sm text-[color:var(--card-sub-text)]">Number of papers published per year</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[color:var(--text-subtle)]" />
          <span className="text-sm text-[color:var(--text-main)]">2019-2024</span>
        </div>
      </div>

      <div className="space-y-4">
        {YEARLY_DATA.map((data, idx) => {
          const percentage = (data.papers / maxPapers) * 100;
          const growth = idx > 0 ? ((data.papers - YEARLY_DATA[idx - 1].papers) / YEARLY_DATA[idx - 1].papers * 100).toFixed(1) : '0';

          return (
            <div key={data.year} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-[color:var(--text-dim)]">{data.year}</span>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-[color:var(--card-text)]">{data.papers.toLocaleString()}</span>
                  {idx > 0 && (
                    <span className={`text-xs font-medium ${
                      parseFloat(growth) >= 0 
                        ? "text-[color:var(--grow-up)] bg-[color:var(--grow-up-bg)]" 
                        : "text-[color:var(--grow-down)] bg-[color:var(--grow-down-bg)]"
                    }`}>
                      {parseFloat(growth) >= 0 ? '+' : ''}{growth}%
                    </span>
                  )}
                </div>
              </div>
              <div className="relative h-10 bg-[color:var(--timeline-track)] rounded-lg overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--timeline-fill-start)] to-[var(--timeline-fill-end)] rounded-lg transition-all duration-1000 flex items-center justify-end pr-3"
                  style={{ width: `${percentage}%` }}
                >
                  {percentage > 30 && (
                    <span className="text-xs font-medium" style={{ color: "var(--on-primary)" }}>
                      {data.papers.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

