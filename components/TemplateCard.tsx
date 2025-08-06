import { Template } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Code2, Layers, Target, Package, Zap, PlusCircle } from 'lucide-react';

interface TemplateCardProps {
  template: Template & { 
    similarity?: number;
    matchType?: 'vector' | 'fulltext' | 'both';
  };
}

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Card className="h-full flex flex-col card-hover group relative overflow-hidden border-[hsl(var(--border)/0.5)] bg-[hsl(var(--card)/0.5)] backdrop-blur-sm">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary)/0.05)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {template.type === 'starter' && (
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-xs px-2 py-0.5">
                  <Package className="w-3 h-3 mr-1" />
                  Starter
                </Badge>
              )}
              {template.type === 'mve' && (
                <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-xs px-2 py-0.5">
                  <Zap className="w-3 h-3 mr-1" />
                  MVE
                </Badge>
              )}
              {template.type === 'addon' && (
                <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 text-xs px-2 py-0.5">
                  <PlusCircle className="w-3 h-3 mr-1" />
                  Add-on
                </Badge>
              )}
              {(template.similarity !== undefined || template.matchType) && (
                <>
                  {template.similarity !== undefined && template.similarity > 0 && (
                    <Badge 
                      className={`text-xs px-2 py-0.5 font-medium ${
                        template.similarity >= 90 
                          ? 'bg-gradient-to-r from-emerald-500/10 to-emerald-400/10 text-emerald-700 border-emerald-500/30' 
                          : template.similarity >= 75 
                          ? 'bg-gradient-to-r from-amber-500/10 to-amber-400/10 text-amber-700 border-amber-500/30'
                          : 'bg-gradient-to-r from-gray-500/10 to-gray-400/10 text-gray-700 border-gray-500/30'
                      }`}
                      title={`This template is ${template.similarity}% similar to your search query`}
                    >
                      <span className="font-semibold">{template.similarity}%</span> match
                    </Badge>
                  )}
                  {template.matchType === 'both' && (
                    <Badge 
                      className="text-xs px-2 py-0.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 border-purple-500/30"
                      title="Matched both AI semantic search and keyword search"
                    >
                      AI + Keyword
                    </Badge>
                  )}
                  {template.matchType === 'fulltext' && (
                    <Badge 
                      className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-700 border-blue-500/30"
                      title="Matched keyword search"
                    >
                      Keyword match
                    </Badge>
                  )}
                  {template.matchType === 'vector' && template.similarity && template.similarity < 75 && (
                    <Badge 
                      className="text-xs px-2 py-0.5 bg-gray-500/10 text-gray-600 border-gray-500/30"
                      title="AI semantic match"
                    >
                      AI match
                    </Badge>
                  )}
                </>
              )}
            </div>
            <CardTitle className="text-xl font-semibold line-clamp-1 group-hover:text-[hsl(var(--primary))] transition-colors duration-300">
              {template.title}
            </CardTitle>
          </div>
          <ExternalLink className="h-4 w-4 text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--primary))] transition-colors duration-300 flex-shrink-0" />
        </div>
        <CardDescription className="line-clamp-2 text-base leading-relaxed">
          {template.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Best Use Case */}
          {template.bestUseCase && (
            <div className="p-3 bg-gradient-to-r from-amber-500/5 to-orange-500/5 rounded-lg border border-amber-500/10">
              <div className="flex items-start gap-2">
                <Target className="h-4 w-4 text-amber-500/70 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[hsl(var(--foreground)/0.8)] leading-relaxed line-clamp-2">
                  {template.bestUseCase}
                </p>
              </div>
            </div>
          )}
          {/* Library Tags */}
          {template.libraryTags && template.libraryTags.length > 0 && (
            <div className="flex items-start gap-2.5">
              <Code2 className="h-4 w-4 text-[hsl(var(--primary)/0.6)] flex-shrink-0 mt-0.5" />
              <div className="flex flex-wrap gap-1.5">
                {template.libraryTags.slice(0, 3).map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="text-xs px-2.5 py-0.5 bg-[hsl(var(--primary)/0.1)] hover:bg-[hsl(var(--primary)/0.2)] border-0 transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
                {template.libraryTags.length > 3 && (
                  <Badge 
                    variant="outline" 
                    className="text-xs px-2.5 py-0.5 border-dashed"
                  >
                    +{template.libraryTags.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}
          
          {/* Architecture Tags */}
          {template.architectureTags && template.architectureTags.length > 0 && (
            <div className="flex items-start gap-2.5">
              <Layers className="h-4 w-4 text-[hsl(var(--primary)/0.6)] flex-shrink-0 mt-0.5" />
              <div className="flex flex-wrap gap-1.5">
                {template.architectureTags.slice(0, 2).map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="text-xs px-2.5 py-0.5 border-[hsl(var(--border)/0.5)] hover:border-[hsl(var(--primary)/0.5)] transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
                {template.architectureTags.length > 2 && (
                  <Badge 
                    variant="outline" 
                    className="text-xs px-2.5 py-0.5 border-dashed"
                  >
                    +{template.architectureTags.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="pt-4 mt-4 border-t border-[hsl(var(--border)/0.5)]">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start hover:bg-[hsl(var(--primary)/0.1)] hover:text-[hsl(var(--primary))] group/btn transition-all duration-300"
            asChild
          >
            <a
              href={template.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5"
            >
              <Github className="h-4 w-4 group-hover/btn:rotate-12 transition-transform duration-300" />
              <span className="font-medium">View on GitHub</span>
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}