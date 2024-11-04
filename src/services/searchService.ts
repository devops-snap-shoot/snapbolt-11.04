import { SearchResponse } from '../types';
import { searchAcrossInstances } from './searxService';
import { generateAnswer } from './openaiService';

export async function performSearch(query: string): Promise<SearchResponse> {
  try {
    const searchResults = await searchAcrossInstances(query);

    if (searchResults.length === 0) {
      throw new Error('No search results found');
    }

    const answer = await generateAnswer(query, searchResults);

    return {
      answer: String(answer),
      sources: searchResults.map((result) => ({
        title: result.title,
        url: result.url,
        snippet: result.content,
      })),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Search error:', errorMessage);
    throw new Error(
      errorMessage.includes('All search methods failed')
        ? 'Search services are currently unavailable. Please try again later.'
        : 'Failed to perform search. Please try again.'
    );
  }
}