function yearFilter(fromYear?: number) {
  return fromYear ? "AND a.year >= ?" : "";
}

/* ============================
   TRENDING TOPICS (מהיר)
============================ */
export function buildTrendingTopicsQuery(fromYear?: number, limit = 5) {
  const yearCond = yearFilter(fromYear);

  const sql = `
    SELECT
      k.keyword,
      COUNT(DISTINCT ak.article_id) AS articleCount,
      MIN(a.year) AS firstAppearanceYear,
      MAX(a.year) AS latestYear
    FROM ArticlesKeywords ak
    JOIN Articles a ON a.article_id = ak.article_id
    JOIN Keywords k ON ak.keyword_id = k.keyword_id
    WHERE 1=1
      ${yearCond}
    GROUP BY ak.keyword_id
    ORDER BY articleCount DESC
    LIMIT ${limit}
  `.trim();

  return {
    sql,
    params: fromYear ? [fromYear] : [],
  };
}

/* ============================
   KEYWORD GROWTH (מהיר)
============================ */
export function buildKeywordGrowthQuery(
  keywords: string[],
  fromYear?: number
) {
  if (!keywords.length) return { sql: "", params: [] };

  const placeholders = keywords.map(() => "?").join(", ");
  const yearCond = fromYear != null ? "AND a.year >= ?" : "";

  const sql = `
    SELECT
      k.keyword AS keyword,
      a.year    AS year,
      COUNT(DISTINCT a.article_id) AS articleCount
    FROM Keywords k
    JOIN ArticlesKeywords ak ON k.keyword_id = ak.keyword_id
    JOIN Articles a ON a.article_id = ak.article_id
    WHERE k.keyword IN (${placeholders})
      ${yearCond}
    GROUP BY k.keyword_id, a.year
    ORDER BY k.keyword, a.year DESC
  `.trim();

  return {
    sql,
    params: fromYear != null
      ? [...keywords, fromYear]
      : [...keywords],
  };
}

/* ============================
   KEYWORD CROSS-DOMAIN (מהיר)
============================ */
export function buildKeywordCrossDomainQuery(
  keywords: string[],
  fromYear?: number,
  minSubjects: number = 2
) {
  if (!keywords.length) return { sql: "", params: [] };

  const placeholders = keywords.map(() => "?").join(", ");
  const yearCond = fromYear != null ? "AND a.year >= ?" : "";

  const sql = `
    SELECT
      k.keyword AS keyword,
      COUNT(DISTINCT asub.subject_id) AS subjectCount,
      COUNT(DISTINCT ak.article_id)   AS articleCount,
      GROUP_CONCAT(
        DISTINCT s.subject_name
        ORDER BY s.subject_name
        SEPARATOR '||'
      ) AS subjects
    FROM ArticlesKeywords ak
    JOIN Articles a ON a.article_id = ak.article_id
    JOIN Keywords k ON ak.keyword_id = k.keyword_id
    JOIN ArticlesSubjects asub ON asub.article_id = a.article_id
    JOIN Subjects s ON s.subject_id = asub.subject_id
    WHERE k.keyword IN (${placeholders})
      AND s.subject_name <> k.keyword
      ${yearCond}
    GROUP BY k.keyword_id
    HAVING subjectCount >= ?
    ORDER BY articleCount DESC, subjectCount DESC
  `.trim();

  return {
    sql,
    params: [
      ...keywords,
      ...(fromYear != null ? [fromYear] : []),
      minSubjects,
    ],
  };
}
