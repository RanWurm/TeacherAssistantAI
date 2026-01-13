'use client';

import { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Globe } from 'lucide-react';
import type { TimeRange } from '../../types/insights.types';
import { useTranslation, Trans } from 'react-i18next';
import { useInsightsCross } from '@/hooks/insights/useInsightsCross';

/* ======================= Types ======================= */
type LanguageDatum = {
  language: string;
  articleCount: number;
  avgCitations: number;
};
type CompareKey = 'avgCitations' | 'articleCount';

interface LanguageImpactBarChartProps {
  timeRange: TimeRange;
}

/* ======================= Tooltip, mapped/labels from i18n ======================= */
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

  // Use translation for explanation, fallback to language code
  const languageExplanation = t(
    `insights.cross.languageImpactBarChart.languageExplanations.${d.language.toLowerCase()}`,
    { defaultValue: '' }
  );

  // Display metric values
  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-md p-3 text-xs min-w-[190px]">
      <div className="font-semibold text-gray-900 mb-1 flex items-center gap-1.5">
        <Globe className="w-3.5 h-3.5 text-gray-500" />
        {d.language}
        {languageExplanation && languageExplanation !== d.language.toLowerCase() && (
          <span className="ml-1 text-gray-500 font-normal text-[11px]">
            ({languageExplanation})
          </span>
        )}
      </div>
      <div className="space-y-0.5 text-gray-700">
        <div>
          {t('insights.cross.languageImpactBarChart.tooltip.avgCitations')}:{' '}
          <span className="font-mono">{Number(d.avgCitations)}</span>
        </div>
        <div>
          {t('insights.cross.languageImpactBarChart.tooltip.articleCount')}:{' '}
          <span className="font-mono">{d.articleCount}</span>
        </div>
      </div>
    </div>
  );
}

/* ======================= Main component ======================= */
export function LanguageImpactBarChart({ timeRange }: LanguageImpactBarChartProps) {
  const { t, i18n } = useTranslation();

  // Detect RTL (Hebrew) by i18n.language
  const isRTL = i18n.language === 'he';

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
  ];

  const [compareBy, setCompareBy] = useState<CompareKey>('avgCitations');
  const currentMeta = COMPARISON_OPTIONS.find(o => o.key === compareBy)!;

  // --- Use useInsightsCross to get languageImpact ---
  const { data: crossData, loading } = useInsightsCross(timeRange);
  const languageImpact = crossData?.languageImpact as LanguageDatum[] | undefined;

  // Memoize sorted, (and if RTL, reverse) and sliced data, or empty array if loading
  const data = useMemo<LanguageDatum[]>(() => {
    if (!languageImpact || loading) return [];
    const sorted = [...languageImpact].sort((a, b) => b[compareBy] - a[compareBy]).slice(0, 5);
    return isRTL ? [...sorted].reverse() : sorted;
  }, [languageImpact, compareBy, loading, isRTL]);

  // Add explanations to XAxis labels using translation for explanation, fallback to language code
  function getLanguageLabel(language: string) {
    const expl = t(
      `insights.cross.languageImpactBarChart.languageExplanations.${language.toLowerCase()}`,
      { defaultValue: '' }
    );
    return expl && expl !== language.toLowerCase()
      ? `${language} (${expl})`
      : language;
  }
  
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
              components={{ 1: <b /> }}
            />
          </span>
        </div>
        {/* Metric selector */}
        <select
          value={compareBy}
          onChange={e => setCompareBy(e.target.value as CompareKey)}
          className="text-xs border border-gray-300 rounded-md px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          style={isRTL ? { direction: 'rtl', textAlign: 'right' } : undefined}
        >
          {COMPARISON_OPTIONS.map(opt => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {/* Chart */}
      <div className="h-64 relative">
        {loading ? (
          <div className="h-full w-full flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Chart area */}
            <div className={`relative flex-1 px-6 pb-10 flex ${isRTL ? 'flex-row-reverse' : ''}`}>
              {/* Y-axis label placeholder */}
              <div className={`flex flex-col items-center justify-center ${isRTL ? 'order-2' : ''}`}>
                <div className="h-40 w-14 bg-gray-200 rounded-sm animate-pulse" />
              </div>
              {/* Bars + gridlines */}
              <div className="relative flex-1">
                {/* Grid lines (subtle blue) */}
                {[20, 45, 70].map((p, i) => (
                  <div
                    key={i}
                    className="absolute left-0 right-0 h-px bg-blue-50"
                    style={{ bottom: `${p}%` }}
                  />
                ))}
                {/* Bars: reverse order visually for RTL */}
                <div
                  className={`absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 px-6 h-44 ${
                    isRTL ? 'flex-row-reverse' : ''
                  }`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                >
                  {(isRTL ? [25, 30, 38, 45, 60].slice().reverse() : [25, 30, 38, 45, 60]).map((h, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center flex-1 h-full justify-end"
                    >
                      <div
                        className="w-full max-w-[48px] bg-blue-200 rounded-t-md animate-pulse"
                        style={{ height: `${h}%` }}
                      />
                      <div className="h-4 w-16 rounded mt-3 animate-pulse bg-gray-300" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 20, bottom: 30, left: 20 }}
            >
              {/* Trick: use mirrored/swap for X and Y axis for RTL if needed */}
              <XAxis
                type="category"
                dataKey="language"
                tick={({ x, y, payload }) => {
                  const label = getLanguageLabel(payload.value);
                  return (
                    <text
                      x={x}
                      y={y + 8}
                      textAnchor="middle"
                      fontSize={12}
                      fill="#757575"
                    >
                      {label}
                    </text>
                  );
                }}
              />
              <YAxis
                type="number"
                orientation={isRTL ? 'right' : 'left'}
                tick={{ fontSize: 12, textAnchor: 'end' }}
                axisLine={{ stroke: '#ddd' }}
                tickLine={false}
                label={{
                  value: currentMeta.yAxisLabel,
                  angle: -90,
                  position: 'center',
                  dx: isRTL ? 40 : -40,
                  style: { fontSize: 12, fill: '#6b7280' },
                }}
              />
              <Tooltip content={<LanguageTooltip />} cursor={{ fill: '#f3f4f6' }} />
              <Bar dataKey={compareBy} fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
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