'use client';

import React, { useState, useEffect } from 'react';
import { X, Key, ExternalLink, Cpu, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeysSaved: (keys: { nvidiaKey: string; geminiKey: string; factCheckKey: string }) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onKeysSaved,
}) => {
  const [nvidiaKey, setNvidiaKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [factCheckKey, setFactCheckKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const storedNvidia = localStorage.getItem('truthlens_nvidia_key') || '';
      const storedGemini = localStorage.getItem('truthlens_gemini_key') || '';
      const storedFact = localStorage.getItem('truthlens_factcheck_key') || '';

      // Auto-migrate if user previously put an nvapi- key in gemini or fact check slot
      if (!storedNvidia && storedFact.startsWith('nvapi-')) {
        setNvidiaKey(storedFact);
        setFactCheckKey('');
      } else if (!storedNvidia && storedGemini.startsWith('nvapi-')) {
        setNvidiaKey(storedGemini);
        setGeminiKey('');
      } else {
        setNvidiaKey(storedNvidia);
        setGeminiKey(storedGemini);
        setFactCheckKey(storedFact);
      }

      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    let cleanNvidia = nvidiaKey.trim();
    let cleanGemini = geminiKey.trim();
    let cleanFact = factCheckKey.trim();

    // Auto-sort if keys are accidentally swapped
    if (cleanFact.startsWith('nvapi-') && !cleanNvidia) {
      cleanNvidia = cleanFact;
      cleanFact = '';
    }
    if (cleanGemini.startsWith('nvapi-') && !cleanNvidia) {
      cleanNvidia = cleanGemini;
      cleanGemini = '';
    }

    localStorage.setItem('truthlens_nvidia_key', cleanNvidia);
    localStorage.setItem('truthlens_gemini_key', cleanGemini);
    localStorage.setItem('truthlens_factcheck_key', cleanFact);

    onKeysSaved({
      nvidiaKey: cleanNvidia,
      geminiKey: cleanGemini,
      factCheckKey: cleanFact,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const handleClear = () => {
    localStorage.removeItem('truthlens_nvidia_key');
    localStorage.removeItem('truthlens_gemini_key');
    localStorage.removeItem('truthlens_factcheck_key');
    setNvidiaKey('');
    setGeminiKey('');
    setFactCheckKey('');
    onKeysSaved({
      nvidiaKey: '',
      geminiKey: '',
      factCheckKey: '',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-[#0c1322] p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AI Engine & API Configuration</h3>
              <p className="text-xs text-slate-400">
                Configure NVIDIA NIM or Google Gemini for live credibility analysis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-4 text-xs">
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-3 text-emerald-200">
            <span className="font-semibold text-white">Active Engine:</span> NVIDIA NIM (Llama 3.1 Nemotron 70B) or Google Gemini. Configured keys can also be set in <code className="rounded bg-black/40 px-1 py-0.5 text-emerald-300">.env.local</code>.
          </div>

          {/* NVIDIA NIM Key */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-200">NVIDIA NIM API Key</span>
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                  Recommended
                </span>
              </div>
              <a
                href="https://build.nvidia.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-emerald-400 hover:underline text-[11px]"
              >
                <span>NVIDIA API Catalog</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <input
              type="password"
              value={nvidiaKey}
              onChange={(e) => setNvidiaKey(e.target.value)}
              placeholder="nvapi-..."
              className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none font-mono text-xs"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Powers deep forensic reasoning using NVIDIA Llama 3.1 Nemotron 70B.
            </p>
          </div>

          {/* Gemini Key */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-200">Google Gemini API Key</label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-indigo-400 hover:underline text-[11px]"
              >
                <span>Get Free Key</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none font-mono text-xs"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Alternative AI contextual reasoning and logical fallacy scoring engine.
            </p>
          </div>

          {/* Fact Check Tools Key */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-200">Google Fact Check Tools API Key</label>
              <a
                href="https://console.cloud.google.com/apis/library/factchecktools.googleapis.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-indigo-400 hover:underline text-[11px]"
              >
                <span>Google Cloud Console</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <input
              type="password"
              value={factCheckKey}
              onChange={(e) => setFactCheckKey(e.target.value)}
              placeholder="AIzaSy... (optional)"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none font-mono text-xs"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Directly queries international fact-checking organizations (Snopes, Reuters, PolitiFact).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
          <button
            onClick={handleClear}
            className="text-xs text-slate-400 hover:text-rose-400"
          >
            Clear Stored Keys
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/30"
            >
              {savedSuccess ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Keys</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
