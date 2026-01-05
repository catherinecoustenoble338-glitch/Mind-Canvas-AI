import React, { useState, useEffect, useRef } from 'react';
import { useAppStore, BlockItem } from '@/store/useAppStore';
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
import { MessageSquare, Paperclip, Send, FileText, Check, X, Target, List, User, Bot, Loader2, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface BlockDetailsDialogProps {
  nodeId: string;
  block: BlockItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BlockDetailsDialog({ nodeId, block, open, onOpenChange }: BlockDetailsDialogProps) {
  const { updateBlockDescription, updateBlockLabel, updateBlockVFP, updateBlockFeatures, addBlockChatMessage } = useAppStore();
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Local state for editing to allow "Save" action
  const [tempLabel, setTempLabel] = useState(block.label || '');
  const [tempDescription, setTempDescription] = useState(block.description || '');
  const [tempVFP, setTempVFP] = useState(block.vfp || '');
  const [tempFeatures, setTempFeatures] = useState(block.features || '');

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full h-full sm:h-[700px] sm:max-w-[500px] flex flex-col p-0 gap-0 overflow-hidden bg-white sm:rounded-lg rounded-none border-none sm:border">
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
                <TabsList className="grid w-full grid-cols-2 h-8">
                    <TabsTrigger value="specs" className="text-xs">Specs & VFP</TabsTrigger>
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
