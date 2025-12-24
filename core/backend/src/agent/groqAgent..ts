import { getToolDeclarations, runTool } from "./tools/registry";
import dotenv from "dotenv";
import Groq from "groq-sdk";
dotenv.config();


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "llama-3.1-8b-instant";


export async function askGroqAgent(userMessage: string) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("Missing GROQ_API_KEY");
  }

  const tools = getToolDeclarations().map((fn) => ({
    type: "function" as const,
    function: fn,
  }));

  const messages: any[] = [
  {
    role: "system",
    content: `You are a database-backed assistant.
      Rules (must follow):
      - If the user asks for ARTICLES / paper search / rankings: call "search_articles".
      - If the user asks for AUTHORS: call "search_authors" (or "list_authors" for name lists).
      - If the user asks for JOURNALS: call "search_journals".
      - If the user asks for SUBJECTS: call "search_subjects" (or "list_subjects" for name lists).
      - If the user asks for KEYWORDS: call "search_keywords" (or "list_keywords" for name lists).
      - You MUST base your final answer ONLY on the tool result field "rows". Do not use outside knowledge.
      - Do not invent fields. If a value is missing in rows, say "unknown".
      - If rows is empty, reply exactly: "No matching results found."
      - Never set filters to "unknown"; omit the field instead.

      Tone (must follow):
      - Start with 1 friendly sentence (max 12 words).
      - Keep it informal and human (no slang, no emojis).
      - Then one blank line, then the results.

      Output format (strict):
      1) Line 1 MUST be a single friendly opener.
      2) Line 2 MUST be blank.
      3) Line 3 MUST start the numbered list with "1."
      4) Use exactly ONE blank line between items (i.e., items are separated by a single empty line).
      5) Do not add any other extra blank lines.

      Per-item format:
      - Articles:
        N. **Title**
          Year: [Year] | Citations: [Citations]
      - Authors:
        N. **Name**
          Affiliation: [Affiliation]
      - Journals:
        N. **Name**
          Publisher: [Publisher] | Impact Factor: [IF]
      - Subjects/Keywords:
        N. Value

      Example:
        Sure!, Here’s what I found in the database.

      1. **The Evolution of AI**
        Year: 2023 | Citations: 45

      2. **Climate Change Models**
        Year: 2022 | Citations: 110`
    },
      { role: "user", content: userMessage },
    ];


  for (let step = 0; step < 5; step++) {
    const resp = await groq.chat.completions.create({
      model: MODEL,
      messages,
      tools,
      tool_choice: "auto",
      temperature: 0.2,
    });

    const msg = resp.choices?.[0]?.message;
    console.log("MODEL_TOOL_CALLS:", JSON.stringify(msg.tool_calls ?? [], null, 2));
    console.log("RAW_AGENT_CONTENT:", JSON.stringify(msg.content));

    if (!msg) throw new Error("No model message");

    // אם אין tool calls -> תשובה סופית
    if (!msg.tool_calls || msg.tool_calls.length === 0) {
      return msg.content ?? "";
    }

    // מוסיפים את הודעת ה-assistant עם ה-tool_calls
    messages.push(msg);

    // מריצים כל tool ומחזירים tool result
    for (const tc of msg.tool_calls) {
      const name = tc.function?.name;
      const rawArgs = tc.function?.arguments ?? "{}";

      let args: any = {};
      try {
        args = JSON.parse(rawArgs);
      } catch {
        args = {};
      }

      const result = await runTool(name, args);
      
      messages.push({
        role: "tool",
        tool_call_id: tc.id,
        content: JSON.stringify(result),
      });
    }
  }

  throw new Error("Tool loop exceeded");
}