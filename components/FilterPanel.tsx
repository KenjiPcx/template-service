'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Package, 
  Zap, 
  PlusCircle, 
  Code2, 
  Layers, 
  Filter,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { Template } from '@/lib/db';

interface FilterPanelProps {
  templates: Template[];
  onFilterChange: (filtered: Template[]) => void;
  onClearFilters: () => void;
}

export function FilterPanel({ templates, onFilterChange, onClearFilters }: FilterPanelProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedLibraries, setSelectedLibraries] = useState<string[]>([]);
  const [selectedArchitectures, setSelectedArchitectures] = useState<string[]>([]);
  const [showLibraries, setShowLibraries] = useState(false);
  const [showArchitectures, setShowArchitectures] = useState(false);

  // Extract unique tags from templates
  const allLibraryTags = Array.from(
    new Set(templates.flatMap(t => t.libraryTags || []))
  ).sort();
  
  const allArchitectureTags = Array.from(
    new Set(templates.flatMap(t => t.architectureTags || []))
  ).sort();

  // Count templates for each filter
  const typeCounts = {
    starter: templates.filter(t => t.type === 'starter').length,
    mve: templates.filter(t => t.type === 'mve').length,
    addon: templates.filter(t => t.type === 'addon').length,
  };

  const libraryCounts = Object.fromEntries(
    allLibraryTags.map(tag => [
      tag,
      templates.filter(t => t.libraryTags?.includes(tag)).length
    ])
  );

  const architectureCounts = Object.fromEntries(
    allArchitectureTags.map(tag => [
      tag,
      templates.filter(t => t.architectureTags?.includes(tag)).length
    ])
  );

  // Apply filters
  useEffect(() => {
    let filtered = [...templates];

    // Filter by type
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(t => selectedTypes.includes(t.type || 'starter'));
    }

    // Filter by library tags
    if (selectedLibraries.length > 0) {
      filtered = filtered.filter(t => 
        selectedLibraries.some(tag => t.libraryTags?.includes(tag))
      );
    }

    // Filter by architecture tags
    if (selectedArchitectures.length > 0) {
      filtered = filtered.filter(t => 
        selectedArchitectures.some(tag => t.architectureTags?.includes(tag))
      );
    }

    onFilterChange(filtered);
  }, [selectedTypes, selectedLibraries, selectedArchitectures, templates]);

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleLibraryToggle = (tag: string) => {
    setSelectedLibraries(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleArchitectureToggle = (tag: string) => {
    setSelectedArchitectures(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSelectedLibraries([]);
    setSelectedArchitectures([]);
    onClearFilters();
  };

  const hasActiveFilters = selectedTypes.length > 0 || selectedLibraries.length > 0 || selectedArchitectures.length > 0;

  return (
    <Card className="p-6 bg-[hsl(var(--card)/0.5)] backdrop-blur-sm border-[hsl(var(--border)/0.5)]">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Filter className="h-5 w-5 text-[hsl(var(--primary)/0.7)]" />
            Filters
          </h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs hover:bg-[hsl(var(--primary)/0.1)]"
            >
              <X className="h-3 w-3 mr-1" />
              Clear all
            </Button>
          )}
        </div>

        {/* Active filters summary */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pb-3 border-b border-[hsl(var(--border)/0.5)]">
            {selectedTypes.map(type => (
              <Badge 
                key={type}
                variant="secondary"
                className="text-xs cursor-pointer hover:bg-[hsl(var(--destructive)/0.1)] hover:text-[hsl(var(--destructive))]"
                onClick={() => handleTypeToggle(type)}
              >
                {type} <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
            {selectedLibraries.map(tag => (
              <Badge 
                key={tag}
                variant="secondary"
                className="text-xs cursor-pointer hover:bg-[hsl(var(--destructive)/0.1)] hover:text-[hsl(var(--destructive))]"
                onClick={() => handleLibraryToggle(tag)}
              >
                {tag} <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
            {selectedArchitectures.map(tag => (
              <Badge 
                key={tag}
                variant="secondary"
                className="text-xs cursor-pointer hover:bg-[hsl(var(--destructive)/0.1)] hover:text-[hsl(var(--destructive))]"
                onClick={() => handleArchitectureToggle(tag)}
              >
                {tag} <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
        )}

        {/* Template Type Filter */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-[hsl(var(--foreground)/0.8)]">Template Type</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer hover:bg-[hsl(var(--primary)/0.05)] p-2 rounded-lg transition-colors">
              <Checkbox
                checked={selectedTypes.includes('starter')}
                onCheckedChange={() => handleTypeToggle('starter')}
                className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
              />
              <Package className="h-4 w-4 text-green-600" />
              <span className="text-sm flex-1">Starter Templates</span>
              <Badge variant="outline" className="text-xs">
                {typeCounts.starter}
              </Badge>
            </label>

            <label className="flex items-center gap-3 cursor-pointer hover:bg-[hsl(var(--primary)/0.05)] p-2 rounded-lg transition-colors">
              <Checkbox
                checked={selectedTypes.includes('mve')}
                onCheckedChange={() => handleTypeToggle('mve')}
                className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
              />
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-sm flex-1">MVE Examples</span>
              <Badge variant="outline" className="text-xs">
                {typeCounts.mve}
              </Badge>
            </label>

            <label className="flex items-center gap-3 cursor-pointer hover:bg-[hsl(var(--primary)/0.05)] p-2 rounded-lg transition-colors">
              <Checkbox
                checked={selectedTypes.includes('addon')}
                onCheckedChange={() => handleTypeToggle('addon')}
                className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
              />
              <PlusCircle className="h-4 w-4 text-purple-600" />
              <span className="text-sm flex-1">Add-on Features</span>
              <Badge variant="outline" className="text-xs">
                {typeCounts.addon}
              </Badge>
            </label>
          </div>
        </div>

        {/* Library Tags Filter */}
        <div className="space-y-3">
          <button
            onClick={() => setShowLibraries(!showLibraries)}
            className="w-full flex items-center justify-between text-sm font-medium text-[hsl(var(--foreground)/0.8)] hover:text-[hsl(var(--foreground))] transition-colors"
          >
            <span className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-blue-500/70" />
              Library Tags
              {selectedLibraries.length > 0 && (
                <Badge variant="secondary" className="text-xs ml-1">
                  {selectedLibraries.length}
                </Badge>
              )}
            </span>
            {showLibraries ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {showLibraries && (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {allLibraryTags.map(tag => (
                <label 
                  key={tag}
                  className="flex items-center gap-3 cursor-pointer hover:bg-[hsl(var(--primary)/0.05)] p-2 rounded-lg transition-colors"
                >
                  <Checkbox
                    checked={selectedLibraries.includes(tag)}
                    onCheckedChange={() => handleLibraryToggle(tag)}
                  />
                  <span className="text-sm flex-1">{tag}</span>
                  <Badge variant="outline" className="text-xs">
                    {libraryCounts[tag]}
                  </Badge>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Architecture Tags Filter */}
        <div className="space-y-3">
          <button
            onClick={() => setShowArchitectures(!showArchitectures)}
            className="w-full flex items-center justify-between text-sm font-medium text-[hsl(var(--foreground)/0.8)] hover:text-[hsl(var(--foreground))] transition-colors"
          >
            <span className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-purple-500/70" />
              Architecture Tags
              {selectedArchitectures.length > 0 && (
                <Badge variant="secondary" className="text-xs ml-1">
                  {selectedArchitectures.length}
                </Badge>
              )}
            </span>
            {showArchitectures ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {showArchitectures && (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {allArchitectureTags.map(tag => (
                <label 
                  key={tag}
                  className="flex items-center gap-3 cursor-pointer hover:bg-[hsl(var(--primary)/0.05)] p-2 rounded-lg transition-colors"
                >
                  <Checkbox
                    checked={selectedArchitectures.includes(tag)}
                    onCheckedChange={() => handleArchitectureToggle(tag)}
                  />
                  <span className="text-sm flex-1">{tag}</span>
                  <Badge variant="outline" className="text-xs">
                    {architectureCounts[tag]}
                  </Badge>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}