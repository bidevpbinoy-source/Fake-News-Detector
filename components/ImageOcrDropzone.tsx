'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, CheckCircle, AlertCircle, RefreshCw, X } from 'lucide-react';
import { createWorker } from 'tesseract.js';

interface ImageOcrDropzoneProps {
  onTextExtracted: (text: string) => void;
}

export const ImageOcrDropzone: React.FC<ImageOcrDropzoneProps> = ({ onTextExtracted }) => {
  const [dragOver, setDragOver] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (PNG, JPG, WebP, etc.)');
      return;
    }

    setErrorMessage(null);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setIsProcessing(true);
    setProgressPercent(10);
    setProgressStatus('Initializing OCR engine...');

    try {
      const worker = await createWorker('eng', 1, {
        workerPath: '/tesseract/worker.min.js',
        langPath: '/tesseract/',
        corePath: `https://unpkg.com/tesseract.js-core@5.1.1/tesseract-core-simd-lstm.wasm.js`,
        logger: (m: { status: string; progress: number }) => {
          if (m.status === 'recognizing text') {
            setProgressPercent(Math.round(50 + m.progress * 50));
          }
        },
      });

      setProgressStatus('Processing image & recognizing text...');
      setProgressPercent(50);

      const ret = await worker.recognize(file);
      const text = ret.data.text.trim();

      setProgressPercent(100);
      setProgressStatus('Text extraction complete!');

      await worker.terminate();

      if (!text) {
        setErrorMessage('No readable text could be detected in this image. Try an image with clearer typography.');
      } else {
        onTextExtracted(text);
      }
    } catch (err: any) {
      console.error('OCR error:', err);
      setErrorMessage(err?.message || 'Failed to extract text from image. Please enter text manually.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImage(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImage(e.target.files[0]);
    }
  };

  const handleClear = () => {
    setImagePreview(null);
    setProgressStatus('');
    setProgressPercent(0);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {!imagePreview ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all ${
            dragOver
              ? 'border-indigo-400 bg-indigo-950/30'
              : 'border-slate-700/80 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-900/60'
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-105 transition-transform">
            <UploadCloud className="h-6 w-6" />
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-200">
            Upload or Drag & Drop Screenshot / Image
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Supports tweets, news clippings, headlines (PNG, JPG, WebP)
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-slate-800/80 px-2.5 py-1 text-[11px] text-slate-300">
            <ImageIcon className="h-3 w-3 text-indigo-400" />
            <span>Automatic In-Browser OCR Extraction</span>
          </div>
        </div>
      ) : (
        <div className="relative rounded-xl border border-slate-700 bg-slate-900/70 p-4">
          <div className="flex items-start gap-4">
            {/* Thumbnail */}
            <div className="relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-slate-700 bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Uploaded preview"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Status Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200">
                  {isProcessing ? 'Extracting Text via OCR...' : 'Image Processed'}
                </span>
                <button
                  onClick={handleClear}
                  className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                  title="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {isProcessing && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="h-3 w-3 animate-spin text-indigo-400" />
                      {progressStatus}
                    </span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {!isProcessing && !errorMessage && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Text extracted and populated below!</span>
                </div>
              )}

              {errorMessage && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
