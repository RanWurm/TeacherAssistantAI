// tools/registry.ts
import { buildArticlesSearchQuery } from "../../db/ArticleSearchQuery";
import { pool } from "../../db";

// ✅ add these imports (adjust paths if needed)
import { searchAuthors } from "../../services/authorsService";
import { searchJournals } from "../../services/journalsService";
import { searchKeywords } from "../../services/keywordsService";
import { searchSubjects } from "../../services/subjectsService";
import { getSubjects, getAuthors, getKeywords } from "../../services/filters";

type ToolDef = {
  declaration: any;
  handler: (args: any) => Promise<any>;
};

// shared helpers (same style you already used)
const normInt = (v: any) => {
  if (v === null || v === undefined) return undefined;
  const n = typeof v === "string" ? Number(v) : v;
  return Number.isFinite(n) ? n : undefined;
};

  const normStr = (v: any) => {
    if (typeof v !== "string") return undefined;
    const s = v.trim();
    if (!s) return undefined;
    const lower = s.toLowerCase();
    if (lower === "unknown" || lower === "n/a" || lower === "null") return undefined;
    return s;
  };
  const normNum = (v: any) => {
    if (v === null || v === undefined) return undefined;
    const n = typeof v === "string" ? Number(v) : v;
    return Number.isFinite(n) ? n : undefined;
  };

  

const clampLimit = (v: any, def = 10, min = 1, max = 50) =>
  Math.min(max, Math.max(min, normInt(v) ?? def));

const clampOffset = (v: any, def = 0, min = 0, max = 1_000_000) =>
  Math.min(max, Math.max(min, normInt(v) ?? def));

