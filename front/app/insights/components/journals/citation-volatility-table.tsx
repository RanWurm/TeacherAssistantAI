import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Label,
  ZAxis,
} from 'recharts';
import { useTranslation, Trans } from 'react-i18next';
import { useInsightsJournals } from '@/hooks/insights/useInsightsJournals';
import type { TimeRange } from '@/lib/api/insights.api';

// Typed according to backend SubjectImpactPoint
type Datum = {
  journalName: string;
  subjectCount: number;
  impactFactor: number | null;
  articleCount: number;
};

// Mini chart skeleton while loading (smaller, more chart focus)
function ChartLoadingSkeleton() {
  // Animated skeleton chart with blue tones and animate-pulse
  return (
    <div className="flex flex-col items-center justify-center h-[40vh] min-h-[240px]">
      <div className="relative w-full h-full max-w-4xl min-h-[180px] aspect-[2.8/1] animate-pulse">
        {/* Chart grid background in blue */}
        <div className="absolute inset-0">
          {[...Array(4)].map((_, i) => (
            <div
              key={`h${i}`}
              className="absolute left-0 right-0 border-t border-dashed border-blue-100"
              style={{ top: `${25 * i}%`, height: '1px' }}
            />
          ))}
          {[...Array(8)].map((_, i) => (
            <div
              key={`v${i}`}
              className="absolute top-0 bottom-0 border-l border-dashed border-blue-100"
              style={{ left: `${25 * i}%`, width: '1px' }}
            />
          ))}
        </div>
        {/* Blue skeleton dots */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((_, i) => {
          const skeletonBg = [
            'bg-blue-200',
            'bg-blue-300',
            'bg-blue-400',
            'bg-blue-100',
            'bg-blue-300',
            'bg-blue-200',
            'bg-blue-400',
            'bg-blue-100'
          ];
          return (
            <div
              key={i}
              className={`absolute rounded-full ${skeletonBg[i % skeletonBg.length]}`}
              style={{
                left: `${8 + i * 11.5}%`,
                bottom: `${10 + (i % 4) * 18}%`,
                width: 14 + (i % 2) * 6,
                height: 14 + ((i + 1) % 2) * 6,
                opacity: 0.5,
                filter: 'blur(0.5px)',
              }}
            />
          );
        })}
        {/* Blue axis lines */}
        <div className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-200 rounded" />
        <div className="absolute left-0 bottom-0 h-full w-0.5 bg-blue-200 rounded" />
      </div>
      {/* Axis label skeletons in blue */}
      <div className="flex justify-between w-full max-w-4xl mt-2 animate-pulse">
        <div className="h-3 w-32 bg-blue-100 rounded" />
        <div className="h-3 w-12 bg-blue-50 rounded" />
      </div>
    </div>
  );
}

function ChartContent({
  chartData,
  t,
}: {
  chartData: Datum[];
  t: (s: string) => string;
}) {
  // Y axis domain:
  const yMin = chartData?.length ? Math.max(0.1, Math.min(...chartData.map(d => d.impactFactor!))) : 0;
  const yMax = chartData?.length ? Math.max(...chartData.map(d => d.impactFactor!)) : 'auto';

  return (
    <>
      <div className="p-4" style={{ minHeight: 450 }}>
        
        <div style={{ height: '40vh', minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis
                type="number"
                dataKey="subjectCount"
                domain={[0, 'dataMax + 5']}
                tickFormatter={subjectCount =>
                  subjectCount >= 800 ? '800+' : subjectCount
                }
              >
                <Label value="Number of subjects" position="insideBottom" dy={15} />
              </XAxis>
              <YAxis
                type="number"
                dataKey="impactFactor"
                scale="log"
                padding={{ top: 20, bottom: 20 }}
                domain={[yMin, yMax]}
                allowDataOverflow
                tickCount={20}
                tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
              >
                <Label
                  value="Impact Factor"
                  angle={-90}
                  position="middle"
                  dx={-40}
                />
              </YAxis>
              <ZAxis
                dataKey="articleCount"
                range={[60, 120]}
                name="Article count"
              />
              <Tooltip
                content={renderTooltipContent as any}
                formatter={(
                  value: number,
                  name: string,
                  props: any
                ) => {
                  if (name === "subjectCount" && value >= 800) {
                    return ["800+", "Number of subjects"];
                  }
                  if (name === "impactFactor" && (value === null || isNaN(Number(value)))) {
                    return ["N/A", "Impact Factor"];
                  }
                  return [value, name];
                }}
              />
              <Scatter
                data={chartData}
                fill="#6366f1"
                cursor="pointer"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="border-t bg-gray-50 px-4 py-3 text-xs text-gray-700">
          <div className="font-semibold mb-1">{t('insights.journals.citationVolatilityTable.howToReadTitle') || "How to read"}</div>
          <ul className="list-disc list-inside space-y-0.5">
            <li>
              <b>Left</b> = more focused journals · <b>Right</b> = more interdisciplinary
            </li>
            <li>
              <b>Higher</b> = stronger impact (avg. citations per article)
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

// Tooltip adopted for recharts, compatible signature (no debug logs)
function renderTooltipContent(props: any) {
  const { active, payload } = props;
  if (!active || !payload?.length) return null;
  const d: Datum = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs">
      <div className="font-semibold mb-1">{d.journalName}</div>
      <div>
        Impact Factor:{" "}
        <b>{d.impactFactor === null ? <span className="text-gray-400">N/A</span> : d.impactFactor}</b>
      </div>
      <div className="text-gray-500 mt-1">
        {d.subjectCount} subjects · {d.articleCount} articles
      </div>
    </div>
  );
}

export function SubjectImpactChart({ timeRange }: { timeRange: TimeRange }) {
  const { t } = useTranslation();
  const { data, loading } = useInsightsJournals(timeRange);

  // Defensive: Drop null/NaN impactFactor, filter small N, cap subjectCount visually at 800
  const chartData: Datum[] = (data?.subjectImpact as Datum[] | undefined)?.map(d => ({
    ...d,
    impactFactor: Number(d.impactFactor),
    subjectCount: d.subjectCount >= 800 ? 800 : d.subjectCount,
  })) ?? [];

  if (loading) {
    return (
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="p-4" style={{ minHeight: 260 }}>
          {/* Chart area skeleton, more chart, fewer/finer UI elements */}
          <ChartLoadingSkeleton />
          {/* How to read section faint */}
          <div className="border-t bg-gray-50 px-4 py-3 text-xs text-gray-200 mt-2">
            <div className="font-semibold mb-1">{t('insights.journals.citationVolatilityTable.howToReadTitle') || "How to read"}</div>
            <ul className="list-disc list-inside space-y-0.5">
              <li>
                <b>Left</b> = more focused journals · <b>Right</b> = more interdisciplinary
              </li>
              <li>
                <b>Higher</b> = stronger impact (avg. citations per article)
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.subjectImpact) {
    return (
      <div className="bg-white border rounded-lg p-6 text-center text-red-500">
        {t('error_loading_data') || "Failed to load"}
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="bg-white border rounded-lg p-6 text-center text-gray-400">
        {t('no_data_available') || "No data available"}
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <ChartContent chartData={chartData} t={t} />
    </div>
  );
}
