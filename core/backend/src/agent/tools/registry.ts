import { buildArticlesSearchQuery } from "../../db/ArticleSearchQuery";
import { pool } from "../../db";
type ToolDef = {
  declaration: any;
  handler: (args: any) => Promise<any>;
};

const tools: Record<string, ToolDef> = {
  search_articles: {
    declaration: {
      name: "search_articles",
      description: "Search articles in MySQL using allowed filters.",
      parameters: {
        type: "object",
        properties: {
            subject: { type: "string" },
            author: { type: "string" },
            keyword: { type: "string" },
            language: { type: "string" },
            type: { type: "string" },
            fromYear: { anyOf: [{ type: "integer" }, { type: "string" }] },
            toYear:   { anyOf: [{ type: "integer" }, { type: "string" }] },
            limit:    { anyOf: [{ type: "integer" }, { type: "string" }] },
            offset:   { anyOf: [{ type: "integer" }, { type: "string" }] },
            },
        },
    },

    handler: async (args: any) => {
        const normInt = (v: any) => {
            if (v === null || v === undefined) return undefined;
            const n = typeof v === "string" ? Number(v) : v;
            return Number.isFinite(n) ? n : undefined;
        };

        // Map incoming fields to ArticleSearchFilters shape
        // ArticleSearchFilters expects: authors?: string[], subjects?: string[], keywords?: string[], language, type, fromYear, toYear, limit, offset

        const subjects = typeof args?.subject === "string" && args.subject.length > 0
          ? [args.subject]
          : undefined;

        const authors = typeof args?.author === "string" && args.author.length > 0
          ? [args.author]
          : undefined;

        const keywords = typeof args?.keyword === "string" && args.keyword.length > 0
          ? [args.keyword]
          : undefined;

        const language = typeof args?.language === "string" ? args.language : undefined;
        const type = typeof args?.type === "string" ? args.type : undefined;

        const fromYear = normInt(args?.fromYear);
        const toYear = normInt(args?.toYear);

        const limit = Math.max(1, Math.min(50, normInt(args?.limit) ?? 10));
        const offset = Math.max(0, normInt(args?.offset) ?? 0);

        const built: any = buildArticlesSearchQuery({
            subjects,
            authors,
            keywords,
            language,
            type,
            fromYear,
            toYear,
            limit,
            offset,
        });

        const sql: string = built.sql ?? built.query;
        const params: any[] = built.params ?? built.values ?? [];
        console.log("tool args:", args);
        console.log("SQL:", sql, "PARAMS:", params);
        const [rows] = await pool.execute(sql, params);
        return { rows };
    },
  },
};
export function getToolDeclarations() {
  return Object.values(tools).map((t) => t.declaration);
}

export async function runTool(name: string, args: any) {
  const tool = tools[name];
  if (!tool) throw new Error(`Unknown tool: ${name}`);
  return tool.handler(args);
}
