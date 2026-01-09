import { PlannerAgent } from "./planner";
import { ExecutorAgent } from "./executor";
import { OrchestratorResponse } from "../types/plan";

// ─────────────────────────────────────────────────────────────
// Orchestrator Configuration
// ─────────────────────────────────────────────────────────────

const MAX_HISTORY_LENGTH = 10;

// ─────────────────────────────────────────────────────────────
// Conversation History Entry
// ─────────────────────────────────────────────────────────────

type HistoryEntry = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
};

// ─────────────────────────────────────────────────────────────
// Orchestrator Class
// ─────────────────────────────────────────────────────────────

export class Orchestrator {
  private planner: PlannerAgent;
  private executor: ExecutorAgent;
  private conversationHistory: HistoryEntry[] = [];
  private debugMode: boolean;

  constructor(options: { debug?: boolean } = {}) {
    this.planner = new PlannerAgent();
    this.executor = new ExecutorAgent();
    this.debugMode = options.debug || false;
  }

  /**
   * Process a user message through the planning and execution pipeline
   */
  async process(userMessage: string): Promise<OrchestratorResponse> {
    const startTime = Date.now();

    // 1. Build conversation context
    const context = this.buildContext();

    // 2. Create action plan
    console.log('[Orchestrator] Creating plan...');
    const { plan, tokensUsed: planningTokens } = await this.planner.createPlan(
      userMessage,
      context
    );
    console.log('[Orchestrator] Plan:', JSON.stringify(plan, null, 2));

    // 3. Execute the plan
    console.log('[Orchestrator] Executing plan...');
    const executionResult = await this.executor.execute(plan, userMessage);
    console.log('[Orchestrator] Execution complete');

    // 4. Update conversation history
    this.addToHistory('user', userMessage);
    this.addToHistory('assistant', executionResult.finalResponse);

    // 5. Build response
    const response: OrchestratorResponse = {
      message: executionResult.finalResponse,
      intent: plan.intent,
      confidence: plan.confidence,
      steps_executed: executionResult.stepResults.length,
      tokens_used: {
        planning: planningTokens,
        execution: executionResult.stepResults.reduce((sum, r) => sum + r.tokens_used, 0),
        synthesis: executionResult.totalTokens - executionResult.stepResults.reduce((sum, r) => sum + r.tokens_used, 0),
        total: planningTokens + executionResult.totalTokens,
      },
    };

    // Add debug info if enabled
    if (this.debugMode) {
      response.debug = {
        plan,
        stepResults: executionResult.stepResults,
      };
    }

    const duration = Date.now() - startTime;
    console.log(`[Orchestrator] Complete in ${duration}ms, ${response.tokens_used.total} tokens`);

    return response;
  }

  /**
   * Build context string from conversation history
   */
  private buildContext(): string {
    if (this.conversationHistory.length === 0) {
      return '';
    }

    return this.conversationHistory
      .slice(-6) // Last 3 exchanges (6 messages)
      .map(entry => `${entry.role === 'user' ? 'User' : 'Assistant'}: ${entry.content}`)
      .join('\n');
  }

  /**
   * Add entry to conversation history
   */
  private addToHistory(role: 'user' | 'assistant', content: string): void {
    this.conversationHistory.push({
      role,
      content: content.slice(0, 500), // Truncate long messages
      timestamp: Date.now(),
    });

    // Trim history if too long
    if (this.conversationHistory.length > MAX_HISTORY_LENGTH * 2) {
      this.conversationHistory = this.conversationHistory.slice(-MAX_HISTORY_LENGTH * 2);
    }
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * Get current conversation history
   */
  getHistory(): HistoryEntry[] {
    return [...this.conversationHistory];
  }

  /**
   * Set debug mode
   */
  setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
  }
}

// ─────────────────────────────────────────────────────────────
// Factory Function
// ─────────────────────────────────────────────────────────────

export function createOrchestrator(options?: { debug?: boolean }): Orchestrator {
  return new Orchestrator(options);
}
