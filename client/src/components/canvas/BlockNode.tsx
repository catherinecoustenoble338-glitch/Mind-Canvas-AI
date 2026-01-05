import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useAppStore, BlockData } from '@/store/useAppStore';
import WireframeVisual from './WireframeVisual';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

const CustomBlockNode = ({ id, data, selected }: NodeProps<BlockData>) => {
  const { viewMode, removeIconFromNode } = useAppStore();

  return (
    <div 
      className={cn(
        "relative rounded-sm transition-all duration-200 group bg-transparent flex flex-col items-center",
        viewMode === 'visual' ? "w-[180px]" : "w-[160px]"
      )}
    >
      {/* Handles - Keep them subtle */}
      <Handle type="target" position={Position.Top} className="!bg-slate-300 !w-2 !h-2 !-top-2 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle type="source" position={Position.Bottom} className="!bg-slate-300 !w-2 !h-2 !-bottom-2 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* TECH STACK STRIP (Top, detached) */}
      {data.icons && data.icons.length > 0 && (
         <div className="flex flex-wrap justify-center gap-1 mb-2 max-w-full">
            {data.icons.map((icon, i) => (
              <div key={i} className="group/icon relative">
                 <img 
                    src={`https://cdn.simpleicons.org/${icon.toLowerCase().replace(/\s+/g, '')}`} 
                    alt={icon} 
                    className="w-5 h-5 opacity-80 hover:opacity-100 transition-opacity"
                    onError={(e) => {
                        // Fallback to text if icon not found
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                 />
                 <span className="hidden text-[10px] font-bold text-slate-500 bg-white px-1 rounded border border-slate-200">{icon.substring(0,2)}</span>
                 
                 {/* Delete button on hover */}
                 {selected && (
                   <div 
                     className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 cursor-pointer opacity-0 group-hover/icon:opacity-100 shadow-sm z-10"
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
      )}

      {/* PAGE CONTAINER */}
      <div className={cn(
         "w-full bg-white rounded-sm overflow-hidden shadow-sm border transition-colors",
         selected ? "border-primary ring-1 ring-primary shadow-md" : "border-slate-200 hover:border-slate-300"
      )}>
         
         {/* HEADER / TITLE */}
         <div className="bg-white border-b border-slate-100 px-3 py-2 text-center">
            <span className="text-xs font-semibold text-slate-700 block truncate">{data.label}</span>
         </div>

         {/* BLOCKS STACK */}
         <div className="flex flex-col w-full bg-slate-50 min-h-[40px]">
            {data.blocks.map((block) => (
               <div key={block.id} className="w-full relative group/block">
                  <WireframeVisual type={block.type} />
                  
                  {/* Block Hover Actions (Optional, for future: delete block, move block) */}
                  {selected && (
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/block:opacity-100 pointer-events-none transition-opacity" />
                  )}
               </div>
            ))}
            {data.blocks.length === 0 && (
               <div className="py-4 text-center text-[10px] text-slate-400 italic">
                  Empty Page
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default memo(CustomBlockNode);
