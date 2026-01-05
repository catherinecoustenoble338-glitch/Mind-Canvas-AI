import React, { useState } from 'react';
import { useAppStore, BlockType } from '@/store/useAppStore';
import { 
  LayoutTemplate, 
  LayoutGrid, 
  Type, 
  Image, 
  Box, 
  Video, 
  CreditCard, 
  Plus,
  Monitor,
  List,
  Sparkles,
  Search,
  X,
  Send,
  Trash2,
  Paperclip
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const TOOLS: { type: BlockType; label: string; icon: any }[] = [
  { type: 'hero', label: 'Hero', icon: LayoutTemplate },
  { type: 'features', label: 'Features', icon: LayoutGrid },
  { type: 'text', label: 'Text', icon: Type },
  { type: 'gallery', label: 'Gallery', icon: Image },
  { type: 'form', label: 'Form', icon: Box },
  { type: 'video', label: 'Video', icon: Video },
  { type: 'pricing', label: 'Pricing', icon: CreditCard },
  { type: 'footer', label: 'Footer', icon: LayoutTemplate },
];

const POPULAR_STACKS = [
  'React', 'Vue', 'Next.js', 'Node.js', 'Python', 'Go', 
  'Supabase', 'Firebase', 'AWS', 'Vercel', 'Stripe', 
  'Postgres', 'MongoDB', 'Redis', 'Docker'
];

export function Sidebar() {
  const { addNode, viewMode, setViewMode, selectedNodeId, nodes, updateNodeData, addIconToNode, removeIconFromNode } = useAppStore();
  
  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const [chatMessage, setChatMessage] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');

  const handleDragStart = (event: React.DragEvent, nodeType: BlockType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleAddNode = (type: BlockType) => {
    // Add to center of screen roughly (would need projection in real app)
    // For now just offset random
    addNode(type, { x: Math.random() * 400, y: Math.random() * 400 });
  };

  const handleAiGenerate = () => {
    // Mock AI generation
    if (!aiPrompt) return;
    setAiPrompt('');
    // Simulate thinking then adding a node
    setTimeout(() => {
        addNode('features', { x: Math.random() * 500, y: Math.random() * 500 });
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-200 w-[320px] shadow-xl z-10">
      {/* Header Logo */}
      <div className="p-4 border-b border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="flex flex-col">
           <h1 className="font-bold text-slate-900 leading-none">OctoFlow</h1>
           <span className="text-[10px] text-slate-500 font-medium">Sitemap Builder</span>
        </div>
      </div>

      {/* Main Content Area */}
      <ScrollArea className="flex-1">
        
        {/* Selection Details Panel (Conditional) */}
        {selectedNode ? (
          <div className="p-4 space-y-6 animate-in slide-in-from-left-4 duration-300">
            <div className="flex items-center justify-between">
               <h2 className="font-semibold text-lg">Block Details</h2>
               <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => useAppStore.getState().setSelectedNode(null)}>
                 <X size={14} />
               </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Label</label>
                <Input 
                  value={selectedNode.data.label} 
                  onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
                  className="font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Description</label>
                <Textarea 
                  value={selectedNode.data.description} 
                  onChange={(e) => updateNodeData(selectedNode.id, { description: e.target.value })}
                  className="min-h-[80px] text-sm resize-none bg-slate-50 focus:bg-white transition-colors"
                  placeholder="Describe this section..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tech Stack</label>
                <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 rounded-lg border border-slate-100 min-h-[60px]">
                  {selectedNode.data.icons?.map(icon => (
                    <Badge key={icon} variant="secondary" className="gap-1 bg-white border border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors cursor-pointer group" onClick={() => removeIconFromNode(selectedNode.id, icon)}>
                      {icon}
                      <X size={10} className="opacity-0 group-hover:opacity-100" />
                    </Badge>
                  ))}
                  {(!selectedNode.data.icons || selectedNode.data.icons.length === 0) && (
                    <span className="text-xs text-slate-400 italic">No technologies added</span>
                  )}
                </div>
                
                <div className="pt-2">
                  <p className="text-[10px] text-slate-400 mb-2">Add Technology</p>
                  <div className="flex flex-wrap gap-1">
                    {POPULAR_STACKS.map(stack => (
                      <button 
                        key={stack}
                        onClick={() => addIconToNode(selectedNode.id, stack)}
                        className="text-[10px] px-2 py-1 rounded bg-slate-100 hover:bg-primary hover:text-white transition-colors border border-slate-200"
                      >
                        {stack}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                 <label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-2">
                   Discussion
                   <span className="bg-primary/10 text-primary text-[10px] px-1.5 rounded-full">2</span>
                 </label>
                 <div className="bg-slate-50 rounded-lg border border-slate-100 p-3 space-y-3 max-h-[200px] overflow-y-auto">
                    <div className="flex gap-2 items-start">
                       <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">JD</div>
                       <div className="flex-1 bg-white p-2 rounded-lg rounded-tl-none text-xs shadow-sm border border-slate-100">
                         Should we use framer-motion here?
                       </div>
                    </div>
                    <div className="flex gap-2 items-start flex-row-reverse">
                       <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-600">ME</div>
                       <div className="flex-1 bg-primary/5 p-2 rounded-lg rounded-tr-none text-xs shadow-sm border border-primary/10 text-slate-800">
                         Yes, let's keep it smooth.
                       </div>
                    </div>
                 </div>
                 <div className="relative">
                    <Input 
                      placeholder="Type a comment..." 
                      className="pr-8 text-xs h-9" 
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                    />
                    <div className="absolute right-1 top-1 bottom-1 flex items-center gap-1">
                      <Button size="icon" variant="ghost" className="h-6 w-6 text-slate-400 hover:text-slate-600">
                        <Paperclip size={12} />
                      </Button>
                      {chatMessage && (
                         <Button size="icon" variant="ghost" className="h-6 w-6 text-primary">
                           <Send size={12} />
                         </Button>
                      )}
                    </div>
                 </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="p-4 space-y-6">
            {/* View Mode Toggle */}
            <div className="bg-slate-100 p-1 rounded-lg flex gap-1">
               <button 
                 onClick={() => setViewMode('visual')}
                 className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'visual' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 <Monitor size={14} />
                 Visual
               </button>
               <button 
                 onClick={() => setViewMode('brief')}
                 className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'brief' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 <List size={14} />
                 Brief
               </button>
            </div>

            {/* AI Assistant */}
            <div className="space-y-3 bg-gradient-to-b from-indigo-50 to-white p-4 rounded-xl border border-indigo-100">
               <div className="flex items-center gap-2 text-indigo-700 font-semibold text-sm">
                 <Sparkles size={16} />
                 AI Assistant
               </div>
               <p className="text-xs text-slate-600 leading-relaxed">
                 Describe your app idea and I'll suggest a structure for you.
               </p>
               <div className="relative">
                 <Textarea 
                    placeholder="e.g. A marketplace for vintage cameras..." 
                    className="min-h-[80px] bg-white border-indigo-200 focus:border-indigo-400 resize-none text-xs pr-2"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                 />
                 <Button 
                   size="sm" 
                   className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white h-8 text-xs"
                   onClick={handleAiGenerate}
                   disabled={!aiPrompt}
                 >
                   Generate Ideas
                 </Button>
               </div>
            </div>

            <Separator />

            {/* Components Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Components</h3>
              <div className="grid grid-cols-2 gap-2">
                {TOOLS.map((tool) => (
                  <button
                    key={tool.type}
                    onClick={() => handleAddNode(tool.type)}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg border border-slate-200 bg-white hover:border-primary/50 hover:bg-slate-50 hover:shadow-md transition-all group text-left"
                  >
                    <div className="p-2 bg-slate-50 rounded-md group-hover:bg-white group-hover:text-primary transition-colors text-slate-500">
                      <tool.icon size={20} />
                    </div>
                    <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900">{tool.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </ScrollArea>
      
      {/* Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 text-[10px] text-slate-400 text-center">
        Mockup Mode • v0.1.0
      </div>
    </div>
  );
}
