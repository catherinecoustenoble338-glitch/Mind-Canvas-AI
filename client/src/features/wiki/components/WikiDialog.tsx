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

const WIKI_CONTENT = `# OctoFlow Blueprint: The Living Spec

## 1. Vision & Philosophy
**Elevator Pitch**: OctoFlow is a hybrid of Miro and Linear—a visual sitemap editor where every node is not just a static image but an interactive list of wireframes with attached chats, status tracking, and "Valuable Final Product" (VFP) definitions.

**Key Metaphor**: "Technical Blueprint". The design aesthetic mimics an engineering drawing: monospaced fonts (JetBrains Mono/Inter), dashed connector lines, technical grid backgrounds (dots), and soft, functional pastel colors.

### UX Principles
- **Direct Manipulation**: Everything is draggable. Reordering blocks, moving nodes, and connecting pages happens directly on the canvas.
- **Context Over Modal**: Editing happens "inline" wherever possible. Modals are reserved only for heavy configuration or deep-dive detailing.
- **Living Spec**: This is not a static artifact. It is the "source of truth" for the project's structure, evolving from "Idea" to "Done".

## 2. Technology Stack (The Constitution)
- **Core Framework**: React 18, Vite, TypeScript.
- **Styling Engine**: TailwindCSS, \`tailwind-merge\`, \`clsx\`, \`shadcn/ui\` (Radix Primitives) for accessible interactive components.
- **State Management**: **Zustand**. We avoid Context API for business logic. The store is split into "Slices" (Project, UI, Team, History) to maintain modularity.
- **Canvas Engine**: \`reactflow\` (v11). Custom nodes and edges are the heart of the application.
- **Animation**: \`framer-motion\`. Used for smooth list reordering and layout transitions.
- **Layout Engine**: \`dagre\`. Provides deterministic auto-layout for the node graph (Top-to-Bottom flow).
- **Icons**: \`lucide-react\` for UI icons, \`Simple Icons\` (via CDN) for tech stack logos.

## 3. Architecture & Structure
### 3.1 Feature-Based Directory Structure
The codebase is organized by domain features, not technical layers:
- **src/features/canvas**: The core editor logic. Contains \`components/nodes\` (BlockNode), \`MindMap.tsx\`, \`Sidebar.tsx\`.
- **src/features/admin**: Administration dashboard, user management tables.
- **src/features/wiki**: Documentation system (this dialog).
- **src/features/chat**: Commenting system, message threads.
- **src/features/navigation**: Main app navigation, popups.
- **src/store**: Global state slices.
- **src/components/ui**: Shared atomic components (Button, Dialog, Input).

### 3.2 State Management Pattern (Zustand Slices)
We use a single \`useAppStore\` hook that combines multiple slices:
- **ProjectSlice**: Manages the graph data (\`nodes\`, \`edges\`), block CRUD operations (\`addBlock\`, \`removeBlock\`), and structural logic.
- **UISlice**: Controls visual state (\`viewMode\`, \`sidebarOpen\`, \`showDetails\`).
- **TeamSlice**: Manages \`adminUsers\` (system-wide) and \`teamMembers\` (project-specific).
- **HistorySlice**: Implements a robust Undo/Redo stack using deep cloning of state snapshots.

## 4. Core Components Deep Dive
### 4.1 BlockNode (The God Component)
The \`BlockNode\` is the primary interactive element. It is decomposed into:
- **BlockNodeHeader**: Displays page status (Idea/In Progress), Assignee avatar, and tech stack icons. Handles page-level actions (Delete, Rename).
- **BlockItem**: Represents a single wireframe row. It supports two modes:
- **Visual Mode**: A compact, graphical representation of the UI block (e.g., a "Hero" wireframe).
- **Details Mode**: Expands to show the "Visual" on the left and text specifications (VFP, Feature List) on the right.
- **BlockReorder**: Uses \`Reorder.Group\` to allow dragging blocks within a page.

### 4.2 WireframeVisual (The Renderer)
A polymorphic component that takes a \`type\` (e.g., 'hero_arrows', 'text_video') and renders a schematic SVG/CSS representation. It uses a **Registry Pattern** (\`BlockRegistry\`) to map types to components, avoiding massive switch statements.

### 4.3 MindMap (The Wrapper)
Wraps \`ReactFlow\` and provides:
- **CustomControls**: Zoom, History (Undo/Redo), Auto-Layout triggers.
- **Background**: Dot pattern \`BackgroundVariant.Dots\` for the engineering look.
- **CustomEdge**: Animated, styled connector lines.

## 5. Data Models & Types
Strict TypeScript interfaces define the domain:
- **WireframeType**: Union type of 50+ block kinds ('header', 'hero', 'footer', etc.).
- **PageStatus**: 'idea' | 'in_progress' | 'review' | 'done' | 'error'.
- **BlockItem**: \`{ id, type, label, vfp?, features?, chatMessages[] }\`.
- **BlockData**: \`{ label, status, blocks[], assignee?, icons? }\`.

## 6. Business Logic & Behavior
### 6.1 Auto-Layout System
We use \`dagre\` to calculate node positions.
- **Direction**: 'TB' (Top-Bottom).
- **Spacing**: Dynamic rank separation based on \`showDetails\` mode (nodes get taller in Details mode).
- **Trigger**: Layout runs on initial load and when explicitly requested by the user.

### 6.2 History & Time Travel
Every significant user action (Move, Edit, Delete) triggers a snapshot:
1. **Capture**: Deep clone \`nodes\` and \`edges\`.
2. **Push**: Add to \`past\` stack.
3. **Log**: Record action in \`historyLog\` for the debug console.
4. **Restore**: Pop from \`past\` and apply to current state.

### 6.3 "Caps Lock" Details Mode
A global toggle that transforms the entire canvas:
- **Visual Mode (Default)**: Optimized for structure. Width: 200px. Shows only visual wireframes.
- **Details Mode (Expanded)**: Optimized for content. Width: 400px. Reveals VFP (Valuable Final Product) and Feature bullet points for every block.

## 7. Design System & Aesthetics
- **Color Palette**: Neutral Slate scale (50-900) for UI chrome. Semantic colors (Emerald, Blue, Amber, Rose) used sparingly for Status indicators.
- **Typography**: Clean sans-serif (Inter) for UI, Monospace for IDs and technical labels.
- **Depth**: Subtle borders (\`border-slate-200\`) and soft shadows (\`shadow-lg\`). Active elements get a \`ring-2\` focus state.
- **Motion**: Instant feedback. Hover states are snappy (150ms), layout changes use spring physics.

## 8. Future Roadmap & Extension Points
- **Roadmap View**: Visualize pages on a Gantt chart based on status and assignee.
- **Export Engine**: Generate high-res PDF/PNG of the entire flow.
- **Live Collaboration**: Replace local state with Yjs/WebSockets for multiplayer editing.
- **Templates**: Pre-built page structures (Landing, Auth, Dashboard).
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
