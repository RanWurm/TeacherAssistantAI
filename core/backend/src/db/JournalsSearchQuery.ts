import { buildSelectQuery } from "./queryBuilder";
import { JournalSearchFilters } from "../types/JournalSearchFilters";

export function buildJournalsSearchQuery(filters: JournalSearchFilters) {
    const where = [];

    if (filters.name) {
        where.push({ clause: "j.name LIKE ?", value: `%${filters.name}%` });
    }

    if (filters.publisher) {
        where.push({ clause: "j.publisher LIKE ?", value: `%${filters.publisher}%` });
    }

    return buildSelectQuery({
        table: "Journals",
        as: "j",
        columns: ["j.journal_id", "j.name", "j.impact_factor", "j.publisher"],
        filters: where,
        orderBy: "j.impact_factor DESC",
        limit: filters.limit,
        offset: filters.offset
    });
}
