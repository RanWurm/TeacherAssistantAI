function yearFilter(fromYear?: number) {
  return fromYear ? "WHERE a.year >= ?" : "";
}

export function buildTrendingTopicsQuery(fromYear?: number, limit = 5) {
  const where = yearFilter(fromYear);

  const sql = `
      SELECT
        k.keyword,
        COUNT(DISTINCT ak.article_id) AS articleCount,
        MIN(a.year) AS firstAppearanceYear,
        MAX(a.year) AS latestYear
      FROM Articles a
      JOIN ArticlesKeywords ak ON a.article_id = ak.article_id
      JOIN Keywords k ON ak.keyword_id = k.keyword_id
      ${where}
      GROUP BY ak.keyword_id
      ORDER BY articleCount DESC
      LIMIT ${limit}
    `.trim();

  const params = fromYear ? [fromYear] : [];
  return { sql, params };
}

export function buildKeywordGrowthQuery(
  keywords: string[],
  fromYear?: number
) {
  if (!keywords.length) {
    return { sql: "", params: [] };
  }
  const placeholders = keywords.map(() => "?").join(", ");
  const fetchFromYear = fromYear != null ? fromYear - 1 : null;
  const where = fetchFromYear != null ? "AND a.year >= ?" : "";

  const sql = `
      SELECT
        k.keyword                    AS keyword,
        a.year                       AS year,
        COUNT(DISTINCT a.article_id) AS articleCount
      FROM Keywords k
      JOIN ArticlesKeywords ak ON k.keyword_id = ak.keyword_id
      JOIN Articles a ON ak.article_id = a.article_id
      WHERE k.keyword IN (${placeholders})
      ${where}
      GROUP BY k.keyword_id, a.year
      ORDER BY k.keyword, a.year DESC
    `.trim();

  const params = fetchFromYear ? [...keywords, fetchFromYear] : [...keywords];
  return { sql, params };
}

export function buildKeywordCrossDomainQuery(
  keywords: string[],
  fromYear?: number,
  minSubjects: number = 2
) {
  if (!keywords.length) {
    return { sql: "", params: [] };
  }
  const placeholders = keywords.map(() => "?").join(", ");

  const sql = `
    SELECT
      k.keyword                                       AS keyword,
      COUNT(DISTINCT asub.subject_id)                 AS subjectCount,
      COUNT(DISTINCT ak.article_id)                   AS articleCount,
      GROUP_CONCAT(
        DISTINCT s.subject_name
        ORDER BY s.subject_name
        SEPARATOR '||'
      )                                               AS subjects

    FROM Articles a
    JOIN ArticlesKeywords ak ON a.article_id = ak.article_id
    JOIN Keywords k ON ak.keyword_id = k.keyword_id
    JOIN ArticlesSubjects asub ON a.article_id = asub.article_id
    JOIN Subjects s ON s.subject_id = asub.subject_id
    WHERE k.keyword IN (${placeholders})
      AND s.subject_name <> k.keyword
      ${fromYear != null ? "AND a.year >= ?" : ""}

    GROUP BY k.keyword_id
    HAVING COUNT(DISTINCT asub.subject_id) >= ?
    ORDER BY articleCount DESC, subjectCount DESC
  `.trim();

  // Keywords first, then year (if present), then minSubjects
  const params: any[] = [
    ...keywords,
    ...(fromYear != null ? [fromYear] : []),
    minSubjects,
  ];

  return { sql, params };
}
