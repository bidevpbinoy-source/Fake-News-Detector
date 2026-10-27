import { NextRequest, NextResponse } from 'next/server';
import { searchFactCheckClaims } from '@/lib/factCheckApi';
import { analyzeWithOllama } from '@/lib/ollamaApi';
import { analyzeWithGemini } from '@/lib/geminiApi';
import { analyzeWithNvidia } from '@/lib/nvidiaApi';
import { generateHeuristicAnalysis } from '@/lib/mockAnalyzer';
import { AnalyzeRequest, FactCheckClaim, AnalysisResult } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body: AnalyzeRequest = await req.json();
    const { text, userGeminiKey, userFactCheckKey, userNvidiaKey } = body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Text content is required for analysis.' },
        { status: 400 }
      );
    }

    const cleanText = text.trim();

    // Determine NVIDIA key if provided anywhere
    const nvidiaKey =
      userNvidiaKey ||
      (userGeminiKey?.startsWith('nvapi-') ? userGeminiKey : undefined) ||
      (userFactCheckKey?.startsWith('nvapi-') ? userFactCheckKey : undefined) ||
      process.env.NVIDIA_API_KEY ||
      (process.env.FACT_CHECK_API_KEY?.startsWith('nvapi-') ? process.env.FACT_CHECK_API_KEY : undefined) ||
      (process.env.GEMINI_API_KEY?.startsWith('nvapi-') ? process.env.GEMINI_API_KEY : undefined);

    // ----------------------------------------------------
    // Tier 1: Search Google Fact Check Tools Database
    // ----------------------------------------------------
    let factCheckClaims: FactCheckClaim[] = [];
    try {
      factCheckClaims = await searchFactCheckClaims(cleanText, userFactCheckKey);
    } catch (err) {
      console.warn('Tier 1 Fact Check API skipped or failed:', err);
    }

    // ----------------------------------------------------
    // Tier 2: AI Contextual Reasoning (Ollama Local, NVIDIA NIM, or Gemini)
    // ----------------------------------------------------
    let analysisResult: AnalysisResult | null = null;

    // 1. Try local open-source Ollama first
    try {
      console.log('[API] Checking for local Ollama open-source engine...');
      analysisResult = await analyzeWithOllama(cleanText, factCheckClaims);
    } catch (err) {
      console.warn('Tier 2 Ollama analysis skipped or failed:', err);
    }

    // 2. Try NVIDIA NIM if Ollama didn't respond and NVIDIA key is present
    if (!analysisResult && nvidiaKey) {
      try {
        console.log('[API] Running analysis with NVIDIA NIM...');
        analysisResult = await analyzeWithNvidia(cleanText, factCheckClaims, nvidiaKey);
      } catch (err) {
        console.warn('Tier 2 NVIDIA NIM analysis failed:', err);
      }
    }

    // 3. Fall back to Gemini if neither Ollama nor NVIDIA completed
    if (!analysisResult) {
      try {
        analysisResult = await analyzeWithGemini(cleanText, factCheckClaims, userGeminiKey);
      } catch (err) {
        console.warn('Tier 2 Gemini AI analysis failed:', err);
      }
    }

    // ----------------------------------------------------
    // Tier 3: Heuristic Fallback (Demo / Offline / No Keys)
    // ----------------------------------------------------
    if (!analysisResult) {
      const heuristic = generateHeuristicAnalysis(cleanText);

      // If Fact Check API had matches, enrich the heuristic result
      if (factCheckClaims.length > 0) {
        heuristic.factCheckMatches = factCheckClaims.flatMap((c) =>
          c.claimReview.map((r) => ({
            claim: c.text,
            claimant: c.claimant,
            publisher: r.publisher.name,
            rating: r.textualRating,
            url: r.url,
            date: r.reviewDate,
          }))
        );
        heuristic.engineUsed = 'Google Fact Check Database';
      }

      analysisResult = heuristic;
    }

    return NextResponse.json({
      success: true,
      data: analysisResult,
    });
  } catch (error: any) {
    console.error('Unhandled error in /api/analyze:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'An unexpected error occurred during credibility analysis.',
      },
      { status: 500 }
    );
  }
}
