import React, { useState } from 'react';
import { useAppStore, PageStatus } from '@/store/useAppStore';
import { cn, getInitials } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { X, CheckCircle2, AlertCircle, Loader2, Eye, Lightbulb, User, FileText, Trash2, AlertTriangle, Target, List } from 'lucide-react';
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
import { Button } from '@/components/ui/button';

interface BlockNodeHeaderProps {
  id: string;
  data: any; // BlockData
  selected: boolean;
  onOpenPageDetails: () => void;
}

export const BlockNodeStatusStrip: React.FC<BlockNodeHeaderProps> = ({ id, data, selected }) => {
  const { updateNodeData, removeIconFromNode, adminUsers } = useAppStore();
  const assigneeUser = adminUsers.find(u => u.id === data.assignee);

  const statusLabels: Record<PageStatus, string> = {
    idea: 'Idea',
    in_progress: 'In Progress',
    review: 'Review',
    done: 'Done',
    error: 'Error'
  };

  const statusIcons: Record<PageStatus, React.ReactNode> = {
    idea: <Lightbulb size={12} />,
    in_progress: <Loader2 size={12} />,
    review: <Eye size={12} />,
    done: <CheckCircle2 size={12} />,
    error: <AlertCircle size={12} />
  };

  const handleStatusChange = (status: PageStatus) => {
    updateNodeData(id, { status });
  };

  return (
      <div className="w-full flex justify-between items-end gap-1 mb-1 min-h-[20px] px-1">
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
                  title={statusLabels[data.status as PageStatus]}
              >
                {statusIcons[data.status as PageStatus]}
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
                data.icons.map((icon: string, i: number) => (
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
  );
};

export const BlockNodeTitle: React.FC<BlockNodeHeaderProps> = ({ id, data, selected, onOpenPageDetails }) => {
  const { updateNodeData, removeNode, showDetails } = useAppStore();
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  return (
      <div className="bg-white border-b border-slate-100 px-[8px] py-2 flex flex-col items-center relative group/header min-h-[36px] rounded-t-[22px] overflow-hidden">
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
                   onOpenPageDetails();
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
                         {data.features.split('\n').map((line: string, i: number) => (
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
             {/* Details/Specs Trigger */}
             <Button 
                size="icon" 
                variant="ghost" 
                className="h-5 w-5 text-slate-300 hover:text-blue-500 opacity-0 group-hover/header:opacity-100 transition-opacity"
                onClick={(e) => {
                   e.stopPropagation();
                   onOpenPageDetails();
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
                        onClick={(e) => e.stopPropagation()} 
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
  );
};

// Backwards compatibility if needed, though I'll update usage
export const BlockNodeHeader: React.FC<BlockNodeHeaderProps> = (props) => {
    return (
        <>
            <BlockNodeStatusStrip {...props} />
            <BlockNodeTitle {...props} />
        </>
    );
};
