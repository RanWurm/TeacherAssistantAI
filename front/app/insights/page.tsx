'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, Award, Users, BookOpen, Calendar, Globe, Zap } from 'lucide-react';

interface TopResearcher {
  name: string;
  papers: number;
  citations: number;
  hIndex: number;
}

interface TopJournal {
  name: string;
  papers: number;
  avgCitations: number;
  impactFactor: number;
}

interface TrendingTopic {
  topic: string;
  papers: number;
  growth: number;
}

const MOCK_RESEARCHERS: TopResearcher[] = [
  { name: 'Prof. Sarah Johnson', papers: 342, citations: 12450, hIndex: 45 },
  { name: 'Dr. Michael Chen', papers: 289, citations: 9876, hIndex: 38 },
  { name: 'Prof. Emma Williams', papers: 267, citations: 8934, hIndex: 36 },
  { name: 'Dr. James Brown', papers: 234, citations: 7543, hIndex: 32 },
  { name: 'Prof. Lisa Garcia', papers: 221, citations: 6789, hIndex: 30 },
];

const MOCK_JOURNALS: TopJournal[] = [
  { name: 'Nature', papers: 15234, avgCitations: 42.3, impactFactor: 49.96 },
  { name: 'Science', papers: 12456, avgCitations: 38.7, impactFactor: 47.73 },
  { name: 'Cell', papers: 9876, avgCitations: 35.2, impactFactor: 41.58 },
  { name: 'The Lancet', papers: 8765, avgCitations: 32.1, impactFactor: 39.21 },
  { name: 'PNAS', papers: 7654, avgCitations: 28.9, impactFactor: 11.21 },
];

const MOCK_TOPICS: TrendingTopic[] = [
  { topic: 'Artificial Intelligence', papers: 45678, growth: 234 },
  { topic: 'Climate Change', papers: 38921, growth: 156 },
  { topic: 'Quantum Computing', papers: 12345, growth: 389 },
  { topic: 'CRISPR', papers: 9876, growth: 178 },
  { topic: 'Renewable Energy', papers: 23456, growth: 145 },
];

const YEARLY_DATA = [
  { year: 2019, papers: 28500 },
  { year: 2020, papers: 32100 },
  { year: 2021, papers: 38900 },
  { year: 2022, papers: 45600 },
  { year: 2023, papers: 52300 },
  { year: 2024, papers: 48200 },
];

export default function InsightsPage() {
  const [selectedView, setSelectedView] = useState<'overview' | 'topics' | 'researchers' | 'journals'>('overview');
  const [timeRange, setTimeRange] = useState<'1y' | '3y' | '5y' | 'all'>('5y');

  const maxPapers = Math.max(...YEARLY_DATA.map(d => d.papers));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-lg bg-white/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Research Analytics</h1>
                <p className="text-xs text-slate-500">Insights from CORE dataset</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="1y">Last Year</option>
                <option value="3y">Last 3 Years</option>
                <option value="5y">Last 5 Years</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* View Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'topics', label: 'Trending Topics', icon: TrendingUp },
            { id: 'researchers', label: 'Top Researchers', icon: Users },
            { id: 'journals', label: 'Top Journals', icon: BookOpen },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedView(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                selectedView === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {selectedView === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Papers', value: '245.6M', change: '+12.3%', icon: BookOpen, color: 'from-blue-500 to-indigo-500' },
                { label: 'Active Researchers', value: '8.4M', change: '+8.7%', icon: Users, color: 'from-purple-500 to-pink-500' },
                { label: 'Research Topics', value: '12.3K', change: '+15.2%', icon: Globe, color: 'from-green-500 to-emerald-500' },
                { label: 'Citations', value: '1.8B', change: '+22.1%', icon: Award, color: 'from-orange-500 to-red-500' },
              ].map((metric, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center shadow-lg`}>
                      <metric.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                      {metric.change}
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-slate-900 mb-1">{metric.value}</p>
                  <p className="text-sm text-slate-500">{metric.label}</p>
                </div>
              ))}
            </div>

            {/* Publications Timeline */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-1">Publications Over Time</h2>
                  <p className="text-sm text-slate-500">Number of papers published per year</p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">2019-2024</span>
                </div>
              </div>

              <div className="space-y-4">
                {YEARLY_DATA.map((data, idx) => {
                  const percentage = (data.papers / maxPapers) * 100;
                  const growth = idx > 0 ? ((data.papers - YEARLY_DATA[idx - 1].papers) / YEARLY_DATA[idx - 1].papers * 100).toFixed(1) : '0';
                  
                  return (
                    <div key={data.year} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">{data.year}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-900 font-semibold">{data.papers.toLocaleString()}</span>
                          {idx > 0 && (
                            <span className={`text-xs font-medium ${parseFloat(growth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {parseFloat(growth) >= 0 ? '+' : ''}{growth}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="relative h-10 bg-slate-100 rounded-lg overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg transition-all duration-1000 flex items-center justify-end pr-3"
                          style={{ width: `${percentage}%` }}
                        >
                          {percentage > 30 && (
                            <span className="text-xs font-medium text-white">
                              {data.papers.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Trending Topics */}
        {selectedView === 'topics' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-1">Trending Research Topics</h2>
              <p className="text-sm text-slate-500">Topics with highest growth in publications</p>
            </div>

            <div className="space-y-4">
              {MOCK_TOPICS.map((topic, idx) => (
                <div key={idx} className="group hover:bg-slate-50 rounded-xl p-4 transition-colors border border-transparent hover:border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-slate-300">#{idx + 1}</span>
                      <div>
                        <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {topic.topic}
                        </h3>
                        <p className="text-sm text-slate-500">{topic.papers.toLocaleString()} papers</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-lg">
                        +{topic.growth}% growth
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min((topic.papers / MOCK_TOPICS[0].papers) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Researchers */}
        {selectedView === 'researchers' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900 mb-1">Top Researchers</h2>
              <p className="text-sm text-slate-500">Most influential researchers by citations and h-index</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Researcher</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Papers</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Citations</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">h-Index</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_RESEARCHERS.map((researcher, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {idx < 3 ? (
                            <Award className={`w-5 h-5 ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-slate-400' : 'text-orange-600'}`} />
                          ) : (
                            <span className="text-sm font-medium text-slate-500">#{idx + 1}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                            {researcher.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="font-medium text-slate-900">{researcher.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700 font-medium">{researcher.papers.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-slate-700 font-medium">{researcher.citations.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold">
                          {researcher.hIndex}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Top Journals */}
        {selectedView === 'journals' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900 mb-1">Top Academic Journals</h2>
              <p className="text-sm text-slate-500">Leading journals by publications and impact factor</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Journal</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Papers</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Avg Citations</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Impact Factor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_JOURNALS.map((journal, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-500">#{idx + 1}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-900">{journal.name}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700 font-medium">{journal.papers.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-slate-700 font-medium">{journal.avgCitations}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-green-50 text-green-700 text-sm font-semibold">
                          {journal.impactFactor}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}