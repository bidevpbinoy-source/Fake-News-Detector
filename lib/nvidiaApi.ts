import { AnalysisResult, FactCheckClaim, VerdictType } from './types';

export async function analyzeWithNvidia(
  text: string,
  factCheckClaims: FactCheckClaim[] = [],
  apiKey?: string
): Promise<AnalysisResult | null> {
  const key =
    apiKey ||
    process.env.NVIDIA_API_KEY ||
    (process.env.FACT_CHECK_API_KEY?.startsWith('nvapi-') ? process.env.FACT_CHECK_API_KEY : undefined) ||
    (process.env.GEMINI_API_KEY?.startsWith('nvapi-') ? process.env.GEMINI_API_KEY : undefined);

  if (!key) {
    return null;
  }

  const model = process.env.NVIDIA_MODEL || 'meta/llama-3.2-11b-vision-instruct';
  const endpoint = 'https://integrate.api.nvidia.com/v1/chat/completions';

  // Summarize any fact-check claims retrieved
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

  const systemInstruction = `You are VeritasAI, an expert investigative fact-checker, media literacy analyst, and forensic linguistic specialist powered by NVIDIA NIM.
Your goal is to critically analyze the user's provided news claim, excerpt, or headline for factual credibility, manipulation tactics, and disinformation.

Strict Requirements:
1. Verdict must be one of:
   - "LIKELY_TRUE": Verified facts, credible consensus, corroborated by reputable sources.
   - "LIKELY_FAKE": Demonstrably false, fabricated, hoax, or debunks.
   - "MISLEADING": Partial truth taken out of context, cherry-picked data, sensationalized distortion, or satire presented as fact.
   - "UNVERIFIED": Insufficient verifiable evidence or breaking unconfirmed news.
2. Confidence score must be an integer between 0 and 100 representing certainty.
3. Be fair, neutral, and rigorous. Avoid political or cultural bias.
4. Output MUST be strictly valid raw JSON matching this schema:
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
Do not wrap your output in markdown code blocks or backticks. Return ONLY raw valid JSON.`;

  const userPrompt = `Analyze the following news text or claim for factual accuracy:
----------------------------------------
${text}
----------------------------------------
${contextFactChecks}`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.2,
        top_p: 0.8,
        max_tokens: 2048,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[NvidiaApi] HTTP Error ${res.status}:`, errText);
      return null;
    }

    const data = await res.json();
    let rawContent = data?.choices?.[0]?.message?.content;
    if (!rawContent) {
      console.error('[NvidiaApi] Empty response text from NVIDIA NIM');
      return null;
    }
    // Some NVIDIA models return content as a JSON array: [{"type":"text","text":"..."}]
    // Normalise it to a plain string.
    if (Array.isArray(rawContent)) {
      rawContent = rawContent
        .filter((b: any) => b.type === 'text')
        .map((b: any) => b.text)
        .join('');
    }

    // Clean any markdown formatting if present
    const cleanJson = rawContent.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
    
    // Find JSON object boundaries if model added conversational preamble
    const firstBrace = cleanJson.indexOf('{');
    const lastBrace = cleanJson.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1) {
      console.error('[NvidiaApi] Could not find JSON boundaries in model output:', cleanJson);
      return null;
    }

    const jsonString = cleanJson.substring(firstBrace, lastBrace + 1);
    const parsed = JSON.parse(jsonString);

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
      engineUsed: `NVIDIA NIM (${model})`,
      isMock: false,
    };

    return result;
  } catch (error) {
    console.error('[NvidiaApi] Exception querying NVIDIA NIM:', error);
    return null;
  }
}
