import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Bookmark, BarChart3, ExternalLink } from 'lucide-react';
import { AnalysisResult } from '@/lib/types';

interface AnalysisDetailsCardProps {
  analysis: AnalysisResult;
}

export const AnalysisDetailsCard: React.FC<AnalysisDetailsCardProps> = ({ analysis }) => {
  const { metrics, redFlags, keyTakeaways, trustedSources, linguisticSignals } = analysis;

  const getStatusColor = (status: 'good' | 'warning' | 'danger') => {
    switch (status) {
      case 'good':
        return 'bg-emerald-500';
      case 'warning':
        return 'bg-amber-500';
      case 'danger':
        return 'bg-rose-500';
    }
  };

  return (
    <div className="space-y-5">
      {/* Key Takeaways */}
      {keyTakeaways && keyTakeaways.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-[#0d1424]/90 p-5 shadow-lg">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <CheckCircle2 className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Key Verification Findings
            </h3>
          </div>
          <ul className="mt-3.5 space-y-2 text-xs sm:text-sm text-slate-300">
            {keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-400" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Credibility Metrics Grid */}
      {metrics && metrics.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-[#0d1424]/90 p-5 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-400" />
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                Forensic Credibility Metrics
              </h3>
            </div>
            <span className="text-xs text-slate-400">Multi-Factor Assessment</span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {metrics.map((metric, idx) => (
              <div key={idx} className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">{metric.name}</span>
                  <span className="text-xs font-bold text-slate-300">{metric.score}%</span>
                </div>

                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full transition-all duration-500 ${getStatusColor(metric.status)}`}
                    style={{ width: `${metric.score}%` }}
                  />
                </div>

                <p className="mt-2 text-[11px] text-slate-400 leading-relaxed">
                  {metric.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Red Flags & Manipulation Tactics */}
      {redFlags && redFlags.length > 0 && (
        <div className="rounded-xl border border-rose-500/20 bg-[#160e18]/80 p-5 shadow-lg">
          <div className="flex items-center gap-2 border-b border-rose-900/40 pb-3">
            <ShieldAlert className="h-4 w-4 text-rose-400" />
            <h3 className="text-sm font-bold text-rose-300 uppercase tracking-wider">
              Identified Red Flags & Deceptive Cues
            </h3>
          </div>
          <ul className="mt-3.5 space-y-2 text-xs sm:text-sm text-slate-300">
            {redFlags.map((flag, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-rose-400" />
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Linguistic Signals & Tone */}
      {linguisticSignals && (
        <div className="rounded-xl border border-slate-800 bg-[#0d1424]/90 p-5 shadow-lg">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-3">
            Linguistic & Stylistic Signals
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-900/60 p-3 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                Sensationalism
              </span>
              <span className="mt-1 text-lg font-bold text-indigo-300">
                {linguisticSignals.sensationalismScore}%
              </span>
            </div>
            <div className="rounded-lg bg-slate-900/60 p-3 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                Emotional Tone
              </span>
              <span className="mt-1 text-sm font-bold text-purple-300">
                {linguisticSignals.emotionalTone}
              </span>
            </div>
            <div className="rounded-lg bg-slate-900/60 p-3 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                Clickbait Propensity
              </span>
              <span
                className={`mt-1 text-sm font-bold ${
                  linguisticSignals.clickbaitLevel === 'High'
                    ? 'text-rose-400'
                    : linguisticSignals.clickbaitLevel === 'Moderate'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {linguisticSignals.clickbaitLevel}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Trusted Sources & External Fact-Checks */}
      {trustedSources && trustedSources.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-[#0d1424]/90 p-5 shadow-lg">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Bookmark className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Verified Sources & Reference Citations
            </h3>
          </div>

          <div className="mt-3.5 space-y-2.5">
            {trustedSources.map((source, idx) => (
              <a
                key={idx}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start justify-between rounded-lg border border-slate-800/80 bg-slate-900/50 p-3 transition-colors hover:border-slate-700 hover:bg-slate-800/60"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-indigo-400 flex items-center gap-1.5">
                    <span>{source.title}</span>
                  </div>
                  {source.snippet && (
                    <p className="mt-1 text-[11px] text-slate-400">{source.snippet}</p>
                  )}
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-indigo-400 flex-shrink-0 ml-2 mt-0.5" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
