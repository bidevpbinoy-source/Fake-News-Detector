# TruthLens AI - Real-Time AI News & Claim Fact-Checker 🛡️

TruthLens AI is a modern, high-impact web application that evaluates news claims, excerpts, and screenshots for factual accuracy in real-time. It leverages a two-tier fact-checking architecture combined with in-browser Optical Character Recognition (OCR).

---

## 🌟 Key Features

1. **Hero & Workspace Input**:
   - Multi-line text area for news headlines, articles, or social media posts.
   - One-click sample claims (AI image hoaxes, astronomical claims, scientific studies, misleading viral declarations).
   - Word count and quick actions (Paste, Clear, Hotkey Ctrl+Enter).

2. **In-Browser OCR Dropzone (Tesseract.js)**:
   - Drag-and-drop screenshots of tweets, Instagram posts, or news clippings.
   - Text extracted directly in the browser with live percentage progress tracking.
   - Zero OCR cloud billing or backend latency.

3. **Two-Tier Credibility Engine (`/api/analyze`)**:
   - **Tier 1 (Database of Record)**: Queries the **Google Fact Check Tools API** for ClaimReview records from accredited publishers (Snopes, Reuters Fact Check, PolitiFact, AFP).
   - **Tier 2 (Contextual AI Reasoner)**: Passes claims and verified records to **Google Gemini 1.5 Flash** for forensic reasoning, logical fallacy analysis, and linguistic scoring.
   - **Tier 3 (Intelligent Heuristic Fallback)**: Built-in linguistic analyzer and preset database ensuring full functionality out-of-the-box even before API keys are added.

4. **Forensic Verdict & Results Display**:
   - Color-coded verdict badge:
     - 🟢 **Likely True / Verified**
     - 🔴 **Likely Fake / False**
     - 🟠 **Misleading / Needs Context**
     - ⚪ **Unverified / Inconclusive**
   - Confidence Score indicator (0–100%).
   - Executive fact-check summary.
   - Direct publisher citations with links to original fact-checks.
   - Multi-factor metrics (Source Transparency, Logical Coherence, Emotional Neutrality, Verification Quality).
   - Linguistic cues (Sensationalism score, Emotional tone, Clickbait propensity).
   - One-click "Copy Summary Report" to clipboard.

5. **API Key Management**:
   - Configure keys in `.env.local` or enter them in the in-app **Settings** modal (stored in localStorage).

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+ (tested on Node v24)
- npm 9+

### 2. Installation
```bash
npm install
```

### 3. Environment Variables (Optional for Live Keys)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your keys:
```env
# 1. NVIDIA NIM API Key (Default AI Engine - Llama 3.1 Nemotron 70B)
# Get a key at: https://build.nvidia.com/
NVIDIA_API_KEY=nvapi-...
NVIDIA_MODEL=nvidia/llama-3.1-nemotron-70b-instruct

# 2. Google Gemini API Key (Alternative AI Engine)
# Get a free Gemini API key: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_key_here

# 3. Google Fact Check Tools API Key (Optional database search)
# Enable 'Fact Check Tools API' in Google Cloud Console:
# https://console.cloud.google.com/apis/library/factchecktools.googleapis.com
FACT_CHECK_API_KEY=your_fact_check_api_key_here
```
*(Note: You can also insert keys directly via the app's Settings modal).*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 📁 Project Architecture

```
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts         # Two-tier API Route (Fact Check API + Gemini)
│   ├── favicon.ico
│   ├── globals.css              # Custom styling & glassmorphism
│   ├── layout.tsx               # Root layout & SEO metadata
│   └── page.tsx                 # Main application dashboard
├── components/
│   ├── Header.tsx               # Navbar with status indicator & Settings trigger
│   ├── HeroSection.tsx          # Brand hero with badges & value props
│   ├── InputSection.tsx         # Textarea, presets, mode switcher
│   ├── ImageOcrDropzone.tsx     # Client-side Tesseract.js OCR dropzone
│   ├── ResultsSection.tsx       # Verdict banner, confidence score & summary
│   ├── FactCheckMatchCard.tsx   # Google Fact Check Tools API match list
│   ├── AnalysisDetailsCard.tsx  # Forensic metrics, red flags & citations
│   └── SettingsModal.tsx        # In-browser API key manager
├── lib/
│   ├── factCheckApi.ts          # Google Fact Check Tools API client
│   ├── geminiApi.ts             # Google Gemini 1.5 Flash analyzer
│   ├── mockAnalyzer.ts          # Intelligent heuristic fallback engine
│   └── types.ts                 # TypeScript data contracts
├── .env.example
├── .env.local
├── package.json
└── tailwind.config.ts
```

---

## 🛡️ Responsible AI & Fact-Checking Disclaimer
TruthLens AI uses assistive artificial intelligence and public fact-checking databases. While highly effective at identifying viral hoaxes and linguistic deception, critical breaking news should always be corroborated across multiple independent primary sources.
