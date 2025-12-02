import { query } from "../db";
import { buildSelectQuery } from "../db/queryBuilder";
import { SubjectSearchFilters } from "../types/SubjectSearchFilters";

export async function searchSubjects(filters: SubjectSearchFilters) {
  const { sql, params } = buildSelectQuery({
    table: "Subjects",
    as: "s",
    filters: [
      filters.subject_name && { clause: "s.subject_name LIKE ?", value: `%${filters.subject_name}%` },
    ].filter(Boolean) as any[],
    limit: filters.limit,
    offset: filters.offset,
    orderBy: "s.subject_name ASC",
  });

  return query(sql, params);
}
