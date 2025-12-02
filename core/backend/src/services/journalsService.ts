import { query } from "../db";
import { buildSelectQuery } from "../db/queryBuilder";
import { JournalSearchFilters } from "../types/JournalSearchFilters";

export async function searchJournals(filters: JournalSearchFilters) {
  const { sql, params } = buildSelectQuery({
    table: "Journals",
    as: "j",
    filters: [
      filters.name && { clause: "j.name LIKE ?", value: `%${filters.name}%` },
      filters.publisher && { clause: "j.publisher LIKE ?", value: `%${filters.publisher}%` },
      filters.minImpactFactor && { clause: "j.impact_factor >= ?", value: filters.minImpactFactor },
      filters.maxImpactFactor && { clause: "j.impact_factor <= ?", value: filters.maxImpactFactor },
    ].filter(Boolean) as any[],
    limit: filters.limit,
    offset: filters.offset,
    orderBy: "j.impact_factor DESC",
  });

  return query(sql, params);
}
