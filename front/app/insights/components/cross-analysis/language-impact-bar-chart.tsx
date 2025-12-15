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
import { useTranslation, Trans } from 'react-i18next';

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
   Tooltip, mapped/labels from i18n
======================= */

function LanguageTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: LanguageDatum }>;
}) {
  const { t } = useTranslation();
  if (!active || !payload || !payload[0]) return null;
  const d = payload[0].payload;

  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-md p-3 text-xs min-w-[190px]">
      <div className="font-semibold text-gray-900 mb-1 flex items-center gap-1.5">
        <Globe className="w-3.5 h-3.5 text-gray-500" />
        {d.language}
      </div>

      <div className="space-y-0.5 text-gray-700">
        <div>
          {t('insights.cross.languageImpactBarChart.tooltip.avgCitations')}: <b>{d.avgCitations.toFixed(1)}</b>
        </div>
        <div>
          {t('insights.cross.languageImpactBarChart.tooltip.articleCount')}: <b>{d.articleCount.toLocaleString()}</b>
        </div>
        <div>
          {t('insights.cross.languageImpactBarChart.tooltip.totalCitations')}: <b>{d.totalCitations.toLocaleString()}</b>
        </div>
        <div>
          {t('insights.cross.languageImpactBarChart.tooltip.uniqueJournals')}: <b>{d.uniqueJournals}</b>
        </div>
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
  const { t } = useTranslation();

  // The metrics and their i18n-driven labels/descriptions
  const COMPARISON_OPTIONS: {
    key: CompareKey;
    label: string;
    description: string;
    yAxisLabel: string;
  }[] = [
    {
      key: 'avgCitations',
      label: t('insights.cross.languageImpactBarChart.metric.avgCitations'),
      description: t('insights.cross.languageImpactBarChart.metricDescription.avgCitations'),
      yAxisLabel: t('insights.cross.languageImpactBarChart.yAxisLabel.avgCitations'),
    },
    {
      key: 'articleCount',
      label: t('insights.cross.languageImpactBarChart.metric.articleCount'),
      description: t('insights.cross.languageImpactBarChart.metricDescription.articleCount'),
      yAxisLabel: t('insights.cross.languageImpactBarChart.yAxisLabel.articleCount'),
    },
    {
      key: 'totalCitations',
      label: t('insights.cross.languageImpactBarChart.metric.totalCitations'),
      description: t('insights.cross.languageImpactBarChart.metricDescription.totalCitations'),
      yAxisLabel: t('insights.cross.languageImpactBarChart.yAxisLabel.totalCitations'),
    },
    {
      key: 'uniqueJournals',
      label: t('insights.cross.languageImpactBarChart.metric.uniqueJournals'),
      description: t('insights.cross.languageImpactBarChart.metricDescription.uniqueJournals'),
      yAxisLabel: t('insights.cross.languageImpactBarChart.yAxisLabel.uniqueJournals'),
    },
  ];

  const [compareBy, setCompareBy] = useState<CompareKey>('avgCitations');

  const currentMeta = COMPARISON_OPTIONS.find(o => o.key === compareBy)!;

  const data = useMemo<LanguageDatum[]>(() => {
    return [...MOCK_LANGUAGE_IMPACT]
      .sort((a, b) => b[compareBy] - a[compareBy])
      .slice(0, 5);
  }, [compareBy]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-500" />
            {t('insights.cross.languageImpactBarChart.title')}
          </h3>
          <span className="text-xs text-gray-600 mt-0.5 max-w-md inline-block">
            <Trans
              i18nKey="insights.cross.languageImpactBarChart.description"
              values={{
                metric: currentMeta.label,
                description: currentMeta.description,
              }}
              components={{
                1: <b />,
              }}
            />
          </span>
        </div>
        {/* Metric selector */}
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
              tick={{ fontSize: 12, dx: -5, direction: "ltr" }}
              axisLine={{ stroke: '#ddd' }}
              tickLine={false}
              label={{
                value: currentMeta.yAxisLabel,
                angle: -90,
                position: 'center',
                dx: -40,
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

      {/* Footer (i18n) */}
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>
          {t('insights.cross.languageImpactBarChart.showingTop')}
        </span>
        <span>
          {t(`insights.cross.languageImpactBarChart.timeRange.${timeRange}`)}
        </span>
      </div>
    </div>
  );
}
