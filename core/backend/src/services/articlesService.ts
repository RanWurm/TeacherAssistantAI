import { query } from "../db";
import { buildArticleIdsQuery } from "../db/search/ArticleSearchIdsQuery";
import { buildArticlesByIdsQuery } from "../db/search/ArticleSearchQuery";
import { ArticleSearchFilters } from "../types/ArticleSearchFilters";

export async function searchArticles(
  filters: ArticleSearchFilters & {
    page?: number;
    pageSize?: number;
  }
) {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 6;
  const offset = (page - 1) * pageSize;

  const { page: _, pageSize: __, ...pureFilters } = filters;

  // 1. total count
  const { sql: countSql, params: countParams } =
    buildArticleIdsQuery(pureFilters, { countOnly: true });

  const countRows = await query(countSql, countParams);
  const total = countRows?.[0]?.total ?? 0;

  // 2. paged IDs
  const { sql: idsSql, params: idsParams } =
    buildArticleIdsQuery(pureFilters, { limit: pageSize, offset });

  const idRows = await query(idsSql, idsParams);

  if (!Array.isArray(idRows) || idRows.length === 0) {
    return {
      data: [],
      total,
      page,
      pageSize,
    };
  }

  // 3. fetch full articles for this page
  const articleIds = idRows.map((row: any) => row.article_id);

  const { sql, params } = buildArticlesByIdsQuery(articleIds);

  const data = await query(sql, params);

  return {
    data,
    total,
    page,
    pageSize,
  };
}
