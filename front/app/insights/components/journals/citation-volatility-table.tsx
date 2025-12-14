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

type Datum = {
  journalName: string;
  avgCitations: number;
  citationStdDev: number;
  articleCount: number;
  minCitations: number;
  maxCitations: number;
};

function TooltipContent({ active, payload }: any) {
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
          <span>Avg. Citations<span className="mx-1">•</span>
            <span className="font-semibold text-violet-700">{d.avgCitations.toFixed(1)}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
          <span>Volatility (std)<span className="mx-1">•</span>
            <span className="font-semibold text-blue-700">{d.citationStdDev.toFixed(1)}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Hash className="w-3.5 h-3.5 text-gray-400" />
          <span>Articles<span className="mx-1">•</span>
            <span className="font-semibold text-gray-900">{d.articleCount.toLocaleString()}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1 text-gray-500">
          <span className="inline-block bg-gray-100 px-2 py-0.5 rounded">
            Range: <span className="font-medium text-gray-600">{d.minCitations} – {d.maxCitations}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

// Custom label renderer for each scatter dot to show journal name
function DotLabel(props: any) {
  const { x, y, index } = props;
  const datum = MOCK_CITATION_VOLATILITY[index];
  if (!datum) return null;
  // Make label a little bigger and visually centered above the dot
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
  const xVals = MOCK_CITATION_VOLATILITY.map(d => d.avgCitations);
  const yVals = MOCK_CITATION_VOLATILITY.map(d => d.citationStdDev);

  const avgX = xVals.reduce((a, b) => a + b, 0) / xVals.length;
  const avgY = yVals.reduce((a, b) => a + b, 0) / yVals.length;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-gray-900">
          Citation Volatility Map
        </h3>
        <p className="text-xs text-gray-600 mt-1">
          Each dot represents a <b>journal</b>. Position shows citation impact and stability. <br />
          <span className="text-[0.95em] text-gray-500">
            <b>Tip:</b> Journal name is shown above each dot.
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
              <b>X-axis:</b> Average citations per article  
              <span className="text-gray-400">→ further right = higher impact</span>
            </span>
          </div>
          <div className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-pink-500 mt-0.5" />
            <span>
              <b>Y-axis:</b> Citation volatility (std dev)  
              <span className="text-gray-400">→ higher = less predictable</span>
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Hash className="w-4 h-4 text-gray-400 mt-0.5" />
            <span>
              <b>Bubble size:</b> Number of articles published
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
                  value="Average Citations"
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
                  value="Volatility (Std Dev)"
                  angle={-90}
                  position="insideLeft"
                  offset={6}
                  className="text-xs text-gray-500"
                />
              </YAxis>

              {/* Reference lines = mental model, not decoration */}
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
