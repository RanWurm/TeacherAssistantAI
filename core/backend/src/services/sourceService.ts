import { query } from "../db";
import { buildSelectQuery } from "../db/queryBuilder";
import { SourceSearchFilters } from "../types/SourceSearchFilters";

export async function searchSources(filters: SourceSearchFilters) {
  const { sql, params } = buildSelectQuery({
    table: "Sources",
    as: "s",
    filters: [
      filters.name && { clause: "s.name LIKE ?", value: `%${filters.name}%` },
      filters.type && { clause: "s.type = ?", value: filters.type },
      filters.publisher && { clause: "s.publisher LIKE ?", value: `%${filters.publisher}%` },
      filters.minImpactFactor && { clause: "s.impact_factor >= ?", value: filters.minImpactFactor },
      filters.maxImpactFactor && { clause: "s.impact_factor <= ?", value: filters.maxImpactFactor },
    ].filter(Boolean) as any[],
    limit: filters.limit,
    offset: filters.offset,
    orderBy: "s.impact_factor DESC",
  });

  return query(sql, params);
}