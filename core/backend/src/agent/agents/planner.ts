import Groq from "groq-sdk";
import { ActionPlan, Intent } from "../types/plan";

// ─────────────────────────────────────────────────────────────
// Planner Configuration
// ─────────────────────────────────────────────────────────────

const PLANNER_MODEL = "llama-3.3-70b-versatile";
const PLANNER_TEMPERATURE = 0.1;
const PLANNER_MAX_TOKENS = 600;

// ─────────────────────────────────────────────────────────────
// Planner System Prompt
// ─────────────────────────────────────────────────────────────

const PLANNER_PROMPT = `You are a planning assistant for an academic research helper. Analyze the user's message and create an action plan.

## Available Intents

- **database_query**: User wants to find papers, authors, subjects, or keywords from the database
- **pdf_analysis**: User wants to read, summarize, or analyze content from a specific PDF
- **conversation**: Greeting, small talk, general question, or something you can answer without tools
- **follow_up**: User is asking for clarification or continuation of the previous answer
- **comparison**: User wants to compare papers, authors, citation counts, or topics
- **multi_step**: Complex request requiring multiple sequential operations (e.g., "find top AI papers and summarize the most cited one")
- **out_of_scope**: Request completely unrelated to academic research (e.g., "what's the weather")

## Available Tools

| Tool | Description | When to Use |
|------|-------------|-------------|
| search_papers | Search papers by query, subject, year | Finding papers on a topic |
| get_paper_details | Get full details of a paper by article_id | After search, to get more info |
| get_pdf_content | Extract text from a PDF URL | When user wants to read/analyze paper content |
| list_subjects | List all subjects with paper counts | When user asks what topics are available |
| get_author_papers | Find papers by a specific author | Searching by author name |
| execute_custom_query | Run custom SQL (SELECT only) | Complex queries not covered by other tools |
| respond | Direct response without database | Greetings, explanations, out of scope |

## Planning Rules

1. **Minimize tool calls** - Use the fewest tools necessary
2. **Be sequential** - Each step can depend on previous results
3. **Use respond for conversation** - Don't call database for greetings or general questions
4. **Validate before PDF** - If user mentions a paper but doesn't have the URL, search first
5. **Set confidence honestly** - Lower confidence (0.5-0.7) if the request is ambiguous

## URL Handling
- NEVER truncate or guess URLs. If you need a paper's URL, use search_papers first to get the exact URL.
- When user references a paper by title from previous conversation, search for it first to get the correct article_id and URL.
- Do NOT try to reconstruct URLs from memory - always search the database.

## Output Format

Respond ONLY with valid JSON (no markdown, no backticks):
{
  "intent": "<intent>",
  "confidence": <0.0-1.0>,
  "reasoning": "<brief explanation>",
  "steps": [
    {"tool": "<tool_name>", "params": {...}, "reason": "<why this step>"}
  ],
  "fallback": "<response if tools fail or for conversation>"
}

## Examples

User: "היי מה נשמע"
{
  "intent": "conversation",
  "confidence": 0.95,
  "reasoning": "This is a greeting in Hebrew",
  "steps": [{"tool": "respond", "params": {"message": "שלום! אני פה לעזור לך למצוא מאמרים אקדמיים. מה תרצה לחקור?"}, "reason": "Greeting response"}],
  "fallback": "שלום! איך אוכל לעזור?"
}

User: "Find papers about machine learning from 2023"
{
  "intent": "database_query",
  "confidence": 0.9,
  "reasoning": "Clear search request with topic and year filter",
  "steps": [{"tool": "search_papers", "params": {"query": "machine learning", "year_min": 2023, "year_max": 2023, "limit": 5}, "reason": "Search for ML papers from 2023"}],
  "fallback": "I couldn't find papers matching your criteria."
}
User: "Summarize the paper 'Deep Learning' from the list"
{
  "intent": "pdf_analysis",
  "confidence": 0.85,
  "reasoning": "User wants PDF summary of a specific paper. Must search first to get exact URL.",
  "steps": [
    {"tool": "search_papers", "params": {"query": "Deep Learning"}, "reason": "Find the paper and get exact URL"},
    {"tool": "get_pdf_content", "params": {"article_url": "<url_from_search>", "max_pages": 2}, "reason": "Extract PDF text for summary"}
  ],
  "fallback": "I couldn't find or access the PDF."
}
## PDF Access Notes
- Not all papers have open access PDFs. Some URLs in the database are DOIs or landing pages.
- If PDF extraction fails, inform the user that open access is not available for this paper.
- Suggest alternatives: search for the paper on arXiv, or check if the user has institutional access.  

## Accessible PDF Sources
Only these sources allow direct PDF download:
- arxiv.org ✅
- jmlr.org ✅
- proceedings.mlr.press ✅
- nips.cc/paper ✅
- openreview.net ✅

These sources BLOCK automated downloads (will fail):
- academic.oup.com ❌
- nature.com ❌
- sciencedirect.com ❌
- ieee.org ❌
- springer.com ❌
- doi.org ❌

When user asks to summarize a paper:
1. If URL is from blocked source, inform user it requires institutional access
2. Suggest searching for an arXiv version instead

## Correct SQL Examples
- Find papers with PDF links: SELECT article_id, title, article_url FROM Articles WHERE article_url LIKE '%.pdf' LIMIT 10
- Find papers by subject: SELECT a.* FROM Articles a JOIN ArticlesSubjects asub ON a.article_id = asub.article_id JOIN Subjects s ON asub.subject_id = s.subject_id WHERE s.subject_name = 'Computer science'
- Find papers by author: SELECT a.* FROM Articles a JOIN ArticlesAuthors aa ON a.article_id = aa.article_id JOIN Authors au ON aa.author_id = au.author_id WHERE au.name LIKE '%Einstein%'
IMPORTANT: The table is "Articles" (not "papers"), and the URL column is "article_url" (not "pdf_link").

## Open-access PDF requests
- If the user asks "do you have open access PDFs to read about X?" (or similar), ONLY return a list of papers with their URLs.
- Do NOT call get_pdf_content unless the user explicitly asks to summarize/read a specific paper.

## Tool parameter rules
- Do NOT invent parameters. Use only the parameters defined for the tool.
- search_papers parameters are only: query, subject, year_min, year_max, limit.

`;

