'use client';

import { useState } from 'react';
import '../../styles/variables.css';
import { InsightsHeader } from './components/insights-header';
import { ViewTabs } from './components/view-tabs';
import { OverviewView } from './components/overview/overview-view';
import { TrendingTopicsView } from './components/trending-topics/trending-topics-view';
import { ResearchersView } from './components/researchers/researchers-view';
import { JournalsView } from './components/journals/journals-view';

export default function InsightsPage() {
  const [selectedView, setSelectedView] = useState<'overview' | 'topics' | 'researchers' | 'journals'>('overview');
  const [timeRange, setTimeRange] = useState<'1y' | '3y' | '5y' | 'all'>('5y');

  return (
    <div className="min-h-screen bg-linear-to-br from-(--bg-start) via-(--bg-via) to-(--bg-end)">
      <InsightsHeader />

      <div className="max-w-7xl mx-auto px-6 py-6">
        <ViewTabs
          selectedView={selectedView}
          setSelectedView={setSelectedView}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />
        {selectedView === 'overview' && <OverviewView />}
        {selectedView === 'topics' && <TrendingTopicsView />}
        {selectedView === 'researchers' && <ResearchersView />}
        {selectedView === 'journals' && <JournalsView />}
      </div>
    </div>
  );
}
