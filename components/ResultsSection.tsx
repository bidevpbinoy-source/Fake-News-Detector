'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';
import { AnalysisResult, VerdictType } from '@/lib/types';
import { FactCheckMatchCard } from './FactCheckMatchCard';
import { AnalysisDetailsCard } from './AnalysisDetailsCard';

interface ResultsSectionProps {
  result: AnalysisResult;
  onReset: () => void;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ result, onReset }) => {
  const [copied, setCopied] = useState(false);

  const getVerdictTheme = (verdict: VerdictType) => {
    switch (verdict) {
      case 'LIKELY_TRUE':
        return {
          title: 'Likely True / Verified',
          subtitle: 'Supported by credible sources and factual consensus',
          bg: 'bg-emerald-950/40',
          border: 'border-emerald-500/40',
          badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
          textColor: 'text-emerald-400',
          icon: CheckCircle2,
          colorCode: '#10b981',
        };
      case 'LIKELY_FAKE':
        return {
          title: 'Likely Fake / False',
          subtitle: 'Debunked, fabricated, or contradicts verified records',
          bg: 'bg-rose-950/40',
          border: 'border-rose-500/40',
          badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
          textColor: 'text-rose-400',
          icon: XCircle,
          colorCode: '#ef4444',
        };
      case 'MISLEADING':
        return {
          title: 'Misleading / Needs Context',
          subtitle: 'Contains partial facts distorted, exaggerated, or cherry-picked',
          bg: 'bg-amber-950/40',
          border: 'border-amber-500/40',
          badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          textColor: 'text-amber-400',
          icon: AlertTriangle,
          colorCode: '#f59e0b',
        };
      case 'UNVERIFIED':
      default:
        return {
          title: 'Unverified / Inconclusive',
          subtitle: 'Insufficient independent confirmation or breaking claim',
          bg: 'bg-slate-900/50',
          border: 'border-slate-700',
          badgeBg: 'bg-slate-800 text-slate-300 border-slate-700',
          textColor: 'text-slate-300',
          icon: HelpCircle,
          colorCode: '#94a3b8',
        };
    }
  };

  const theme = getVerdictTheme(result.verdict);
  const VerdictIcon = theme.icon;

  const handleCopyReport = async () => {
    const report = `[TruthLens Fact Check Report]
Verdict: ${theme.title} (${result.confidenceScore}% Confidence)
Headline: ${result.headline}
Summary: ${result.summary}
Engine: ${result.engineUsed}
Verified with TruthLens AI`;

    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-6 animate-fadeIn">
      {/* Engine Used Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-[#0c1322] px-4 py-2.5 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span>Analysis Engine:</span>
          <span className="font-semibold text-white">{result.engineUsed}</span>
        </div>
        {result.isMock && (
          <div className="flex items-center gap-1.5 text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-[11px]">
            <Info className="h-3 w-3" />
            <span>Demo Mode (Configure API keys in Settings for live Gemini)</span>
          </div>
        )}
      </div>

      {/* Top Main Verdict Card */}
      <div className={`rounded-2xl border ${theme.border} ${theme.bg} p-6 shadow-2xl backdrop-blur-xl`}>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Left Verdict Info */}
          <div className="flex items-start gap-4">
            <div className={`rounded-2xl border ${theme.border} bg-[#0c1220] p-3.5 shadow-inner`}>
              <VerdictIcon className={`h-8 w-8 ${theme.textColor}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${theme.badgeBg}`}>
                  {theme.title}
                </span>
              </div>
              <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                {result.headline}
              </h2>
              <p className="mt-1 text-xs text-slate-300">
                {theme.subtitle}
              </p>
            </div>
          </div>

          {/* Right Confidence Radial / Indicator */}
          <div className="flex items-center gap-4 rounded-xl border border-slate-800/80 bg-[#080d19]/80 p-4 min-w-[170px] justify-center md:justify-start">
            <div className="text-center">
              <div className="text-3xl font-black text-white">
                {result.confidenceScore}%
              </div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Confidence Score
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mt-6 border-t border-slate-800/80 pt-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Executive Fact-Check Summary
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-slate-200">
            {result.summary}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/60 pt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyReport}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary Report'}</span>
            </button>
          </div>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-600/10 px-4 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-600/20"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Verify Another Claim</span>
          </button>
        </div>
      </div>

      {/* Google Fact Check Tools API Matches (Tier 1) */}
      <FactCheckMatchCard matches={result.factCheckMatches} />

      {/* Deep-Dive Analysis, Red Flags & Citations (Tier 2) */}
      <AnalysisDetailsCard analysis={result} />
    </div>
  );
};
