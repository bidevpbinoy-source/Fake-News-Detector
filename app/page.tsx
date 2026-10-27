'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { InputSection } from '@/components/InputSection';
import { ResultsSection } from '@/components/ResultsSection';
import { SettingsModal } from '@/components/SettingsModal';
import { AnalysisResult } from '@/lib/types';
import { AlertCircle, Shield, Info } from 'lucide-react';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userNvidiaKey, setUserNvidiaKey] = useState('');
  const [userGeminiKey, setUserGeminiKey] = useState('');
  const [userFactCheckKey, setUserFactCheckKey] = useState('');
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load stored keys from browser localStorage if any
    const storedNvidia = localStorage.getItem('truthlens_nvidia_key') || '';
    const storedGemini = localStorage.getItem('truthlens_gemini_key') || '';
    const storedFact = localStorage.getItem('truthlens_factcheck_key') || '';
    setUserNvidiaKey(storedNvidia);
    setUserGeminiKey(storedGemini);
    setUserFactCheckKey(storedFact);
  }, []);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          userNvidiaKey: userNvidiaKey || undefined,
          userGeminiKey: userGeminiKey || undefined,
          userFactCheckKey: userFactCheckKey || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to analyze credibility. Please check network connection.');
      }

      setResult(data.data);

      // Smooth scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err?.message || 'An unexpected error occurred during fact check.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setInputText('');
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleKeysSaved = (keys: { nvidiaKey: string; geminiKey: string; factCheckKey: string }) => {
    setUserNvidiaKey(keys.nvidiaKey);
    setUserGeminiKey(keys.geminiKey);
    setUserFactCheckKey(keys.factCheckKey);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#070b14] text-slate-100">
      {/* Top Navigation */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        hasCustomKeys={Boolean(userNvidiaKey || userGeminiKey || userFactCheckKey)}
      />

      {/* Main Content */}
      <main className="flex-1 pb-16 space-y-10">
        <HeroSection />

        {/* Input & OCR Workspace */}
        <InputSection
          inputText={inputText}
          setInputText={setInputText}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
        />

        {/* Error Alert */}
        {error && (
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="flex items-center gap-3 rounded-xl border border-rose-500/40 bg-rose-950/40 p-4 text-xs text-rose-300">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-rose-400" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Results Container */}
        <div ref={resultsRef}>
          {result && (
            <ResultsSection result={result} onReset={handleReset} />
          )}
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onKeysSaved={handleKeysSaved}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#060911] py-8 text-center text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex items-center justify-center gap-2 text-slate-300 font-semibold">
            <Shield className="h-4 w-4 text-indigo-400" />
            <span>TruthLens AI News Guard</span>
          </div>
          <p className="max-w-xl mx-auto text-[11px] text-slate-400">
            TruthLens uses multi-tier corroboration: querying fact check databases and applying high-performance NVIDIA NIM (Llama 3.1 Nemotron) and Google Gemini for contextual reasoning and bias analysis. Always consult multiple reputable sources before resharing information.
          </p>
          <div className="pt-2 text-[10px] text-slate-400">
            Powered by NVIDIA NIM, Google Fact Check Tools, Google Gemini & Tesseract.js OCR
          </div>
        </div>
      </footer>
    </div>
  );
}
