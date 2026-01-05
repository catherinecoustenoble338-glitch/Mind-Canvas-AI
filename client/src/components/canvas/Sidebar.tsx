import React, { useState } from 'react';
import { useAppStore, WireframeType } from '@/store/useAppStore';
import { 
  Plus,
  Monitor,
  List,
  Sparkles,
  X,
  Send,
  Paperclip,
  Trash2,
  Grid
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

// Grouped tools for better organization
const TOOL_GROUPS: { name: string, tools: { type: WireframeType, label: string, color: string }[] }[] = [
  {
    name: "Structure",
    tools: [
      { type: 'header', label: 'Header', color: 'bg-emerald-400' },
      { type: 'footer', label: 'Footer', color: 'bg-purple-500' },
      { type: 'divider', label: 'Divider', color: 'bg-purple-400' },
    ]
  },
  {
    name: "Hero & Intros",
    tools: [
      { type: 'hero', label: 'Hero Center', color: 'bg-blue-500' },
      { type: 'hero_arrows', label: 'Hero Arrows', color: 'bg-sky-400' },
      { type: 'text', label: 'Text Block', color: 'bg-blue-500' },
    ]
  },
  {
    name: "Features & Content",
    tools: [
      { type: 'features', label: 'Features', color: 'bg-rose-400' },
      { type: 'cards', label: 'Cards', color: 'bg-red-400' },
      { type: 'text_image', label: 'Text & Image', color: 'bg-indigo-500' },
      { type: 'two_col_images', label: '2 Col Images', color: 'bg-blue-400' },
      { type: 'gallery', label: 'Gallery', color: 'bg-blue-400' },
      { type: 'video', label: 'Video', color: 'bg-blue-500' },
    ]
  },
  {
    name: "Forms & Interaction",
    tools: [
      { type: 'form', label: 'Form', color: 'bg-orange-300' },
      { type: 'signup', label: 'Sign In', color: 'bg-amber-400' },
      { type: 'cta', label: 'Call to Action', color: 'bg-red-500' },
      { type: 'faq', label: 'FAQ', color: 'bg-sky-600' },
    ]
  },
  {
    name: "Data",
    tools: [
      { type: 'pricing', label: 'Pricing', color: 'bg-blue-400' },
      { type: 'table', label: 'Table', color: 'bg-blue-500' },
      { type: 'steps', label: 'Steps', color: 'bg-sky-500' },
    ]
  }
];

const POPULAR_STACKS = [
  'React', 'Vue', 'Next.js', 'Node.js', 'Python', 'Go', 
  'Supabase', 'Firebase', 'AWS', 'Vercel', 'Stripe', 
  'Postgres', 'MongoDB', 'Redis', 'Docker', 'Tailwind'
];

export function Sidebar() {
  const { 
    addNode, 
    addBlockToNode, 
    viewMode, 
    setViewMode, 
    selectedNodeId, 
    nodes, 
    updateNodeData, 
    addIconToNode, 
    removeIconFromNode,
    removeBlockFromNode
  } = useAppStore();
  
  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const [chatMessage, setChatMessage] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');

  const handleToolClick = (type: WireframeType) => {
    if (selectedNodeId) {
      addBlockToNode(selectedNodeId, type);
    } else {
      addNode({ x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 });
      // The new node is added async, we can't immediately add the block without a callback or effect,
      // but standard behavior for 'addNode' in store initializes with a header.
      // We could enhance this to create a node WITH this block type as first child.
      // For now, let's just create a blank new page if nothing selected.
    }
  };

  const handleAiGenerate = () => {
    if (!aiPrompt) return;
    setAiPrompt('');
    // Simulation
    setTimeout(() => {
        addNode({ x: Math.random() * 500, y: Math.random() * 500 });
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-200 w-[300px] shadow-xl z-10 font-sans">
      {/* Header Logo */}
      <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-white">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-md shadow-primary/20">
           <Grid size={18} />
        </div>
        <div className="flex flex-col">
           <h1 className="font-bold text-slate-800 leading-none text-sm">OctoFlow</h1>
           <span className="text-[10px] text-slate-400 font-medium">Sitemap & Wireframe</span>
        </div>
      </div>

      {/* Main Content Area */}
      <ScrollArea className="flex-1 bg-slate-50/50">
        
        {/* Selection Details Panel */}
        {selectedNode ? (
          <div className="p-4 space-y-6 animate-in slide-in-from-left-4 duration-300">
            <div className="flex items-center justify-between">
               <h2 className="font-semibold text-sm text-slate-800">Page Details</h2>
               <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => useAppStore.getState().setSelectedNode(null)}>
                 <X size={14} />
               </Button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Page Name</label>
                <Input 
                  value={selectedNode.data.label} 
                  onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
                  className="font-medium h-8 text-sm bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</label>
                <Textarea 
                  value={selectedNode.data.description} 
                  onChange={(e) => updateNodeData(selectedNode.id, { description: e.target.value })}
                  className="min-h-[60px] text-xs resize-none bg-white focus:bg-white transition-colors"
                  placeholder="Describe this page purpose..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Backend & Services</label>
                <div className="p-2 bg-white rounded-md border border-slate-200 min-h-[40px] flex flex-wrap gap-1">
                  {selectedNode.data.icons?.map(icon => (
                    <div key={icon} className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-slate-600 border border-slate-200">
                       <img src={`https://cdn.simpleicons.org/${icon.toLowerCase().replace(/\s+/g, '')}`} className="w-3 h-3 opacity-50" />
                       {icon}
                       <X size={10} className="cursor-pointer hover:text-red-500" onClick={() => removeIconFromNode(selectedNode.id, icon)} />
                    </div>
                  ))}
                  {(!selectedNode.data.icons || selectedNode.data.icons.length === 0) && (
                    <span className="text-[10px] text-slate-400 italic">No services added</span>
                  )}
                </div>
                
                <div className="pt-1">
                  <ScrollArea className="h-[80px] w-full border border-slate-100 rounded bg-white p-1">
                    <div className="flex flex-wrap gap-1">
                        {POPULAR_STACKS.map(stack => (
                        <button 
                            key={stack}
                            onClick={() => addIconToNode(selectedNode.id, stack)}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-100 transition-colors flex items-center gap-1"
                        >
                            <img src={`https://cdn.simpleicons.org/${stack.toLowerCase().replace(/\s+/g, '')}`} className="w-3 h-3 opacity-50" />
                            {stack}
                        </button>
                        ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Page Structure</label>
                 <div className="space-y-1">
                    {selectedNode.data.blocks.map((block, index) => (
                        <div key={block.id} className="flex items-center justify-between bg-white border border-slate-200 p-2 rounded text-xs group">
                            <span className="font-medium text-slate-600 capitalize">{block.type.replace('_', ' ')}</span>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="icon" variant="ghost" className="h-5 w-5 text-red-400 hover:text-red-600" onClick={() => removeBlockFromNode(selectedNode.id, block.id)}>
                                    <Trash2 size={12} />
                                </Button>
                            </div>
                        </div>
                    ))}
                    {selectedNode.data.blocks.length === 0 && (
                        <p className="text-[10px] text-slate-400 text-center py-2">No blocks on this page</p>
                    )}
                 </div>
                 <p className="text-[10px] text-slate-400 mt-2">
                    Select a component from the list below to add it to this page.
                 </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-6">
             <div className="space-y-2">
                <p className="text-xs text-slate-600">
                    Welcome to OctoFlow. <br/>
                    <span className="text-slate-400">Select a page to edit its content, or click a block below to start a new page.</span>
                </p>
             </div>
          </div>
        )}

        <div className="px-4 pb-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                {selectedNode ? "Add Block to Page" : "Create New Page"}
            </h3>
            
            <div className="space-y-6">
                {TOOL_GROUPS.map((group) => (
                    <div key={group.name} className="space-y-2">
                        <h4 className="text-[10px] font-semibold text-slate-500 pl-1">{group.name}</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {group.tools.map((tool) => (
                                <button
                                    key={tool.type}
                                    onClick={() => handleToolClick(tool.type)}
                                    className="flex flex-col items-start gap-2 p-2 rounded border border-slate-200 bg-white hover:border-primary/50 hover:shadow-md transition-all group text-left relative overflow-hidden"
                                >
                                    <div className={`absolute top-0 left-0 w-full h-1 ${tool.color}`}></div>
                                    <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900 mt-1">{tool.label}</span>
                                    {/* Mini visual indicator */}
                                    <div className={`w-full h-8 ${tool.color} opacity-20 rounded-sm mt-auto`}></div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </ScrollArea>
      
      {/* Footer / View Toggle */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <div className="bg-slate-100 p-1 rounded-md flex gap-1">
            <button 
                onClick={() => setViewMode('visual')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-sm transition-all ${viewMode === 'visual' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <Monitor size={12} />
                Visual
            </button>
            <button 
                onClick={() => setViewMode('brief')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-sm transition-all ${viewMode === 'brief' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <List size={12} />
                Brief
            </button>
        </div>
      </div>
    </div>
  );
}
