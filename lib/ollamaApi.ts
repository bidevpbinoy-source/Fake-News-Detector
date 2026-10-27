import { AnalysisResult, FactCheckClaim, VerdictType } from './types';

export async function analyzeWithOllama(
  text: string,
  factCheckClaims: FactCheckClaim[] = [],
  baseUrl?: string,
  modelName?: string
): Promise<AnalysisResult | null> {
  const host = baseUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  const model = modelName || process.env.OLLAMA_MODEL || 'llama3.2';

  // Summarize prior fact check records if any
  const contextFactChecks =
    factCheckClaims.length > 0
      ? `\nPrior Fact Check Records from accredited publishers:\n${JSON.stringify(
          factCheckClaims.map((c) => ({
            claim: c.text,
            claimant: c.claimant,
            reviews: c.claimReview.map((r) => ({
              publisher: r.publisher.name,
              rating: r.textualRating,
              url: r.url,
            })),
          })),
          null,
          2
        )}`
      : '\nNo exact match found in known fact-check databases. Rely on contextual reasoning, semantic evaluation, and media literacy heuristics.';

  const systemInstruction = `You are VeritasAI, an expert investigative fact-checker, media literacy analyst, and forensic linguistic specialist powered by an open-source Local LLM via Ollama.
Your goal is to critically analyze the user's provided news claim, excerpt, or headline for factual credibility, manipulation tactics, and disinformation.

Strict Requirements:
1. Verdict must be one of:
   - "LIKELY_TRUE": Verified facts, credible consensus, corroborated by reputable sources.
   - "LIKELY_FAKE": Demonstrably false, fabricated, hoax, or debunks.
   - "MISLEADING": Partial truth taken out of context, cherry-picked data, sensationalized distortion, or satire presented as fact.
   - "UNVERIFIED": Insufficient verifiable evidence or breaking unconfirmed news.
2. Confidence score must be an integer between 0 and 100 representing certainty.
3. Be fair, neutral, and rigorous. Avoid political or cultural bias.
4. Output MUST be strictly valid JSON matching this schema:
{
  "verdict": "LIKELY_TRUE" | "LIKELY_FAKE" | "MISLEADING" | "UNVERIFIED",
  "confidenceScore": number,
  "headline": "A concise 1-sentence verdict statement",
  "summary": "Clear, objective breakdown explaining the background, reality, and context.",
  "keyTakeaways": ["Key bullet 1", "Key bullet 2", "Key bullet 3"],
  "redFlags": ["Identified deceptive tactic, sensationalism, or missing source"],
  "metrics": [
    { "name": "Source Transparency", "score": number, "status": "good" | "warning" | "danger", "explanation": "string" },
    { "name": "Logical Coherence", "score": number, "status": "good" | "warning" | "danger", "explanation": "string" },
    { "name": "Emotional Neutrality", "score": number, "status": "good" | "warning" | "danger", "explanation": "string" },
    { "name": "Factual Verification", "score": number, "status": "good" | "warning" | "danger", "explanation": "string" }
  ],
  "trustedSources": [
    { "title": "Source name or agency", "url": "https://...", "snippet": "Context or relevance" }
  ],
  "linguisticSignals": {
    "sensationalismScore": number,
    "emotionalTone": "e.g. Alarmist, Neutral, Objective, Aggressive, Urgent",
    "clickbaitLevel": "Low" | "Moderate" | "High"
  }
}
Return ONLY valid JSON.`;

  const userPrompt = `Analyze the following news text or claim for factual accuracy:
----------------------------------------
${text}
----------------------------------------
${contextFactChecks}`;

  try {
    const res = await fetch(`${host}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: userPrompt },
        ],
        format: 'json',
        stream: false,
        options: {
          temperature: 0.2,
        },
      }),
    });

    if (!res.ok) {
      console.warn(`[OllamaApi] HTTP Error ${res.status} from Ollama at ${host}`);
      return null;
    }

    const data = await res.json();
    const rawContent = data?.message?.content;
    if (!rawContent) {
      console.warn('[OllamaApi] Empty response from Ollama');
      return null;
    }

    const cleanJson = rawContent
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const firstBrace = cleanJson.indexOf('{');
    const lastBrace = cleanJson.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1) {
      console.warn('[OllamaApi] No JSON structure found in output');
      return null;
    }

    const parsed = JSON.parse(cleanJson.substring(firstBrace, lastBrace + 1));

    const matches = factCheckClaims.flatMap((c) =>
      c.claimReview.map((r) => ({
        claim: c.text,
        claimant: c.claimant,
        publisher: r.publisher.name,
        rating: r.textualRating,
        url: r.url,
        date: r.reviewDate,
      }))
    );

    const result: AnalysisResult = {
      verdict: (parsed.verdict as VerdictType) || 'UNVERIFIED',
      confidenceScore: typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : 80,
      headline: parsed.headline || 'Analysis Completed',
      summary: parsed.summary || 'Contextual analysis completed.',
      keyTakeaways: Array.isArray(parsed.keyTakeaways) ? parsed.keyTakeaways : [],
      redFlags: Array.isArray(parsed.redFlags) ? parsed.redFlags : [],
      metrics: Array.isArray(parsed.metrics) ? parsed.metrics : [],
      factCheckMatches: matches,
      trustedSources: Array.isArray(parsed.trustedSources) ? parsed.trustedSources : [],
      linguisticSignals: parsed.linguisticSignals || {
        sensationalismScore: 30,
        emotionalTone: 'Neutral',
        clickbaitLevel: 'Low',
      },
      engineUsed: `Ollama Local (${model})`,
      isMock: false,
    };

    return result;
  } catch (err: any) {
    // If Ollama is not running or unreachable, return null so next tier can handle it
    console.warn('[OllamaApi] Could not connect to Ollama (is it running?):', err?.message || err);
    return null;
  }
}
