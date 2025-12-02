import { query } from "../db";
import { buildSelectQuery } from "../db/queryBuilder";
import { AuthorSearchFilters } from "../types/AuthorSearchFilters";

export async function searchAuthors(filters: AuthorSearchFilters) {
  const { sql, params } = buildSelectQuery({
    table: "Authors",
    as: "au",
    filters: [
      filters.name && { clause: "au.name LIKE ?", value: `%${filters.name}%` },
      filters.affiliation && { clause: "au.affiliation LIKE ?", value: `%${filters.affiliation}%` },
    ].filter(Boolean) as any[],
    limit: filters.limit,
    offset: filters.offset,
    orderBy: "au.name ASC",
  });

  return query(sql, params);
}