const tools: Record<string, ToolDef> = {
  // ---------- existing ----------
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
          toYear: { anyOf: [{ type: "integer" }, { type: "string" }] },
          limit: { anyOf: [{ type: "integer" }, { type: "string" }] },
          offset: { anyOf: [{ type: "integer" }, { type: "string" }] },
        },
      },
    },

    handler: async (args: any) => {
      let subjectStr = normStr(args?.subject);
      const authorStr = normStr(args?.author);
      let keywordStr = normStr(args?.keyword);
      if (subjectStr && keywordStr && subjectStr.toLowerCase() === keywordStr.toLowerCase()) {
        keywordStr = undefined;
      }
      
      const subjects = subjectStr ? [subjectStr] : undefined;
      const authors = authorStr ? [authorStr] : undefined;
      const keywords = keywordStr ? [keywordStr] : undefined;

      const language = normStr(args?.language);
      const type = normStr(args?.type);

      const fromYear = normInt(args?.fromYear);
      const toYear = normInt(args?.toYear);

      const limit = clampLimit(args?.limit, 10, 1, 50);
      const offset = clampOffset(args?.offset, 0, 0, 1_000_000);

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
      console.log("TOOL search_articles args:", args);
      console.log("SQL:", sql, "PARAMS:", params);
      const [rows] = await pool.execute(sql, params);
      return { rows };
    },
  },

  // ---------- ✅ NEW: Authors ----------
  search_authors: {
    declaration: {
      name: "search_authors",
      description: "Search authors by name/affiliation.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string" },
          affiliation: { type: "string" },
          limit: { anyOf: [{ type: "integer" }, { type: "string" }] },
          offset: { anyOf: [{ type: "integer" }, { type: "string" }] },
        },
      },
    },
    handler: async (args: any) => {
      const limit = clampLimit(args?.limit, 10, 1, 200);
      const offset = clampOffset(args?.offset, 0, 0, 1_000_000);

      const rows = await searchAuthors({
        name: typeof args?.name === "string" ? args.name : undefined,
        affiliation: typeof args?.affiliation === "string" ? args.affiliation : undefined,
        limit,
        offset,
      } as any);

      return { rows };
    },
  },

  // ---------- ✅ NEW: Journals ----------
  search_journals: {
    declaration: {
      name: "search_journals",
      description: "Search journals by name/publisher/impact factor range.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string" },
          publisher: { type: "string" },
          minImpactFactor: { anyOf: [{ type: "number" }, { type: "string" }] },
          maxImpactFactor: { anyOf: [{ type: "number" }, { type: "string" }] },
          limit: { anyOf: [{ type: "integer" }, { type: "string" }] },
          offset: { anyOf: [{ type: "integer" }, { type: "string" }] },
        },
      },
    },
    handler: async (args: any) => {
      const toNum = (v: any) => {
        if (v === null || v === undefined) return undefined;
        const n = typeof v === "string" ? Number(v) : v;
        return Number.isFinite(n) ? n : undefined;
      };

      const limit = clampLimit(args?.limit, 10, 1, 200);
      const offset = clampOffset(args?.offset, 0, 0, 1_000_000);

      const rows = await searchJournals({
        name: typeof args?.name === "string" ? args.name : undefined,
        publisher: typeof args?.publisher === "string" ? args.publisher : undefined,
        minImpactFactor: toNum(args?.minImpactFactor),
        maxImpactFactor: toNum(args?.maxImpactFactor),
        limit,
        offset,
      } as any);

      return { rows };
    },
  },

  // ---------- ✅ NEW: Keywords ----------
  search_keywords: {
    declaration: {
      name: "search_keywords",
      description: "Search keywords (LIKE).",
      parameters: {
        type: "object",
        properties: {
          keyword: { type: "string" },
          limit: { anyOf: [{ type: "integer" }, { type: "string" }] },
          offset: { anyOf: [{ type: "integer" }, { type: "string" }] },
        },
      },
    },
    handler: async (args: any) => {
      const limit = clampLimit(args?.limit, 10, 1, 200);
      const offset = clampOffset(args?.offset, 0, 0, 1_000_000);

      const rows = await searchKeywords({
        keyword: typeof args?.keyword === "string" ? args.keyword : undefined,
        limit,
        offset,
      } as any);

      return { rows };
    },
  },

  // ---------- ✅ NEW: Subjects ----------
  search_subjects: {
    declaration: {
      name: "search_subjects",
      description: "Search subjects (LIKE).",
      parameters: {
        type: "object",
        properties: {
          subject_name: { type: "string" },
          limit: { anyOf: [{ type: "integer" }, { type: "string" }] },
          offset: { anyOf: [{ type: "integer" }, { type: "string" }] },
        },
      },
    },
    handler: async (args: any) => {
      const limit = clampLimit(args?.limit, 10, 1, 200);
      const offset = clampOffset(args?.offset, 0, 0, 1_000_000);

      const rows = await searchSubjects({
        subject_name: typeof args?.subject_name === "string" ? args.subject_name : undefined,
        limit,
        offset,
      } as any);

      return { rows };
    },
  },

  // ---------- ✅ NEW: Autocomplete-style lists (return as rows for consistency) ----------
  list_subjects: {
    declaration: {
      name: "list_subjects",
      description: "List distinct subject names (optionally filtered by q).",
      parameters: {
        type: "object",
        properties: {
          q: { type: "string" },
          limit: { anyOf: [{ type: "integer" }, { type: "string" }] },
          offset: { anyOf: [{ type: "integer" }, { type: "string" }] },
        },
      },
    },
    handler: async (args: any) => {
      const limit = clampLimit(args?.limit, 50, 1, 200);
      const offset = clampOffset(args?.offset, 0, 0, 1_000_000);
      const q = typeof args?.q === "string" ? args.q : undefined;

      const values = await getSubjects(q, limit, offset);
      return { rows: values.map((subject_name) => ({ subject_name })) };
    },
  },

  list_authors: {
    declaration: {
      name: "list_authors",
      description: "List distinct author names (optionally filtered by q).",
      parameters: {
        type: "object",
        properties: {
          q: { type: "string" },
          limit: { anyOf: [{ type: "integer" }, { type: "string" }] },
          offset: { anyOf: [{ type: "integer" }, { type: "string" }] },
        },
      },
    },
    handler: async (args: any) => {
      const limit = clampLimit(args?.limit, 50, 1, 200);
      const offset = clampOffset(args?.offset, 0, 0, 1_000_000);
      const q = typeof args?.q === "string" ? args.q : undefined;

      const values = await getAuthors(q, limit, offset);
      return { rows: values.map((name) => ({ name })) };
    },
  },

  list_keywords: {
    declaration: {
      name: "list_keywords",
      description: "List distinct keywords (optionally filtered by q).",
      parameters: {
        type: "object",
        properties: {
          q: { type: "string" },
          limit: { anyOf: [{ type: "integer" }, { type: "string" }] },
          offset: { anyOf: [{ type: "integer" }, { type: "string" }] },
        },
      },
    },
    handler: async (args: any) => {
      const limit = clampLimit(args?.limit, 50, 1, 200);
      const offset = clampOffset(args?.offset, 0, 0, 1_000_000);
      const q = typeof args?.q === "string" ? args.q : undefined;

      const values = await getKeywords(q, limit, offset);
      return { rows: values.map((keyword) => ({ keyword })) };
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
