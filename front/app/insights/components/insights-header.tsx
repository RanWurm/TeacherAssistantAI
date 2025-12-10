import { BarChart3 } from 'lucide-react';

interface InsightsHeaderProps {
  timeRange: '1y' | '3y' | '5y' | 'all';
  setTimeRange: (range: '1y' | '3y' | '5y' | 'all') => void;
}

export function InsightsHeader() {
  return (
    <header
      className="z-30 border-b border-[color:var(--border-color)] m-0 px-10 py-10"
      data-component="insights-header"
    >
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--metric-blue-s)] to-[var(--metric-blue-e)] flex items-center justify-center shadow-lg">
            <BarChart3 className="w-10 h-10" style={{ color: "var(--on-primary)" }} />
          </div>

          <div>
            <h1 className="text-4xl font-extrabold text-[color:var(--text-main)] text-center">
              Research Analytics
            </h1>
            <p className="text-lg text-[color:var(--text-muted)] text-center mt-1">
              Insights from CORE dataset
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
