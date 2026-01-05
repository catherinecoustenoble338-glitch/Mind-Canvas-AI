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

// Detailed Tool Mapping based on Octopus.do screenshot provided
const TOOL_GROUPS: { name: string, tools: { type: WireframeType, label: string, color: string }[] }[] = [
  {
    name: "Blue Group (Content)",
    tools: [
      { type: 'images', label: 'Images', color: 'bg-blue-500' },
      { type: 'slider', label: 'Slider', color: 'bg-blue-500' },
      { type: 'text_video', label: 'Text & Video', color: 'bg-blue-500' },
      { type: 'text', label: 'Text', color: 'bg-blue-500' },
      { type: 'two_col_images_text', label: 'Two-col + Text', color: 'bg-blue-400' },
      { type: 'map', label: 'Map', color: 'bg-blue-500' },
      { type: 'text_image', label: 'Text & Image', color: 'bg-blue-500' },
      { type: 'vanilla_img_placeholder', label: 'Img Placeholder', color: 'bg-blue-400' },
      { type: 'left_text_on_image', label: 'Left Text Img', color: 'bg-blue-500' },
      { type: 'slider_2_column', label: 'Slider 2 Col', color: 'bg-blue-500' },
      { type: 'two_col_images', label: 'Two-col Images', color: 'bg-blue-400' },
    ]
  },
  {
    name: "Green Group (Headers)",
    tools: [
      { type: 'header', label: 'Header', color: 'bg-emerald-400' },
      { type: 'title', label: 'Title', color: 'bg-emerald-400' },
      { type: 'features_green', label: 'Features', color: 'bg-emerald-400' },
      { type: 'interface_header', label: 'Interface Header', color: 'bg-emerald-400' },
      { type: 'table', label: 'Table', color: 'bg-blue-500' }, // Visual override
      { type: 'bullets', label: 'Bullets', color: 'bg-blue-500' }, // Visual override
      { type: 'mobile_top_bar', label: 'Mobile / Top', color: 'bg-orange-300' }, // Mixed
      { type: 'no_logo_navigation', label: 'No-logo Nav', color: 'bg-emerald-400' },
      { type: 'articles', label: 'Articles', color: 'bg-blue-500' },
      { type: 'profile', label: 'Profile', color: 'bg-blue-500' },
    ]
  },
  {
    name: "Red Group (Features/CTA)",
    tools: [
      { type: 'features', label: 'Features', color: 'bg-rose-400' },
      { type: 'cards', label: 'Cards', color: 'bg-red-400' },
      { type: 'cta', label: 'CTA', color: 'bg-red-400' },
      { type: 'cta_image', label: 'CTA & Image', color: 'bg-red-400' },
      { type: 'slider_cards', label: 'Slider Cards', color: 'bg-red-400' },
      { type: 'buttons_left_aligned', label: 'Buttons Left', color: 'bg-red-400' },
      { type: 'hero_arrows', label: 'Hero Arrows', color: 'bg-sky-500' },
    ]
  },
  {
    name: "Orange Group (Forms)",
    tools: [
      { type: 'text_form', label: 'Text & Form', color: 'bg-orange-300' },
      { type: 'form', label: 'Form', color: 'bg-orange-300' },
      { type: 'sign_in', label: 'Sign In', color: 'bg-orange-300' },
      { type: 'text_sidebar_form', label: 'Text & Sidebar', color: 'bg-orange-300' },
      { type: 'hamburger', label: 'Hamburger', color: 'bg-orange-300' },
      { type: 'upload_button', label: 'Upload Button', color: 'bg-orange-300' },
      { type: 'next', label: 'Next', color: 'bg-orange-300' },
      { type: 'radiobuttons', label: 'Radiobuttons', color: 'bg-orange-300' },
      { type: 'toggles', label: 'Toggles', color: 'bg-orange-300' },
    ]
  },
  {
    name: "Purple Group (Dividers)",
    tools: [
       { type: 'divider', label: 'Divider', color: 'bg-purple-400' },
       { type: 'footer', label: 'Footer', color: 'bg-purple-400' },
       { type: 'loading', label: 'Loading', color: 'bg-purple-400' },
       { type: 'audio', label: 'Audio', color: 'bg-blue-500' },
       { type: 'post_thread', label: 'Post Thread', color: 'bg-blue-500' },
    ]
  },
  {
    name: "Cyan/Blue Group (Misc)",
    tools: [
       { type: 'map_contacts', label: 'Map + Contacts', color: 'bg-blue-500' },
       { type: 'table_of_contents', label: 'Table of Contents', color: 'bg-blue-500' },
       { type: 'invoice', label: 'Invoice', color: 'bg-blue-500' },
       { type: 'checklist', label: 'Checklist', color: 'bg-blue-500' },
       { type: 'steps', label: 'Steps', color: 'bg-blue-500' },
       { type: 'accordion', label: 'Accordion', color: 'bg-blue-500' },
       { type: 'chart', label: 'Chart', color: 'bg-blue-500' },
       { type: 'catalog', label: 'Catalog', color: 'bg-blue-500' },
       { type: 'plans', label: 'Plans', color: 'bg-blue-500' },
       { type: 'carousel', label: 'Carousel', color: 'bg-blue-500' },
       { type: 'faq', label: 'FAQ', color: 'bg-blue-500' },
       { type: 'timeline', label: 'Timeline', color: 'bg-blue-500' },
       { type: 'pagination', label: 'Pagination', color: 'bg-emerald-400' },
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
                        <div className="grid grid-cols-2 gap-2">
                            {group.tools.map((tool) => (
                                <button
                                    key={tool.type}
                                    onClick={() => handleToolClick(tool.type)}
                                    className={`
                                      flex flex-col items-start gap-2 p-2 rounded border border-slate-200 bg-white 
                                      hover:border-primary/50 hover:shadow-md transition-all group text-left relative overflow-hidden h-[60px]
                                      ${tool.color.replace('bg-', 'hover:bg-').replace('400', '50').replace('500', '50').replace('300', '50')}
                                    `}
                                >
                                    <div className={`absolute top-0 left-0 w-1 h-full ${tool.color}`}></div>
                                    <span className="text-[11px] font-medium text-slate-600 group-hover:text-slate-900 ml-2 z-10 leading-tight">
                                      {tool.label}
                                    </span>
                                    {/* Abstract representation background */}
                                    <div className={`absolute -right-2 -bottom-2 w-12 h-12 ${tool.color} opacity-10 rounded-full group-hover:scale-150 transition-transform`}></div>
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
