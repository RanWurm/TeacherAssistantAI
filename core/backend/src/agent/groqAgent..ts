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
    - For any request that asks for articles/data/rankings, you MUST call the tool "search_articles".
    - You MUST base your final answer ONLY on the tool result field "rows". Do not use outside knowledge.
    - Do not invent titles, years, or citation counts. If a value is missing in rows, say "unknown".
    - If rows is empty, reply: "No matching results found."
    - Output a numbered list. Each item: Title — Year — Citations.`,
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