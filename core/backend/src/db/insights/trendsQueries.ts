function yearFilter(fromYear?: number) {
    return fromYear ? "WHERE a.year >= ?" : "";
}

export function buildTrendingTopicsQuery(fromYear?: number, limit = 5) {
  const sql = `
    SELECT
      k.keyword AS keyword,
      COUNT(DISTINCT ak.article_id) AS articleCount,
      MIN(a.year) AS firstAppearanceYear,
      MAX(a.year) AS latestYear
    FROM Keywords k
    JOIN ArticlesKeywords ak ON k.keyword_id = ak.keyword_id
    JOIN Articles a ON ak.article_id = a.article_id
    ${fromYear ? "WHERE a.year >= ?" : ""}
    GROUP BY k.keyword_id
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
  const fetchFromYear = fromYear != null ? fromYear - 1 : undefined;
  const whereYear = fetchFromYear ? "AND a.year >= ?" : "";
  
  const sql = `
    SELECT
      k.keyword                    AS keyword,
      a.year                       AS year,
      COUNT(DISTINCT a.article_id) AS articleCount
    FROM Keywords k
    JOIN ArticlesKeywords ak ON k.keyword_id = ak.keyword_id
    JOIN Articles a ON ak.article_id = a.article_id
    WHERE k.keyword IN (${placeholders})
    ${whereYear}
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
  const whereYear = fromYear != null ? "AND a.year >= ?" : "";

  const sql = `
    SELECT
      k.keyword                                       AS keyword,

      -- number of DISTINCT domains (subjects)
      COUNT(DISTINCT asub.subject_id)                 AS subjectCount,

      -- number of DISTINCT articles
      COUNT(DISTINCT a.article_id)                    AS articleCount,

      -- DISTINCT domain names, excluding the keyword itself
      GROUP_CONCAT(
        DISTINCT s.subject_name
        ORDER BY s.subject_name
        SEPARATOR '||'
      )                                               AS subjects

    FROM Keywords k
    JOIN ArticlesKeywords ak ON k.keyword_id = ak.keyword_id
    JOIN Articles a ON ak.article_id = a.article_id
    JOIN ArticlesSubjects asub ON a.article_id = asub.article_id
    JOIN Subjects s ON asub.subject_id = s.subject_id

    WHERE k.keyword IN (${placeholders})
      AND s.subject_name <> k.keyword   -- 🔴 מונע כפילות סמנטית
      ${whereYear}

    GROUP BY k.keyword_id

    HAVING COUNT(DISTINCT asub.subject_id) >= ?

    ORDER BY
      articleCount DESC,
      subjectCount DESC
  `.trim();

  const params =
    fromYear != null
      ? [...keywords, fromYear, minSubjects]
      : [...keywords, minSubjects];

  return { sql, params };
}
