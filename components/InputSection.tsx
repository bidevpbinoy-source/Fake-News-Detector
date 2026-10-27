'use client';

import React, { useState } from 'react';
import { ImageOcrDropzone } from './ImageOcrDropzone';
import { FileText, Image as ImageIcon, Sparkles, Trash2, ClipboardPaste, ArrowRight, Loader2 } from 'lucide-react';

interface InputSectionProps {
  inputText: string;
  setInputText: (val: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const SAMPLE_CLAIMS = [
  {
    label: 'Pope White Puffer Jacket',
    type: 'fake',
    text: 'Photo shows Pope Francis wearing an oversized white designer Balenciaga puffer jacket while walking in Rome.',
  },
  {
    label: 'NASA Alpha Centauri Alien Structure',
    type: 'fake',
    text: 'BREAKING: NASA James Webb Telescope confirms discovery of an artificial alien megastructure Dyson sphere orbiting Alpha Centauri!',
  },
  {
    label: 'Coffee & Heart Health Study',
    type: 'true',
    text: 'Major cohort studies published in the European Heart Journal show drinking 2 to 3 cups of coffee daily is linked with lower cardiovascular disease risk.',
  },
  {
    label: 'WHO Declares Disease X Outbreak',
    type: 'misleading',
    text: 'The World Health Organization has officially declared a new worldwide pandemic lockdown for Disease X this month.',
  },
];

export const InputSection: React.FC<InputSectionProps> = ({
  inputText,
  setInputText,
  onAnalyze,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setInputText(text);
    } catch {
      // Ignore clipboard read errors
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (inputText.trim() && !isLoading) {
        onAnalyze();
      }
    }
  };

  const handleOcrExtracted = (text: string) => {
    setInputText(text);
    setActiveTab('text');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      <div className="rounded-2xl border border-slate-800 bg-[#0d1424]/90 p-5 shadow-2xl shadow-indigo-950/20 backdrop-blur-xl sm:p-6">
        {/* Mode Selector Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('text')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                activeTab === 'text'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Article / Headline Text</span>
            </button>

            <button
              onClick={() => setActiveTab('image')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                activeTab === 'image'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <ImageIcon className="h-3.5 w-3.5" />
              <span>Screenshot / Image OCR</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            {inputText.trim().length > 0 && (
              <span>{inputText.trim().split(/\s+/).length} words</span>
            )}
          </div>
        </div>

        {/* OCR Dropzone Tab */}
        {activeTab === 'image' && (
          <div className="pt-4">
            <ImageOcrDropzone onTextExtracted={handleOcrExtracted} />
          </div>
        )}

        {/* Text Input Area */}
        <div className="relative mt-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={5}
            placeholder="Paste a news headline, social media post, excerpt, or WhatsApp forward to verify its factual authenticity... (e.g. 'NASA discovers alien megastructure...')"
            className="w-full resize-y rounded-xl border border-slate-800 bg-[#080d19] p-4 text-sm text-slate-100 placeholder-slate-500 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />

          {/* Bottom helper actions within text container */}
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePaste}
                className="flex items-center gap-1 rounded px-2 py-1 hover:bg-slate-800 hover:text-slate-200"
                title="Paste from clipboard"
              >
                <ClipboardPaste className="h-3.5 w-3.5" />
                <span>Paste</span>
              </button>

              {inputText && (
                <button
                  type="button"
                  onClick={() => setInputText('')}
                  className="flex items-center gap-1 rounded px-2 py-1 text-slate-400 hover:bg-slate-800 hover:text-rose-400"
                  title="Clear text"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            <div className="hidden sm:block text-[11px] text-slate-400">
              Press <kbd className="rounded border border-slate-700 bg-slate-800 px-1 py-0.5 text-[10px] text-slate-300">Ctrl</kbd> + <kbd className="rounded border border-slate-700 bg-slate-800 px-1 py-0.5 text-[10px] text-slate-300">Enter</kbd> to analyze
            </div>
          </div>
        </div>

        {/* Sample Presets */}
        <div className="mt-5 border-t border-slate-800/80 pt-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Try sample real-world claims:</span>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {SAMPLE_CLAIMS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputText(sample.text);
                  setActiveTab('text');
                }}
                className="rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-300 transition-all hover:border-indigo-500/50 hover:bg-indigo-950/30 hover:text-white"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Analyze Button */}
        <div className="mt-6 flex items-center justify-end">
          <button
            type="button"
            disabled={!inputText.trim() || isLoading}
            onClick={onAnalyze}
            className={`group relative flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all ${
              !inputText.trim() || isLoading
                ? 'cursor-not-allowed bg-slate-800 text-slate-500 shadow-none'
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] hover:bg-right hover:shadow-indigo-600/30'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Cross-Checking Databases & AI Reasoner...</span>
              </>
            ) : (
              <>
                <span>Analyze Credibility</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
