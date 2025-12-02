// backend/src/db/queryBuilder.ts
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

  // ---- בניית השאילתה ----
  let sql = `
    SELECT DISTINCT ${columns.join(", ")}
    FROM ${options.table} ${as}
    ${joins.join("\n")}
    ${whereClauses.length ? "WHERE " + whereClauses.join(" AND ") : ""}
    ${options.orderBy ? "ORDER BY " + options.orderBy : ""}
    ${typeof options.limit === "number" ? "LIMIT " + options.limit : ""}
    ${typeof options.offset === "number" ? "OFFSET " + options.offset : ""}
  `.trim();

  // ---- חשוב: לא דוחפים LIMIT/OFFSET ל-params ----
  return { sql, params };
}
