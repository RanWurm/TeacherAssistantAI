'use client';

import { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Globe } from 'lucide-react';
import { MOCK_LANGUAGE_IMPACT } from '../../data/mock';
import type { TimeRange } from '../../types/insights.types';

/* =======================
   Types
======================= */

type LanguageDatum = {
  language: string;
  articleCount: number;
  totalCitations: number;
  avgCitations: number;
  uniqueJournals: number;
};

type CompareKey =
  | 'avgCitations'
  | 'articleCount'
  | 'totalCitations'
  | 'uniqueJournals';

interface LanguageImpactBarChartProps {
  timeRange: TimeRange;
}

/* =======================
   Comparison options
======================= */

const COMPARISON_OPTIONS: {
  key: CompareKey;
  label: string;
  description: string;
  yAxisLabel: string;
}[] = [
  {
    key: 'avgCitations',
    label: 'Average Citations',
    description: 'Average impact per article',
    yAxisLabel: 'Avg citations',
  },
  {
    key: 'articleCount',
    label: 'Article Volume',
    description: 'Number of published articles',
    yAxisLabel: 'Articles',
  },
  {
    key: 'totalCitations',
    label: 'Total Citations',
    description: 'Overall citation volume',
    yAxisLabel: 'Total citations',
  },
  {
    key: 'uniqueJournals',
    label: 'Journal Diversity',
    description: 'Breadth across journals',
    yAxisLabel: 'Journals',
  },
];

/* =======================
   Tooltip
======================= */

function LanguageTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: LanguageDatum }>;
}) {
  if (!active || !payload || !payload[0]) return null;
  const d = payload[0].payload;

  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-md p-3 text-xs min-w-[190px]">
      <div className="font-semibold text-gray-900 mb-1 flex items-center gap-1.5">
        <Globe className="w-3.5 h-3.5 text-gray-500" />
        {d.language}
      </div>

      <div className="space-y-0.5 text-gray-700">
        <div>Avg citations: <b>{d.avgCitations.toFixed(1)}</b></div>
        <div>Articles: <b>{d.articleCount.toLocaleString()}</b></div>
        <div>Total citations: <b>{d.totalCitations.toLocaleString()}</b></div>
        <div>Journals: <b>{d.uniqueJournals}</b></div>
      </div>
    </div>
  );
}

/* =======================
   Main component
======================= */

export function LanguageImpactBarChart({
  timeRange,
}: LanguageImpactBarChartProps) {
  const [compareBy, setCompareBy] = useState<CompareKey>('avgCitations');

  const currentMeta = COMPARISON_OPTIONS.find(o => o.key === compareBy)!;

  const data = useMemo<LanguageDatum[]>(() => {
    return [...MOCK_LANGUAGE_IMPACT]
      .sort((a, b) => b[compareBy] - a[compareBy])
      .slice(0, 5); // Top 5 only
  }, [compareBy]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-500" />
            Language Comparison
          </h3>
          <p className="text-xs text-gray-600 mt-0.5 max-w-md">
            Top 5 languages ranked by <b>{currentMeta.label}</b>.
            {` ${currentMeta.description}.`}
          </p>
        </div>

        {/* Comparison selector */}
        <select
          value={compareBy}
          onChange={e => setCompareBy(e.target.value as CompareKey)}
          className="text-xs border border-gray-300 rounded-md px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {COMPARISON_OPTIONS.map(opt => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 20, bottom: 30, left: 20 }}
          >
            <XAxis
              dataKey="language"
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#ddd' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#ddd' }}
              tickLine={false}
              label={{
                value: currentMeta.yAxisLabel,
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: 12, fill: '#6b7280' },
              }}
            />
            <Tooltip
              content={<LanguageTooltip />}
              cursor={{ fill: '#f3f4f6' }}
            />
            <Bar
              dataKey={compareBy}
              fill="#4f46e5"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>
          Showing top 5 languages
        </span>
        <span>
          {timeRange === '1y'
            ? 'Last year'
            : timeRange === '3y'
            ? 'Last 3 years'
            : timeRange === '5y'
            ? 'Last 5 years'
            : 'All time'}
        </span>
      </div>
    </div>
  );
}
