// backend/src/db/ArticleSearchQuery.ts
import { buildSelectQuery } from "../queryBuilder";

function inPlaceholders(n: number): string {
  if (n <= 0) return "NULL";
  return Array.from({ length: n }, () => "?").join(", ");
}

export function buildArticlesByIdsQuery(articleIds: number[]) {
  if (!Array.isArray(articleIds) || articleIds.length === 0) {
    return {
      sql: "SELECT * FROM Articles WHERE 1=0",
      params: [],
    };
  }

  const placeholders = inPlaceholders(articleIds.length);
  const orderByField = `ORDER BY FIELD(a.article_id, ${placeholders})`;

  const { sql, params } = buildSelectQuery({
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
      // Replace a.views with av.view_count as views
      "av.view_count AS views",
      "src.name AS source",
      "src.type AS source_type",
      "src.publisher AS publisher",
      "GROUP_CONCAT(DISTINCT au.name) AS authors",
      "GROUP_CONCAT(DISTINCT s.subject_name) AS subjects",
      "GROUP_CONCAT(DISTINCT k.keyword) AS keywords",
    ],
    joins: [
      { type: "LEFT JOIN", table: "Sources", as: "src", on: "a.source_id = src.source_id" },
      { type: "LEFT JOIN", table: "ArticlesAuthors", as: "aa", on: "a.article_id = aa.article_id" },
      { type: "LEFT JOIN", table: "Authors", as: "au", on: "aa.author_id = au.author_id" },
      { type: "LEFT JOIN", table: "ArticlesSubjects", as: "asub", on: "a.article_id = asub.article_id" },
      { type: "LEFT JOIN", table: "Subjects", as: "s", on: "asub.subject_id = s.subject_id" },
      { type: "LEFT JOIN", table: "ArticlesKeywords", as: "ak", on: "a.article_id = ak.article_id" },
      { type: "LEFT JOIN", table: "Keywords", as: "k", on: "ak.keyword_id = k.keyword_id" },
      // Add LEFT JOIN to ArticleViews
      { type: "LEFT JOIN", table: "ArticleViews", as: "av", on: "a.article_id = av.article_id" },
    ],
    filters: [{
      clause: `a.article_id IN (${placeholders})`,
      value: articleIds,
    }],
    groupBy: "a.article_id",
  });

  return {
    sql: `${sql} ${orderByField}`,
    params: [...params, ...articleIds],
  };
}