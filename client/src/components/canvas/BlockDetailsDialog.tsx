import React, { useState } from 'react';
import { useAppStore, BlockItem } from '@/store/useAppStore';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Paperclip, Send, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BlockDetailsDialogProps {
  nodeId: string;
  block: BlockItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BlockDetailsDialog({ nodeId, block, open, onOpenChange }: BlockDetailsDialogProps) {
  const { updateBlockDescription, addBlockChatMessage } = useAppStore();
  const [messageText, setMessageText] = useState('');

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
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-slate-100 bg-slate-50/50">
          <DialogTitle className="flex items-center gap-2 text-sm font-semibold text-slate-700">
             <span className="bg-slate-200 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider text-slate-500 font-bold">{block.type.replace(/_/g, ' ')}</span>
             {block.label || 'Block Details'}
          </DialogTitle>
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
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-medium text-slate-500">Block Description (Visible in Brief Mode)</label>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 text-[10px] text-blue-500 px-2"
                            onClick={() => {
                                const newDesc = block.description ? block.description + '\n• ' : '• ';
                                updateBlockDescription(nodeId, block.id, newDesc);
                            }}
                        >
                            + Add Bullet
                        </Button>
                    </div>
                    <Textarea 
                        placeholder="Describe the functionality and content of this block... Use - or • for bullets."
                        className="flex-1 resize-none text-sm leading-relaxed p-3 focus-visible:ring-1 bg-slate-50 border-slate-200"
                        value={block.description || ''}
                        onChange={(e) => updateBlockDescription(nodeId, block.id, e.target.value)}
                    />
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
