'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/variables.css';
import { InsightsHeader } from './components/insights-header';
import { ViewTabs } from './components/view-tabs';
import { OverviewView } from './components/overview/overview-view';
import { TrendsView } from './components/trends/trends-view';
import { ResearchersView } from './components/researchers/researchers-view';
import { SourcesView } from './components/sources/sources-view';
import { CrossAnalysisView } from './components/cross-analysis/cross-analysis-view';
import type { ViewType, TimeRange } from './types/insights.types';

export default function InsightsPage() {
  const { t } = useTranslation();
  const [selectedView, setSelectedView] = useState<ViewType>('overview');
  const [timeRange, setTimeRange] = useState<TimeRange>('5y');

  return (
    <div className="min-h-screen bg-linear-to-br from-(--bg-start) via-(--bg-via) to-(--bg-end)">
      <InsightsHeader />

      <div className="max-w-7xl mx-auto px-6 py-6">
        <h1 className="text-3xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
          {t('insights.pageTitle')}
        </h1>
        <ViewTabs
          selectedView={selectedView}
          setSelectedView={setSelectedView}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />
        {selectedView === 'overview' && <OverviewView timeRange={timeRange} />}
        {selectedView === 'trends' && <TrendsView timeRange={timeRange} />}
        {selectedView === 'researchers' && <ResearchersView timeRange={timeRange} />}
        {selectedView === 'sources' && <SourcesView timeRange={timeRange} />}
        {selectedView === 'cross' && <CrossAnalysisView timeRange={timeRange} />}
      </div>
    </div>
  );
}