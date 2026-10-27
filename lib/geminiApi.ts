import { AnalysisResult, FactCheckClaim, VerdictType } from './types';

export async function analyzeWithGemini(
  text: string,
  factCheckClaims: FactCheckClaim[],
  apiKey?: string
): Promise<AnalysisResult | null> {
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key) {
    return null;
  }

  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

  // Summarize any fact-check claims retrieved from Tier 1 Google Fact Check Tools API
  const contextFactChecks = factCheckClaims.length > 0
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
    : '\nNo exact match found in Google Fact Check database. Rely on contextual reasoning, web knowledge, and semantic evaluation.';

  const systemInstruction = `You are VeritasAI, an expert investigative fact-checker, media literacy analyst, and forensic linguistic specialist.
Your goal is to critically analyze the user's provided news claim, excerpt, or headline for factual credibility, manipulation tactics, and disinformation.

Strict Requirements:
1. Verdict must be one of:
   - "LIKELY_TRUE": Verified facts, credible consensus, corroborated by reputable sources.
   - "LIKELY_FAKE": Demonstrably false, fabricated, hoax, or debunks.
   - "MISLEADING": Partial truth taken out of context, cherry-picked data, sensationalized distortion, or satire presented as fact.
   - "UNVERIFIED": Insufficient verifiable evidence or breaking unconfirmed news.
2. Confidence score must be an integer between 0 and 100 representing certainty.
3. Be fair, neutral, and rigorous. Avoid political or cultural bias.
4. Output must be strictly valid JSON matching this schema:
{
  "verdict": "LIKELY_TRUE" | "LIKELY_FAKE" | "MISLEADING" | "UNVERIFIED",
  "confidenceScore": number (0-100),
  "headline": "A concise 1-sentence verdict statement",
  "summary": "Clear, objective breakdown explaining the background, reality, and context.",
  "keyTakeaways": ["Key bullet 1", "Key bullet 2", "Key bullet 3"],
  "redFlags": ["Identified deceptive tactic, sensationalism, or missing source"],
  "metrics": [
    { "name": "Source Transparency", "score": number (0-100), "status": "good" | "warning" | "danger", "explanation": "string" },
    { "name": "Logical Coherence", "score": number (0-100), "status": "good" | "warning" | "danger", "explanation": "string" },
    { "name": "Emotional Neutrality", "score": number (0-100), "status": "good" | "warning" | "danger", "explanation": "string" },
    { "name": "Factual Verification", "score": number (0-100), "status": "good" | "warning" | "danger", "explanation": "string" }
  ],
  "trustedSources": [
    { "title": "Source name or agency", "url": "https://...", "snippet": "Context or relevance" }
  ],
  "linguisticSignals": {
    "sensationalismScore": number (0-100),
    "emotionalTone": "e.g. Alarmist, Neutral, Objective, Aggressive, Urgent",
    "clickbaitLevel": "Low" | "Moderate" | "High"
  }
}
Do not wrap your output in markdown code blocks or backticks. Return raw JSON.`;

  const userPrompt = `Analyze the following news text or claim for factual accuracy:
----------------------------------------
${text}
----------------------------------------
${contextFactChecks}`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemInstruction}\n\n${userPrompt}` }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[GeminiApi] HTTP Error ${res.status}:`, errText);
      return null;
    }

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      console.error('[GeminiApi] Empty response text from Gemini');
      return null;
    }

    // Clean any markdown formatting if present
    const cleanJson = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(cleanJson);

    // Format factCheckMatches
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
      confidenceScore: typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : 75,
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
      engineUsed: matches.length > 0 ? 'Google Fact Check + Gemini AI' : 'Gemini AI Contextual',
      isMock: false,
    };

    return result;
  } catch (error) {
    console.error('[GeminiApi] Exception querying Gemini:', error);
    return null;
  }
}
