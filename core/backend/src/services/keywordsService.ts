import { query } from "../db";
import { buildSelectQuery } from "../db/queryBuilder";
import { KeywordSearchFilters } from "../types/KeywordSearchFilters";

export async function searchKeywords(filters: KeywordSearchFilters) {
  const { sql, params } = buildSelectQuery({
    table: "Keywords",
    as: "k",
    filters: [
      filters.keyword && { clause: "k.keyword LIKE ?", value: `%${filters.keyword}%` },
    ].filter(Boolean) as any[],
    limit: filters.limit,
    offset: filters.offset,
    orderBy: "k.keyword ASC",
  });

  return query(sql, params);
}
