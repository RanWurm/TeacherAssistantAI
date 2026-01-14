import {
  ToolName,
  ToolResult,
  SearchPapersSchema,
  GetPaperDetailsSchema,
  GetPdfContentSchema,
  GetAuthorPapersSchema,
  ExecuteCustomQuerySchema,
    SearchPapersWithPdfSchema,

} from "./types";
import * as db from "./db";
import { fetchAndExtractPdf, extractAbstract, estimateTokens } from "./pdf";

// ─────────────────────────────────────────────────────────────
// Tool Definitions (for LLM function calling)
// ─────────────────────────────────────────────────────────────

export const TOOL_DEFINITIONS = [
  {
    type: "function" as const,
    function: {
      name: "search_papers",
      description:
        "Search for academic papers by keywords, subject, or year range. Returns up to 10 papers with basic metadata. Use this for broad searches.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search terms to match against title and keywords",
          },
          subject: {
            type: "string",
            description: "Filter by subject/field (e.g., 'Computer science', 'Medicine')",
          },
          year_min: {
            type: "number",
            description: "Minimum publication year",
          },
          year_max: {
            type: "number",
            description: "Maximum publication year",
          },
          limit: {
            type: "number",
            description: "Maximum results to return (1-10, default 5)",
          },
        },
        required: [],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_paper_details",
      description:
        "Get full details of a specific paper including authors, subjects, keywords, and source info. Use after search_papers to get more info.",
      parameters: {
        type: "object",
        properties: {
          article_id: {
            type: "number",
            description: "The article_id from search results",
          },
        },
        required: ["article_id"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_pdf_content",
      description:
        "Fetch and extract text from a paper's PDF. Note: Not all papers have open access PDFs - some URLs are DOIs that may not resolve to downloadable PDFs. If extraction fails, inform the user.",
      parameters: {
        type: "object",
        properties: {
          article_url: {
            type: "string",
            description: "URL to the PDF (from article_url field)",
          },
          max_pages: {
            type: "number",
            description: "Pages to extract (1-3, default 1)",
          },
        },
        required: ["article_url"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "list_subjects",
      description:
        "List all available subjects/fields in the database with paper counts. Use to help user narrow down their search.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_author_papers",
      description: "Find papers by a specific author name.",
      parameters: {
        type: "object",
        properties: {
          author_name: {
            type: "string",
            description: "Author name to search (partial match supported)",
          },
          limit: {
            type: "number",
            description: "Maximum results to return (1-10, default 5)",
          },
        },
        required: ["author_name"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "execute_custom_query",
      description:
        "Execute a custom SQL SELECT query. Only read operations allowed. Use when pre-built tools don't meet the need.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "SQL SELECT query. Tables: Articles, Sources, Authors, Institutions, Subjects, Keywords, ArticlesAuthors, ArticleAuthorInstitutions, ArticlesSubjects, ArticlesKeywords",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "search_papers_with_pdf",
      description:
        "Search for papers that have open access PDFs available (arXiv, JMLR, etc). Use this when user wants to read/summarize paper content without specifying a particular paper.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search terms",
          },
          limit: {
            type: "number",
            description: "Maximum results (1-10, default 5)",
          },
        },
        required: ["query"],
      },
    },
  },
];

// ─────────────────────────────────────────────────────────────
// Tool Executor
// ─────────────────────────────────────────────────────────────

export async function executeTool(
  name: ToolName,
  args: Record<string, unknown>
): Promise<ToolResult> {
  const startTime = Date.now();

  try {
    switch (name) {
      case "search_papers": {
        const params = SearchPapersSchema.parse(args);
        const { rows, error } = await db.searchPapers({
          query: params.query,
          subject: params.subject,
          yearMin: params.year_min,
          yearMax: params.year_max,
          limit: params.limit,
        });

        if (error) {
          return { name, result: null, tokens_used: 0, error };
        }

        const result = formatSearchResults(rows);
        return { name, result, tokens_used: estimateTokens(JSON.stringify(result)) };
      }

      case "get_paper_details": {
        const params = GetPaperDetailsSchema.parse(args);
        const { article, error } = await db.getPaperDetails(params.article_id);

        if (error || !article) {
          return { name, result: null, tokens_used: 0, error: error || "Not found" };
        }

        const result = formatPaperDetails(article);
        return { name, result, tokens_used: estimateTokens(JSON.stringify(result)) };
      }

      case "get_pdf_content": {
        const params = GetPdfContentSchema.parse(args);
        const pdfResult = await fetchAndExtractPdf(params.article_url, params.max_pages);

        if (pdfResult.error) {
          return { name, result: null, tokens_used: 0, error: pdfResult.error };
        }

        const abstract = extractAbstract(pdfResult.text);

        const result = {
          abstract,
          full_text_preview: pdfResult.text.slice(0, 2000),
          pages_extracted: pdfResult.pages_extracted,
          total_pages: pdfResult.total_pages,
          truncated: pdfResult.truncated,
        };

        return { name, result, tokens_used: estimateTokens(JSON.stringify(result)) };
      }

      case "list_subjects": {
        const { rows, error } = await db.listSubjects();

        if (error) {
          return { name, result: null, tokens_used: 0, error };
        }

        const result = rows.map((r: any) => ({
          subject: r.subject_name,
          papers: r.paper_count,
        }));

        return { name, result, tokens_used: estimateTokens(JSON.stringify(result)) };
      }

      case "get_author_papers": {
        const params = GetAuthorPapersSchema.parse(args);
        const { rows, error } = await db.getAuthorPapers(params.author_name, params.limit);

        if (error) {
          return { name, result: null, tokens_used: 0, error };
        }

        const result = rows.map((r: any) => ({
          article_id: r.article_id,
          title: r.title,
          year: r.year,
          citations: r.citation_count,
          author: r.author_name,
        }));

        return { name, result, tokens_used: estimateTokens(JSON.stringify(result)) };
      }

      case "execute_custom_query": {
        const params = ExecuteCustomQuerySchema.parse(args);
        const { rows, error } = await db.executeReadOnlyQuery(params.query);

        if (error) {
          return { name, result: null, tokens_used: 0, error };
        }

        const limitedRows = rows.slice(0, 20);
        const truncated = rows.length > 20;

        const result = {
          rows: limitedRows,
          total_rows: rows.length,
          truncated,
        };

        return { name, result, tokens_used: estimateTokens(JSON.stringify(result)) };
        
      }

          case "search_papers_with_pdf": {
      const params = SearchPapersWithPdfSchema.parse(args);

      const { rows, error } = await db.searchPapersWithPdf({
        query: params.query,
        limit: params.limit,
      });

      if (error) {
        return { name, result: null, tokens_used: 0, error };
      }

      const result = formatSearchResults(rows);
      return { name, result, tokens_used: estimateTokens(JSON.stringify(result)) };
    }

      default:
        return { name, result: null, tokens_used: 0, error: `Unknown tool: ${name}` };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { name, result: null, tokens_used: 0, error: message };
  }
}

// ─────────────────────────────────────────────────────────────
// Formatters (compact output for token efficiency)
// ─────────────────────────────────────────────────────────────

function formatSearchResults(rows: any[]) {
  return rows.map((r) => ({
    id: r.article_id,
    title: truncateText(r.title, 100),
    year: r.year,
    citations: r.citation_count,
    source: r.source_name ? truncateText(r.source_name, 50) : null,
    source_type: r.source_type,
    url: r.article_url,
  }));
}

function formatPaperDetails(article: any) {
  return {
    id: article.article_id,
    title: article.title,
    year: article.year,
    type: article.type,
    language: article.language,
    citations: article.citation_count,
    url: article.article_url,
    source: article.source_name
      ? {
          name: article.source_name,
          type: article.source_type,
          publisher: article.publisher,
          impact_factor: article.impact_factor,
        }
      : null,
    authors: article.authors?.slice(0, 10) || [],
    subjects: article.subjects?.slice(0, 8) || [],
    keywords: article.keywords?.slice(0, 8) || [],
  };
}

function truncateText(text: string, maxLen: number): string {
  if (!text || text.length <= maxLen) return text;
  return text.slice(0, maxLen - 3) + "...";
}