import { ArticleSearchFilters } from "../../types/ArticleSearchFilters";

function inPlaceholders(n: number): string {
    if (n <= 0) return "NULL";
    return Array.from({ length: n }, () => "?").join(", ");
}

export function buildArticleIdsQuery(
    filters: ArticleSearchFilters,
    options: {
        limit?: number;
        offset?: number;
        countOnly?: boolean;
    } = {}
) {
    const joins: string[] = [];
    const where: string[] = [];
    const params: any[] = [];

    const { limit, offset, countOnly = false } = options;

    // Authors
    if (filters.authors?.length) {
        joins.push(
            "JOIN ArticlesAuthors aa ON aa.article_id = a.article_id",
            "JOIN Authors au ON au.author_id = aa.author_id"
        );
        where.push(`au.name IN (${inPlaceholders(filters.authors.length)})`);
        params.push(...filters.authors);
    }

    // Subjects
    if (filters.subjects?.length) {
        joins.push(
            "JOIN ArticlesSubjects asub ON asub.article_id = a.article_id",
            "JOIN Subjects s ON s.subject_id = asub.subject_id"
        );
        where.push(`s.subject_name IN (${inPlaceholders(filters.subjects.length)})`);
        params.push(...filters.subjects);
    }

    // Keywords
    if (filters.keywords?.length) {
        joins.push(
            "JOIN ArticlesKeywords ak ON ak.article_id = a.article_id",
            "JOIN Keywords k ON k.keyword_id = ak.keyword_id"
        );
        where.push(`k.keyword IN (${inPlaceholders(filters.keywords.length)})`);
        params.push(...filters.keywords);
    }

    // Language
    if (filters.language && filters.language !== 'all') {
        where.push("a.language = ?");
        params.push(filters.language);
    }

    // Type
    if (filters.type && filters.type !== 'all') {
        where.push("a.type = ?");
        params.push(filters.type);
    }

    // Years
    if (filters.fromYear) {
        where.push("a.year >= ?");
        params.push(filters.fromYear);
    }
    if (filters.toYear) {
        where.push("a.year <= ?");
        params.push(filters.toYear);
    }

    // Search by title (query)
    if (filters.query) {
        where.push(`LOWER(a.title) LIKE ?`);
        params.push(`%${filters.query.toLowerCase()}%`);
    }

    const safeLimit =
        typeof limit === "number"
            ? Math.max(1, Math.min(limit, 100))
            : 6;

    const safeOffset =
        typeof offset === "number"
            ? Math.max(0, offset)
            : 0;

    const orderBy =
        filters.sortBy === "citations"
            ? "a.citation_count DESC, a.year DESC"
            : "a.year DESC, a.citation_count DESC";

    const sql = `
    ${countOnly
            ? "SELECT COUNT(DISTINCT a.article_id) AS total"
            : "SELECT a.article_id"
        }
    FROM Articles a
    ${joins.join("\n")}
    ${where.length ? "WHERE " + where.join(" AND ") : ""}
    ${!countOnly ? `ORDER BY ${orderBy}` : ""}
    ${!countOnly ? `LIMIT ${safeLimit} OFFSET ${safeOffset}` : ""}
  `;

    return { sql, params };
}
