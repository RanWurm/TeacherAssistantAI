import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Label,
  ZAxis,
  ReferenceLine,
  Text,
} from 'recharts';
import { MOCK_CITATION_VOLATILITY } from '../../data/mock';
import { Book, BarChart2, TrendingUp, Hash } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';

type Datum = {
  journalName: string;
  avgCitations: number;
  citationStdDev: number;
  articleCount: number;
  minCitations: number;
  maxCitations: number;
};

function TooltipContent({ active, payload }: any) {
  const { t } = useTranslation();
  if (!active || !payload?.length) return null;
  const d: Datum = payload[0].payload;

  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-xl p-4 text-sm min-w-[250px] transition-all duration-150">
      <div className="flex items-center gap-2 mb-3">
        <Book className="w-4 h-4 text-violet-600" />
        <span className="font-semibold text-gray-900 text-base">{d.journalName}</span>
      </div>

      <div className="flex flex-col gap-1 text-gray-800">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-3.5 h-3.5 text-gray-400" />
          <span>
            {t('insights.journals.citationVolatilityChart.tooltip.avgCitations')}
            <span className="mx-1">•</span>
            <span className="font-semibold text-violet-700">{d.avgCitations.toFixed(1)}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
          <span>
            {t('insights.journals.citationVolatilityChart.tooltip.volatility')}
            <span className="mx-1">•</span>
            <span className="font-semibold text-blue-700">{d.citationStdDev.toFixed(1)}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Hash className="w-3.5 h-3.5 text-gray-400" />
          <span>
            {t('insights.journals.citationVolatilityChart.tooltip.articles')}
            <span className="mx-1">•</span>
            <span className="font-semibold text-gray-900">{d.articleCount.toLocaleString()}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1 text-gray-500">
          <span className="inline-block bg-gray-100 px-2 py-0.5 rounded">
            <Trans
              i18nKey="insights.journals.citationVolatilityChart.tooltip.range"
              values={{ min: d.minCitations, max: d.maxCitations }}
              components={{
                1: <span className="font-medium text-gray-600" />,
                2: <span className="font-medium text-gray-600" />
              }}
            >
              Range: <span className="font-medium text-gray-600">{d.minCitations}</span> – <span className="font-medium text-gray-600">{d.maxCitations}</span>
            </Trans>
          </span>
        </div>
      </div>
    </div>
  );
}

function DotLabel(props: any) {
  const { x, y, index } = props;
  const datum = MOCK_CITATION_VOLATILITY[index];
  if (!datum) return null;
  return (
    <Text
      x={x}
      y={y - 18}
      textAnchor="middle"
      fontSize={13}
      fill="#4b5563"
      style={{
        fontWeight: 600,
        userSelect: 'none',
        pointerEvents: 'none'
      }}
      alignmentBaseline="middle"
      verticalAnchor="end"
    >
      {datum.journalName}
    </Text>
  );
}

export function CitationVolatilityChart() {
  const { t } = useTranslation();

  const xVals = MOCK_CITATION_VOLATILITY.map(d => d.avgCitations);
  const yVals = MOCK_CITATION_VOLATILITY.map(d => d.citationStdDev);

  const avgX = xVals.reduce((a, b) => a + b, 0) / xVals.length;
  const avgY = yVals.reduce((a, b) => a + b, 0) / yVals.length;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-gray-900">
          {t('insights.journals.citationVolatilityChart.title')}
        </h3>
        <p className="text-xs text-gray-600 mt-1">
          <Trans i18nKey="insights.journals.citationVolatilityChart.description" components={{ 1: <b /> }} />
          <br />
          <span className="text-[0.95em] text-gray-500">
            <Trans i18nKey="insights.journals.citationVolatilityChart.tip" components={{ 1: <b /> }} />
          </span>
        </p>
      </div>

      {/* Layout: Explanation ("How to read") to the left of chart */}
      <div className="flex flex-col md:flex-row md:items-stretch md:gap-6 mb-4">
        {/* How to read */}
        <div className="mb-4 md:mb-0 md:w-60 shrink-0 text-xs text-gray-600 flex flex-col gap-3 justify-center">
          <div className="flex items-start gap-2">
            <BarChart2 className="w-4 h-4 text-indigo-400 mt-0.5" />
            <span>
              <Trans i18nKey="insights.journals.citationVolatilityChart.howToRead.xAxis" components={{ 1: <b />, 2: <span className="text-gray-400" /> }} />
            </span>
          </div>
          <div className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-pink-500 mt-0.5" />
            <span>
              <Trans i18nKey="insights.journals.citationVolatilityChart.howToRead.yAxis" components={{ 1: <b />, 2: <span className="text-gray-400" /> }} />
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Hash className="w-4 h-4 text-gray-400 mt-0.5" />
            <span>
              <Trans i18nKey="insights.journals.citationVolatilityChart.howToRead.bubbleSize" components={{ 1: <b /> }} />
            </span>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64 max-w-md w-full mx-auto">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 0, bottom: 30, left: 0 }}>
              <XAxis
                type="number"
                dataKey="avgCitations"
                tick={{ fontSize: 11 }}
                axisLine={{ stroke: '#ddd' }}
                tickLine={false}
              >
                <Label
                  value={t('insights.journals.citationVolatilityChart.xAxisLabel')}
                  position="insideBottom"
                  offset={-8}
                  className="text-xs text-gray-500"
                />
              </XAxis>

              <YAxis
                type="number"
                dataKey="citationStdDev"
                tick={{ fontSize: 11 }}
                axisLine={{ stroke: '#ddd' }}
                tickLine={false}
              >
                <Label
                  value={t('insights.journals.citationVolatilityChart.yAxisLabel')}
                  angle={-90}
                  position="insideLeft"
                  offset={6}
                  className="text-xs text-gray-500"
                />
              </YAxis>

              <ReferenceLine
                x={avgX}
                stroke="#e5e7eb"
                strokeDasharray="3 3"
              />
              <ReferenceLine
                y={avgY}
                stroke="#e5e7eb"
                strokeDasharray="3 3"
              />

              <ZAxis dataKey="articleCount" range={[50, 170]} />

              <Tooltip content={<TooltipContent />} />

              <Scatter
                data={MOCK_CITATION_VOLATILITY}
                fill="#7c3aed"
                opacity={0.8}
                label={DotLabel}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