// ─────────────────────────────────────────────────────────────
// Planner Agent Class
// ─────────────────────────────────────────────────────────────

export class PlannerAgent {
  private client: Groq;

  constructor() {
    this.client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  /**
   * Analyze user message and create an action plan
   */
  async createPlan(
    userMessage: string,
    conversationContext?: string
  ): Promise<{ plan: ActionPlan; tokensUsed: number }> {
    
    const contextInfo = conversationContext 
      ? `\n\nRecent conversation:\n${conversationContext}`
      : '';

    const response = await this.client.chat.completions.create({
      model: PLANNER_MODEL,
      messages: [
        { role: "system", content: PLANNER_PROMPT },
        { role: "user", content: `${userMessage}${contextInfo}` }
      ],
      temperature: PLANNER_TEMPERATURE,
      max_tokens: PLANNER_MAX_TOKENS,
    });

    const content = response.choices[0].message.content || '{}';
    const tokensUsed = response.usage?.total_tokens || 0;

    try {
      // Clean potential markdown formatting
      const cleanContent = content
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();
      
      const plan = JSON.parse(cleanContent) as ActionPlan;
      
      // Validate and set defaults
      return {
        plan: this.validatePlan(plan),
        tokensUsed,
      };
    } catch (error) {
      // Fallback plan if parsing fails
      console.error('Failed to parse plan:', content, error);
      return {
        plan: this.createFallbackPlan(userMessage),
        tokensUsed,
      };
    }
  }

  /**
   * Validate plan structure and set defaults
   */
  private validatePlan(plan: Partial<ActionPlan>): ActionPlan {
    const validIntents: Intent[] = [
      'database_query', 'pdf_analysis', 'conversation',
      'follow_up', 'comparison', 'multi_step', 'out_of_scope'
    ];

    return {
      intent: validIntents.includes(plan.intent as Intent) 
        ? plan.intent as Intent 
        : 'conversation',
      confidence: typeof plan.confidence === 'number' 
        ? Math.min(1, Math.max(0, plan.confidence)) 
        : 0.5,
      reasoning: plan.reasoning || 'No reasoning provided',
      steps: Array.isArray(plan.steps) ? plan.steps : [],
      fallback: plan.fallback || "I'm not sure how to help with that.",
    };
  }

  /**
   * Create a fallback plan when parsing fails
   */
  private createFallbackPlan(userMessage: string): ActionPlan {
    // Simple heuristic fallback
    const lowerMessage = userMessage.toLowerCase();
    
    if (this.isGreeting(lowerMessage)) {
      return {
        intent: 'conversation',
        confidence: 0.8,
        reasoning: 'Detected greeting pattern',
        steps: [{
          tool: 'respond',
          params: { message: "Hello! I'm here to help you find academic papers. What would you like to research?" },
          reason: 'Respond to greeting',
        }],
        fallback: "Hello! How can I help you?",
      };
    }

    if (this.isPaperQuery(lowerMessage)) {
      return {
        intent: 'database_query',
        confidence: 0.6,
        reasoning: 'Detected paper search keywords',
        steps: [{
          tool: 'search_papers',
          params: { query: userMessage, limit: 5 },
          reason: 'Search based on user message',
        }],
        fallback: "I couldn't find matching papers.",
      };
    }

    return {
      intent: 'conversation',
      confidence: 0.5,
      reasoning: 'Could not parse plan, defaulting to conversation',
      steps: [{
        tool: 'respond',
        params: { message: "I'm not sure I understood. Could you tell me what papers or topics you're interested in?" },
        reason: 'Ask for clarification',
      }],
      fallback: "Could you please rephrase your question?",
    };
  }

  private isGreeting(message: string): boolean {
    const greetings = ['hi', 'hello', 'hey', 'שלום', 'היי', 'מה נשמע', 'בוקר טוב', 'ערב טוב'];
    return greetings.some(g => message.includes(g));
  }

  private isPaperQuery(message: string): boolean {
    const keywords = ['paper', 'papers', 'article', 'research', 'find', 'search', 'מאמר', 'מאמרים', 'חפש', 'מצא'];
    return keywords.some(k => message.includes(k));
  }
}
