import { query } from "../db";
import { buildArticlesSearchQuery } from "../db/ArticleSearchQuery";

export async function searchArticles(filters: any) {
  const { sql, params } = buildArticlesSearchQuery(filters);
  return await query(sql, params);
}
