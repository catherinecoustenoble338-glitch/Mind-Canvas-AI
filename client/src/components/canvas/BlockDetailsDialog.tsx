import React, { useState, useEffect } from 'react';
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
import { MessageSquare, Paperclip, Send, FileText, Check, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BlockDetailsDialogProps {
  nodeId: string;
  block: BlockItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BlockDetailsDialog({ nodeId, block, open, onOpenChange }: BlockDetailsDialogProps) {
  const { updateBlockDescription, updateBlockLabel, addBlockChatMessage } = useAppStore();
  const [messageText, setMessageText] = useState('');
  
  // Local state for editing to allow "Save" action
  const [tempLabel, setTempLabel] = useState(block.label || '');
  const [tempDescription, setTempDescription] = useState(block.description || '');

  // Sync state when dialog opens or block changes
  useEffect(() => {
      if (open) {
          setTempLabel(block.label || '');
          setTempDescription(block.description || '');
      }
  }, [open, block]);

  const handleSave = () => {
      updateBlockLabel(nodeId, block.id, tempLabel);
      updateBlockDescription(nodeId, block.id, tempDescription);
      onOpenChange(false);
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          
          const textarea = e.currentTarget;
          const { selectionStart, selectionEnd, value } = textarea;
          
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

          setTempDescription(newValue);
          
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
    
    // Simulate system response after a delay
    setTimeout(() => {
        addBlockChatMessage(nodeId, block.id, {
            text: "Received. I'll take a look at the attached documents and update the design accordingly.",
            sender: 'system',
        });
    }, 1000);
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
      <DialogContent className="w-full h-full sm:h-[600px] sm:max-w-[500px] flex flex-col p-0 gap-0 overflow-hidden bg-white sm:rounded-lg rounded-none border-none sm:border">
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

        <Tabs defaultValue="description" className="flex-1 flex flex-col overflow-hidden">
            <div className="px-4 pt-2 border-b border-slate-100 bg-white">
                <TabsList className="grid w-full grid-cols-2 h-8">
                    <TabsTrigger value="description" className="text-xs">Description</TabsTrigger>
                    <TabsTrigger value="chat" className="text-xs">Chat & Files</TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="description" className="flex-1 p-4 m-0 overflow-hidden flex flex-col gap-2">
                <div className="space-y-1 flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-medium text-slate-500">Block Requirements</label>
                        <span className="text-[10px] text-slate-400">Press Enter for new bullet</span>
                    </div>
                    <Textarea 
                        placeholder="Describe what this block should do...
- Start with a dash for lists
- Press Enter to continue list"
                        className="flex-1 resize-none text-sm leading-relaxed p-3 focus-visible:ring-1 bg-slate-50/50 border-slate-200 focus:bg-white transition-colors"
                        value={tempDescription}
                        onChange={(e) => setTempDescription(e.target.value)}
                        onKeyDown={handleDescriptionKeyDown}
                    />
                </div>
                <div className="flex justify-end pt-2">
                    <Button size="sm" onClick={handleSave} className="gap-1 bg-blue-600 hover:bg-blue-700">
                        <Check size={14} />
                        Save Changes
                    </Button>
                </div>
            </TabsContent>

            <TabsContent value="chat" className="flex-1 flex flex-col m-0 overflow-hidden">
                <ScrollArea className="flex-1 p-4 bg-slate-50/30">
                    <div className="space-y-4">
                        {(!block.chatMessages || block.chatMessages.length === 0) && (
                            <div className="text-center text-xs text-slate-400 py-10 italic">
                                No messages yet. Start a discussion or upload files for this block.
                            </div>
                        )}
                        {block.chatMessages?.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-lg p-3 text-sm ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white border border-slate-200 text-slate-700 shadow-sm'}`}>
                                    {msg.text}
                                    {msg.attachments && msg.attachments.length > 0 && (
                                        <div className="mt-2 space-y-1">
                                            {msg.attachments.map((file, i) => (
                                                <div key={i} className={`flex items-center gap-2 text-xs p-1.5 rounded ${msg.sender === 'user' ? 'bg-white/20' : 'bg-slate-100'}`}>
                                                    <FileText size={12} />
                                                    <span className="truncate">{file}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className={`text-[9px] mt-1 text-right ${msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <div className="p-3 bg-white border-t border-slate-100 flex gap-2 items-center">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-500" onClick={handleFileUpload}>
                        <Paperclip size={16} />
                    </Button>
                    <Input 
                        placeholder="Type a message..." 
                        className="h-8 text-sm bg-slate-50 border-slate-200 focus-visible:ring-1"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button size="icon" className="h-8 w-8 bg-blue-500 hover:bg-blue-600" onClick={handleSendMessage}>
                        <Send size={14} />
                    </Button>
                </div>
            </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
