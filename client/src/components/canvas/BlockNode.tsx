import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useAppStore, BlockData } from '@/store/useAppStore';
import { WireframeVisual } from './WireframeVisual';
import { cn } from '@/lib/utils';
import { Box, FileText, Image, LayoutGrid, Type, Video, CreditCard, LayoutTemplate } from 'lucide-react';

const iconsMap: Record<string, any> = {
  hero: LayoutTemplate,
  features: LayoutGrid,
  text: Type,
  gallery: Image,
  form: Box,
  video: Video,
  pricing: CreditCard,
  footer: LayoutTemplate,
};

const CustomBlockNode = ({ id, data, selected }: NodeProps<BlockData>) => {
  const viewMode = useAppStore((state) => state.viewMode);
  const Icon = iconsMap[data.type] || Box;

  return (
    <div 
      className={cn(
        "relative rounded-xl border-2 transition-all duration-200 group bg-white",
        selected ? "border-primary shadow-lg ring-4 ring-primary/10" : "border-transparent shadow-md hover:border-slate-200 hover:shadow-xl",
        viewMode === 'visual' ? "w-[240px]" : "w-[200px]"
      )}
    >
      {/* Handles */}
      <Handle type="target" position={Position.Top} className="opacity-0 group-hover:opacity-100 transition-opacity !bg-primary !w-3 !h-3" />
      <Handle type="source" position={Position.Bottom} className="opacity-0 group-hover:opacity-100 transition-opacity !bg-primary !w-3 !h-3" />

      {/* Header / Title Bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
        <div className="p-1.5 rounded-md bg-white border border-slate-100 shadow-sm text-slate-500">
           <Icon size={14} />
        </div>
        <span className="text-xs font-semibold text-slate-700 truncate flex-1">{data.label}</span>
      </div>

      {/* Content Body */}
      <div className="p-1 bg-white rounded-b-xl overflow-hidden">
        {viewMode === 'visual' ? (
           <div className="relative">
             <WireframeVisual type={data.type} className="h-[140px] shadow-inner" />
             {/* Tech Stack Icons Overlay */}
             {data.icons && data.icons.length > 0 && (
               <div className="absolute bottom-2 right-2 flex gap-1 justify-end flex-wrap max-w-full px-1">
                 {data.icons.map((icon, i) => (
                   <span key={i} className="text-[10px] bg-black/80 text-white px-1.5 py-0.5 rounded shadow-sm backdrop-blur-md">
                     {icon}
                   </span>
                 ))}
               </div>
             )}
           </div>
        ) : (
          <div className="p-3 min-h-[60px] flex flex-col gap-2">
            <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
              {data.description || "No description added."}
            </p>
             {/* Tech Stack Icons List */}
             {data.icons && data.icons.length > 0 && (
               <div className="flex gap-1 flex-wrap mt-auto pt-2 border-t border-slate-50">
                 {data.icons.map((icon, i) => (
                   <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                     {icon}
                   </span>
                 ))}
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(CustomBlockNode);
