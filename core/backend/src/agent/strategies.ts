import { Strategy, ToolName } from "./types";

// ─────────────────────────────────────────────────────────────
// Built-in Strategies
// ─────────────────────────────────────────────────────────────

export const DEFAULT_STRATEGIES: Strategy[] = [
  {
    name: "quick_search",
    description:
      "Fast paper lookup by keywords or subject. Best for simple queries like 'find papers about X'.",
    suggested_tools: ["search_papers"],
    max_tool_calls: 1,
  },
  {
    name: "literature_review",
    description:
      "Comprehensive search across multiple criteria. Good for 'what are the key papers in field X'.",
    suggested_tools: ["search_papers", "get_paper_details"],
    max_tool_calls: 3,
  },
  {
    name: "author_exploration",
    description:
      "Explore a researcher's body of work. Use when user asks about specific authors.",
    suggested_tools: ["get_author_papers", "get_paper_details"],
    max_tool_calls: 2,
  },
  {
    name: "deep_dive",
    description:
      "Read and analyze a specific paper's content. Use when user wants to understand a paper.",
    suggested_tools: ["get_paper_details", "get_pdf_content"],
    max_tool_calls: 2,
  },
  {
    name: "field_overview",
    description:
      "Get an overview of available subjects and their coverage in the database.",
    suggested_tools: ["list_subjects", "search_papers"],
    max_tool_calls: 2,
  },
  {
    name: "custom_analysis",
    description:
      "Complex queries requiring custom SQL. Use when pre-built tools are insufficient.",
    suggested_tools: ["execute_custom_query"],
    max_tool_calls: 2,
  },
];

// ─────────────────────────────────────────────────────────────
// Strategy Selection Prompt
// ─────────────────────────────────────────────────────────────

export function buildStrategyPrompt(strategies: Strategy[]): string {
  const strategyList = strategies
    .map(
      (s) =>
        `- **${s.name}**: ${s.description}\n  Tools: ${s.suggested_tools.join(", ")} | Max calls: ${s.max_tool_calls}`
    )
    .join("\n");

  return `
## Available Research Strategies

${strategyList}

When responding, you should:
1. Identify the most appropriate strategy based on the user's query
2. Stay within the tool call limit for that strategy
3. If uncertain, use "quick_search" first, then escalate if needed
4. Always explain your findings clearly and suggest next steps
`;
}

// ─────────────────────────────────────────────────────────────
// Strategy Inference
// ─────────────────────────────────────────────────────────────

export function inferStrategy(userQuery: string): Strategy {
  const query = userQuery.toLowerCase();

  // Author-related queries
  if (
    query.includes("author") ||
    query.includes("researcher") ||
    query.includes("who wrote") ||
    query.includes("papers by")
  ) {
    return DEFAULT_STRATEGIES.find((s) => s.name === "author_exploration")!;
  }

  // Deep reading queries
  if (
    query.includes("read") ||
    query.includes("summarize") ||
    query.includes("abstract") ||
    query.includes("content of") ||
    query.includes("what does") ||
    query.includes("explain the paper")
  ) {
    return DEFAULT_STRATEGIES.find((s) => s.name === "deep_dive")!;
  }

  // Overview/field queries
  if (
    query.includes("overview") ||
    query.includes("what subjects") ||
    query.includes("what fields") ||
    query.includes("available topics") ||
    query.includes("categories")
  ) {
    return DEFAULT_STRATEGIES.find((s) => s.name === "field_overview")!;
  }

  // Literature review indicators
  if (
    query.includes("review") ||
    query.includes("key papers") ||
    query.includes("important") ||
    query.includes("seminal") ||
    query.includes("foundational") ||
    query.includes("comprehensive")
  ) {
    return DEFAULT_STRATEGIES.find((s) => s.name === "literature_review")!;
  }

  // Complex/custom queries
  if (
    query.includes("compare") ||
    query.includes("correlation") ||
    query.includes("trend") ||
    query.includes("statistics") ||
    query.includes("how many")
  ) {
    return DEFAULT_STRATEGIES.find((s) => s.name === "custom_analysis")!;
  }

  // Default to quick search
  return DEFAULT_STRATEGIES.find((s) => s.name === "quick_search")!;
}

// ─────────────────────────────────────────────────────────────
// Custom Strategy Builder
// ─────────────────────────────────────────────────────────────

export function createCustomStrategy(
  name: string,
  description: string,
  tools: ToolName[],
  maxCalls: number = 3
): Strategy {
  return {
    name,
    description,
    suggested_tools: tools,
    max_tool_calls: Math.min(maxCalls, 5), // Hard cap at 5
  };
}

export function addStrategy(strategies: Strategy[], newStrategy: Strategy): Strategy[] {
  // Replace if exists, otherwise append
  const existing = strategies.findIndex((s) => s.name === newStrategy.name);
  if (existing >= 0) {
    strategies[existing] = newStrategy;
  } else {
    strategies.push(newStrategy);
  }
  return strategies;
}
