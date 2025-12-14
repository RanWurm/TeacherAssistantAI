import { BarChart3, TrendingUp, Users, BookOpen, Network, LucideIcon } from 'lucide-react';
import type { ViewType, TimeRange } from '../types/insights.types';

interface Tab {
  id: ViewType;
  label: string;
  icon: LucideIcon;
}

const tabs: Tab[] = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'trends', label: 'Trends', icon: TrendingUp },
  { id: 'researchers', label: 'Researchers', icon: Users },
  { id: 'journals', label: 'Journals', icon: BookOpen },
  { id: 'cross', label: 'Cross-Analysis', icon: Network },
];

interface ViewTabsProps {
  selectedView: ViewType;
  setSelectedView: (view: ViewType) => void;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
}

export function ViewTabs({ selectedView, setSelectedView, timeRange, setTimeRange }: ViewTabsProps) {
  return (
    <div className="w-full mb-6">
      <div className="flex items-center gap-4 overflow-x-auto pb-2 mb-4 flex-wrap">
        <div className="flex gap-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedView(tab.id)}
                className={`flex items-center gap-2 px-4.5 py-2.5 rounded-2xl font-semibold text-sm transition-all whitespace-nowrap ${
                  selectedView === tab.id
                    ? "bg-linear-to-r from-(--tab-active-start) to-(--tab-active-end) shadow-lg"
                    : "bg-(--tab-inactive) hover:bg-(--tab-hover-bg) hover:border-(--tab-hover-border)"
                }`}
                style={selectedView === tab.id ? { color: "var(--on-primary)" } : {}}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as TimeRange)}
          className="px-4.5 py-2.5 rounded-2xl border border-(--border-color) text-sm font-semibold text-(--text-main) focus:outline-none focus:border-(--accent-main) focus:border-[1.5px] bg-white ml-auto"
          style={{ minWidth: '110px' }}
        >
          <option value="1y">Last Year</option>
          <option value="3y">Last 3 Years</option>
          <option value="5y">Last 5 Years</option>
          <option value="all">All Time</option>
        </select>
      </div>
    </div>
  );
}
