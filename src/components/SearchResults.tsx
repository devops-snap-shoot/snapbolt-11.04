import React, { useEffect, useState } from 'react';
import { ArrowLeft, ExternalLink, ThumbsUp, ThumbsDown, Share2, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { performSearch } from '../services/searchService';
import type { SearchState } from '../types';
import AdBanner from './AdBanner';

export default function SearchResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';
  
  const [searchState, setSearchState] = useState<SearchState>({
    isLoading: true,
    error: null,
    data: null
  });

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await performSearch(query);
        setSearchState({
          isLoading: false,
          error: null,
          data: response
        });
      } catch (error) {
        setSearchState({
          isLoading: false,
          error: 'Failed to fetch results. Please try again.',
          data: null
        });
      }
    };

    fetchResults();
  }, [query]);

  return (
    <main className="flex-1 min-h-screen bg-gradient-to-b from-[#111111] to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Query Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/')}
            className="text-[#0095FF] hover:text-[#0080FF] transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-white text-xl font-medium">{query}</h2>
        </div>

        <div className="flex gap-6">
          {/* Main Content Column */}
          <div className="flex-1">
            {/* Loading State */}
            {searchState.isLoading && (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="animate-spin text-[#0095FF]" size={32} />
              </div>
            )}

            {/* Error State */}
            {searchState.error && (
              <div className="bg-red-500/10 text-red-500 p-4 rounded-xl border border-red-500/20">
                {searchState.error}
              </div>
            )}

            {/* Results */}
            {searchState.data && (
              <div className="bg-[#111111] rounded-xl p-6 mb-6 border border-gray-800">
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {searchState.data.answer}
                  </p>
                </div>

                {/* Sources */}
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <h4 className="text-white text-sm font-medium mb-3">Sources</h4>
                  <div className="flex flex-col gap-3">
                    {searchState.data.sources.map((source, index) => (
                      <a 
                        key={index}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block bg-[#222222] p-4 rounded-lg hover:bg-[#333333] transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-sm font-medium text-white group-hover:text-[#0095FF] transition-colors">
                            {source.title}
                          </h5>
                          <ExternalLink size={14} className="text-gray-400 group-hover:text-[#0095FF]" />
                        </div>
                        <p className="text-sm text-gray-400">{source.snippet}</p>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Feedback Section */}
            {searchState.data && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="text-gray-400 hover:text-[#0095FF] p-2 rounded-lg transition-colors">
                    <ThumbsUp size={20} />
                  </button>
                  <button className="text-gray-400 hover:text-[#0095FF] p-2 rounded-lg transition-colors">
                    <ThumbsDown size={20} />
                  </button>
                </div>
                <button className="text-gray-400 hover:text-[#0095FF] p-2 rounded-lg transition-colors">
                  <Share2 size={20} />
                </button>
              </div>
            )}
          </div>

          {/* AdSense Column */}
          <div className="w-80 shrink-0">
            <div className="sticky top-6">
              <AdBanner
                dataAdSlot={import.meta.env.VITE_ADSENSE_SIDEBAR_SLOT}
                style={{ minHeight: '600px' }}
                className="bg-[#111111] rounded-xl border border-gray-800 overflow-hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}