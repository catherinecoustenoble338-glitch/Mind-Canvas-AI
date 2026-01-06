import React, { useState } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { useAppStore, BlockItem as BlockItemType } from '@/store/useAppStore';
import WireframeVisual from '../WireframeVisual';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GripVertical, MessageSquare, Trash2 } from 'lucide-react';
import { Handle, Position } from 'reactflow';

interface BlockItemProps {
  block: BlockItemType;
  nodeId: string;
  isLast: boolean;
  openDetails: (block: BlockItemType) => void;
  isActive: boolean;
  onActivate: () => void;
}

export const BlockItem: React.FC<BlockItemProps> = ({ block, nodeId, isLast, openDetails, isActive, onActivate }) => {
  const { updateBlockLabel, removeBlockFromNode, showDetails, viewMode } = useAppStore();
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const dragControls = useDragControls();

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeBlockFromNode(nodeId, block.id);
  };

  return (
    <Reorder.Item 
        value={block} 
        className={cn(
            "w-full relative group/block rounded-md nodrag transition-colors",
            isActive && "bg-slate-50 ring-1 ring-blue-100"
        )}
        dragListener={false}
        dragControls={dragControls}
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
                    updateBlockLabel(nodeId, block.id, e.target.value);
                    setEditingBlockId(null);
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        updateBlockLabel(nodeId, block.id, e.currentTarget.value);
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
            
            // Interaction Logic:
            // 1. If not active, activate it (show controls).
            // 2. If already active:
            //    - If Visual Mode: Enable editing.
            //    - If Details Mode: Open details.
            
            if (!isActive) {
                onActivate();
                return; 
            }

            // Only proceed to actions if already active
            if (!showDetails) {
                setEditingBlockId(block.id);
            } else {
                openDetails(block);
            }
        }}
        className="cursor-pointer hover:brightness-95 transition-all relative flex gap-4 items-start"
        >
            {/* LEFT SIDE: Visual */}
            <div className="w-full flex-1 min-w-0">
                <WireframeVisual type={block.type} label={block.label} />
            </div>
            
            {/* RIGHT SIDE: DETAILS (Within Flow) */}
            {showDetails && (
            <div className="w-[160px] shrink-0 flex flex-col gap-1.5 text-left border-l border-dashed border-slate-200 pl-4 min-h-[40px] pt-0">
                    {/* VFP */}
                    {(block.vfp) && (
                    <div className="text-[10px] font-medium text-slate-700 leading-tight">
                        {block.vfp}
                    </div>
                    )}
                    
                    {/* Features */}
                    {(block.features) && (
                    <div className="text-[9px] text-slate-500 leading-tight">
                        <div className="flex flex-col gap-0.5">
                        {block.features.split('\n').slice(0, 5).map((line, i) => (
                            <div key={i} className="flex gap-1 items-start">
                                <span className="mt-1 w-0.5 h-0.5 rounded-full bg-slate-400 shrink-0"></span>
                                <span className="truncate">{line.replace(/^[-*•]\s?/, '')}</span>
                            </div>
                        ))}
                        {block.features.split('\n').length > 5 && <span className="text-[8px] text-slate-400 pl-1.5 italic">more...</span>}
                        </div>
                    </div>
                    )}
                    
                    {!block.vfp && !block.features && (
                    <span className="text-[9px] text-slate-300 italic">No details...</span>
                    )}
            </div>
            )}
        </div>
        
        {/* SEPARATOR (Only in Details Mode, and NOT for the last item) */}
        {showDetails && !isLast && <div className="w-full h-px bg-slate-100 my-3" />}
        
        {/* HOVER CONTROLS LAYER - Visible on Hover OR when Active */}
        <div className={cn(
            "absolute top-1 right-1 flex gap-1 transition-opacity z-10",
            isActive ? "opacity-100" : "opacity-0 group-hover/block:opacity-100"
        )}>
            {/* Chat / Details Button */}
            <Button 
                size="icon" 
                variant="ghost" 
                className="h-5 w-5 bg-black/50 hover:bg-black/70 text-white rounded-[2px] backdrop-blur-sm"
                onClick={(e) => {
                e.stopPropagation();
                openDetails(block);
                }}
                title="Details & Chat"
            >
                <MessageSquare size={10} className={cn(block.chatMessages && block.chatMessages.length > 0 ? "text-blue-300" : "text-white")} />
            </Button>

            {/* Delete Button */}
            <Button 
                size="icon" 
                variant="ghost" 
                className="h-5 w-5 bg-red-500/80 hover:bg-red-600 text-white rounded-[2px] backdrop-blur-sm"
                onClick={handleRemove}
                title="Remove Block"
            >
                <Trash2 size={10} />
            </Button>
        </div>

        {/* Drag Handle (Visible on Hover/Active) - Left side */}
        <div 
            className={cn(
                "absolute top-1/2 -left-3 -translate-y-1/2 cursor-grab active:cursor-grabbing transition-opacity p-1 hover:bg-slate-100 rounded",
                isActive ? "opacity-100" : "opacity-0 group-hover/block:opacity-100"
            )}
            onPointerDown={(e) => dragControls.start(e)}
        >
            <GripVertical size={14} className="text-slate-400" />
        </div>

        {/* Connection Handles (Visible on Hover/Active) - Floating outside */}
        <div className={cn(
            "absolute top-1/2 -translate-y-1/2 -left-2 transition-opacity z-10",
            isActive ? "opacity-100" : "opacity-0 group-hover/block:opacity-100"
        )}>
            <Handle type="target" position={Position.Left} id={`t-${block.id}`} className="!w-2.5 !h-2.5 !bg-blue-500 !border-2 !border-white shadow-sm" />
        </div>
        <div className={cn(
            "absolute top-1/2 -translate-y-1/2 -right-2 transition-opacity z-10",
            isActive ? "opacity-100" : "opacity-0 group-hover/block:opacity-100"
        )}>
            <Handle type="source" position={Position.Right} id={`s-${block.id}`} className="!w-2.5 !h-2.5 !bg-blue-500 !border-2 !border-white shadow-sm" />
        </div>
    </Reorder.Item>
  );
};
