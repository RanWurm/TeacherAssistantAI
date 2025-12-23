// backend/src/db/queryBuilder.ts

function inPlaceholders(n: number) {
  return Array.from({ length: n }, () => "?").join(", ");
}

export function buildSelectQuery(options: {
  table: string,
  as?: string,
  columns?: string[],
  joins?: Array<{
    type: "JOIN" | "LEFT JOIN",
    table: string,
    as?: string,
    on: string,
  }>,
  filters?: Array<{
    clause: string,
    value?: any | any[],
  }>,
  groupBy?: string,
  orderBy?: string,
  limit?: number,
  offset?: number,
}) {
  const params: any[] = [];
  const as = options.as || "t";

  const columns = options.columns?.length
    ? options.columns.map(c => c.includes(".") ? c : `${as}.${c}`)
    : [`${as}.*`];

  const joins = (options.joins || []).map(j =>
    `\n${j.type} ${j.table}${j.as ? " " + j.as : ""} ON ${j.on}`
  );

  const whereClauses: string[] = [];
  (options.filters || []).forEach(f => {
    whereClauses.push(f.clause);
    if (typeof f.value !== "undefined") {
      if (Array.isArray(f.value)) params.push(...f.value);
      else params.push(f.value);
    }
  });

  const sql = `
    SELECT DISTINCT ${columns.join(", ")}
    FROM ${options.table} ${as}
    ${joins.join("\n")}
    ${whereClauses.length ? "WHERE " + whereClauses.join(" AND ") : ""}
    ${options.groupBy ? "GROUP BY " + options.groupBy : ""}
    ${options.orderBy ? "ORDER BY " + options.orderBy : ""}
    ${typeof options.limit === "number" ? "LIMIT " + options.limit : ""}
    ${typeof options.offset === "number" ? "OFFSET " + options.offset : ""}
  `.trim();

  return { sql, params };
}
