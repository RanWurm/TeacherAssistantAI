import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createOrchestrator, Orchestrator } from "./agents/orchestrator";

dotenv.config();

// ─────────────────────────────────────────────────────────────
// Server Configuration
// ─────────────────────────────────────────────────────────────

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// ─────────────────────────────────────────────────────────────
// Session Management (simple in-memory)
// ─────────────────────────────────────────────────────────────

const sessions = new Map<string, Orchestrator>();

function getOrCreateSession(sessionId: string): Orchestrator {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, createOrchestrator({ debug: true }));
  }
  return sessions.get(sessionId)!;
}

// ─────────────────────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────────────────────

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Main chat endpoint
app.post("/chat", async (req, res) => {
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
      debug: response.debug, // Will be undefined if debug mode is off
    });
  } catch (error) {
    console.error("Chat error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: errorMessage });
  }
});

// Clear session history
app.post("/clear", (req, res) => {
  const { session_id = "default" } = req.body;
  
  if (sessions.has(session_id)) {
    sessions.get(session_id)!.clearHistory();
  }
  
  res.json({ success: true, session_id });
});

// Get session history
app.get("/history/:session_id", (req, res) => {
  const { session_id } = req.params;
  const orchestrator = sessions.get(session_id);
  
  if (!orchestrator) {
    return res.json({ history: [] });
  }
  
  res.json({ history: orchestrator.getHistory() });
});

// List available sessions
app.get("/sessions", (_req, res) => {
  res.json({ sessions: Array.from(sessions.keys()) });
});

// Delete a session
app.delete("/session/:session_id", (req, res) => {
  const { session_id } = req.params;
  const deleted = sessions.delete(session_id);
  res.json({ deleted, session_id });
});

// ─────────────────────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`🚀 TeacherAssistant AI server running on http://localhost:${PORT}`);
  console.log(`   POST /chat - Send a message`);
  console.log(`   POST /clear - Clear session history`);
  console.log(`   GET  /history/:session_id - Get conversation history`);
  console.log(`   GET  /health - Health check`);
});