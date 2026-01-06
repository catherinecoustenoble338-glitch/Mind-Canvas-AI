import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Book, X } from 'lucide-react';
import { toast } from 'sonner';

interface WikiDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WIKI_CONTENT = `# OctoFlow Wiki

## About OctoFlow
OctoFlow is a collaborative visual sitemap and wireframe planning tool designed to help teams plan website and application structures effectively.

## Key Features

### Visual Sitemap Planning
- **Draggable Page Nodes**: Easily organize your site structure using a drag-and-drop interface.
- **Visual Block Representation**: Represent page content using visual blocks instead of abstract lists.
- **Dual View Modes**: Switch between "Visual Mode" for high-level structure and "Details Mode" for in-depth content planning.

### Detailed Specifications
- **VFP (Valuable Final Product)**: Define the specific outcome or value for each page and block (ЦКП).
- **Feature Lists**: Document detailed functional requirements and features for every component.
- **Block-Level Details**: Drill down into individual blocks to specify their purpose and functionality.

### Collaboration Tools
- **Team Assignments**: Assign team members to specific pages.
- **Status Tracking**: Track the progress of each page (Idea, In Progress, Review, Done).
- **Tech Stack**: Define the technology stack used for each page.
- **Chat & Files**: Discuss requirements and attach documents directly within block context.

## Workflow
1. **Create Pages**: Start by mapping out your main pages.
2. **Add Blocks**: Populate pages with content blocks (Headers, Features, Forms, etc.).
3. **Define Specs**: Switch to Details Mode to add VFP and Feature lists.
4. **Assign & Track**: Assign tasks to team members and monitor progress.

## Technical Details
OctoFlow is built using React, ReactFlow, and Tailwind CSS, optimized for performance and ease of use.
`;

export function WikiDialog({ open, onOpenChange }: WikiDialogProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(WIKI_CONTENT);
    toast.success("Wiki content copied to clipboard");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] max-h-[80vh] flex flex-col p-0 gap-0 overflow-hidden bg-white sm:rounded-lg [&>button]:hidden">
        <DialogHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between space-y-0 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <Book size={18} />
            </div>
            <DialogTitle className="text-lg font-bold text-slate-800">OctoFlow Wiki</DialogTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button 
                size="sm" 
                variant="outline" 
                className="gap-2 h-8 text-xs bg-white"
                onClick={handleCopy}
            >
                <Copy size={14} />
                Copy Wiki
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8 text-slate-400">
                <X size={18} />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
            <div className="prose prose-sm prose-slate max-w-none">
                {WIKI_CONTENT.split('\n').map((line, i) => {
                    if (line.startsWith('# ')) {
                        return <h1 key={i} className="text-2xl font-bold mb-4 text-slate-900 border-b pb-2">{line.replace('# ', '')}</h1>;
                    }
                    if (line.startsWith('## ')) {
                        return <h2 key={i} className="text-lg font-bold mt-6 mb-3 text-slate-800">{line.replace('## ', '')}</h2>;
                    }
                    if (line.startsWith('### ')) {
                        return <h3 key={i} className="text-sm font-bold mt-4 mb-2 text-slate-700 uppercase tracking-wide">{line.replace('### ', '')}</h3>;
                    }
                    if (line.startsWith('- **')) {
                        const parts = line.split('**:');
                        const title = parts[0].replace('- **', '');
                        const content = parts[1];
                        return (
                            <li key={i} className="ml-4 mb-1 list-disc text-slate-600">
                                <strong className="text-slate-800">{title}:</strong>{content}
                            </li>
                        );
                    }
                    if (line.startsWith('- ')) {
                        return <li key={i} className="ml-4 mb-1 list-disc text-slate-600">{line.replace('- ', '')}</li>;
                    }
                    if (line.match(/^\d+\. /)) {
                         return <div key={i} className="ml-4 mb-1 text-slate-600 font-medium">{line}</div>;
                    }
                    if (line.trim() === '') {
                        return <br key={i} />;
                    }
                    return <p key={i} className="text-slate-600 mb-2 leading-relaxed">{line}</p>;
                })}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
