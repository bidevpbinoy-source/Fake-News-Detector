import React from 'react';
import { ShieldCheck, Search, Image as ImageIcon, Cpu, CheckCircle } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden pt-8 pb-6 text-center">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-96 rounded-full bg-indigo-600/15 blur-[100px]" />
      <div className="pointer-events-none absolute top-12 left-1/4 h-48 w-48 rounded-full bg-emerald-500/10 blur-[80px]" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
        {/* Top Pills */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-3.5 py-1.5 text-xs text-indigo-300 backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
          <span className="font-semibold text-white">AI News Guard</span>
          <span className="text-slate-500">•</span>
          <span>Google Fact Check Tools & Gemini 1.5</span>
        </div>

        {/* Main Headline */}
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl sm:leading-tight">
          Verify Any News, Claim, or <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
            Screenshot in Real-Time
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed">
          Combat misinformation and viral hoaxes. Our two-tier engine cross-checks verified databases from Snopes, Reuters, and PolitiFact, coupled with Google Gemini AI contextual forensics.
        </p>

        {/* Feature Badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-400">
          <div className="flex items-center gap-1.5 rounded-md bg-slate-900/60 border border-slate-800 px-3 py-1.5">
            <Search className="h-3.5 w-3.5 text-indigo-400" />
            <span>Fact Check Tools API</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-slate-900/60 border border-slate-800 px-3 py-1.5">
            <Cpu className="h-3.5 w-3.5 text-purple-400" />
            <span>Gemini AI Reasoner</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-slate-900/60 border border-slate-800 px-3 py-1.5">
            <ImageIcon className="h-3.5 w-3.5 text-emerald-400" />
            <span>Client-side OCR Engine</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-slate-900/60 border border-slate-800 px-3 py-1.5">
            <CheckCircle className="h-3.5 w-3.5 text-sky-400" />
            <span>Confidence & Bias Scoring</span>
          </div>
        </div>
      </div>
    </div>
  );
};
