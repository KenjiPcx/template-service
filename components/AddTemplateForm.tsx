'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TagInput } from '@/components/ui/tag-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Loader2, Sparkles, Github, FileText, Layers, Code2, Package } from 'lucide-react';

interface AddTemplateFormProps {
  onTemplateAdded: () => void;
}

export function AddTemplateForm({ onTemplateAdded }: AddTemplateFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    bestUseCase: '',
    type: 'starter',
    libraryTags: [] as string[],
    architectureTags: [] as string[],
    githubUrl: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add template');
      }

      setSuccess(true);
      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          bestUseCase: '',
          type: 'starter',
          libraryTags: [],
          architectureTags: [],
          githubUrl: ''
        });
        setOpen(false);
        setSuccess(false);
        onTemplateAdded();
      }, 1500);
    } catch (error) {
      console.error('Error adding template:', error);
      alert('Failed to add template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="lg"
          className="fixed bottom-8 right-8 shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] group"
        >
          <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
          Add Template
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] glass border-[hsl(var(--border)/0.5)] shadow-2xl overflow-hidden flex flex-col">
        <DialogHeader className="relative pb-2 flex-shrink-0">
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-[hsl(var(--primary)/0.3)] via-blue-400/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full blur-2xl" />
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-gradient-to-br from-[hsl(var(--primary)/0.2)] to-[hsl(var(--primary)/0.1)] rounded-xl">
              <Sparkles className="w-5 h-5 text-[hsl(var(--primary))]" />
            </div>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[hsl(var(--foreground))] to-[hsl(var(--foreground)/0.7)] bg-clip-text text-transparent">
              Add New Template
            </DialogTitle>
          </div>
          <DialogDescription className="text-base text-[hsl(var(--muted-foreground))] pl-11">
            Share your template with the community. Fill in the details below to help others discover and use your code.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="relative flex flex-col flex-1 overflow-hidden">
          <div className="grid gap-5 py-6 overflow-y-auto px-1" style={{ maxHeight: 'calc(90vh - 220px)' }}>
            <div className="grid gap-2.5 group">
              <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4 text-[hsl(var(--primary)/0.7)]" />
                Title
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Next.js Commerce"
                className="h-11 bg-[hsl(var(--background)/0.5)] backdrop-blur-sm border-[hsl(var(--border)/0.5)] focus:border-[hsl(var(--primary)/0.5)] focus:ring-2 focus:ring-[hsl(var(--primary)/0.2)] transition-all duration-200 rounded-lg"
              />
            </div>
            
            <div className="grid gap-2.5 group">
              <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4 text-[hsl(var(--primary)/0.7)]" />
                Description
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="A modern e-commerce template built with Next.js..."
                className="min-h-[100px] resize-none bg-[hsl(var(--background)/0.5)] backdrop-blur-sm border-[hsl(var(--border)/0.5)] focus:border-[hsl(var(--primary)/0.5)] focus:ring-2 focus:ring-[hsl(var(--primary)/0.2)] transition-all duration-200 rounded-lg"
              />
            </div>
            
            <div className="grid gap-2.5 group">
              <Label htmlFor="bestUseCase" className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500/70" />
                Best Use Case
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="bestUseCase"
                required
                value={formData.bestUseCase}
                onChange={(e) => setFormData({ ...formData, bestUseCase: e.target.value })}
                placeholder="Building real-time collaborative applications with websockets and state synchronization..."
                className="min-h-[80px] resize-none bg-[hsl(var(--background)/0.5)] backdrop-blur-sm border-[hsl(var(--border)/0.5)] focus:border-[hsl(var(--primary)/0.5)] focus:ring-2 focus:ring-[hsl(var(--primary)/0.2)] transition-all duration-200 rounded-lg"
              />
            </div>
            
            <div className="grid gap-2.5 group">
              <Label htmlFor="type" className="text-sm font-medium flex items-center gap-2">
                <Package className="w-4 h-4 text-green-500/70" />
                Template Type
                <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="h-11 bg-[hsl(var(--background)/0.5)] backdrop-blur-sm border-[hsl(var(--border)/0.5)] focus:border-[hsl(var(--primary)/0.5)] focus:ring-2 focus:ring-[hsl(var(--primary)/0.2)] transition-all duration-200 rounded-lg">
                  <SelectValue placeholder="Select template type" />
                </SelectTrigger>
                <SelectContent className="glass">
                  <SelectItem value="starter">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Starter</span>
                      <span className="text-xs text-[hsl(var(--muted-foreground))]">- Clean foundation to build from</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="mve">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">MVE</span>
                      <span className="text-xs text-[hsl(var(--muted-foreground))]">- Minimal viable example</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="addon">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Add-on</span>
                      <span className="text-xs text-[hsl(var(--muted-foreground))]">- Feature to integrate</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2.5 group">
              <Label htmlFor="libraryTags" className="text-sm font-medium flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-400/70" />
                Library Tags 
                <span className="text-[hsl(var(--muted-foreground))] text-xs font-normal ml-auto">(Press Enter to add)</span>
              </Label>
              <TagInput
                value={formData.libraryTags}
                onChange={(tags) => setFormData({ ...formData, libraryTags: tags })}
                placeholder="nextjs, react, typescript..."
                suggestions={['nextjs', 'react', 'vue', 'angular', 'svelte', 'typescript', 'javascript', 'tailwindcss', 'chakra-ui', 'material-ui', 'express', 'fastify', 'nestjs', 'prisma', 'drizzle', 'postgresql', 'mongodb', 'redis']}
              />
            </div>
            
            <div className="grid gap-2.5 group">
              <Label htmlFor="architectureTags" className="text-sm font-medium flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400/70" />
                Architecture Tags 
                <span className="text-[hsl(var(--muted-foreground))] text-xs font-normal ml-auto">(Press Enter to add)</span>
              </Label>
              <TagInput
                value={formData.architectureTags}
                onChange={(tags) => setFormData({ ...formData, architectureTags: tags })}
                placeholder="e-commerce, serverless, saas..."
                suggestions={['e-commerce', 'serverless', 'jamstack', 'microservices', 'monolithic', 'api', 'fullstack', 'frontend', 'backend', 'real-time', 'chat', 'dashboard', 'admin', 'blog', 'portfolio', 'landing-page', 'saas', 'marketplace']}
              />
            </div>
            
            <div className="grid gap-2.5 group">
              <Label htmlFor="githubUrl" className="text-sm font-medium flex items-center gap-2">
                <Github className="w-4 h-4 text-[hsl(var(--foreground)/0.7)]" />
                GitHub URL
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="githubUrl"
                type="url"
                required
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/vercel/commerce"
                className="h-11 bg-[hsl(var(--background)/0.5)] backdrop-blur-sm border-[hsl(var(--border)/0.5)] focus:border-[hsl(var(--primary)/0.5)] focus:ring-2 focus:ring-[hsl(var(--primary)/0.2)] transition-all duration-200 rounded-lg"
              />
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[hsl(var(--border)/0.3)] flex-shrink-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setFormData({
                  title: '',
                  description: '',
                  bestUseCase: '',
                  type: 'starter',
                  libraryTags: [],
                  architectureTags: [],
                  githubUrl: ''
                });
                setOpen(false);
              }}
              className="sm:mr-auto border-[hsl(var(--border)/0.5)] hover:bg-[hsl(var(--muted)/0.5)] hover:border-[hsl(var(--border))] transition-all duration-200"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || success}
              className="bg-gradient-to-r from-[hsl(var(--primary))] to-blue-500 hover:from-[hsl(var(--primary)/0.9)] hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
            >
              {success ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                  Success!
                </>
              ) : loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Template
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}