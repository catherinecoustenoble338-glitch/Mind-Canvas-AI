import React, { memo, useCallback, useState } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { useAppStore, BlockData, PageStatus } from '@/store/useAppStore';
import WireframeVisual from './WireframeVisual';
import { cn } from '@/lib/utils';
import { X, MoreHorizontal, ChevronDown, Trash2 } from 'lucide-react';
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
         "w-full bg-white rounded-sm overflow-hidden shadow-sm border transition-colors",
         selected ? "border-primary ring-1 ring-primary shadow-md" : "border-slate-200 hover:border-slate-300"
      )}>
         
         {/* HEADER (Just Title, Left Aligned) */}
         <div className="bg-white border-b border-slate-100 px-2 py-1.5 text-left">
            <span className="text-xs font-bold text-slate-800 block truncate">{data.label}</span>
         </div>

         {/* BLOCKS STACK */}
         <div className="flex flex-col w-full bg-slate-50 min-h-[40px] gap-px border-t border-slate-100">
            {data.blocks.map((block) => (
               <div key={block.id} className="w-full relative group/block">
                  {/* Block Label Bar (Always visible) */}
                  <div className="w-full bg-slate-100/50 border-b border-slate-100/50 px-2 py-0.5 flex justify-between items-center group-hover/block:bg-slate-100 transition-colors">
                     {editingBlockId === block.id ? (
                        <Input 
                           autoFocus
                           className="h-4 text-[10px] bg-white text-black px-1 py-0 w-full border-slate-200"
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
                           className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider truncate cursor-pointer hover:text-primary"
                           onClick={(e) => {
                              e.stopPropagation();
                              setEditingBlockId(block.id);
                           }}
                        >
                           {block.label || block.type.replace(/_/g, ' ')}
                        </span>
                     )}

                     {/* Delete Action (Visible on Hover) */}
                     {selected && (
                        <button 
                           className="opacity-0 group-hover/block:opacity-100 text-slate-400 hover:text-red-500 transition-opacity"
                           onClick={(e) => {
                              e.stopPropagation();
                              removeBlockFromNode(id, block.id);
                           }}
                        >
                           <Trash2 size={10} />
                        </button>
                     )}
                  </div>

                  <WireframeVisual type={block.type} />
                  
                  {/* Connection Handles (Visible on Hover) */}
                  <div className="absolute top-1/2 -translate-y-1/2 -left-1 opacity-0 group-hover/block:opacity-100 transition-opacity z-10">
                     <Handle type="target" position={Position.Left} id={`t-${block.id}`} className="!w-2 !h-2 !bg-blue-400 !border-white shadow-sm" />
                  </div>
                  <div className="absolute top-1/2 -translate-y-1/2 -right-1 opacity-0 group-hover/block:opacity-100 transition-opacity z-10">
                     <Handle type="source" position={Position.Right} id={`s-${block.id}`} className="!w-2 !h-2 !bg-blue-400 !border-white shadow-sm" />
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

export default memo(CustomBlockNode);
