import { Router } from "express";
import { askGroqAgent } from "../agent/groqAgent.";

const router = Router();

router.post("/ask", async (req, res) => {
  try {
    const message = String(req.body?.message ?? "").trim();
    if (!message) return res.status(400).json({ error: "message is required" });

    const out = await askGroqAgent(message);
    res.json(out);
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "server error" });
  }
});

export default router;
