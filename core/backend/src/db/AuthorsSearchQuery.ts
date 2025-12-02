import { buildSelectQuery } from "./queryBuilder";
import { AuthorSearchFilters } from "../types/AuthorSearchFilters";

export function buildAuthorsSearchQuery(filters: AuthorSearchFilters) {
    const where = [];

    if (filters.name) {
        where.push({ clause: "a.name LIKE ?", value: `%${filters.name}%` });
    }

    if (filters.affiliation) {
        where.push({ clause: "a.affiliation LIKE ?", value: `%${filters.affiliation}%` });
    }

    return buildSelectQuery({
        table: "Authors",
        as: "a",
        columns: ["a.author_id", "a.name", "a.affiliation"],
        filters: where,
        orderBy: "a.name ASC",
        limit: filters.limit,
        offset: filters.offset
    });
}
