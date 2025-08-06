'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Search, X, Loader2, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Template } from '@/lib/db';

interface SearchBarProps {
  onSearch: (results: (Template & { similarity?: number })[]) => void;
  onClear: () => void;
}

export function SearchBar({ onSearch, onClear }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [threshold, setThreshold] = useState(65);
  const [showSettings, setShowSettings] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      onClear();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/templates/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query,
          minSimilarity: threshold / 100 
        }),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const results = await response.json();
      onSearch(results);
    } catch (error) {
      console.error('Error searching:', error);
      alert('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setQuery('');
    onClear();
  };

  return (
    <div className="w-full space-y-2">
      <div className="relative flex gap-3 p-1">
        <div className="relative flex-1 group">
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--primary)/0.2)] via-[hsl(var(--primary)/0.1)] to-transparent rounded-xl opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-500" />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[hsl(var(--muted-foreground))] group-focus-within:text-[hsl(var(--primary))] transition-colors duration-300" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search templates using natural language..."
            className="relative pl-12 pr-12 h-12 text-base bg-[hsl(var(--background)/0.8)] backdrop-blur-sm border-[hsl(var(--border)/0.5)] rounded-xl focus:border-[hsl(var(--primary)/0.5)] focus:bg-[hsl(var(--background))] transition-all duration-300"
            disabled={loading}
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <Button 
          onClick={handleSearch} 
          disabled={loading || !query.trim()}
          size="lg"
          className="h-12 px-6 rounded-xl bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Sparkles className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              Search
            </>
          )}
        </Button>
      </div>
      
      {/* Settings Toggle */}
      <div className="flex items-center justify-between">
        {query && (
          <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
            <Sparkles className="h-3 w-3" />
            <span>AI semantic search + keyword matching • Min relevance: {threshold}%</span>
          </div>
        )}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="ml-auto flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Settings</span>
        </button>
      </div>
      
      {/* Threshold Slider */}
      {showSettings && (
        <div className="glass p-4 rounded-xl space-y-3 animate-slide-down">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[hsl(var(--primary)/0.7)]" />
              AI Match Threshold
            </label>
            <span className="text-sm font-semibold text-[hsl(var(--primary))]">
              {threshold}%
            </span>
          </div>
          <Slider
            value={[threshold]}
            onValueChange={(value) => setThreshold(value[0])}
            min={0}
            max={100}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-[hsl(var(--muted-foreground))]">
            <span>0% (Show all)</span>
            <span>50% (Balanced)</span>
            <span>100% (Exact only)</span>
          </div>
          <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
            Lower values show more results including partial matches. Higher values show only the most relevant results.
            Keyword matches are always included regardless of threshold.
          </p>
        </div>
      )}
    </div>
  );
}