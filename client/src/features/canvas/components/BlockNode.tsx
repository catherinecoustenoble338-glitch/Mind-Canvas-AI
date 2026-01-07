import React, { memo, useState, useEffect } from 'react';
import { Handle, Position, NodeProps, useUpdateNodeInternals } from 'reactflow';
import { useAppStore, BlockData, BlockItem as BlockItemType } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import { Reorder } from 'framer-motion';
import { PlusCircle } from 'lucide-react';

import { BlockDetailsDialog } from './BlockDetailsDialog';
import { PageDetailsDialog } from './PageDetailsDialog';
import { BlockNodeStatusStrip, BlockNodeTitle } from './nodes/BlockNodeHeader';
import { BlockItem } from './nodes/BlockItem';

const CustomBlockNode = ({ id, data, selected }: NodeProps<BlockData>) => {
  const { viewMode, showDetails, reorderBlocks, addChildNode, activeBlockId, setActiveBlockId } = useAppStore();
  const updateNodeInternals = useUpdateNodeInternals();
  
  // Dialog States
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [pageDetailsDialogOpen, setPageDetailsDialogOpen] = useState(false);
  const [selectedBlockForDetails, setSelectedBlockForDetails] = useState<BlockItemType | null>(null);
  
  // Mobile/Tap State: Track which block inside this node is "active" (tapped) to show its controls
  const [tappedBlockId, setTappedBlockId] = useState<string | null>(null);

  // Effect to handle external navigation to this node's blocks
  useEffect(() => {
    if (activeBlockId) {
      const block = data.blocks.find(b => b.id === activeBlockId);
      if (block) {
        setSelectedBlockForDetails(block);
        setDetailsDialogOpen(true);
        setActiveBlockId(null); // Reset global trigger
      }
    }
  }, [activeBlockId, data.blocks, setActiveBlockId]);

  // Force update handles when blocks change or view details changes
  useEffect(() => {
    updateNodeInternals(id);
  }, [data.blocks, showDetails, updateNodeInternals, id]);

  const handleReorder = (newOrder: any[]) => {
    reorderBlocks(id, newOrder);
  };

  const openDetails = (block: BlockItemType) => {
      setSelectedBlockForDetails(block);
      setDetailsDialogOpen(true);
  };
  
  const handleBlockTap = (blockId: string) => {
      setTappedBlockId(prev => prev === blockId ? blockId : blockId);
  };

  return (
    <div 
      className={cn(
        "relative rounded-sm transition-all duration-200 group bg-transparent flex flex-col items-center",
        viewMode === 'visual' ? (showDetails ? "w-[400px]" : "w-[200px]") : "w-[200px]" 
      )}
    >
      {/* Handles - Visible on Hover OR when Node is Selected */}
      <Handle 
        type="target" 
        position={Position.Top} 
        className={cn(
            "!bg-slate-300 !w-2 !h-2 !-top-2 transition-opacity",
            selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )} 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className={cn(
            "!bg-slate-300 !w-2 !h-2 !-bottom-2 transition-opacity",
            selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )} 
      />

      {/* TOP STRIP: Status & Icons (Detached) */}
      <BlockNodeStatusStrip 
        id={id}
        data={data}
        selected={selected}
        onOpenPageDetails={() => setPageDetailsDialogOpen(true)}
      />

      {/* PAGE CONTAINER - Unified Card */}
      <div className={cn(
         "w-full bg-white rounded-[24px] overflow-hidden shadow-lg border-2 border-[#74859A] ring-1 ring-black/5 transition-colors flex flex-col",
         selected ? "ring-2 ring-blue-500 ring-offset-2" : "hover:border-[#64748B]" 
      )}>
         
         {/* HEADER TITLE (Now inside the card) */}
         <BlockNodeTitle 
            id={id}
            data={data}
            selected={selected}
            onOpenPageDetails={() => setPageDetailsDialogOpen(true)}
         />

         {/* BLOCKS STACK */}
         <Reorder.Group axis="y" values={data.blocks} onReorder={handleReorder} className={cn("flex flex-col w-full bg-white min-h-[40px]", showDetails ? "p-3 gap-0" : "p-2 gap-1")}>
            {data.blocks.map((block, index) => (
               <BlockItem 
                 key={block.id}
                 block={block}
                 nodeId={id}
                 isLast={index === data.blocks.length - 1}
                 openDetails={openDetails}
                 isActive={tappedBlockId === block.id}
                 onActivate={() => handleBlockTap(block.id)}
               />
            ))}
            {data.blocks.length === 0 && (
               <div className="py-8 text-center text-[10px] text-slate-300 italic">
                  Drop blocks here
               </div>
            )}
         </Reorder.Group>
         
         <div className="h-1 bg-slate-50"></div>
      </div>
      
      {/* Bottom Plus Button (Add Child) - Visible on Hover OR when Selected */}
      <div className={cn(
          "absolute -bottom-5 transition-opacity z-50",
          selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      )}>
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

      {/* Page Details Dialog */}
      <PageDetailsDialog 
         nodeId={id} 
         data={data} 
         open={pageDetailsDialogOpen} 
         onOpenChange={setPageDetailsDialogOpen} 
      />
    </div>
  );
};

export default memo(CustomBlockNode);
