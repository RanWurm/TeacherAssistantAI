import { Award, Users, BookOpen, Globe, LucideIcon } from 'lucide-react';

interface Metric {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  colorIdx: number;
}

const metrics: Metric[] = [
  { label: 'Total Papers', value: '245.6M', change: '+12.3%', icon: BookOpen, colorIdx: 0 },
  { label: 'Active Researchers', value: '8.4M', change: '+8.7%', icon: Users, colorIdx: 1 },
  { label: 'Research Topics', value: '12.3K', change: '+15.2%', icon: Globe, colorIdx: 2 },
  { label: 'Citations', value: '1.8B', change: '+22.1%', icon: Award, colorIdx: 3 },
];

const metricGradients = [
  "bg-gradient-to-br from-[var(--metric-blue-s)] to-[var(--metric-blue-e)]",
  "bg-gradient-to-br from-[var(--metric-purple-s)] to-[var(--metric-pink-e)]",
  "bg-gradient-to-br from-[var(--metric-green-s)] to-[var(--metric-green-e)]",
  "bg-gradient-to-br from-[var(--metric-orange-s)] to-[var(--metric-red-e)]",
];

export function MetricsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {metrics.map((metric, idx) => {
        const Icon = metric.icon;
        return (
          <div key={idx} className="bg-[color:var(--card-bg)] rounded-2xl border border-[color:var(--border-color)] shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${metricGradients[metric.colorIdx]} flex items-center justify-center shadow-lg`}>
                <Icon className="w-6 h-6" style={{ color: "var(--on-primary)" }} />
              </div>
              <span className="text-xs font-semibold text-[color:var(--grow-up)] bg-[color:var(--grow-up-bg)] px-2 py-1 rounded-lg">
                {metric.change}
              </span>
            </div>
            <p className="text-3xl font-bold text-[color:var(--card-text)] mb-1">{metric.value}</p>
            <p className="text-sm text-[color:var(--card-sub-text)]">{metric.label}</p>
          </div>
        );
      })}
    </div>
  );
}

