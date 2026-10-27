import { AnalysisResult } from './types';

interface PresetCase {
  keywords: string[];
  result: AnalysisResult;
}

const PRESET_CASES: PresetCase[] = [
  {
    keywords: ['pope', 'puffer', 'jacket', 'balenciaga', 'white coat'],
    result: {
      verdict: 'LIKELY_FAKE',
      confidenceScore: 98,
      headline: 'Viral Image of Pope Francis in Stylish White Puffer Jacket is an AI Generation',
      summary: 'The widely circulated viral image showing Pope Francis strolling in a fashionable oversized white puffer jacket is not real. It was generated in March 2023 using Midjourney v5 by a construction worker in Chicago and posted to Reddit before spreading globally across Twitter and TikTok as real news.',
      keyTakeaways: [
        'Image was synthesized using Midjourney AI generator in late March 2023.',
        'High-resolution forensic analysis reveals AI rendering artifacts on the Pope’s right hand and glasses shadow.',
        'Vatican press office confirmed no such apparel or public appearance took place.',
      ],
      redFlags: [
        'Uncanny rendering of fingers and crucifix chain geometry.',
        'Absence of any official Vatican photo credits or wire service corroboration (Reuters, AP, AFP).',
        'Originated on r/midjourney on Reddit before cross-platform viral distribution.',
      ],
      metrics: [
        { name: 'Source Transparency', score: 12, status: 'danger', explanation: 'No credible wire service or primary photographer identified.' },
        { name: 'Logical Coherence', score: 45, status: 'warning', explanation: 'High-fashion luxury coat contradicts papal dress norms and liturgical protocol.' },
        { name: 'Emotional Neutrality', score: 85, status: 'good', explanation: 'Humorous/aesthetic viral piece rather than malicious propaganda.' },
        { name: 'Factual Verification', score: 98, status: 'good', explanation: 'Universally debunked by Snopes, Reuters, and AP News.' },
      ],
      factCheckMatches: [
        {
          claim: 'Photo shows Pope Francis wearing a stylish white puffer jacket.',
          claimant: 'Social media users',
          publisher: 'Reuters Fact Check',
          rating: 'False - AI Generated Image',
          url: 'https://www.reuters.com/article/factcheck-pope-jacket-idUSL1N3600Q7/',
          date: '2023-03-27',
        },
        {
          claim: 'Pope Francis was photographed wearing an oversized designer puffer coat.',
          claimant: 'Viral Twitter Accounts',
          publisher: 'Snopes',
          rating: 'Fake',
          url: 'https://www.snopes.com/fact-check/pope-francis-puffer-jacket-ai/',
          date: '2023-03-26',
        },
      ],
      trustedSources: [
        { title: 'Reuters Fact Check', url: 'https://www.reuters.com/fact-check/', snippet: 'Reuters investigation confirming Midjourney origin.' },
        { title: 'Snopes Investigation', url: 'https://www.snopes.com', snippet: 'Detailed breakdown of Midjourney v5 visual inconsistencies.' },
      ],
      linguisticSignals: {
        sensationalismScore: 72,
        emotionalTone: 'Astonishment / Novelty',
        clickbaitLevel: 'Moderate',
      },
      engineUsed: 'Heuristic Intelligence Engine (Demo Mode)',
      isMock: true,
    },
  },
  {
    keywords: ['nasa', 'alien', 'megastructure', 'alpha centauri', 'extraterrestrial'],
    result: {
      verdict: 'LIKELY_FAKE',
      confidenceScore: 94,
      headline: 'No Credible Evidence of Alien Megastructures Discovered by NASA at Alpha Centauri',
      summary: 'Sensational claims that NASA or the James Webb Space Telescope detected an extraterrestrial Dyson sphere or artificial megastructure orbiting Alpha Centauri are baseless. While astronomers continue searching for biosignatures and exoplanetary atmospheres, no artificial technological artifacts have ever been verified.',
      keyTakeaways: [
        'NASA has published no press release or peer-reviewed findings supporting this discovery.',
        'Sensational YouTube and tabloid blogs frequently misrepresent routine stellar luminosity variations.',
        'The Breakthrough Watch and SETI initiatives have observed no non-natural technosignatures from the system.',
      ],
      redFlags: [
        'Clickbait buzzwords ("NASA SHOCKED", "GOVERNMENT COVERUP EXPOSED").',
        'Lacks citation to arXiv, Nature, Science, or official NASA.gov portal.',
        'Misinterprets standard stellar flux anomalies as deliberate construction.',
      ],
      metrics: [
        { name: 'Source Transparency', score: 10, status: 'danger', explanation: 'Zero peer-reviewed scientific citations provided.' },
        { name: 'Logical Coherence', score: 35, status: 'danger', explanation: 'Violates scientific consensus on observational astronomical limits.' },
        { name: 'Emotional Neutrality', score: 20, status: 'danger', explanation: 'Relies heavily on sensationalism and conspiracy tropes.' },
        { name: 'Factual Verification', score: 95, status: 'good', explanation: 'Conclusively unverified and contradictory to official space agencies.' },
      ],
      factCheckMatches: [
        {
          claim: 'NASA confirmed discovery of alien megastructure near Alpha Centauri.',
          claimant: 'Viral blogs & YouTube channels',
          publisher: 'Science Fact Check / AFP',
          rating: 'False / Unsubstantiated',
          url: 'https://factcheck.afp.com',
          date: '2024-01-12',
        },
      ],
      trustedSources: [
        { title: 'NASA Official News & Discoveries', url: 'https://www.nasa.gov/news/', snippet: 'Direct repository of all verified astronomical announcements.' },
        { title: 'SETI Institute Research', url: 'https://www.seti.org', snippet: 'Scientific research dedicated to technosignature verification.' },
      ],
      linguisticSignals: {
        sensationalismScore: 88,
        emotionalTone: 'Alarmist / Sensational',
        clickbaitLevel: 'High',
      },
      engineUsed: 'Heuristic Intelligence Engine (Demo Mode)',
      isMock: true,
    },
  },
  {
    keywords: ['coffee', 'heart', 'health', 'cardiovascular', 'longevity', 'reduce risk'],
    result: {
      verdict: 'LIKely_TRUE' as any,
      confidenceScore: 86,
      headline: 'Multiple Clinical Studies Link Moderate Coffee Consumption to Reduced Heart Risk',
      summary: 'Observational cohorts and meta-analyses published in reputable medical journals (including the European Heart Journal and Annals of Internal Medicine) show that drinking 2 to 3 cups of unsweetened coffee per day is correlated with a lower risk of cardiovascular disease and all-cause mortality in healthy adults.',
      keyTakeaways: [
        'Major studies across hundreds of thousands of participants show a mild protective association.',
        'Benefits appear strongest with moderate consumption (2–4 cups daily), ground or instant.',
        'Excess caffeine, added sugars, or underlying cardiac arrhythmias warrant individual medical guidance.',
      ],
      redFlags: [
        'Oversimplifying correlation as unconditional causation in pop-science headlines.',
        'Failing to specify that adding heavy syrups or sugars negates cardiometabolic benefits.',
      ],
      metrics: [
        { name: 'Source Transparency', score: 88, status: 'good', explanation: 'Backed by major peer-reviewed cohorts in prominent journals.' },
        { name: 'Logical Coherence', score: 90, status: 'good', explanation: 'Biochemically plausible via polyphenol antioxidant pathways.' },
        { name: 'Emotional Neutrality', score: 82, status: 'good', explanation: 'Measured scientific language without alarmism.' },
        { name: 'Factual Verification', score: 86, status: 'good', explanation: 'Consistent findings replicated across European and US cohorts.' },
      ],
      factCheckMatches: [
        {
          claim: 'Drinking coffee daily reduces the risk of heart disease and promotes longevity.',
          claimant: 'Health News Outlets',
          publisher: 'American Heart Association / Healthline Fact Check',
          rating: 'Mostly True / Supported by Evidence',
          url: 'https://www.heart.org',
          date: '2023-11-15',
        },
      ],
      trustedSources: [
        { title: 'European Society of Cardiology (ESC)', url: 'https://www.escardio.org', snippet: 'Study: Regular coffee consumption associated with lower mortality.' },
        { title: 'Harvard T.H. Chan School of Public Health', url: 'https://www.hsph.harvard.edu/nutritionsource/food-features/coffee/', snippet: 'Comprehensive scientific review on coffee and health outcomes.' },
      ],
      linguisticSignals: {
        sensationalismScore: 24,
        emotionalTone: 'Informative / Scientific',
        clickbaitLevel: 'Low',
      },
      engineUsed: 'Heuristic Intelligence Engine (Demo Mode)',
      isMock: true,
    },
  },
];

