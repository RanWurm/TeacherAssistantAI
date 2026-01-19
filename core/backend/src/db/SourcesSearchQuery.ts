import { buildSelectQuery } from "./queryBuilder";
import { SourceSearchFilters } from "../types/SourceSearchFilters";

export function buildSourcesSearchQuery(filters: SourceSearchFilters) {
  const where = [];

  if (filters.name) {
    where.push({ clause: "s.name LIKE ?", value: `%${filters.name}%` });
  }

  if (filters.type) {
    where.push({ clause: "s.type = ?", value: filters.type });
  }

  if (filters.publisher) {
    where.push({ clause: "s.publisher LIKE ?", value: `%${filters.publisher}%` });
  }

  return buildSelectQuery({
    table: "Sources",
    as: "s",
    columns: ["s.source_id", "s.name", "s.type", "s.impact_factor", "s.publisher"],
    filters: where,
    orderBy: "s.impact_factor DESC",
    limit: filters.limit,
    offset: filters.offset,
  });
}