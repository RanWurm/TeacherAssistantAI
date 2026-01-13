// Type definitions for Insights analytics based on SQL-queryable data

// These types correspond to the tab and time range keys in the English i18n (en.json, "insights.tabs", "insights.timeRanges")
export type TimeRange = '1y' | '3y' | '5y' | 'all';
export type ViewType = 'overview' | 'trends' | 'researchers' | 'journals' | 'cross';

// // Overview Metrics
// export interface OverviewMetrics {
//   totalArticles: number;
//   totalAuthors: number;
//   totalJournals: number;
//   totalSubjects: number;
//   totalKeywords: number;
//   avgCitationsPerArticle: number;
//   articlesWithMultipleSubjects: number;
//   articlesWithMultipleAuthors: number;
// }

// // Publications Timeline
// export interface PublicationTimelinePoint {
//   year: number;
//   articleCount: number;
//   authorCount: number;
//   journalCount: number;
// }

// // Multidisciplinary Summary
// export interface MultidisciplinarySummary {
//   singleSubjectArticles: number;
//   multiSubjectArticles: number;
//   avgSubjectsPerArticle: number;
//   mostCommonSubjectCombination: {
//     subjects: string[];
//     articleCount: number;
//   };
// }

// // Trending Topics
// export interface TrendingTopic {
//   keyword: string;
//   articleCount: number;
//   firstAppearanceYear: number | null;
//   latestYear: number | null;
// }

// // Keyword Growth
// export interface KeywordGrowth {
//   keyword: string;
//   year: number;
//   articleCount: number;
//   previousYearCount: number;
//   growth: number; // absolute growth
// }

// // Keyword Cross-Domain
// export interface KeywordCrossDomain {
//   keyword: string;
//   subjectCount: number;
//   articleCount: number;
//   subjects: string[];
// }

// // Researcher Statistics
// export interface TopResearcher {
//   authorId: number;
//   name: string;
//   affiliation: string | null;
//   articleCount: number;
//   totalCitations: number;
//   avgCitationsPerArticle: number;
//   uniqueJournals: number;
//   uniqueSubjects: number;
// }

// // Multidisciplinary Researcher
// export interface MultidisciplinaryResearcher {
//   authorId: number;
//   name: string;
//   affiliation: string | null;
//   articleCount: number;
//   subjectCount: number;
//   subjects: string[];
//   avgCitationsPerArticle: number;
// }

// // Journal Statistics
// export interface TopJournal {
//   journalId: number;
//   name: string;
//   publisher: string | null;
//   articleCount: number;
//   totalCitations: number;
//   avgCitationsPerArticle: number;
//   uniqueAuthors: number;
//   uniqueSubjects: number;
//   impactFactor: number | null;
// }

// // Citation Volatility (variance in citations across articles)
// export interface CitationVolatility {
//   journalId: number;
//   journalName: string;
//   articleCount: number;
//   avgCitations: number;
//   minCitations: number;
//   maxCitations: number;
//   citationStdDev: number;
// }

// // Cross-Analysis: Subject-Journal Heatmap
// export interface SubjectJournalHeatmap {
//   subjectName: string;
//   journalName: string;
//   articleCount: number;
// }

// // Language Impact
// export interface LanguageImpact {
//   language: string;
//   articleCount: number;
//   avgCitations: number;
//   totalCitations: number;
//   uniqueJournals: number;
// }

// // Multidisciplinary vs Single Subject
// export interface MultidisciplinaryComparison {
//   category: 'single-subject' | 'multi-subject';
//   articleCount: number;
//   avgCitations: number;
//   totalCitations: number;
//   uniqueAuthors: number;
//   uniqueJournals: number;
// }