/**
 * Intelligent rule-based heuristic analyzer for any arbitrary claim
 * when API keys are not supplied or rate-limited.
 */
export function generateHeuristicAnalysis(text: string): AnalysisResult {
  const lower = text.toLowerCase();

  // 1. Check if matches any rich preset scenarios
  for (const preset of PRESET_CASES) {
    const matchCount = preset.keywords.filter((kw) => lower.includes(kw)).length;
    if (matchCount >= 2) {
      return {
        ...preset.result,
        headline: preset.result.headline,
      };
    }
  }

  // 2. Compute linguistic heuristic signals
  const words = text.split(/\s+/);
  const uppercaseWords = words.filter((w) => w.length > 2 && w === w.toUpperCase() && /[A-Z]/.test(w));
  const exclamationCount = (text.match(/!/g) || []).length;
  const questionCount = (text.match(/\?/g) || []).length;

  const sensationalKeywords = [
    'shocking', 'unbelievable', 'secret', 'miracle', 'cure', 'they dont want you to know',
    'illuminati', 'deep state', 'banned', 'conspiracy', 'magic', '100% proof',
    'mind-blowing', 'exposed', 'censored', 'wake up', 'breaking news',
  ];
  const detectedSensational = sensationalKeywords.filter((kw) => lower.includes(kw));

  const credibleKeywords = [
    'according to', 'study published in', 'spokesperson', 'university',
    'peer-reviewed', 'official statement', 'data shows', 'reuters', 'associated press',
  ];
  const detectedCredible = credibleKeywords.filter((kw) => lower.includes(kw));

  // Heuristic scoring
  let sensationalism = Math.min(
    100,
    detectedSensational.length * 25 + uppercaseWords.length * 8 + exclamationCount * 12
  );
  let isLikelyFake = sensationalism > 50 || detectedSensational.length >= 2;
  let isMisleading = !isLikelyFake && (exclamationCount > 1 || uppercaseWords.length > 2 || lower.includes('claim'));
  let isTrue = detectedCredible.length >= 2 && sensationalism < 25;

  let verdict: AnalysisResult['verdict'] = 'UNVERIFIED';
  let confidence = 70;
  let headline = 'Claim Requires Further Corroboration';
  let summary = 'The submitted text presents assertions that cannot be immediately confirmed by historical databases without active API verification. Linguistic markers suggest caution before resharing.';

  if (isLikelyFake) {
    verdict = 'LIKELY_FAKE';
    confidence = Math.min(92, 65 + detectedSensational.length * 10);
    headline = 'High Probability of Misinformation or Sensationalized Fabrication';
    summary = 'This statement exhibits prominent hallmarks of misinformation, including emotionally manipulative phrasing, heavy hyperbole, and an absence of verifiable institutional citations.';
  } else if (isTrue) {
    verdict = 'LIKELY_TRUE';
    confidence = 82;
    headline = 'Text Contains Credible Sourcing and Objective Linguistic Indicators';
    summary = 'The text uses neutral tone, references corroborating attribution markers, and avoids excessive emotional appeals or deceptive formatting.';
  } else if (isMisleading) {
    verdict = 'MISLEADING';
    confidence = 74;
    headline = 'Text Contains Potentially Distorted or Context-Dependent Claims';
    summary = 'Portions of this claim may be based on real events or partial data, but the framing appears selective, exaggerated, or stripped of critical qualifying context.';
  }

  const redFlags: string[] = [];
  if (detectedSensational.length > 0) {
    redFlags.push(`Sensationalist vocabulary detected: "${detectedSensational.join('", "')}"`);
  }
  if (uppercaseWords.length > 2) {
    redFlags.push(`Aggressive capitalization pattern detected (${uppercaseWords.length} full-uppercase words)`);
  }
  if (exclamationCount >= 2) {
    redFlags.push(`Excessive exclamation punctuation (${exclamationCount} instances) designed to trigger urgency`);
  }
  if (detectedCredible.length === 0) {
    redFlags.push('Absence of primary source attribution, dateline, or named experts');
  }

  return {
    verdict,
    confidenceScore: confidence,
    headline,
    summary,
    keyTakeaways: [
      `Overall credibility assessed as ${verdict.replace('_', ' ')}.`,
      detectedCredible.length > 0
        ? 'Identified potential references to observational or scientific phrasing.'
        : 'Lacks verifiable primary source quotes or official agency references.',
      'Connect your Gemini API Key in Settings to unlock deep real-time web-scale reasoning.',
    ],
    redFlags: redFlags.length > 0 ? redFlags : ['No overt manipulative syntax detected, but independent validation is recommended.'],
    metrics: [
      {
        name: 'Source Transparency',
        score: detectedCredible.length > 0 ? 75 : 25,
        status: detectedCredible.length > 0 ? 'good' : 'warning',
        explanation: detectedCredible.length > 0 ? 'Mentions verifiable attribution signals.' : 'No named institutions, journals, or primary sources identified.',
      },
      {
        name: 'Sensationalism Index',
        score: Math.max(10, 100 - sensationalism),
        status: sensationalism > 50 ? 'danger' : sensationalism > 25 ? 'warning' : 'good',
        explanation: sensationalism > 50 ? 'Heavy clickbait / sensational phrasing.' : 'Standard journalistic or informational tone.',
      },
      {
        name: 'Attribution Quality',
        score: detectedCredible.length > 0 ? 80 : 30,
        status: detectedCredible.length > 0 ? 'good' : 'warning',
        explanation: 'Evaluates whether specific authors, dates, and institutions are cited.',
      },
      {
        name: 'Factual Coherence',
        score: isLikelyFake ? 30 : isTrue ? 85 : 60,
        status: isLikelyFake ? 'danger' : isTrue ? 'good' : 'warning',
        explanation: 'Internal semantic consistency and absence of known disinformation tropes.',
      },
    ],
    factCheckMatches: [],
    trustedSources: [
      { title: 'Google Fact Check Explorer', url: 'https://toolbox.google.com/factcheck/explorer', snippet: 'Search verified database of international fact-checkers.' },
      { title: 'Snopes Fact Checking', url: 'https://www.snopes.com', snippet: 'Oldest and largest online fact-checking site.' },
      { title: 'Reuters Fact Check Archive', url: 'https://www.reuters.com/fact-check/', snippet: 'Global wire service reporting and debunking.' },
    ],
    linguisticSignals: {
      sensationalismScore: sensationalism,
      emotionalTone: sensationalism > 50 ? 'Alarmist / Sensational' : sensationalism > 25 ? 'Emotional' : 'Neutral / Informational',
      clickbaitLevel: sensationalism > 60 ? 'High' : sensationalism > 30 ? 'Moderate' : 'Low',
    },
    engineUsed: 'Heuristic Intelligence Engine (Demo Mode)',
    isMock: true,
  };
}
