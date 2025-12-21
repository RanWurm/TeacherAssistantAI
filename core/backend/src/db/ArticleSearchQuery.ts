import { buildSelectQuery } from "./queryBuilder";
import { ArticleSearchFilters } from "../types/ArticleSearchFilters";

type JoinType = "JOIN" | "LEFT JOIN";

interface JoinClause {
    type: JoinType;
    table: string;
    as?: string;
    on: string;
}

interface WhereClause {
    clause: string;
    value?: any | any[];
}

export function buildArticlesSearchQuery(filters: ArticleSearchFilters) {
    const joins: JoinClause[] = [];
    const where: WhereClause[] = [];
    const limit = filters.limit !== undefined ? Number(filters.limit) : undefined;
    const offset = filters.offset !== undefined ? Number(filters.offset) : undefined;
        
    // ---- SUBJECT ----
    if (filters.subject) {
        joins.push({
            type: "JOIN",
            table: "ArticlesSubjects",
            as: "asub",
            on: "a.article_id = asub.article_id",
        });
        joins.push({
            type: "JOIN",
            table: "Subjects",
            as: "s",
            on: "asub.subject_id = s.subject_id",
        });
        where.push({ clause: "s.subject_name LIKE ?", value: `%${filters.subject}%` });
    }

    // ---- AUTHOR ----
    if (filters.author) {
        joins.push({
            type: "JOIN",
            table: "ArticlesAuthors",
            as: "aa",
            on: "a.article_id = aa.article_id",
        });
        joins.push({
            type: "JOIN",
            table: "Authors",
            as: "au",
            on: "aa.author_id = au.author_id",
        });
        where.push({ clause: "au.name LIKE ?", value: `%${filters.author}%` });
    }

    // ---- KEYWORD ----
    if (filters.keyword) {
        joins.push({
            type: "JOIN",
            table: "ArticlesKeywords",
            as: "ak",
            on: "a.article_id = ak.article_id",
        });
        joins.push({
            type: "JOIN",
            table: "Keywords",
            as: "k",
            on: "ak.keyword_id = k.keyword_id",
        });
        where.push({ clause: "k.keyword LIKE ?", value: `%${filters.keyword}%` });
    }

    // ---- LANGUAGE ----
    if (filters.language) {
        where.push({ clause: "a.language = ?", value: filters.language });
    }

    // ---- TYPE ----
    if (filters.type) {
        where.push({ clause: "a.type LIKE ?", value: `%${filters.type}%` });
    }

    // ---- YEAR RANGE ----
    if (filters.fromYear) {
        where.push({ clause: "a.year >= ?", value: filters.fromYear });
    }
    if (filters.toYear) {
        where.push({ clause: "a.year <= ?", value: filters.toYear });
    }

    return buildSelectQuery({
        table: "Articles",
        as: "a",
        columns: [
            "a.article_id",
            "a.title",
            "a.year",
            "a.language",
            "a.type",
            "a.citation_count",
            "a.journal_id",
        ],
        joins,
        filters: where,
        orderBy: "a.citation_count DESC, a.year DESC ",
        limit,
        offset,
    });
}
