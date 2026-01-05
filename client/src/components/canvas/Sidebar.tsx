import React, { useState } from 'react';
import { useAppStore, WireframeType } from '@/store/useAppStore';
import { 
  Plus,
  Monitor,
  List,
  Grid,
  X,
  Trash2,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { WireframeVisual } from './WireframeVisual';

// Detailed Tool Mapping based on Octopus.do screenshot provided
const TOOL_GROUPS: { name: string, tools: { type: WireframeType, label: string, color: string }[] }[] = [
  {
    name: "Content & Media",
    tools: [
      { type: 'images', label: 'Images', color: 'bg-slate-500' },
      { type: 'slider', label: 'Slider', color: 'bg-slate-500' },
      { type: 'text_video', label: 'Text & Video', color: 'bg-slate-500' },
      { type: 'text', label: 'Text', color: 'bg-slate-500' },
      { type: 'two_col_images_text', label: 'Two-col + Text', color: 'bg-slate-500' },
      { type: 'map', label: 'Map', color: 'bg-slate-500' },
      { type: 'text_image', label: 'Text & Image', color: 'bg-slate-500' },
      { type: 'vanilla_img_placeholder', label: 'Img Placeholder', color: 'bg-slate-500' },
      { type: 'left_text_on_image', label: 'Left Text Img', color: 'bg-slate-500' },
      { type: 'slider_2_column', label: 'Slider 2 Col', color: 'bg-slate-500' },
      { type: 'two_col_images', label: 'Two-col Images', color: 'bg-slate-500' },
    ]
  },
  {
    name: "Headers & Navigation",
    tools: [
      { type: 'header', label: 'Header', color: 'bg-slate-500' },
      { type: 'title', label: 'Title', color: 'bg-slate-500' },
      { type: 'features_green', label: 'Features', color: 'bg-slate-500' },
      { type: 'interface_header', label: 'Interface Header', color: 'bg-slate-500' },
      { type: 'table', label: 'Table', color: 'bg-slate-500' },
      { type: 'bullets', label: 'Bullets', color: 'bg-slate-500' },
      { type: 'mobile_top_bar', label: 'Mobile / Top', color: 'bg-slate-500' },
      { type: 'no_logo_navigation', label: 'No-logo Nav', color: 'bg-slate-500' },
      { type: 'articles', label: 'Articles', color: 'bg-slate-500' },
      { type: 'profile', label: 'Profile', color: 'bg-slate-500' },
    ]
  },
  {
    name: "Features & CTA",
    tools: [
      { type: 'features', label: 'Features', color: 'bg-slate-500' },
      { type: 'cards', label: 'Cards', color: 'bg-slate-500' },
      { type: 'cta', label: 'CTA', color: 'bg-slate-500' },
      { type: 'cta_image', label: 'CTA & Image', color: 'bg-slate-500' },
      { type: 'slider_cards', label: 'Slider Cards', color: 'bg-slate-500' },
      { type: 'buttons_left_aligned', label: 'Buttons Left', color: 'bg-slate-500' },
      { type: 'hero_arrows', label: 'Hero Arrows', color: 'bg-slate-500' },
    ]
  },
  {
    name: "Forms & Interactions",
    tools: [
      { type: 'text_form', label: 'Text & Form', color: 'bg-slate-500' },
      { type: 'form', label: 'Form', color: 'bg-slate-500' },
      { type: 'sign_in', label: 'Sign In', color: 'bg-slate-500' },
      { type: 'text_sidebar_form', label: 'Text & Sidebar', color: 'bg-slate-500' },
      { type: 'hamburger', label: 'Hamburger', color: 'bg-slate-500' },
      { type: 'upload_button', label: 'Upload Button', color: 'bg-slate-500' },
      { type: 'next', label: 'Next', color: 'bg-slate-500' },
      { type: 'radiobuttons', label: 'Radiobuttons', color: 'bg-slate-500' },
      { type: 'toggles', label: 'Toggles', color: 'bg-slate-500' },
    ]
  },
  {
    name: "Structure & Misc",
    tools: [
       { type: 'divider', label: 'Divider', color: 'bg-slate-500' },
       { type: 'footer', label: 'Footer', color: 'bg-slate-500' },
       { type: 'loading', label: 'Loading', color: 'bg-slate-500' },
       { type: 'audio', label: 'Audio', color: 'bg-slate-500' },
       { type: 'post_thread', label: 'Post Thread', color: 'bg-slate-500' },
    ]
  },
  {
    name: "Components",
    tools: [
       { type: 'map_contacts', label: 'Map + Contacts', color: 'bg-slate-500' },
       { type: 'table_of_contents', label: 'Table of Contents', color: 'bg-slate-500' },
       { type: 'invoice', label: 'Invoice', color: 'bg-slate-500' },
       { type: 'checklist', label: 'Checklist', color: 'bg-slate-500' },
       { type: 'steps', label: 'Steps', color: 'bg-slate-500' },
       { type: 'accordion', label: 'Accordion', color: 'bg-slate-500' },
       { type: 'chart', label: 'Chart', color: 'bg-slate-500' },
       { type: 'catalog', label: 'Catalog', color: 'bg-slate-500' },
       { type: 'plans', label: 'Plans', color: 'bg-slate-500' },
       { type: 'carousel', label: 'Carousel', color: 'bg-slate-500' },
       { type: 'faq', label: 'FAQ', color: 'bg-slate-500' },
       { type: 'timeline', label: 'Timeline', color: 'bg-slate-500' },
       { type: 'pagination', label: 'Pagination', color: 'bg-slate-500' },
    ]
  }
];

const POPULAR_STACKS = [
  'React', 'Vue', 'Next.js', 'Node.js', 'Python', 'Go', 
  'Supabase', 'Firebase', 'AWS', 'Vercel', 'Stripe', 
  'Postgres', 'MongoDB', 'Redis', 'Docker', 'Tailwind',
  'Figma', 'Slack', 'Discord', 'Google Analytics'
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
  const [searchTerm, setSearchTerm] = useState('');

  const handleToolClick = (type: WireframeType) => {
    if (selectedNodeId) {
      addBlockToNode(selectedNodeId, type);
    } else {
      addNode({ x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 });
    }
  };

  const filteredGroups = TOOL_GROUPS.map(group => ({
    ...group,
    tools: group.tools.filter(tool => tool.label.toLowerCase().includes(searchTerm.toLowerCase()))
  })).filter(group => group.tools.length > 0);

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-200 w-[320px] shadow-xl z-10 font-sans">
      {/* Header Logo */}
      <div className="p-4 pl-14 border-b border-slate-100 flex items-center gap-3 bg-white">
        <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-white shadow-md">
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
               <h2 className="font-semibold text-sm text-slate-800">Page Properties</h2>
               <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => useAppStore.getState().setSelectedNode(null)}>
                 <X size={14} />
               </Button>
            </div>

            <div className="space-y-4">
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
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Services (Top Right)</label>
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
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Block List (Drag to reorder)</label>
                 <div className="space-y-1">
                    {selectedNode.data.blocks.map((block, index) => (
                        <div key={block.id} className="flex items-center justify-between bg-white border border-slate-200 p-2 rounded text-xs group hover:border-blue-300 transition-colors cursor-move">
                            <span className="font-medium text-slate-600 truncate max-w-[140px]">{block.label || block.type.replace(/_/g, ' ')}</span>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="icon" variant="ghost" className="h-5 w-5 text-red-400 hover:text-red-600" onClick={() => removeBlockFromNode(selectedNode.id, block.id)}>
                                    <Trash2 size={12} />
                                </Button>
                            </div>
                        </div>
                    ))}
                    {selectedNode.data.blocks.length === 0 && (
                        <p className="text-[10px] text-slate-400 text-center py-2 border border-dashed border-slate-200 rounded">No blocks on this page</p>
                    )}
                 </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
             <div className="space-y-2">
                <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Instructions:</strong><br/>
                    1. Select a page on the canvas.<br/>
                    2. Click blocks below to add them to the page.<br/>
                    3. Or click a block without selection to create a new page.
                </p>
             </div>
             
             <div className="relative">
                <Search className="absolute left-2 top-2 h-3 w-3 text-slate-400" />
                <Input 
                   placeholder="Search components..." 
                   className="h-7 text-xs pl-7 bg-white" 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
          </div>
        )}

        <div className="px-4 pb-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                Component Library
            </h3>
            
            <div className="space-y-6">
                {filteredGroups.map((group) => (
                    <div key={group.name} className="space-y-2">
                        <h4 className="text-[10px] font-semibold text-slate-500 pl-1 border-l-2 border-slate-200">{group.name}</h4>
                        <div className="grid grid-cols-1 gap-3">
                            {group.tools.map((tool) => (
                                <button
                                    key={tool.type}
                                    onClick={() => handleToolClick(tool.type)}
                                    className="relative group transition-all transform hover:scale-[1.01] hover:shadow-lg rounded-sm overflow-hidden"
                                >
                                   {/* Removed scaling hacks to make sidebar preview 1:1 with canvas */}
                                   <div className="pointer-events-none w-full">
                                      <WireframeVisual type={tool.type} label={tool.label} />
                                   </div>
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
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-sm transition-all ${viewMode === 'visual' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <Monitor size={12} />
                Visual
            </button>
            <button 
                onClick={() => setViewMode('brief')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-sm transition-all ${viewMode === 'brief' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <List size={12} />
                Brief
            </button>
        </div>
      </div>
    </div>
  );
}
