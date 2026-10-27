import React from 'react';
import { ExternalLink, CheckCircle2, AlertOctagon, HelpCircle } from 'lucide-react';
import { AnalysisResult } from '@/lib/types';

interface FactCheckMatchCardProps {
  matches: AnalysisResult['factCheckMatches'];
}

export const FactCheckMatchCard: React.FC<FactCheckMatchCardProps> = ({ matches }) => {
  if (!matches || matches.length === 0) {
    return null;
  }

  const getRatingBadge = (rating: string) => {
    const r = rating.toLowerCase();
    if (r.includes('false') || r.includes('fake') || r.includes('pants on fire') || r.includes('incorrect')) {
      return 'border-rose-500/30 bg-rose-500/10 text-rose-300';
    }
    if (r.includes('true') || r.includes('correct') || r.includes('verified')) {
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';
    }
    return 'border-amber-500/30 bg-amber-500/10 text-amber-300';
  };

  return (
    <div className="rounded-xl border border-indigo-500/20 bg-[#0d1424]/90 p-5 shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-indigo-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300">
            Google Fact Check Tools API Match
          </h3>
        </div>
        <span className="rounded-full bg-indigo-950/80 border border-indigo-800/60 px-2.5 py-0.5 text-[11px] font-medium text-indigo-200">
          Human-Verified Record
        </span>
      </div>

      <div className="mt-4 divide-y divide-slate-800/60">
        {matches.map((item, index) => (
          <div key={index} className="py-3.5 first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold text-slate-200 text-sm">
                {item.publisher}
              </span>
              <span
                className={`rounded-md border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${getRatingBadge(
                  item.rating
                )}`}
              >
                {item.rating}
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-300 italic">
              &ldquo;{item.claim}&rdquo;
            </p>

            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
              <span>{item.claimant ? `Claimant: ${item.claimant}` : 'Online viral claim'}</span>
              {item.url && item.url !== '#' && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
                >
                  <span>Read Full Fact Check</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
