import { Router } from "express";
import { createOrchestrator, Orchestrator } from "../agent/agents/orchestrator";
const router = Router();

// Session Management
const sessions = new Map<string, Orchestrator>();

function getOrCreateSession(sessionId: string): Orchestrator {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, createOrchestrator({ debug: true }));
  }
  return sessions.get(sessionId)!;
}

// POST /chat
router.post("/", async (req, res) => {
  try {
    const { message, session_id = "default" } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const orchestrator = getOrCreateSession(session_id);
    const response = await orchestrator.process(message);

    res.json({
      message: response.message,
      intent: response.intent,
      confidence: response.confidence, 
      steps_executed: response.steps_executed,
      tokens: response.tokens_used,
      session_id,
      debug: response.debug,
    });
  } catch (error) {
    console.error("Chat error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: errorMessage });
  }
});

// POST /chat/clear
router.post("/clear", (req, res) => {
  const { session_id = "default" } = req.body;
  if (sessions.has(session_id)) {
    sessions.get(session_id)!.clearHistory();
  }
  res.json({ success: true, session_id });
});

// GET /chat/history/:session_id
router.get("/history/:session_id", (req, res) => {
  const { session_id } = req.params;
  const orchestrator = sessions.get(session_id);
  if (!orchestrator) {
    return res.json({ history: [] });
  }
  res.json({ history: orchestrator.getHistory() });
});

export default router;