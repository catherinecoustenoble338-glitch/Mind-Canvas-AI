import React, { memo, useCallback, useState } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { useAppStore, BlockData, PageStatus } from '@/store/useAppStore';
import WireframeVisual from './WireframeVisual';
import { cn } from '@/lib/utils';
import { X, MoreHorizontal, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';

const CustomBlockNode = ({ id, data, selected }: NodeProps<BlockData>) => {
  const { viewMode, removeIconFromNode, removeBlockFromNode, updateNodeData, updateBlockLabel } = useAppStore();
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

  // Status Colors
  const statusColors: Record<PageStatus, string> = {
    idea: 'bg-slate-100 text-slate-600',
    in_progress: 'bg-blue-100 text-blue-600',
    review: 'bg-purple-100 text-purple-600',
    done: 'bg-emerald-100 text-emerald-600',
    error: 'bg-red-100 text-red-600'
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

  return (
    <div 
      className={cn(
        "relative rounded-sm transition-all duration-200 group bg-transparent flex flex-col items-center",
        viewMode === 'visual' ? "w-[200px]" : "w-[180px]"
      )}
    >
      {/* Handles */}
      <Handle type="target" position={Position.Top} className="!bg-slate-300 !w-2 !h-2 !-top-2 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle type="source" position={Position.Bottom} className="!bg-slate-300 !w-2 !h-2 !-bottom-2 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* TECH STACK STRIP (Top Right Alignment as requested) */}
      <div className="w-full flex justify-end gap-1 mb-1 min-h-[20px]">
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

      {/* PAGE CONTAINER */}
      <div className={cn(
         "w-full bg-white rounded-sm overflow-hidden shadow-sm border transition-colors",
         selected ? "border-primary ring-1 ring-primary shadow-md" : "border-slate-200 hover:border-slate-300"
      )}>
         
         {/* HEADER / STATUS BAR */}
         <div className="bg-white border-b border-slate-100 flex items-center justify-between px-2 py-1.5">
            {/* Status Dropdown (Left) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider hover:opacity-80 flex items-center gap-1 transition-colors", statusColors[data.status])}>
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

            {/* Page Label (Right/Center) */}
            <span className="text-xs font-semibold text-slate-700 truncate ml-2">{data.label}</span>
         </div>

         {/* BLOCKS STACK */}
         <div className="flex flex-col w-full bg-slate-50 min-h-[40px] gap-px border-t border-slate-100">
            {data.blocks.map((block) => (
               <div key={block.id} className="w-full relative group/block">
                  <WireframeVisual type={block.type} />
                  
                  {/* Hover Overlay for Block Name Editing & Actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/block:opacity-100 transition-opacity flex flex-col justify-center items-center p-2 backdrop-blur-[1px]">
                     {editingBlockId === block.id ? (
                        <Input 
                           autoFocus
                           className="h-6 text-xs bg-white text-black text-center"
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
                     ) : (
                        <span 
                           className="text-white text-[10px] font-medium bg-black/50 px-2 py-0.5 rounded cursor-pointer hover:bg-black/70 mb-1"
                           onClick={(e) => {
                              e.stopPropagation();
                              setEditingBlockId(block.id);
                           }}
                        >
                           {block.label || block.type.replace(/_/g, ' ')}
                        </span>
                     )}
                     
                     <div className="flex gap-1 mt-1">
                        <Handle type="target" position={Position.Left} id={`t-${block.id}`} className="!w-2 !h-2 !bg-blue-400 !border-white" />
                        <Handle type="source" position={Position.Right} id={`s-${block.id}`} className="!w-2 !h-2 !bg-blue-400 !border-white" />
                        
                        {selected && (
                           <button 
                              className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors"
                              onClick={(e) => {
                                 e.stopPropagation();
                                 removeBlockFromNode(id, block.id);
                              }}
                           >
                              <TrashIcon />
                           </button>
                        )}
                     </div>
                  </div>
               </div>
            ))}
            {data.blocks.length === 0 && (
               <div className="py-8 text-center text-[10px] text-slate-400 italic">
                  Drop blocks here
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

const TrashIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

export default memo(CustomBlockNode);
