import React, { useState, useEffect, useRef } from 'react';
import { useAppStore, BlockItem, Task, TeamMember } from '@/store/useAppStore';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Paperclip, Send, FileText, Check, X, Target, List, User, Bot, Loader2, Sparkles, Plus, Calendar, Clock, CheckCircle2, Circle, AlertCircle, LayoutList, BarChart3, UserPlus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface BlockDetailsDialogProps {
  nodeId: string;
  block: BlockItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BlockDetailsDialog({ nodeId, block, open, onOpenChange }: BlockDetailsDialogProps) {
  const { updateBlockDescription, updateBlockLabel, updateBlockVFP, updateBlockFeatures, addBlockChatMessage, addTask, updateTask, removeTask, addTaskChatMessage, teamMembers } = useAppStore();
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Local state for editing to allow "Save" action
  const [tempLabel, setTempLabel] = useState(block.label || '');
  const [tempDescription, setTempDescription] = useState(block.description || '');
  const [tempVFP, setTempVFP] = useState(block.vfp || '');
  const [tempFeatures, setTempFeatures] = useState(block.features || '');

  // Task State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [taskViewMode, setTaskViewMode] = useState<'list' | 'gantt'>('list');

  // Sync state when dialog opens or block changes
  useEffect(() => {
      if (open) {
          setTempLabel(block.label || '');
          setTempDescription(block.description || '');
          setTempVFP(block.vfp || '');
          setTempFeatures(block.features || '');
      }
  }, [open, block]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [block.chatMessages, isTyping, open]);

  const handleSave = () => {
      updateBlockLabel(nodeId, block.id, tempLabel);
      updateBlockDescription(nodeId, block.id, tempDescription);
      updateBlockVFP(nodeId, block.id, tempVFP);
      updateBlockFeatures(nodeId, block.id, tempFeatures);
      onOpenChange(false);
  };

  const handleBulletListKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          
          const textarea = e.currentTarget;
          const { selectionStart, selectionEnd } = textarea;
          
          // Find the current line
          const lastNewline = value.lastIndexOf('\n', selectionStart - 1);
          const currentLineStart = lastNewline === -1 ? 0 : lastNewline + 1;
          const currentLine = value.substring(currentLineStart, selectionStart);
          
          // Check if current line starts with a bullet
          const bulletMatch = currentLine.match(/^(\s*)([-*•]\s?)(.*)/);
          
          let newValue = value;
          let newCursorPos = selectionStart + 1; // Default is just newline

          if (bulletMatch) {
              const [_, indent, bullet, content] = bulletMatch;
              
              if (content.trim() === '') {
                  // Empty bullet line -> remove bullet (exit list mode)
                  const lineEnd = value.indexOf('\n', selectionStart);
                  const afterCursor = lineEnd === -1 ? '' : value.substring(lineEnd); // Keep rest of text if any
                  
                  newValue = value.substring(0, currentLineStart) + afterCursor.replace(/^\n/, ''); // Remove the line entirely effectively
                  newCursorPos = currentLineStart;
              } else {
                  // Content exists -> continue list
                  const nextBullet = `\n${indent}${bullet}`;
                  newValue = value.substring(0, selectionStart) + nextBullet + value.substring(selectionEnd);
                  newCursorPos = selectionStart + nextBullet.length;
              }
          } else {
              // Normal newline
              newValue = value.substring(0, selectionStart) + '\n' + value.substring(selectionEnd);
          }

          setter(newValue);
          
          // Need to manually set cursor position after render cycle
          setTimeout(() => {
              textarea.selectionStart = textarea.selectionEnd = newCursorPos;
          }, 0);
      }
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    addBlockChatMessage(nodeId, block.id, {
      text: messageText,
      sender: 'user',
    });
    setMessageText('');
    setIsTyping(true);
    
    // Simulate system response after a delay
    setTimeout(() => {
        setIsTyping(false);
        addBlockChatMessage(nodeId, block.id, {
            text: "Received. I'll take a look at the attached documents and update the design accordingly.",
            sender: 'system',
        });
    }, 1500);
  };
  
  const handleFileUpload = () => {
      // Mock file upload
      addBlockChatMessage(nodeId, block.id, {
        text: 'Uploaded: requirements_doc_v2.pdf',
        sender: 'user',
        attachments: ['requirements_doc_v2.pdf']
      });
  };

  const handleAddTask = () => {
      if (!newTaskTitle.trim()) return;
      addTask(nodeId, block.id, {
          title: newTaskTitle,
          status: 'todo',
          priority: 'medium',
          startDate: Date.now(),
          endDate: Date.now() + 86400000 * 3 // 3 days default
      });
      setNewTaskTitle('');
  };

  const getStatusColor = (status: Task['status']) => {
      switch(status) {
          case 'todo': return 'bg-slate-100 text-slate-600 border-slate-200';
          case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200';
          case 'review': return 'bg-purple-100 text-purple-700 border-purple-200';
          case 'done': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
          default: return 'bg-slate-100 text-slate-600';
      }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full h-full sm:h-[800px] sm:max-w-[700px] flex flex-col p-0 gap-0 overflow-hidden bg-white sm:rounded-lg rounded-none border-none sm:border">
        <DialogHeader className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between space-y-0">
          <div className="flex-1 mr-4">
             <div className="flex items-center gap-2 mb-1">
                 <span className="bg-slate-200 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider text-slate-500 font-bold shrink-0">{block.type.replace(/_/g, ' ')}</span>
             </div>
             <Input 
                value={tempLabel}
                onChange={(e) => setTempLabel(e.target.value)}
                className="h-8 font-semibold text-slate-700 border-transparent hover:border-slate-200 focus:border-blue-500 px-1 -ml-1 text-base bg-transparent shadow-none"
                placeholder="Block Name"
             />
          </div>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="sm:hidden -mr-2 text-slate-400">
             <X size={20} />
          </Button>
        </DialogHeader>

        <Tabs defaultValue="specs" className="flex-1 flex flex-col overflow-hidden">
            <div className="px-4 pt-2 border-b border-slate-100 bg-white">
                <TabsList className="grid w-full grid-cols-3 h-8">
                    <TabsTrigger value="specs" className="text-xs">Specs & VFP</TabsTrigger>
                    <TabsTrigger value="tasks" className="text-xs">Tasks & Plan</TabsTrigger>
                    <TabsTrigger value="chat" className="text-xs">Chat & Files</TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="specs" className="flex-1 p-0 m-0 overflow-hidden flex flex-col">
                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-4">
                        {/* Valuable Final Product Section */}
                        <div className="space-y-2">
                           <div className="flex items-center gap-2">
                               <Target size={14} className="text-emerald-600" />
                               <label className="text-sm font-semibold text-slate-800">Ценный Конечный Продукт (ЦКП)</label>
                           </div>
                           <p className="text-xs text-slate-500 mb-2">Каков конкретный результат или ценность этого блока?</p>
                           <Textarea 
                               placeholder="например: Пользователь подписывается на рассылку"
                               className="resize-none text-sm p-3 focus-visible:ring-1 bg-emerald-50/30 border-emerald-100 focus:bg-white focus:border-emerald-500 transition-colors min-h-[60px]"
                               value={tempVFP}
                               onChange={(e) => setTempVFP(e.target.value)}
                           />
                        </div>

                        {/* Features List Section */}
                        <div className="space-y-2">
                           <div className="flex items-center gap-2">
                               <List size={14} className="text-blue-600" />
                               <label className="text-sm font-semibold text-slate-800">Список Фич</label>
                           </div>
                           <div className="flex justify-between items-center mb-1">
                               <p className="text-xs text-slate-500">Ключевые функциональные требования.</p>
                               <span className="text-[10px] text-slate-400">Enter для новой строки</span>
                           </div>
                           <Textarea 
                               placeholder="- Фича 1
- Фича 2"
                               className="resize-none text-sm p-3 focus-visible:ring-1 bg-blue-50/30 border-blue-100 focus:bg-white focus:border-blue-500 transition-colors min-h-[120px]"
                               value={tempFeatures}
                               onChange={(e) => setTempFeatures(e.target.value)}
                               onKeyDown={(e) => handleBulletListKeyDown(e, setTempFeatures, tempFeatures)}
                           />
                        </div>

                        {/* Description / Notes Section */}
                        <div className="space-y-2">
                           <div className="flex items-center gap-2">
                               <FileText size={14} className="text-slate-600" />
                               <label className="text-sm font-semibold text-slate-800">Дополнительные Заметки</label>
                           </div>
                           <Textarea 
                               placeholder="Любые дополнительные технические заметки..."
                               className="resize-none text-sm p-3 focus-visible:ring-1 bg-slate-50/50 border-slate-200 focus:bg-white transition-colors min-h-[80px]"
                               value={tempDescription}
                               onChange={(e) => setTempDescription(e.target.value)}
                               onKeyDown={(e) => handleBulletListKeyDown(e, setTempDescription, tempDescription)}
                           />
                        </div>
                    </div>
                </ScrollArea>
                
                <div className="p-4 border-t border-slate-100 bg-white">
                    <Button onClick={handleSave} className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
                        <Check size={16} />
                        Сохранить спецификации
                    </Button>
                </div>
            </TabsContent>

            <TabsContent value="tasks" className="flex-1 p-0 m-0 overflow-hidden flex flex-col bg-slate-50/50">
               <div className="p-3 border-b border-slate-100 bg-white flex justify-between items-center gap-2">
                   <div className="flex gap-1 bg-slate-100 p-1 rounded-md">
                       <Button 
                          size="sm" 
                          variant="ghost" 
                          className={cn("h-7 px-2 text-xs", taskViewMode === 'list' && "bg-white shadow-sm")}
                          onClick={() => setTaskViewMode('list')}
                       >
                           <LayoutList size={14} className="mr-1.5" /> List
                       </Button>
                       <Button 
                          size="sm" 
                          variant="ghost" 
                          className={cn("h-7 px-2 text-xs", taskViewMode === 'gantt' && "bg-white shadow-sm")}
                          onClick={() => setTaskViewMode('gantt')}
                       >
                           <BarChart3 size={14} className="mr-1.5" /> Gantt
                       </Button>
                   </div>
                   
                   <div className="flex items-center gap-2 flex-1 max-w-xs">
                       <Input 
                          placeholder="New task..." 
                          className="h-8 text-xs bg-slate-50 border-slate-200"
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                       />
                       <Button size="icon" className="h-8 w-8 bg-slate-800 hover:bg-slate-900 shrink-0" onClick={handleAddTask}>
                           <Plus size={14} />
                       </Button>
                   </div>
               </div>
               
               <ScrollArea className="flex-1">
                   <div className="p-4">
                       {(!block.tasks || block.tasks.length === 0) ? (
                           <div className="flex flex-col items-center justify-center py-10 opacity-50">
                               <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                   <CheckCircle2 size={24} className="text-slate-400" />
                               </div>
                               <p className="text-sm font-medium text-slate-600">No tasks created yet</p>
                               <p className="text-xs text-slate-400 text-center max-w-[200px] mt-1">Break down this block into actionable tasks.</p>
                           </div>
                       ) : taskViewMode === 'list' ? (
                           <div className="space-y-2">
                               {block.tasks.map(task => (
                                   <div key={task.id} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow group">
                                       <div className="flex items-start justify-between gap-3">
                                           <div className="flex items-start gap-3 flex-1">
                                               <div className={cn("mt-1 shrink-0", 
                                                   task.status === 'done' ? "text-emerald-500" : "text-slate-300"
                                               )}>
                                                   {task.status === 'done' ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                                               </div>
                                               <div className="flex-1 min-w-0">
                                                   <Input 
                                                       className="h-7 p-0 border-none shadow-none text-sm font-medium focus-visible:ring-0"
                                                       value={task.title}
                                                       onChange={(e) => updateTask(nodeId, block.id, task.id, { title: e.target.value })}
                                                   />
                                                   <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                                       <span className="flex items-center gap-1">
                                                           <Calendar size={10} />
                                                           {task.endDate ? format(task.endDate, 'MMM d') : '-'}
                                                       </span>
                                                       {task.assignee && (
                                                           <span className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded-full">
                                                               <User size={10} />
                                                               {teamMembers.find(m => m.id === task.assignee)?.name || 'Unknown'}
                                                           </span>
                                                       )}
                                                       <Popover>
                                                          <PopoverTrigger asChild>
                                                              <Button variant="ghost" size="sm" className="h-5 px-1 text-[10px] text-slate-400 hover:text-blue-500">
                                                                  <MessageSquare size={10} className="mr-1" />
                                                                  {task.chatMessages?.length || 0}
                                                              </Button>
                                                          </PopoverTrigger>
                                                          <PopoverContent className="w-64 p-3" align="start">
                                                              <h4 className="font-semibold text-xs mb-2">Task Comments</h4>
                                                              <div className="max-h-40 overflow-y-auto space-y-2 mb-2">
                                                                  {task.chatMessages?.map((msg, idx) => (
                                                                      <div key={idx} className="bg-slate-50 p-2 rounded text-xs">
                                                                          <p>{msg.text}</p>
                                                                          <span className="text-[9px] text-slate-400 block mt-0.5">{format(msg.timestamp, 'HH:mm')}</span>
                                                                      </div>
                                                                  ))}
                                                                  {(!task.chatMessages || task.chatMessages.length === 0) && <p className="text-xs text-slate-400 italic">No comments yet.</p>}
                                                              </div>
                                                              <div className="flex gap-1">
                                                                  <Input placeholder="Comment..." className="h-7 text-xs" onKeyDown={(e) => {
                                                                      if (e.key === 'Enter') {
                                                                          addTaskChatMessage(nodeId, block.id, task.id, {
                                                                              text: e.currentTarget.value,
                                                                              sender: 'user'
                                                                          });
                                                                          e.currentTarget.value = '';
                                                                      }
                                                                  }} />
                                                              </div>
                                                          </PopoverContent>
                                                       </Popover>
                                                   </div>
                                               </div>
                                           </div>
                                           
                                           <div className="flex items-center gap-2">
                                               <Select 
                                                  value={task.status} 
                                                  onValueChange={(val: any) => updateTask(nodeId, block.id, task.id, { status: val })}
                                               >
                                                  <SelectTrigger className={cn("h-7 text-[10px] w-[110px] uppercase font-bold tracking-wider", getStatusColor(task.status))}>
                                                      <SelectValue />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                      <SelectItem value="todo">To Do</SelectItem>
                                                      <SelectItem value="in_progress">In Progress</SelectItem>
                                                      <SelectItem value="review">Review</SelectItem>
                                                      <SelectItem value="done">Done</SelectItem>
                                                  </SelectContent>
                                               </Select>
                                               
                                               <Button 
                                                  variant="ghost" 
                                                  size="icon" 
                                                  className="h-7 w-7 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                  onClick={() => removeTask(nodeId, block.id, task.id)}
                                               >
                                                  <X size={14} />
                                               </Button>
                                           </div>
                                       </div>
                                       
                                       {/* Reviewer / Approval UI */}
                                       {task.status === 'review' && (
                                           <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between bg-purple-50/50 p-2 rounded">
                                               <div className="text-xs text-purple-700 flex items-center gap-2">
                                                   <AlertCircle size={12} />
                                                   <span>Ready for review by Admin or {task.reviewer ? teamMembers.find(m => m.id === task.reviewer)?.name : 'Reviewer'}</span>
                                               </div>
                                               <div className="flex gap-2">
                                                   <Button size="sm" className="h-6 text-[10px] bg-emerald-600 hover:bg-emerald-700" onClick={() => updateTask(nodeId, block.id, task.id, { status: 'done' })}>
                                                       Approve
                                                   </Button>
                                                   <Button size="sm" variant="outline" className="h-6 text-[10px] border-purple-200 text-purple-700 hover:bg-purple-100" onClick={() => updateTask(nodeId, block.id, task.id, { status: 'in_progress' })}>
                                                       Reject
                                                   </Button>
                                               </div>
                                           </div>
                                       )}
                                   </div>
                               ))}
                           </div>
                       ) : (
                           <div className="space-y-1">
                               {/* Simple Gantt Visualization */}
                               <div className="flex border-b border-slate-200 pb-2 mb-2">
                                   <div className="w-1/4 text-xs font-semibold text-slate-500 pl-2">Task</div>
                                   <div className="w-3/4 flex justify-between text-xs text-slate-400 px-2">
                                       <span>Start</span>
                                       <span>Duration</span>
                                       <span>End</span>
                                   </div>
                               </div>
                               {block.tasks.map(task => {
                                   const start = task.startDate || Date.now();
                                   const end = task.endDate || Date.now() + 86400000;
                                   const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                                   
                                   return (
                                       <div key={task.id} className="flex items-center gap-2 group">
                                           <div className="w-1/4 truncate text-xs font-medium text-slate-700 pl-2">{task.title}</div>
                                           <div className="w-3/4 relative h-6 bg-slate-50 rounded overflow-hidden flex items-center">
                                               <div 
                                                   className={cn(
                                                       "absolute h-4 rounded ml-1",
                                                       task.status === 'done' ? "bg-emerald-400" :
                                                       task.status === 'in_progress' ? "bg-blue-400" :
                                                       task.status === 'review' ? "bg-purple-400" : "bg-slate-300"
                                                   )}
                                                   style={{ width: `${Math.min(duration * 10, 90)}%` }} // Mock width logic
                                               ></div>
                                                <span className="relative z-10 text-[9px] text-slate-500 ml-2 pl-[100%] whitespace-nowrap">
                                                    {duration} days
                                                </span>
                                           </div>
                                       </div>
                                   );
                               })}
                           </div>
                       )}
                   </div>
               </ScrollArea>
            </TabsContent>

            <TabsContent value="chat" className="flex-1 flex flex-col m-0 overflow-hidden bg-slate-50/30">
                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                    <div className="space-y-6">
                        {(!block.chatMessages || block.chatMessages.length === 0) && (
                            <div className="flex flex-col items-center justify-center py-10 opacity-50">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                    <MessageSquare size={24} className="text-slate-400" />
                                </div>
                                <p className="text-sm font-medium text-slate-600">No messages yet</p>
                                <p className="text-xs text-slate-400 text-center max-w-[200px] mt-1">Start a discussion or upload files relevant to this block.</p>
                            </div>
                        )}
                        {block.chatMessages?.map((msg) => (
                            <div key={msg.id} className={cn(
                                "flex gap-3 max-w-[90%]",
                                msg.sender === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                            )}>
                                {/* Avatar */}
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm",
                                    msg.sender === 'user' ? "bg-blue-100 border-blue-200 text-blue-600" : "bg-white border-slate-200 text-purple-600"
                                )}>
                                    {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                                </div>

                                {/* Message Bubble */}
                                <div className="flex flex-col gap-1 min-w-0">
                                    <div className={cn(
                                        "rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                                        msg.sender === 'user' 
                                            ? "bg-blue-600 text-white rounded-tr-sm" 
                                            : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm"
                                    )}>
                                        <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                                        
                                        {msg.attachments && msg.attachments.length > 0 && (
                                            <div className="mt-3 space-y-2">
                                                {msg.attachments.map((file, i) => (
                                                    <div key={i} className={cn(
                                                        "flex items-center gap-2 text-xs p-2 rounded-lg border",
                                                        msg.sender === 'user' 
                                                            ? "bg-white/10 border-white/20 text-white" 
                                                            : "bg-slate-50 border-slate-100 text-slate-600"
                                                    )}>
                                                        <div className="p-1 bg-white/20 rounded">
                                                            <FileText size={12} />
                                                        </div>
                                                        <span className="truncate font-medium">{file}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <span className={cn(
                                        "text-[10px] text-slate-400 px-1",
                                        msg.sender === 'user' ? "text-right" : "text-left"
                                    )}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))}
                        
                        {/* Typing Indicator */}
                        {isTyping && (
                             <div className="flex gap-3 max-w-[90%] mr-auto">
                                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 text-purple-600 flex items-center justify-center shrink-0 shadow-sm">
                                    <Sparkles size={14} />
                                </div>
                                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                <div className="p-3 bg-white border-t border-slate-100 flex gap-2 items-end">
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:text-blue-500 shrink-0" onClick={handleFileUpload}>
                        <Paperclip size={18} />
                    </Button>
                    <div className="flex-1 relative">
                        <Textarea 
                            placeholder="Type a message..." 
                            className="min-h-[36px] max-h-[120px] text-sm bg-slate-50 border-slate-200 focus-visible:ring-1 focus-visible:ring-blue-500 resize-none py-2 pr-10"
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            rows={1}
                        />
                    </div>
                    <Button 
                        size="icon" 
                        className={cn(
                            "h-9 w-9 shrink-0 transition-all",
                            messageText.trim() ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-200 text-slate-400 hover:bg-slate-300"
                        )}
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                    >
                        <Send size={16} className={messageText.trim() ? "ml-0.5" : ""} />
                    </Button>
                </div>
            </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
