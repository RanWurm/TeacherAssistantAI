// backend/src/db/ArticleSearchQuery.ts
import { buildSelectQuery } from "./queryBuilder";
import { ArticleSearchFilters } from "../types/ArticleSearchFilters";

function inPlaceholders(n: number) {
  return Array.from({ length: n }, () => "?").join(", ");
}

export function buildArticlesSearchQuery(filters: ArticleSearchFilters) {
  const joins: any[] = [];
  const where: any[] = [];

  const limit = filters.limit !== undefined ? Number(filters.limit) : undefined;
  const offset = filters.offset !== undefined ? Number(filters.offset) : undefined;

  // ---- AUTHORS (always joined) ----
  joins.push(
    { type: "LEFT JOIN", table: "ArticlesAuthors", as: "aa", on: "a.article_id = aa.article_id" },
    { type: "LEFT JOIN", table: "Authors", as: "au", on: "aa.author_id = au.author_id" }
  );

  // ---- SUBJECTS (always joined) ----
  joins.push(
    { type: "LEFT JOIN", table: "ArticlesSubjects", as: "asub", on: "a.article_id = asub.article_id" },
    { type: "LEFT JOIN", table: "Subjects", as: "s", on: "asub.subject_id = s.subject_id" }
  );

  // ---- KEYWORDS (always joined) ----
  joins.push(
    { type: "LEFT JOIN", table: "ArticlesKeywords", as: "ak", on: "a.article_id = ak.article_id" },
    { type: "LEFT JOIN", table: "Keywords", as: "k", on: "ak.keyword_id = k.keyword_id" }
  );

  // ---- JOURNAL (1-to-1) ----
  joins.push(
    { type: "LEFT JOIN", table: "Journals", as: "j", on: "a.journal_id = j.journal_id" }
  );


  // ---- FILTERS ----
  if (filters.authors?.length) {
    where.push({
      clause: `au.name IN (${inPlaceholders(filters.authors.length)})`,
      value: filters.authors,
    });
  }

  if (filters.subjects?.length) {
    where.push({
      clause: `s.subject_name IN (${inPlaceholders(filters.subjects.length)})`,
      value: filters.subjects,
    });
  }

  if (filters.keywords?.length) {
    where.push({
      clause: `k.keyword IN (${inPlaceholders(filters.keywords.length)})`,
      value: filters.keywords,
    });
  }

  if (filters.language) {
    where.push({ clause: "a.language = ?", value: filters.language });
  }

  if (filters.type) {
    where.push({ clause: "a.type = ?", value: filters.type });
  }

  if (filters.fromYear) {
    where.push({ clause: "a.year >= ?", value: filters.fromYear });
  }

  if (filters.toYear) {
    where.push({ clause: "a.year <= ?", value: filters.toYear });
  }

  const ORDER_BY_MAP: Record<NonNullable<ArticleSearchFilters['sortBy']>, string> = {
    citations: "a.citation_count DESC, a.year DESC",
    year: "a.year DESC, a.citation_count DESC",
  };

  const orderBy =
    filters.sortBy && ORDER_BY_MAP[filters.sortBy]
      ? ORDER_BY_MAP[filters.sortBy]
      : ORDER_BY_MAP.year;

  return buildSelectQuery({
    table: "Articles",
    as: "a",
    columns: [
      "a.article_id",
      "a.openalex_id",
      "a.title",
      "a.year",
      "a.language",
      "a.type",
      "a.citation_count",
      "a.article_url",
      "j.name AS journal",
      "j.publisher AS publisher",
      "j.impact_factor AS impact_factor",
      "GROUP_CONCAT(DISTINCT au.name) AS authors",
      "GROUP_CONCAT(DISTINCT s.subject_name) AS subjects",
      "GROUP_CONCAT(DISTINCT k.keyword) AS keywords",
    ],
    joins,
    filters: where,
    groupBy: "a.article_id",
    orderBy,
    limit,
    offset,
  });
}
