import { buildSelectQuery } from "./queryBuilder";
import { SubjectSearchFilters } from "../types/SubjectSearchFilters";

export function buildSubjectsSearchQuery(filters: SubjectSearchFilters) {
    const where = [];

    if (filters.subject_name) {
        where.push({ clause: "s.subject_name LIKE ?", value: `%${filters.subject_name}%` });
    }

    return buildSelectQuery({
        table: "Subjects",
        as: "s",
        columns: ["s.subject_id", "s.subject_name"],
        filters: where,
        orderBy: "s.subject_name ASC",
        limit: filters.limit,
        offset: filters.offset
    });
}