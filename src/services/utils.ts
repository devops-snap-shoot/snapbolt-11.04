import { RetryOptions } from './types';

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < options.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < options.maxRetries - 1) {
        await delay(options.delayMs * Math.pow(2, attempt));
      }
    }
  }
  
  throw lastError || new Error('Operation failed after retries');
}