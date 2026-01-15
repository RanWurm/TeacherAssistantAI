// Type definitions for Insights analytics based on SQL-queryable data

// These types correspond to the tab and time range keys in the English i18n (en.json, "insights.tabs", "insights.timeRanges")
export type TimeRange = '1y' | '3y' | '5y' | 'all';
export type ViewType = 'overview' | 'trends' | 'researchers' | 'journals' | 'cross';

