import { BarChart3, TrendingUp, Users, BookOpen, LucideIcon } from 'lucide-react';

interface Tab {
  id: 'overview' | 'topics' | 'researchers' | 'journals';
  label: string;
  icon: LucideIcon;
}

const tabs: Tab[] = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'topics', label: 'Trending Topics', icon: TrendingUp },
  { id: 'researchers', label: 'Top Researchers', icon: Users },
  { id: 'journals', label: 'Top Journals', icon: BookOpen },
];

interface ViewTabsProps {
  selectedView: 'overview' | 'topics' | 'researchers' | 'journals';
  setSelectedView: (view: 'overview' | 'topics' | 'researchers' | 'journals') => void;
  timeRange: '1y' | '3y' | '5y' | 'all';
  setTimeRange: (range: '1y' | '3y' | '5y' | 'all') => void;
}

export function ViewTabs({ selectedView, setSelectedView, timeRange, setTimeRange }: ViewTabsProps) {
  return (
    <div className="w-full mb-6">

      {/* Tabs Row and Time Range Selector in Same Row (larger select and tabs) */}
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
                    ? "bg-gradient-to-r from-[var(--tab-active-start)] to-[var(--tab-active-end)] shadow-lg"
                    : "bg-[color:var(--tab-inactive)] hover:bg-[color:var(--tab-hover-bg)] hover:border-[color:var(--tab-hover-border)]"
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
          onChange={(e) => setTimeRange(e.target.value as '1y' | '3y' | '5y' | 'all')}
          className="px-4.5 py-2.5 rounded-2xl border border-[color:var(--border-color)] text-sm font-semibold text-[color:var(--text-main)] focus:outline-none focus:border-[color:var(--accent-main)] focus:border-[1.5px] bg-[color:var(--color-white)] ml-auto"
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
