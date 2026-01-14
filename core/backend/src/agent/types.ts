import { z } from "zod";

// ─────────────────────────────────────────────────────────────
// Database Entities
// ─────────────────────────────────────────────────────────────

export interface Article {
  article_id: number;
  openalex_id: string;
  title: string;
  year: number | null;
  language: string | null;
  type: string | null;
  citation_count: number | null;
  source_id: number | null;
  article_url: string | null;
}

export interface ArticleWithDetails extends Article {
  source_name?: string | null;
  source_type?: string | null;
  publisher?: string | null;
  authors?: { name: string; institutions: string[] }[];
  subjects?: string[];
  keywords?: string[];
}

export interface Source {
  source_id: number;
  name: string;
  type: string | null;
  impact_factor: number | null;
  publisher: string | null;
}

export interface Author {
  author_id: number;
  openalex_author_id: string;
  name: string;
}

// ─────────────────────────────────────────────────────────────
// Tool System
// ─────────────────────────────────────────────────────────────

export type ToolName =
  | "search_papers"
  | "search_papers_with_pdf"
  | "get_paper_details"
  | "get_pdf_content"
  | "list_subjects"
  | "get_author_papers"
  | "execute_custom_query";

export interface ToolCall {
  name: ToolName;
  arguments: Record<string, unknown>;
}

export interface ToolResult {
  name: ToolName;
  result: unknown;
  tokens_used: number;
  error?: string;
}

// ─────────────────────────────────────────────────────────────
// Tool Parameter Schemas (for LLM function calling)
// ─────────────────────────────────────────────────────────────

export const SearchPapersSchema = z.object({
  query: z.string().describe("Search terms for title/keywords"),
  subject: z.string().optional().describe("Filter by subject name"),
  year_min: z.number().optional().describe("Minimum publication year"),
  year_max: z.number().optional().describe("Maximum publication year"),
  limit: z.coerce.number().min(1).max(10).default(5)

});

export const GetPaperDetailsSchema = z.object({
  article_id: z.number().describe("The article_id to fetch"),
});

export const GetPdfContentSchema = z.object({
  article_url: z.string().url().describe("URL to the PDF"),
  max_pages: z.number().min(1).max(3).default(1).describe("Pages to extract (1-3)"),
});

export const GetAuthorPapersSchema = z.object({
  author_name: z.string().describe("Author name to search"),
  limit: z.number().min(1).max(10).default(5),
});

export const ExecuteCustomQuerySchema = z.object({
  query: z.string().describe("SELECT query to execute (read-only)"),
});

export const SearchPapersWithPdfSchema = z.object({
  query: z.string().describe("Search terms"),
  limit: z.coerce.number().min(1).max(10).default(5),
});

export type SearchPapersParams = z.infer<typeof SearchPapersSchema>;
export type GetPaperDetailsParams = z.infer<typeof GetPaperDetailsSchema>;
export type GetPdfContentParams = z.infer<typeof GetPdfContentSchema>;
export type GetAuthorPapersParams = z.infer<typeof GetAuthorPapersSchema>;
export type ExecuteCustomQueryParams = z.infer<typeof ExecuteCustomQuerySchema>;
export type SearchPapersWithPdfParams = z.infer<typeof SearchPapersWithPdfSchema>;
// ─────────────────────────────────────────────────────────────
// Agent / Strategy
// ─────────────────────────────────────────────────────────────

export interface Strategy {
  name: string;
  description: string;
  suggested_tools: ToolName[];
  max_tool_calls: number;
}

export interface AgentConfig {
  max_tokens_per_request: number;
  max_tool_calls_per_turn: number;
  strategies: Strategy[];
}

export interface ConversationMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  name?: string; // for tool messages
  tool_calls?: any[];
  tool_call_id?: string;
}

export interface AgentResponse {
  message: string;
  tool_calls: ToolResult[];
  tokens_used: {
    input: number;
    output: number;
    tool_results: number;
  };
}
