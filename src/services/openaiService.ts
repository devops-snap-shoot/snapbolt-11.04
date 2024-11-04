import OpenAI from 'openai';
import { SearchResult } from './types';
import { RETRY_OPTIONS } from './config';
import { withRetry } from './utils';

// Debugging: Log the API key to ensure it is being loaded correctly
console.log("Environment Variable - VITE_OPENAI_API_KEY:", import.meta.env.VITE_OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generateAnswer(
  query: string,
  searchResults: SearchResult[]
): Promise<string> {
  const context = searchResults
    .map((result) => `Title: ${result.title}\nContent: ${result.content}`)
    .join('\n\n');

  const prompt = `Based on the following search results, provide a comprehensive answer to the question: "${query}"\n\nSearch Results:\n${context}\n\nAnswer:`;

  const completion = await withRetry(
    async () => {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that provides accurate, concise answers based on search results. Always maintain a neutral tone and cite information from the provided sources.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });
      return response.choices[0].message.content || 'No answer generated';
    },
    RETRY_OPTIONS
  );

  return completion;
}