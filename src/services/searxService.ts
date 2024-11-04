import axios from 'axios';
import { SearchResult } from './types';
import { SEARX_INSTANCES, RETRY_OPTIONS, API_TIMEOUT, MAX_RESULTS } from './config';
import { withRetry } from './utils';
import { getFallbackResults } from './fallbackService';

const axiosInstance = axios.create({
  timeout: API_TIMEOUT,
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'Snap Search Bot/1.0',
  },
});

async function querySingleInstance(
  query: string,
  instance: string
): Promise<SearchResult[]> {
  const response = await axiosInstance.get(`${instance}/search`, {
    params: {
      q: query,
      format: 'json',
      language: 'en',
      categories: 'general',
      time_range: 'year',
    },
  });

  return (response.data.results || []).map((result: any) => ({
    title: String(result.title || ''),
    url: String(result.url || ''),
    content: String(result.content || result.snippet || ''),
  }));
}

export async function searchAcrossInstances(query: string): Promise<SearchResult[]> {
  let results: SearchResult[] = [];
  let errors: string[] = [];

  // Try SearxNG instances first
  for (const instance of SEARX_INSTANCES) {
    try {
      results = await withRetry(
        () => querySingleInstance(query, instance),
        RETRY_OPTIONS
      );
      
      if (results.length > 0) {
        return results.slice(0, MAX_RESULTS);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`${instance}: ${errorMessage}`);
      continue;
    }
  }

  // If all SearxNG instances fail, try fallback services
  try {
    results = await getFallbackResults(query);
    if (results.length > 0) {
      return results.slice(0, MAX_RESULTS);
    }
  } catch (fallbackError) {
    errors.push(`Fallback services: ${fallbackError instanceof Error ? fallbackError.message : 'Unknown error'}`);
  }

  throw new Error(`All search methods failed:\n${errors.join('\n')}`);
}