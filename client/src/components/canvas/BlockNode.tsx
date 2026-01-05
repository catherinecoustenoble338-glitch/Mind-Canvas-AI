/**
 * BlockNode Component
 * 
 * Spacing Roadmap (Details Mode):
 * - Block Spacing: Determined by Separator (my-3 = 12px*2 + 1px = 25px) or Container Padding (p-3 = 12px)
 * - Container Padding: 12px (p-3) in Details Mode
 * - Text Alignment: Top-aligned (pt-0)
 * - Detail Column Width: 160px
 * - Separator: Only between blocks
 * - Horizontal Padding: 16px (pl-4)
 */

import React, { memo, useCallback, useState, useEffect } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { useAppStore, BlockData, PageStatus, BlockItem } from '@/store/useAppStore';
import WireframeVisual from './WireframeVisual';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { X, MoreHorizontal, ChevronDown, Trash2, GripVertical, MessageSquare, Info, PlusCircle, Lightbulb, Loader2, Eye, CheckCircle2, AlertCircle, AlertTriangle, FileText, Target, List, User, Plus, Edit } from 'lucide-react';
import { Reorder, useDragControls } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { BlockDetailsDialog } from './BlockDetailsDialog';
import { PageDetailsDialog } from './PageDetailsDialog';
import { Button } from '@/components/ui/button';

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const CustomBlockNode = ({ id, data, selected }: NodeProps<BlockData>) => {
  const { viewMode, showDetails, removeIconFromNode, removeBlockFromNode, updateNodeData, updateBlockLabel, reorderBlocks, addChildNode, removeNode, activeBlockId, setActiveBlockId, adminUsers } = useAppStore();
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  
  const assigneeUser = adminUsers.find(u => u.id === data.assignee);
  
  // Dialog States
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [pageDetailsDialogOpen, setPageDetailsDialogOpen] = useState(false);
  const [selectedBlockForDetails, setSelectedBlockForDetails] = useState<BlockItem | null>(null);

  // Effect to handle external navigation to this node's blocks (e.g. from Settings > Chats)
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

  const statusIcons: Record<PageStatus, React.ReactNode> = {
    idea: <Lightbulb size={12} />,
    in_progress: <Loader2 size={12} />, // Static loader icon
    review: <Eye size={12} />,
    done: <CheckCircle2 size={12} />,
    error: <AlertCircle size={12} />
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
        // Width adjustment based on showDetails
        // Visual mode: 200px
        // Details mode: 200px + 16px (gap) + 160px (details) + 16px (padding) ~= 400px
        viewMode === 'visual' ? (showDetails ? "w-[400px]" : "w-[200px]") : "w-[200px]" 
      )}
    >
      {/* Handles */}
      <Handle type="target" position={Position.Top} className="!bg-slate-300 !w-2 !h-2 !-top-2 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle type="source" position={Position.Bottom} className="!bg-slate-300 !w-2 !h-2 !-bottom-2 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* TOP STRIP: Status & Icons (Detached) */}
      <div className="w-full flex justify-between items-end gap-1 mb-1 min-h-[20px]">
          {/* Left Group: Assignee & Status Combined */}
          <div className="flex items-center bg-white rounded-full shadow-sm border border-slate-100 p-0.5 gap-0.5 pr-1.5 transition-all hover:shadow-md hover:border-slate-200">
             {/* Assignee Avatar Dropdown */}
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <div 
                   className={cn(
                     "rounded-full cursor-pointer transition-transform hover:scale-105",
                     assigneeUser ? "opacity-100" : "opacity-60 hover:opacity-100"
                   )} 
                   title={assigneeUser ? `Assigned to: ${assigneeUser.name}` : "Click to assign"}
                 >
                   <Avatar className="h-[20px] w-[20px] shadow-sm border-0">
                     <AvatarImage src={assigneeUser?.avatar} alt={assigneeUser?.name} />
                     <AvatarFallback className="text-[8px] font-bold bg-white text-slate-500 border-0">
                       {assigneeUser ? getInitials(assigneeUser.name) : <User size={10} />}
                     </AvatarFallback>
                   </Avatar>
                 </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 ml-2" align="start">
                <DropdownMenuLabel className="text-xs text-slate-500 uppercase tracking-wider">Assignee</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => updateNodeData(id, { assignee: undefined })} className="gap-2 cursor-pointer">
                   <div className="h-6 w-6 rounded-full border border-dashed border-slate-300 flex items-center justify-center bg-slate-50">
                     <X size={12} className="text-slate-400"/>
                   </div>
                   <span className="text-sm">Unassigned</span>
                </DropdownMenuItem>
                {adminUsers.map(user => (
                  <DropdownMenuItem key={user.id} onClick={() => updateNodeData(id, { assignee: user.id })} className="gap-2 cursor-pointer">
                    <Avatar className="h-6 w-6 border border-slate-100">
                       <AvatarImage src={user.avatar} />
                       <AvatarFallback className="text-[9px] bg-slate-100 text-slate-600">{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm truncate">{user.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Status Dropdown (Right of Avatar) */}
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                  className={cn(
                      "text-[9px] font-bold rounded-sm uppercase tracking-wider hover:opacity-80 flex items-center justify-center transition-colors w-[20px] h-[20px] bg-transparent", 
                      data.status === 'idea' ? "text-slate-500" :
                      data.status === 'in_progress' ? "text-blue-500" :
                      data.status === 'review' ? "text-purple-500" :
                      data.status === 'done' ? "text-emerald-500" : "text-red-500"
                  )}
                  title={statusLabels[data.status]}
              >
                {statusIcons[data.status]}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-32">
              {(Object.keys(statusLabels) as PageStatus[]).map((status) => (
                <DropdownMenuItem key={status} onClick={() => handleStatusChange(status)} className="text-xs gap-2 cursor-pointer">
                  {statusIcons[status]}
                  {statusLabels[status]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          </div>

          {/* Tech Stack Icons (Right aligned) - Combined Group */}
          <div className="flex bg-white rounded-full shadow-sm border border-slate-100 p-0.5 px-1.5 gap-1 justify-end flex-wrap max-w-[120px] min-h-[26px] items-center">
            {data.icons && data.icons.length > 0 ? (
                data.icons.map((icon, i) => (
                    <div key={i} className="group/icon relative flex items-center justify-center w-[16px] h-[16px] transition-transform hover:scale-110 cursor-pointer">
                        <img 
                          src={`https://cdn.simpleicons.org/${icon.toLowerCase().replace(/\s+/g, '')}`} 
                          alt={icon} 
                          className="w-3.5 h-3.5 opacity-80 hover:opacity-100"
                          title={icon}
                        />
                        {selected && (
                          <div 
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-2 h-2 flex items-center justify-center opacity-0 group-hover/icon:opacity-100 z-10 shadow-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeIconFromNode(id, icon);
                            }}
                          >
                            <X size={6} />
                          </div>
                        )}
                    </div>
                ))
            ) : (
                <div className="w-3 h-3 rounded-full bg-slate-100"></div>
            )}
          </div>
      </div>

      {/* PAGE CONTAINER */}
      <div className={cn(
         "w-full bg-white rounded-[24px] overflow-hidden shadow-lg border-2 border-[#74859A] ring-1 ring-black/5 transition-colors",
         selected ? "ring-2 ring-blue-500 ring-offset-2" : "hover:border-[#64748B]" 
      )}>
         
         {/* HEADER (Title and Delete) */}
         <div className="bg-white border-b border-slate-100 px-[8px] py-2 flex flex-col items-center relative group/header min-h-[36px] rounded-t-[22px]">
            {/* Title Input/Display - Centered */}
            <div className="w-full px-6 flex justify-center">
                {isEditingTitle ? (
                   <textarea
                      autoFocus
                      className="text-[13px] font-bold text-[#3B82F6] px-1 py-0 w-full border border-slate-200 rounded text-center resize-none bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      defaultValue={data.label}
                      rows={2}
                      onBlur={(e) => {
                         updateNodeData(id, { label: e.target.value });
                         setIsEditingTitle(false);
                      }}
                      onKeyDown={(e) => {
                         if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            updateNodeData(id, { label: e.currentTarget.value });
                            setIsEditingTitle(false);
                         }
                      }}
                      onClick={(e) => e.stopPropagation()}
                   />
                ) : (
                   <span 
                      className="text-[13px] font-bold text-[#3B82F6] block cursor-pointer hover:bg-slate-50 px-1 rounded transition-colors w-full text-center whitespace-normal line-clamp-2 min-h-[20px]"
                      onClick={(e) => {
                         e.stopPropagation();
                         setIsEditingTitle(true);
                      }}
                      title="Click to rename"
                   >
                      {data.label}
                   </span>
                )}
            </div>
            
            {/* VFP & Features for PAGE (Visible in Details Mode) */}
            {showDetails && (
              <div 
                  className="w-full mt-2 pt-2 border-t border-dashed border-slate-100 flex flex-col gap-2 cursor-pointer hover:bg-slate-50/50 p-1 rounded transition-colors group/vfp"
                  onClick={(e) => {
                      e.stopPropagation();
                      setPageDetailsDialogOpen(true);
                  }}
                  title="Click to edit Page Specs"
              >
                 {/* VFP */}
                 <div className="bg-emerald-50 rounded p-1.5 border border-emerald-100 relative">
                    <div className="flex items-center gap-1 mb-1">
                       <Target size={10} className="text-emerald-600" />
                       <span className="text-[9px] font-bold uppercase text-emerald-700 tracking-wider">ЦКП</span>
                    </div>
                    <div className="text-[10px] text-slate-700 leading-tight">
                       {data.vfp || <span className="text-emerald-400 italic">Нажмите, чтобы определить ЦКП...</span>}
                    </div>
                 </div>
                 
                 {/* Features */}
                 <div className="bg-blue-50 rounded p-1.5 border border-blue-100 relative">
                    <div className="flex items-center gap-1 mb-1">
                       <List size={10} className="text-blue-600" />
                       <span className="text-[9px] font-bold uppercase text-blue-700 tracking-wider">Фичи</span>
                    </div>
                    <div className="text-[10px] text-slate-700 leading-tight">
                       {data.features ? (
                          <div className="flex flex-col gap-0.5">
                            {data.features.split('\n').map((line, i) => (
                              <div key={i} className="flex gap-1 items-start">
                                 <span className="mt-1 w-1 h-1 rounded-full bg-blue-400 shrink-0"></span>
                                 <span>{line.replace(/^[-*•]\s?/, '')}</span>
                              </div>
                            ))}
                          </div>
                       ) : (
                          <span className="text-blue-400 italic">Нажмите, чтобы добавить фичи...</span>
                       )}
                    </div>
                 </div>
                 
                 {/* Edit Hint Overlay */}
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/vfp:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-white/90 shadow-sm border border-slate-200 rounded px-2 py-1 text-[10px] font-medium text-slate-600 flex items-center gap-1">
                        <FileText size={10} />
                        Редактировать
                    </div>
                 </div>
              </div>
            )}
            
            {/* Page Header Actions - Absolute Right Overlay */}
            <div className="absolute right-1 top-2 z-10 flex items-center gap-0.5">
                {/* Details/Specs Trigger (Always visible on hover or if Details are hidden but user wants to edit) */}
                <Button 
                   size="icon" 
                   variant="ghost" 
                   className="h-5 w-5 text-slate-300 hover:text-blue-500 opacity-0 group-hover/header:opacity-100 transition-opacity"
                   onClick={(e) => {
                      e.stopPropagation();
                      setPageDetailsDialogOpen(true);
                   }}
                   title="Page Specs & VFP"
                >
                   <FileText size={12} />
                </Button>

                {/* Delete Button */}
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button 
                           size="icon" 
                           variant="ghost" 
                           className="h-5 w-5 text-slate-300 hover:text-red-500 opacity-0 group-hover/header:opacity-100 transition-opacity"
                           onClick={(e) => e.stopPropagation()} // Prevent opening details
                           title="Delete Page"
                        >
                           <Trash2 size={12} />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="text-red-500" size={20} />
                                Delete Page?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete <strong>"{data.label}"</strong>?<br/>
                                <span className="text-red-500 font-medium">All blocks, content, and data inside this page will be permanently lost.</span>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                                className="bg-red-600 hover:bg-red-700"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeNode(id);
                                }}
                            >
                                Delete Permanently
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
         </div>

         {/* BLOCKS STACK */}
         <Reorder.Group axis="y" values={data.blocks} onReorder={handleReorder} className={cn("flex flex-col w-full bg-white min-h-[40px]", showDetails ? "p-3 gap-0" : "p-2 gap-1")}>
            {data.blocks.map((block, index) => (
               <Reorder.Item 
                  key={block.id} 
                  value={block} 
                  className="w-full relative group/block rounded-md nodrag"
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
                       // In Visual, click allows renaming. Details are toggled globally.
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
                  {showDetails && index < data.blocks.length - 1 && <div className="w-full h-px bg-slate-100 my-3" />}
                  
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
