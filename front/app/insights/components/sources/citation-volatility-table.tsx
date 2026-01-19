import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Label,
  ReferenceLine,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { useInsightsSources } from '@/hooks/insights/useInsightsSources';
import type { TimeRange } from '@/lib/api/insights.api';

type Datum = {
  sourceName: string;
  sourceType: string | null;
  subjectCount: number;
  subjectCountVisual: number;
  impactScore: number | null;
  impactScoreVisual: number;
  articleCount: number;
};

function ChartLoadingSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center h-[40vh] min-h-[240px]">
      <div className="relative w-full h-full max-w-4xl min-h-[180px] aspect-[2.8/1] animate-pulse">
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
        <div className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-200 rounded" />
        <div className="absolute left-0 bottom-0 h-full w-0.5 bg-blue-200 rounded" />
      </div>
      <div className="flex justify-between w-full max-w-4xl mt-2 animate-pulse">
        <div className="h-3 w-32 bg-blue-100 rounded" />
        <div className="h-3 w-12 bg-blue-50 rounded" />
      </div>
    </div>
  );
}

type ChartContentProps = {
  chartData: Datum[];
  t: (s: string) => string;
  maxX: number;
  maxY: number;
  xMedian: number;
  yMedian: number;
};

function ChartContent({ chartData, t, maxX, maxY, xMedian, yMedian }: ChartContentProps) {
  return (
    <>
      <div className="p-4" style={{ minHeight: 450 }}>
        <div dir="ltr" style={{ height: '40vh', minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis
                type="number"
                dataKey="subjectCountVisual"
                domain={[1, maxX]}
                tickFormatter={(v) => v === maxX ? `${Math.round(maxX)}+` : v}
              >
                <Label
                  value={t('insights.sources.citationVolatilityTable.xAxis') || "Number of subjects"}
                  position="insideBottom"
                  dy={15}
                />
              </XAxis>
              <YAxis
                type="number"
                dataKey="impactScoreVisual"
                scale="sqrt"
                domain={[10, maxY]}
                tickCount={8}
                tickFormatter={(v) =>
                  v === maxY
                    ? (maxY >= 1000 ? `${Math.round(maxY / 1000)}k+` : `${Math.round(maxY)}+`)
                    : v >= 1000
                      ? `${Math.round(v / 1000)}k`
                      : v
                }
              >
                <Label
                  value={t('insights.sources.citationVolatilityTable.yAxis') || "Impact Score"}
                  angle={-90}
                  position="middle"
                  dx={-40}
                />
              </YAxis>
              <ReferenceLine x={xMedian} stroke="#e5e7eb" />
              <ReferenceLine y={yMedian} stroke="#e5e7eb" />
              <Tooltip
                content={renderTooltipContent as any}
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
          <div className="font-semibold mb-1">{t('insights.sources.citationVolatilityTable.howToReadTitle') || "How to read"}</div>
          <ul className="list-disc list-inside space-y-0.5">
            <li>
              <b>Left</b> = more focused sources · <b>Right</b> = more interdisciplinary
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

function renderTooltipContent(props: any) {
  const { active, payload } = props;
  const { t, i18n } = useTranslation();

  if (!active || !payload?.length) return null;
  const d: Datum = payload[0].payload;
  const dir = typeof i18n.dir === 'function' ? i18n.dir() : (i18n.language === 'he' ? 'rtl' : 'ltr');

  return (
    <div
      dir={dir}
      className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs"
    >
      <div className="font-semibold mb-1">{d.sourceName}</div>
      {d.sourceType && <div className="text-gray-500 mb-1">{d.sourceType}</div>}
      <div>
        {t('insights.sources.citationVolatilityTable.tooltip.impact') || 'Impact Score'}
        {': '}
        <b>
          {d.impactScore === null || d.impactScore === undefined
            ? <span className="text-gray-400">{t('insights.sources.citationVolatilityTable.tooltip.na') || 'N/A'}</span>
            : d.impactScore
          }
        </b>
      </div>
      <div className="text-gray-500 mt-1">
        {t('insights.sources.citationVolatilityTable.tooltip.meta', {
          subjectCount: d.subjectCount,
          articleCount: d.articleCount
        })}
      </div>
    </div>
  );
}

function ChartInsights() {
  const { t } = useTranslation();
  const quadrants = [
    {
      icon: "🔹",
      title: t("insights.sources.citationVolatilityChart.quadrant.lowerLeftTitle", "Lower left (most sources)"),
      items: [
        t("insights.sources.citationVolatilityChart.quadrant.lowerLeft.0", "Few subjects"),
        t("insights.sources.citationVolatilityChart.quadrant.lowerLeft.1", "Low impact"),
        t("insights.sources.citationVolatilityChart.quadrant.lowerLeft.2", "Niche or younger sources"),
      ],
    },
    {
      icon: "🔹",
      title: t("insights.sources.citationVolatilityChart.quadrant.upperLeftTitle", "Upper left (rare)"),
      items: [
        t("insights.sources.citationVolatilityChart.quadrant.upperLeft.0", "Few subjects"),
        t("insights.sources.citationVolatilityChart.quadrant.upperLeft.1", "Very high impact"),
        t("insights.sources.citationVolatilityChart.quadrant.upperLeft.2", "Focused but strong sources (narrow domain, many citations)"),
      ],
    },
    {
      icon: "🔹",
      title: t("insights.sources.citationVolatilityChart.quadrant.lowerRightTitle", "Lower right"),
      items: [
        t("insights.sources.citationVolatilityChart.quadrant.lowerRight.0", "Many subjects"),
        t("insights.sources.citationVolatilityChart.quadrant.lowerRight.1", "Not high impact"),
        t("insights.sources.citationVolatilityChart.quadrant.lowerRight.2", "General but not prestigious sources"),
      ],
    },
    {
      icon: "🔹",
      title: t("insights.sources.citationVolatilityChart.quadrant.upperRightTitle", "Upper right (almost none)"),
      items: [
        t("insights.sources.citationVolatilityChart.quadrant.upperRight.0", "Many subjects"),
        t("insights.sources.citationVolatilityChart.quadrant.upperRight.1", "High impact"),
        t("insights.sources.citationVolatilityChart.quadrant.upperRight.2", "The 'Nature/Science/PNAS' of the world"),
      ],
    }
  ];

  return (
    <div className="border-t bg-gray-50 px-4 py-3 text-xs text-gray-700 leading-relaxed">
      <div className="font-semibold mb-2 text-base">
        {t("insights.sources.citationVolatilityChart.whatYouSeeTitle", "2️⃣ So what does the chart show?")}
      </div>
      <div className="space-y-3">
        {quadrants.map((q, i) => (
          <div key={i}>
            <div className="font-semibold text-blue-600 flex items-center mb-1">
              <span className="mr-2">{q.icon}</span>
              {q.title}
            </div>
            <ul className="list-disc list-inside ms-5 space-y-0.5">
              {q.items.map((line, idx) => (
                <li key={idx}>{line}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function roundMaxX(values: number[]): number {
  if (!values.length) return 100;
  const max = Math.max(...values);

  if (max >= 2000) {
    return Math.floor(max / 1300) * 1000;
  }
  return Math.floor(max / 130) * 100;
}

function roundMaxY(values: number[]): number {
  if (!values.length) return 200000;
  const max = Math.max(...values);
  if (max >= 100_000) {
    return Math.floor(max / 130_000) * 100_000;
  }
  return Math.floor(max / 13_000) * 10_000;
}

export function SubjectImpactChart({ timeRange }: { timeRange: TimeRange }) {
  const { t } = useTranslation();
  const { data, loading } = useInsightsSources(timeRange);

  const subjectCounts =
    data?.subjectImpact?.map((d: any) => d.subjectCount) ?? [];

  const impactScores =
    data?.subjectImpact
      ?.map((d: any) =>
        d.impactScore === undefined || d.impactScore === null || isNaN(Number(d.impactScore))
          ? undefined
          : Number(d.impactScore)
      )
      .filter((v: number | undefined) => typeof v === 'number' && !isNaN(v)) as number[] ?? [];

  const maxX = roundMaxX(subjectCounts);
  const maxY = roundMaxY(impactScores);

  const xMedian = maxX / 3;
  const yMedian = maxY / 3;

  const chartData: Datum[] =
    (data?.subjectImpact as Datum[] | undefined)?.map(d => ({
      ...d,
      impactScore:
        d.impactScore === undefined || d.impactScore === null || isNaN(Number(d.impactScore))
          ? null
          : Number(d.impactScore),
      impactScoreVisual: Math.min(Number(d.impactScore), maxY),
      subjectCount: d.subjectCount,
      subjectCountVisual: Math.min(d.subjectCount, maxX),
    })) ?? [];

  if (loading) {
    return (
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="p-4" style={{ minHeight: 260 }}>
          <ChartLoadingSkeleton />
          <div className="border-t bg-gray-50 px-4 py-3 text-xs text-gray-200 mt-2">
            <div className="font-semibold mb-1">{t('insights.sources.citationVolatilityTable.howToReadTitle') || "How to read"}</div>
            <ul className="list-disc list-inside space-y-0.5">
              <li>
                <b>Left</b> = more focused sources · <b>Right</b> = more interdisciplinary
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
      <ChartContent
        chartData={chartData}
        t={t}
        maxX={maxX}
        maxY={maxY}
        xMedian={xMedian}
        yMedian={yMedian}
      />
      <ChartInsights />
    </div>
  );
}