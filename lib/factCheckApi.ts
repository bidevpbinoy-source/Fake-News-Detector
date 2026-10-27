import { FactCheckClaim } from './types';

/**
 * Searches the Google Fact Check Tools API for verified claims matching the query.
 * Documentation: https://toolbox.google.com/factcheck/apis
 */
export async function searchFactCheckClaims(
  query: string,
  apiKey?: string
): Promise<FactCheckClaim[]> {
  let key = apiKey || process.env.FACT_CHECK_API_KEY;
  // If the key is an NVIDIA API key (starts with nvapi-), it is meant for LLM reasoning, not Google Fact Check API
  if (key?.startsWith('nvapi-')) {
    key = undefined;
  }
  if (!key) {
    console.log('[FactCheckApi] No valid Google Fact Check API key provided, skipping live Fact Check Tools API call.');
    return [];
  }

  // Google Fact Check API works best with concise queries (under 20 words)
  const trimmedQuery = query
    .split(/\s+/)
    .slice(0, 15)
    .join(' ')
    .replace(/[^\w\s]/gi, ' ')
    .trim();

  if (!trimmedQuery) return [];

  const url = `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${encodeURIComponent(
    trimmedQuery
  )}&languageCode=en&key=${key}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour in Next.js
    });

    if (!res.ok) {
      console.warn(`[FactCheckApi] HTTP error ${res.status}: ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    if (data && Array.isArray(data.claims)) {
      return data.claims.map((item: any) => ({
        text: item.text || '',
        claimant: item.claimant || 'Unknown',
        claimDate: item.claimDate || undefined,
        claimReview: Array.isArray(item.claimReview)
          ? item.claimReview.map((r: any) => ({
              publisher: {
                name: r.publisher?.name || 'Fact Checker',
                site: r.publisher?.site || '',
              },
              url: r.url || '#',
              title: r.title || '',
              textualRating: r.textualRating || 'Unrated',
              reviewDate: r.reviewDate || undefined,
            }))
          : [],
      }));
    }
    return [];
  } catch (error) {
    console.error('[FactCheckApi] Failed to query Fact Check Tools API:', error);
    return [];
  }
}
