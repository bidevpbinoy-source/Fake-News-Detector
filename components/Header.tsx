'use client';

import React from 'react';
import { ShieldCheck, Settings, Sparkles, ExternalLink } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  hasCustomKeys: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, hasCustomKeys }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#070b14]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-400 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#0c1222]">
              <ShieldCheck className="h-5 w-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white sm:text-xl">
                TruthLens<span className="text-indigo-400">AI</span>
              </span>
              <span className="hidden rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 sm:inline-flex items-center gap-1">
                <Sparkles className="h-2.5 w-2.5" /> Two-Tier Fact Check
              </span>
            </div>
            <p className="text-[11px] text-slate-400">AI-Powered Credibility & Screenshot Forensics</p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-full">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>NVIDIA NIM & AI Fact Check</span>
          </div>

          <button
            onClick={onOpenSettings}
            className="relative flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-700/80 hover:text-white"
            title="Configure API Keys"
          >
            <Settings className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden sm:inline">Settings</span>
            {hasCustomKeys && (
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#070b14]" />
            )}
          </button>

          <a
            href="https://toolbox.google.com/factcheck/explorer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-600/10 px-3 py-1.5 text-xs font-medium text-indigo-300 transition-colors hover:bg-indigo-600/20"
          >
            <span>Fact Check Explorer</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </header>
  );
};
