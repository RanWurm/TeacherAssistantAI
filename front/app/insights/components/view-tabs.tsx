import { BarChart3, TrendingUp, Users, BookOpen, Network, LucideIcon } from 'lucide-react';
import type { ViewType, TimeRange } from '../types/insights.types';
import { useTranslation } from 'react-i18next';

interface Tab {
  id: ViewType;
  labelKey: string;
  icon: LucideIcon;
}

const tabs: Tab[] = [
  { id: 'overview', labelKey: 'insights.tabs.overview', icon: BarChart3 },
  { id: 'trends', labelKey: 'insights.tabs.trends', icon: TrendingUp },
  { id: 'researchers', labelKey: 'insights.tabs.researchers', icon: Users },
  { id: 'journals', labelKey: 'insights.tabs.journals', icon: BookOpen },
  { id: 'cross', labelKey: 'insights.tabs.cross', icon: Network },
];

const timeRangeOptions = [
  { value: '1y', labelKey: 'insights.timeRanges.1y' },
  { value: '3y', labelKey: 'insights.timeRanges.3y' },
  { value: '5y', labelKey: 'insights.timeRanges.5y' },
  { value: 'all', labelKey: 'insights.timeRanges.all' },
];

interface ViewTabsProps {
  selectedView: ViewType;
  setSelectedView: (view: ViewType) => void;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
}

export function ViewTabs({ selectedView, setSelectedView, timeRange, setTimeRange }: ViewTabsProps) {
  const { t } = useTranslation();

  return (
    <div className="w-full mb-6">
      <div className="flex items-center gap-4 overflow-x-auto pb-2 mb-4 flex-wrap">
        <div className="flex gap-1 sm:gap-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setSelectedView(tab.id)}
                className={`
                  flex items-center gap-2 justify-center
                  ${selectedView === tab.id 
                    ? "bg-linear-to-r from-(--tab-active-start) to-(--tab-active-end) shadow-lg" 
                    : "bg-(--tab-inactive) hover:bg-(--tab-hover-bg) hover:border-(--tab-hover-border)"
                  }
                  rounded-2xl font-semibold
                  px-3 py-2 sm:px-4.5 sm:py-2.5
                  transition-all
                  text-sm
                  ${selectedView === tab.id ? "" : "text-(--text-main)"}
                  group
                  min-w-[44px]
                `}
                style={selectedView === tab.id ? { color: "var(--on-primary)" } : {}}
                aria-label={t(tab.labelKey)}
                title={t(tab.labelKey)}
              >
                <Icon className="w-5 h-5 mb-0.5" />
                {/* Hide label on small screens, show on sm+ */}
                <span className="hidden sm:inline whitespace-nowrap">
                  {t(tab.labelKey)}
                </span>
              </button>
            );
          })}
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as TimeRange)}
          className="
            px-2 py-1.5 sm:px-4.5 sm:py-2.5 
            rounded-2xl border border-(--border-color) 
            text-xs sm:text-sm font-semibold text-(--text-main) 
            focus:outline-none focus:border-(--accent-main) focus:border-[1.5px] 
            bg-white 
            ml-auto
          "
          style={{ minWidth: '36px' }}
        >
          {timeRangeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.labelKey)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
