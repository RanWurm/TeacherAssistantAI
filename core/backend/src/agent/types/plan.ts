// ─────────────────────────────────────────────────────────────
// Intent Types
// ─────────────────────────────────────────────────────────────

export type Intent =
  | 'database_query'    // User wants to find papers, authors, subjects from the database
  | 'pdf_analysis'      // User wants to read/analyze a specific PDF
  | 'conversation'      // Greeting, general question, or can answer from context
  | 'follow_up'         // Continuing previous conversation, asking for clarification
  | 'comparison'        // Comparing papers, authors, or topics
  | 'multi_step'        // Complex request requiring multiple operations
  | 'out_of_scope';     // Request unrelated to academic research

// ─────────────────────────────────────────────────────────────
// Action Plan Types
// ─────────────────────────────────────────────────────────────

export type ActionStep = {
  tool: string;                     // Tool name or 'respond' for direct response
  params: Record<string, unknown>;  // Parameters for the tool
  reason: string;                   // Why this step is needed
};

export type ActionPlan = {
  intent: Intent;
  confidence: number;     // 0-1 confidence score
  reasoning: string;      // Brief explanation of the analysis
  steps: ActionStep[];
  fallback: string;       // Response if all steps fail
};

// ─────────────────────────────────────────────────────────────
// Execution Types
// ─────────────────────────────────────────────────────────────

export type StepResult = {
  step: ActionStep;
  success: boolean;
  result?: unknown;
  error?: string;
  tokens_used: number;
};

export type ExecutionResult = {
  plan: ActionPlan;
  stepResults: StepResult[];
  finalResponse: string;
  totalTokens: number;
};

// ─────────────────────────────────────────────────────────────
// Orchestrator Response
// ─────────────────────────────────────────────────────────────

export type OrchestratorResponse = {
  message: string;
  intent: Intent;
  confidence: number;
  steps_executed: number;
  tokens_used: {
    planning: number;
    execution: number;
    synthesis: number;
    total: number;
  };
  debug?: {
    plan: ActionPlan;
    stepResults: StepResult[];
  };
};
