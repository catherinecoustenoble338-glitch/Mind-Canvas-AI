import React, { memo, useCallback, useState } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { useAppStore, BlockData, PageStatus, BlockItem } from '@/store/useAppStore';
import WireframeVisual from './WireframeVisual';
import { cn } from '@/lib/utils';
import { X, MoreHorizontal, ChevronDown, Trash2, GripVertical, MessageSquare, Info, PlusCircle } from 'lucide-react';
import { Reorder, useDragControls } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { BlockDetailsDialog } from './BlockDetailsDialog';
import { Button } from '@/components/ui/button';

const CustomBlockNode = ({ id, data, selected }: NodeProps<BlockData>) => {
  const { viewMode, removeIconFromNode, removeBlockFromNode, updateNodeData, updateBlockLabel, reorderBlocks, addChildNode, removeNode } = useAppStore();
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedBlockForDetails, setSelectedBlockForDetails] = useState<BlockItem | null>(null);

  // Status Colors
  const statusColors: Record<PageStatus, string> = {
    idea: 'bg-slate-100 text-slate-600 border-slate-200',
    in_progress: 'bg-blue-100 text-blue-600 border-blue-200',
    review: 'bg-purple-100 text-purple-600 border-purple-200',
    done: 'bg-emerald-100 text-emerald-600 border-emerald-200',
    error: 'bg-red-100 text-red-600 border-red-200'
  };

  const statusLabels: Record<PageStatus, string> = {
    idea: 'Idea',
    in_progress: 'In Progress',
    review: 'Review',
    done: 'Done',
    error: 'Error'
  };

  const handleStatusChange = (status: PageStatus) => {
    updateNodeData(id, { status });
  };

  const handleReorder = (newOrder: any[]) => {
    reorderBlocks(id, newOrder);
  };

  const openDetails = (block: BlockItem) => {
      setSelectedBlockForDetails(block);
      setDetailsDialogOpen(true);
  };

  return (
    <div 
      className={cn(
        "relative rounded-sm transition-all duration-200 group bg-transparent flex flex-col items-center",
        viewMode === 'visual' ? "w-[200px]" : "w-[200px]" // Consistent width for both modes to accommodate text
      )}
    >
      {/* Handles */}
      <Handle type="target" position={Position.Top} className="!bg-slate-300 !w-2 !h-2 !-top-2 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle type="source" position={Position.Bottom} className="!bg-slate-300 !w-2 !h-2 !-bottom-2 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* TOP STRIP: Status & Icons (Detached) */}
      <div className="w-full flex justify-between items-end gap-1 mb-1 min-h-[20px]">
          {/* Status Dropdown (Left aligned) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider hover:opacity-80 flex items-center gap-1 transition-colors border shadow-sm", statusColors[data.status])}>
                {statusLabels[data.status]}
                <ChevronDown size={8} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-24">
              {(Object.keys(statusLabels) as PageStatus[]).map((status) => (
                <DropdownMenuItem key={status} onClick={() => handleStatusChange(status)} className="text-xs">
                  {statusLabels[status]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Tech Stack Icons (Right aligned) */}
          <div className="flex gap-1 justify-end flex-wrap max-w-[120px]">
            {data.icons && data.icons.map((icon, i) => (
                <div key={i} className="group/icon relative bg-white rounded-sm shadow-sm border border-slate-100 p-0.5">
                    <img 
                      src={`https://cdn.simpleicons.org/${icon.toLowerCase().replace(/\s+/g, '')}`} 
                      alt={icon} 
                      className="w-4 h-4 opacity-80"
                    />
                    {selected && (
                      <div 
                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-[1px] cursor-pointer opacity-0 group-hover/icon:opacity-100 z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeIconFromNode(id, icon);
                        }}
                      >
                        <X size={8} />
                      </div>
                    )}
                </div>
            ))}
          </div>
      </div>

      {/* PAGE CONTAINER */}
      <div className={cn(
         "w-full bg-white rounded-xl overflow-hidden shadow-md border-transparent ring-1 ring-black/5 transition-colors",
         selected ? "border-[#3B82F6] shadow-md" : "border-[#3B82F6]/60 hover:border-[#3B82F6]" 
      )}>
         
         {/* HEADER (Title and Delete) */}
         <div className="bg-white border-b border-slate-100 px-2 py-2 flex justify-between items-center group/header">
            {isEditingTitle ? (
               <Input 
                  autoFocus
                  className="h-5 text-[13px] font-bold text-[#3B82F6] px-1 py-0 w-full border-slate-200"
                  defaultValue={data.label}
                  onBlur={(e) => {
                     updateNodeData(id, { label: e.target.value });
                     setIsEditingTitle(false);
                  }}
                  onKeyDown={(e) => {
                     if (e.key === 'Enter') {
                        updateNodeData(id, { label: e.currentTarget.value });
                        setIsEditingTitle(false);
                     }
                  }}
                  onClick={(e) => e.stopPropagation()}
               />
            ) : (
               <span 
                  className="text-[13px] font-bold text-[#3B82F6] block truncate cursor-pointer hover:bg-slate-50 px-1 rounded transition-colors flex-1 mr-2"
                  onClick={(e) => {
                     e.stopPropagation();
                     setIsEditingTitle(true);
                  }}
                  title="Click to rename"
               >
                  {data.label}
               </span>
            )}
            
            {/* Delete Page Button */}
            <Button 
               size="icon" 
               variant="ghost" 
               className="h-5 w-5 text-slate-300 hover:text-red-500 opacity-0 group-hover/header:opacity-100 transition-opacity"
               onClick={(e) => {
                  e.stopPropagation();
                  removeNode(id);
               }}
               title="Delete Page"
            >
               <Trash2 size={12} />
            </Button>
         </div>

         {/* BLOCKS STACK */}
         <Reorder.Group axis="y" values={data.blocks} onReorder={handleReorder} className="flex flex-col w-full bg-white p-1 gap-1 min-h-[40px]">
            {data.blocks.map((block) => (
               <Reorder.Item 
                  key={block.id} 
                  value={block} 
                  className="w-full relative group/block rounded-md overflow-hidden nodrag"
                  onPointerDown={(e) => e.stopPropagation()} 
               >
                  {/* EDIT OVERLAY - Only show input when editing label */}
                   {editingBlockId === block.id && (
                      <div className="absolute inset-0 z-20 bg-black/50 flex items-center justify-center p-1">
                        <Input 
                           autoFocus
                           className="h-5 text-[10px] bg-white text-black px-1 py-0 w-full border-slate-200 shadow-lg"
                           defaultValue={block.label || block.type}
                           onBlur={(e) => {
                              updateBlockLabel(id, block.id, e.target.value);
                              setEditingBlockId(null);
                           }}
                           onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                 updateBlockLabel(id, block.id, e.currentTarget.value);
                                 setEditingBlockId(null);
                              }
                           }}
                           onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                   )}

                  {/* CONTENT RENDERING */}
                  <div 
                    onClick={(e) => {
                       e.stopPropagation();
                       setEditingBlockId(block.id);
                    }}
                    className="cursor-pointer hover:brightness-95 transition-all relative"
                  >
                     {viewMode === 'visual' ? (
                        <WireframeVisual type={block.type} label={block.label} />
                     ) : (
                        // BRIEF VIEW: Description Text
                        <div className="w-full bg-slate-50 border border-slate-200 rounded-sm p-3 min-h-[60px] flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-bold text-slate-800 truncate">{block.label}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 leading-relaxed">
                               {block.description ? (
                                  block.description.split('\n').map((line, i) => {
                                     const trimmed = line.trim();
                                     const isBullet = trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•');
                                     
                                     if (isBullet) {
                                        return (
                                           <div key={i} className="flex gap-1.5 ml-1 items-start">
                                              <span className="mt-1 w-1 h-1 rounded-full bg-slate-400 shrink-0 block"></span>
                                              <span className="leading-tight">{trimmed.replace(/^[-*•]\s?/, '')}</span>
                                           </div>
                                        );
                                     }
                                     
                                     return <div key={i} className={cn("leading-tight", i > 0 && "mt-1")}>{line}</div>;
                                  })
                               ) : (
                                  <span className="italic opacity-50">No description provided. Click to add details.</span>
                               )}
                            </div>
                        </div>
                     )}
                  </div>
                  
                  {/* HOVER CONTROLS LAYER */}
                  <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover/block:opacity-100 transition-opacity z-10">
                      {/* Chat / Details Button */}
                      <Button 
                         size="icon" 
                         variant="ghost" 
                         className="h-5 w-5 bg-black/50 hover:bg-black/70 text-white rounded-[2px] backdrop-blur-sm"
                         onClick={(e) => {
                            e.stopPropagation();
                            openDetails(block);
                         }}
                      >
                         <MessageSquare size={10} />
                      </Button>

                      {/* Delete Button */}
                      <Button 
                         size="icon" 
                         variant="ghost" 
                         className="h-5 w-5 bg-red-500/80 hover:bg-red-600 text-white rounded-[2px] backdrop-blur-sm"
                         onClick={(e) => {
                            e.stopPropagation();
                            removeBlockFromNode(id, block.id);
                         }}
                      >
                          <Trash2 size={10} />
                      </Button>
                  </div>

                  {/* Drag Handle (Visible on Hover) - Left side */}
                  <div className="absolute top-1/2 -translate-y-1/2 left-1 opacity-0 group-hover/block:opacity-100 text-white/50 hover:text-white cursor-grab active:cursor-grabbing z-10 drop-shadow-md">
                     <GripVertical size={12} />
                  </div>
                  
                  {/* Connection Handles (Visible on Hover) - Floating outside */}
                  <div className="absolute top-1/2 -translate-y-1/2 -left-2 opacity-0 group-hover/block:opacity-100 transition-opacity z-10">
                     <Handle type="target" position={Position.Left} id={`t-${block.id}`} className="!w-2.5 !h-2.5 !bg-blue-500 !border-2 !border-white shadow-sm" />
                  </div>
                  <div className="absolute top-1/2 -translate-y-1/2 -right-2 opacity-0 group-hover/block:opacity-100 transition-opacity z-10">
                     <Handle type="source" position={Position.Right} id={`s-${block.id}`} className="!w-2.5 !h-2.5 !bg-blue-500 !border-2 !border-white shadow-sm" />
                  </div>
               </Reorder.Item>
            ))}
            {data.blocks.length === 0 && (
               <div className="py-8 text-center text-[10px] text-slate-300 italic">
                  Drop blocks here
               </div>
            )}
         </Reorder.Group>
         
         <div className="h-1 bg-slate-50"></div>
      </div>
      
      {/* Bottom Plus Button (Add Child) - Visible on Hover */}
      <div className="absolute -bottom-5 opacity-0 group-hover:opacity-100 transition-opacity z-50">
        <button 
           className="bg-white hover:bg-slate-50 text-slate-400 hover:text-blue-500 rounded-full shadow-md border border-slate-200 p-1 transition-colors"
           onClick={(e) => {
             e.stopPropagation();
             addChildNode(id);
           }}
           title="Add child page"
        >
           <PlusCircle size={20} />
        </button>
      </div>

      {/* Details Dialog */}
      {selectedBlockForDetails && (
          <BlockDetailsDialog 
             nodeId={id} 
             block={selectedBlockForDetails} 
             open={detailsDialogOpen} 
             onOpenChange={setDetailsDialogOpen} 
          />
      )}
    </div>
  );
};

export default memo(CustomBlockNode);
