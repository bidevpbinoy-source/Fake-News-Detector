export type VerdictType = 'LIKELY_TRUE' | 'LIKELY_FAKE' | 'MISLEADING' | 'UNVERIFIED';

export interface FactCheckClaimReview {
  publisher: {
    name: string;
    site?: string;
  };
  url: string;
  title?: string;
  textualRating: string;
  reviewDate?: string;
}

export interface FactCheckClaim {
  text: string;
  claimant?: string;
  claimDate?: string;
  claimReview: FactCheckClaimReview[];
}

export interface CredibilityMetric {
  name: string;
  score: number; // 0 to 100
  status: 'good' | 'warning' | 'danger';
  explanation: string;
}

export interface AnalysisResult {
  verdict: VerdictType;
  confidenceScore: number; // 0 to 100
  headline: string;
  summary: string;
  keyTakeaways: string[];
  redFlags: string[];
  metrics: CredibilityMetric[];
  factCheckMatches: {
    claim: string;
    claimant?: string;
    publisher: string;
    rating: string;
    url: string;
    date?: string;
  }[];
  trustedSources: {
    title: string;
    url: string;
    snippet?: string;
  }[];
  linguisticSignals: {
    sensationalismScore: number; // 0 to 100
    emotionalTone: string;
    clickbaitLevel: 'Low' | 'Moderate' | 'High';
  };
  engineUsed: string;
  isMock?: boolean;
}

export interface AnalyzeRequest {
  text: string;
  userGeminiKey?: string;
  userFactCheckKey?: string;
  userNvidiaKey?: string;
}
