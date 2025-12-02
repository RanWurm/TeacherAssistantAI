import { buildSelectQuery } from "./queryBuilder";
import { KeywordSearchFilters } from "../types/KeywordSearchFilters";

export function buildKeywordsSearchQuery(filters: KeywordSearchFilters) {
    const where = [];

    if (filters.keyword) {
        where.push({ clause: "k.keyword LIKE ?", value: `%${filters.keyword}%` });
    }

    return buildSelectQuery({
        table: "Keywords",
        as: "k",
        columns: ["k.keyword_id", "k.keyword"],
        filters: where,
        orderBy: "k.keyword ASC",
        limit: filters.limit,
        offset: filters.offset
    });
}