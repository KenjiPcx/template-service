'use client';

import { useState, useEffect } from 'react';
import { TemplateCard } from '@/components/TemplateCard';
import { AddTemplateForm } from '@/components/AddTemplateForm';
import { SearchBar } from '@/components/SearchBar';
import { FilterPanel } from '@/components/FilterPanel';
import { ThemeToggle } from '@/components/theme-toggle';
import { Template } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { Layers3 } from 'lucide-react';

export default function Home() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [displayedTemplates, setDisplayedTemplates] = useState<(Template & { 
    similarity?: number;
    matchType?: 'vector' | 'fulltext' | 'both';
  })[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<(Template & { 
    similarity?: number;
    matchType?: 'vector' | 'fulltext' | 'both';
  })[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setTemplates(data);
      setDisplayedTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleSearch = (results: (Template & { 
    similarity?: number;
    matchType?: 'vector' | 'fulltext' | 'both';
  })[]) => {
    setDisplayedTemplates(results);
    setFilteredTemplates(results);
    setIsSearching(true);
    setIsFiltering(false);
  };

  const handleClearSearch = () => {
    setDisplayedTemplates(templates);
    setFilteredTemplates(templates);
    setIsSearching(false);
    setIsFiltering(false);
  };

  const handleFilterChange = (filtered: Template[]) => {
    setFilteredTemplates(filtered as any);
    setIsFiltering(true);
  };

  const handleClearFilters = () => {
    setFilteredTemplates(isSearching ? displayedTemplates : templates);
    setIsFiltering(false);
  };

  const handleTemplateAdded = () => {
    fetchTemplates();
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradient mesh */}
      <div className="fixed inset-0 gradient-mesh opacity-50" />
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Theme Toggle */}
        <div className="fixed top-6 right-6 z-50">
          <ThemeToggle />
        </div>

        {/* Header */}
        <header className="py-20 text-center">
          <div className="flex justify-center mb-10">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[hsl(var(--primary)/0.5)] to-[hsl(var(--primary)/0.3)] rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative glass p-5 rounded-2xl">
                <Layers3 className="w-14 h-14 text-[hsl(var(--primary))]" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-[hsl(var(--foreground))] to-[hsl(var(--foreground)/0.7)] bg-clip-text text-transparent">
            Template{' '}
            <span className="bg-gradient-to-r from-[hsl(var(--primary))] to-blue-400 bg-clip-text text-transparent">Library</span>
          </h1>
          <p className="text-lg sm:text-xl text-[hsl(var(--muted-foreground))] max-w-3xl mx-auto leading-relaxed">
            Discover and search through curated code templates using AI-powered semantic search.
            Find the perfect starting point for your next project.
          </p>
        </header>

        {/* Search Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="glass p-2 rounded-2xl shadow-xl">
            <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
          </div>
        </div>

        {/* Results Info */}
        {(isSearching || isFiltering) && (
          <div className="flex justify-center mb-10">
            <div className="glass px-5 py-2.5 rounded-full inline-flex items-center gap-3">
              <div className="w-2 h-2 bg-[hsl(var(--primary))] rounded-full animate-pulse" />
              <span className="text-sm font-medium">
                {filteredTemplates.length} {filteredTemplates.length === 1 ? 'result' : 'results'} found
                {isFiltering && !isSearching && ` (filtered from ${templates.length})`}
              </span>
              {displayedTemplates.length > 0 && displayedTemplates[0].similarity && (
                <>
                  <div className="w-px h-4 bg-[hsl(var(--border))]" />
                  <span className="text-sm text-[hsl(var(--muted-foreground))]">
                    Sorted by relevance
                  </span>
                  {(() => {
                    const avgSimilarity = filteredTemplates
                      .filter(t => t.similarity)
                      .reduce((acc, t) => acc + (t.similarity || 0), 0) / filteredTemplates.filter(t => t.similarity).length;
                    return avgSimilarity > 0 ? (
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          avgSimilarity >= 80 
                            ? 'border-emerald-500/50 text-emerald-600' 
                            : avgSimilarity >= 70 
                            ? 'border-amber-500/50 text-amber-600'
                            : 'border-gray-500/50 text-gray-600'
                        }`}
                      >
                        {avgSimilarity.toFixed(0)}% avg match
                      </Badge>
                    ) : null;
                  })()}
                </>
              )}
            </div>
          </div>
        )}

        {/* Content with Filter Sidebar */}
        <main className="pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filter Panel - Desktop Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <FilterPanel 
                  templates={isSearching ? displayedTemplates : templates} 
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />
              </div>
            </div>

            {/* Templates Grid */}
            <div className="lg:col-span-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-[hsl(var(--primary)/0.2)] rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-[hsl(var(--primary))] rounded-full animate-spin border-t-transparent"></div>
              </div>
              <p className="mt-8 text-[hsl(var(--muted-foreground))] font-medium">Loading templates...</p>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-24">
              <div className="inline-flex items-center justify-center w-24 h-24 glass rounded-3xl mb-8">
                <Layers3 className="w-12 h-12 text-[hsl(var(--primary)/0.6)]" />
              </div>
              <h2 className="text-3xl font-semibold mb-4">
                {isSearching ? 'No matches found' : isFiltering ? 'No templates match filters' : 'No templates yet'}
              </h2>
              <p className="text-[hsl(var(--muted-foreground))] max-w-md mx-auto text-lg">
                {isSearching 
                  ? 'Try adjusting your search terms or browse all templates' 
                  : isFiltering
                  ? 'Try adjusting your filters or clear them to see all templates'
                  : 'Be the first to add a template to the library. Click the button below to get started.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          )}
            </div>
          </div>
        </main>

        {/* Add Template Button */}
        <AddTemplateForm onTemplateAdded={handleTemplateAdded} />
      </div>
    </div>
  );
}