import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set in environment.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// In-memory cloud sync store for multi-device simulation
const cloudSyncStore = new Map<string, any[]>();

// Pre-seeded initial cloud sync demo data if requested
cloudSyncStore.set("demo@verdictdesk.apple", []);

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Cloud Sync endpoints
app.get("/api/sync/:userId", (req, res) => {
  const { userId } = req.params;
  const decisions = cloudSyncStore.get(userId) || [];
  res.json({ success: true, decisions, syncedAt: new Date().toISOString() });
});

app.post("/api/sync/:userId", (req, res) => {
  const { userId } = req.params;
  const { decisions } = req.body;
  if (Array.isArray(decisions)) {
    cloudSyncStore.set(userId, decisions);
    return res.json({ success: true, count: decisions.length, syncedAt: new Date().toISOString() });
  }
  return res.status(400).json({ error: "Invalid decisions payload" });
});

// Helper to clean JSON string from LLM response
function extractJSON(text: string): any {
  try {
    const cleaned = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
    return JSON.parse(cleaned);
  } catch (err) {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (innerErr) {
        console.error("JSON parse regex fallback failed:", innerErr);
      }
    }
    throw new Error("Failed to parse JSON from model output");
  }
}

// Decision Research API (Live Search-Grounded)
app.post("/api/verdict/research", async (req, res) => {
  try {
    const { question, constraints, category = "other", followUpContext, previousVerdict } = req.body;

    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({ error: "A decision question is required." });
    }

    const ai = getAI();
    const systemPrompt = `You are Verdict Desk, an elite, highly decisive intelligence briefing analyst for high-stakes decisions.
Your task is to conduct real-world research using Google Search, strip away marketing fluff, reduce the options to only the factors that actually matter for this decision, and deliver:
1. EXACTLY ONE CLEAR VERDICT. A single definitive recommended option with confidence level ("High", "Medium", or "Low") and 2–3 crisp sentences of decisive reasoning. Stiff mandate: DO NOT HEDGE. NO "it depends on what you value", "both have pros and cons", or "it comes down to personal preference". Make the executive call based on the provided constraints and current objective data.
2. COMPARISON VIEW: Compare each candidate option (2 to 4 options). Strip each option strictly to 2-4 critical deciding factors (e.g. Total Cost of Ownership, True Battery Life under Load, Median Compensation in City, Workload/Drop-off Rate). Mark the single winner.
3. REFERENCE POINTS: 2 to 5 standalone benchmark facts relevant to the decision (e.g., standard industry salary band, average resale depreciation, typical graduation rate, market retail baseline). These MUST read as objective market context, NOT as arguments for one option.
4. UNCERTAINTY FLAGS: Anything genuinely unresolved or unverified from the search (e.g. regional tariff variance, unconfirmed release dates, conflicting employer bonus reports, pending accreditation). NEVER guess or gloss over gaps; flag them explicitly.
5. CATEGORY: Classify into "shopping", "career", "academic", or "other".

OUTPUT FORMAT: Return STRICT valid JSON only without commentary.
Schema:
{
  "title": string,
  "category": "shopping" | "career" | "academic" | "other",
  "verdict": {
    "recommendedOption": string,
    "confidence": "High" | "Medium" | "Low",
    "reasoning": string (2-3 crisp sentences, decisive, zero hedging)
  },
  "options": [
    {
      "name": string,
      "isWinner": boolean,
      "statusBadge": string (e.g. "Optimal Value", "Overpriced for Spec", "Highest Risk-Adjusted ROI"),
      "keyFactors": [
        {
          "factor": string,
          "value": string,
          "sentiment": "positive" | "neutral" | "negative"
        }
      ]
    }
  ],
  "referencePoints": [
    {
      "label": string,
      "metric": string,
      "context": string,
      "sourceHint": string
    }
  ],
  "uncertainties": [
    {
      "title": string,
      "detail": string,
      "severity": "high" | "medium" | "low"
    }
  ]
}`;

    const userPromptContent = `Decision Question: "${question}"
Optional Constraints: ${constraints ? JSON.stringify(constraints) : "None provided"}
${followUpContext ? `Follow-up constraint / Adjustment: "${followUpContext}"\nPrevious Decision Context: ${JSON.stringify(previousVerdict || {})}` : ""}

Search current web information for prices, verified specs, salary data, or benchmarks. Output strict JSON matching the schema.`;

    let response;
    let webSources: { title: string; url: string }[] = [];

    if (process.env.GEMINI_API_KEY) {
      response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: userPromptContent,
        config: {
          systemInstruction: systemPrompt,
          tools: [{ googleSearch: {} }],
        },
      });

      // Extract Grounding Chunks
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (Array.isArray(chunks)) {
        webSources = chunks
          .map((c: any) => {
            if (c.web?.uri) {
              return {
                title: c.web.title || new URL(c.web.uri).hostname,
                url: c.web.uri,
              };
            }
            return null;
          })
          .filter(Boolean) as { title: string; url: string }[];
      }
    } else {
      // Fallback if API key is not yet set
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    const rawText = response.text || "";
    const parsedData = extractJSON(rawText);

    // Build complete record
    const resultRecord = {
      id: "vd_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      question,
      constraints: constraints || "",
      category: parsedData.category || category,
      title: parsedData.title || question,
      verdict: parsedData.verdict,
      options: parsedData.options || [],
      referencePoints: parsedData.referencePoints || [],
      uncertainties: parsedData.uncertainties || [],
      webSources: webSources.slice(0, 6),
      timestamp: new Date().toISOString(),
      trackedForAlerts: false,
      followUps: followUpContext
        ? [
            {
              adjustment: followUpContext,
              timestamp: new Date().toISOString(),
            },
          ]
        : [],
    };

    return res.json({ success: true, decision: resultRecord });
  } catch (error: any) {
    console.error("Research endpoint error:", error);
    return res.status(500).json({
      error: error.message || "Failed to complete decision research.",
      details: error.toString(),
    });
  }
});

