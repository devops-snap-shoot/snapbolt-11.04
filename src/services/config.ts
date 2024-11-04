export const SEARX_INSTANCES = [
  'https://searx.be',
  'https://search.bus-hit.me',
  'https://search.privacytools.io',
  'https://searx.tiekoetter.com',
  'https://searx.work',
];

// Fallback API endpoints
export const FALLBACK_APIS = {
  duckduckgo: 'https://api.duckduckgo.com',
  wikipedia: 'https://en.wikipedia.org/w/api.php',
};

export const RETRY_OPTIONS = {
  maxRetries: 3,
  delayMs: 1000,
};

export const API_TIMEOUT = 10000; // 10 seconds

export const MAX_RESULTS = 5;