import Groq from "groq-sdk";
import { ActionPlan, StepResult, ExecutionResult } from "../types/plan";
import { executeTool } from "../tools";
import { ToolName } from "../types";

// ─────────────────────────────────────────────────────────────
// Executor Configuration
// ─────────────────────────────────────────────────────────────

const SYNTHESIS_MODEL = "llama-3.3-70b-versatile";
const SYNTHESIS_TEMPERATURE = 0.3;
const SYNTHESIS_MAX_TOKENS = 1500;
const MAX_TOOL_RESULT_TOKENS = 3000;

// ─────────────────────────────────────────────────────────────
// Synthesis Prompt
// ─────────────────────────────────────────────────────────────

const SYNTHESIS_PROMPT = `You are a helpful research assistant. Based on the tool results provided, create a clear and helpful response for the user.

Guidelines:
- Be concise but informative
- Highlight key findings (titles, years, citations)
- If listing papers, format them nicely with numbers
- include the URL when it exists (e.g., "PDF/URL: <url>") for each listed paper when the user ask for sources.
- If there were errors, explain what went wrong
- Offer to help further if relevant
- Respond in the same language as the user's original message
- Don't mention internal tool names or technical details`;

// ─────────────────────────────────────────────────────────────
// Executor Agent Class
// ─────────────────────────────────────────────────────────────

export class ExecutorAgent {
  private client: Groq;

  constructor() {
    this.client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  /**
   * Execute an action plan and return results
   */
  async execute(
    plan: ActionPlan,
    userMessage: string
  ): Promise<ExecutionResult> {
    const stepResults: StepResult[] = [];
    let totalTokens = 0;

    // Handle direct conversation without tools
    if (plan.intent === 'conversation' || plan.intent === 'out_of_scope') {
      const directResponse = this.extractDirectResponse(plan);
      if (directResponse) {
        return {
          plan,
          stepResults: [],
          finalResponse: directResponse,
          totalTokens: 0,
        };
      }
    }

    // Execute each step
    for (const step of plan.steps) {
      const lastResult = stepResults.filter(r => r.success).pop()?.result as any;
      if (lastResult) {
        const item = Array.isArray(lastResult) ? lastResult[0] : lastResult;
        for (const [key, val] of Object.entries(step.params)) {
          if (typeof val !== 'string' || !val.startsWith('<')) continue;

          if (key === 'article_id') {
            step.params[key] = item?.article_id ?? item?.id;
          } else if (key === 'article_url') {
            step.params[key] = item?.article_url ?? item?.url;
          }
        }
      }

      // Check if it's a direct response step
      if (step.tool === 'respond') {
        const message = (step.params as { message?: string }).message || plan.fallback;
        return {
          plan,
          stepResults: [],
          finalResponse: message,
          totalTokens: 0,
        };
      }

      // Execute the tool
      const stepResult = await this.executeStep(step);
      stepResults.push(stepResult);
      totalTokens += stepResult.tokens_used;

      // Stop if step failed and it's critical
      if (!stepResult.success && this.isCriticalStep(plan, step)) {
        break;
      }

      // Check token budget
      if (totalTokens > MAX_TOOL_RESULT_TOKENS) {
        console.log('Token budget exceeded, stopping execution');
        break;
      }
    }

    // Synthesize final response
    const { response, tokensUsed } = await this.synthesizeResponse(
      userMessage,
      plan,
      stepResults
    );
    totalTokens += tokensUsed;

    return {
      plan,
      stepResults,
      finalResponse: response,
      totalTokens,
    };
  }

  /**
   * Execute a single step
   */
  private async executeStep(step: { tool: string; params: Record<string, unknown>; reason: string }): Promise<StepResult> {
    try {
      // Coerce numeric parameters
      const params = this.coerceParams(step.params);
      
      console.log(`[Executor] Running tool: ${step.tool}`, params);
      const result = await executeTool(step.tool as ToolName, params);
      console.log(`[Executor] Result:`, result.error || result.result);

      return {
        step,
        success: !result.error,
        result: result.result,
        error: result.error || undefined,
        tokens_used: result.tokens_used,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        step,
        success: false,
        error: errorMessage,
        tokens_used: 0,
      };
    }
  }

  /**
   * Coerce string parameters to numbers where needed
   */
private coerceParams(params: Record<string, unknown>): Record<string, unknown> {
  const numericFields = ['limit', 'year_min', 'year_max', 'max_pages', 'article_id'] as const;
  const coerced: Record<string, unknown> = { ...params };

  for (const field of numericFields) {
    if (coerced[field] === undefined) continue;

    const n = Number(coerced[field]);
    if (!Number.isFinite(n)) {
      delete coerced[field];
      continue;
    }
    coerced[field] = n;
  }

  if (coerced.max_pages !== undefined) {
    coerced.max_pages = Math.min(Number(coerced.max_pages), 3);
  }
  if (coerced.limit !== undefined) {
    coerced.limit = Math.min(Number(coerced.limit), 10);
  }

  return coerced;
}
  /**
   * Check if a step is critical for the plan
   */
  private isCriticalStep(plan: ActionPlan, step: { tool: string }): boolean {
    // First step is usually critical
    if (plan.steps[0]?.tool === step.tool) {
      return true;
    }
    // PDF extraction failure is critical for pdf_analysis
    if (plan.intent === 'pdf_analysis' && step.tool === 'get_pdf_content') {
      return true;
    }
    return false;
  }

  /**
   * Extract direct response from plan (for conversation intents)
   */
  private extractDirectResponse(plan: ActionPlan): string | null {
    // Check if first step is a respond
    const firstStep = plan.steps[0];
    if (firstStep?.tool === 'respond') {
      return (firstStep.params as { message?: string }).message || plan.fallback;
    }
    // If no steps, use fallback
    if (plan.steps.length === 0) {
      return plan.fallback;
    }
    return null;
  }

  /**
   * Synthesize a final response from tool results
   */
  private async synthesizeResponse(
    userMessage: string,
    plan: ActionPlan,
    stepResults: StepResult[]
  ): Promise<{ response: string; tokensUsed: number }> {
    
    // If all steps failed, use fallback
    if (stepResults.every(r => !r.success)) {
      return {
        response: plan.fallback,
        tokensUsed: 0,
      };
    }

    // Build context from results
    const resultsContext = stepResults
      .map((r, i) => {
        const status = r.success ? 'SUCCESS' : 'FAILED';
        const data = r.success 
          ? JSON.stringify(r.result, null, 2).slice(0, 2000) // Truncate large results
          : `Error: ${r.error}`;
        return `Step ${i + 1} (${r.step.tool}) - ${status}:\n${data}`;
      })
      .join('\n\n');

    const response = await this.client.chat.completions.create({
      model: SYNTHESIS_MODEL,
      messages: [
        { role: "system", content: SYNTHESIS_PROMPT },
        { 
          role: "user", 
          content: `User's question: "${userMessage}"\n\nIntent: ${plan.intent}\n\nTool results:\n${resultsContext}\n\nPlease create a helpful response.`
        }
      ],
      temperature: SYNTHESIS_TEMPERATURE,
      max_tokens: SYNTHESIS_MAX_TOKENS,
    });

    return {
      response: response.choices[0].message.content || plan.fallback,
      tokensUsed: response.usage?.total_tokens || 0,
    };
  }
}