// Re-check Decision API
app.post("/api/verdict/recheck", async (req, res) => {
  try {
    const { decision } = req.body;
    if (!decision || !decision.question) {
      return res.status(400).json({ error: "Missing original decision to re-check." });
    }

    const ai = getAI();
    const systemPrompt = `You are Verdict Desk performing a live RE-CHECK on a previously saved decision to detect if material real-world conditions have shifted (e.g. price drops, new models, refreshed salary benchmarks, updated deadlines, availability).
Compare previous findings with the latest real-time web search results.
Return strict valid JSON with the updated verdict briefing AND a "deltaSummary" noting what changed or confirming stability.

Schema:
{
  "deltaSummary": string (1-2 sentences on what materially changed, e.g. "Price dropped $150 on Option A; warranty terms updated", or "Conditions remain stable with no material price or specification changes."),
  "hasMaterialChange": boolean,
  "verdict": {
    "recommendedOption": string,
    "confidence": "High" | "Medium" | "Low",
    "reasoning": string
  },
  "options": [
    {
      "name": string,
      "isWinner": boolean,
      "statusBadge": string,
      "keyFactors": [
        {
          "factor": string,
          "value": string,
          "sentiment": "positive" | "neutral" | "negative"
        }
      ]
    }
  ],
  "referencePoints": [
    {
      "label": string,
      "metric": string,
      "context": string,
      "sourceHint": string
    }
  ],
  "uncertainties": [
    {
      "title": string,
      "detail": string,
      "severity": "high" | "medium" | "low"
    }
  ]
}`;

    const recheckPrompt = `Original Decision: "${decision.question}"
Constraints: "${decision.constraints || "None"}"
Previous Verdict Recommendation: "${decision.verdict?.recommendedOption}" (${decision.verdict?.reasoning})
Previous Reference Points: ${JSON.stringify(decision.referencePoints || [])}

Perform a fresh web search to verify if numbers, prices, terms, or availability changed right now. Output strict JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: recheckPrompt,
      config: {
        systemInstruction: systemPrompt,
        tools: [{ googleSearch: {} }],
      },
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    let webSources: { title: string; url: string }[] = [];
    if (Array.isArray(chunks)) {
      webSources = chunks
        .map((c: any) => (c.web?.uri ? { title: c.web.title || new URL(c.web.uri).hostname, url: c.web.uri } : null))
        .filter(Boolean) as { title: string; url: string }[];
    }

    const parsed = extractJSON(response.text || "");

    const updatedDecision = {
      ...decision,
      verdict: parsed.verdict || decision.verdict,
      options: parsed.options || decision.options,
      referencePoints: parsed.referencePoints || decision.referencePoints,
      uncertainties: parsed.uncertainties || decision.uncertainties,
      webSources: webSources.length > 0 ? webSources.slice(0, 6) : decision.webSources,
      lastRecheck: {
        timestamp: new Date().toISOString(),
        deltaSummary: parsed.deltaSummary || "Re-checked against live web data.",
        hasMaterialChange: Boolean(parsed.hasMaterialChange),
      },
    };

    return res.json({ success: true, decision: updatedDecision, delta: parsed.deltaSummary });
  } catch (error: any) {
    console.error("Re-check endpoint error:", error);
    return res.status(500).json({ error: error.message || "Failed to re-check decision." });
  }
});

// Prompt Lab API (Generates 3 tailored variants with explanatory rationale)
app.post("/api/prompt-lab", async (req, res) => {
  try {
    const { requestText } = req.body;
    if (!requestText || !requestText.trim()) {
      return res.status(400).json({ error: "Prompt request text is required." });
    }

    const ai = getAI();
    const systemInstruction = `You are the Prompt Lab engine inside Verdict Desk.
Given one plain-language user query or decision request, generate THREE tailored prompt variants optimized for different modern LLM architectures:
1. "reasoning": Phrased for a reasoning-style / chain-of-thought model (e.g. OpenAI o1/o3, Claude 3.7 Thinking, Gemini Thinking). Emphasizes step-by-step constraint hierarchies, trade-off trees, stress-testing edge cases, and explicit trade-off weighing.
2. "chat": Phrased for a conversational chat-tuned model (e.g. Claude Sonnet, ChatGPT 4o). Emphasizes structured executive briefing, clear headings, bulleted actionable summaries, and asking one critical follow-up question.
3. "search_grounded": Phrased for a search-grounded browsing model (e.g. Perplexity, Gemini with Google Search). Emphasizes specific factual anchors, date parameters, live pricing/availability queries, domain filtering, and explicit source citation requirements.

For EACH variant, provide:
- "targetType": "Reasoning Model" | "Chat Model" | "Search-Grounded Model"
- "prompt": The exact ready-to-paste prompt text
- "whyNote": A concise one-line note on WHY this variant is phrased this way (what changes across model architectures).

Output strict JSON only:
{
  "originalRequest": string,
  "variants": [
    {
      "id": "reasoning",
      "targetType": "Reasoning Model",
      "subtitle": "Chain-of-thought, trade-off tree, constraint hierarchy",
      "prompt": string,
      "whyNote": string
    },
    {
      "id": "chat",
      "targetType": "Chat Model",
      "subtitle": "Structured briefing, clean typography, executive clarity",
      "prompt": string,
      "whyNote": string
    },
    {
      "id": "search_grounded",
      "targetType": "Search-Grounded Model",
      "subtitle": "Factual anchors, price checks, live citation demands",
      "prompt": string,
      "whyNote": string
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Request: "${requestText.trim()}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const parsed = extractJSON(response.text || "");
    return res.json({ success: true, lab: parsed });
  } catch (error: any) {
    console.error("Prompt Lab error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate prompt variants." });
  }
});

// Vite & Static Asset Handling
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Verdict Desk server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
