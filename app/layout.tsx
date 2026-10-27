import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TruthLens AI - Real-Time AI News & Claim Fact-Checker',
  description: 'Analyze news claims, articles, and screenshots for factual credibility in real time using Google Fact Check Tools and Google Gemini AI.',
  keywords: ['fake news detector', 'fact check', 'AI news guard', 'Gemini AI', 'OCR screenshot analysis'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#070b14] text-slate-100 selection:bg-indigo-500 selection:text-white antialiased">
        {children}
      </body>
    </html>
  );
}
