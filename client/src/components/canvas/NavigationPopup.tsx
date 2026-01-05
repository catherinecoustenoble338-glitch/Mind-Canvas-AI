import React, { useState, useMemo } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  Map, 
  MessageSquare, 
  Lightbulb, 
  ShieldCheck, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useLocation } from 'wouter';
import { useAppStore } from '@/store/useAppStore';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export function NavigationPopup() {
  const [, setLocation] = useLocation();
  const { nodes, setActiveBlockId } = useAppStore();
  const [open, setOpen] = useState(false);

  // Aggregate chats (reused logic from Settings)
  const blocksWithChats = useMemo(() => {
    const chats: { 
        nodeId: string, 
        nodeLabel: string, 
        blockId: string, 
        blockLabel: string, 
        blockType: string,
        lastMessage: string, 
        timestamp: number,
        sender: 'user' | 'system',
        unread: boolean 
    }[] = [];

    nodes.forEach(node => {
        node.data.blocks.forEach(block => {
            if (block.chatMessages && block.chatMessages.length > 0) {
                const lastMsg = block.chatMessages[block.chatMessages.length - 1];
                chats.push({
                    nodeId: node.id,
                    nodeLabel: node.data.label,
                    blockId: block.id,
                    blockLabel: block.label || block.type,
                    blockType: block.type,
                    lastMessage: lastMsg.text,
                    timestamp: lastMsg.timestamp,
                    sender: lastMsg.sender,
                    unread: true
                });
            }
        });
    });

    return chats.sort((a, b) => b.timestamp - a.timestamp);
  }, [nodes]);

  const handleChatClick = (blockId: string) => {
      setActiveBlockId(blockId);
      setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-12 w-12 md:h-9 md:w-9 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          title="App Navigation"
        >
           <Menu size={24} className="md:w-[18px] md:h-[18px] md:hidden" />
           <Menu size={18} className="hidden md:block" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
        <div className="flex flex-col">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 rounded-t-md">
                <h4 className="font-semibold text-sm text-slate-800">Navigation</h4>
            </div>
            
            <div className="p-2 space-y-1">
                {/* Admin - Only visible to admins, at the top */}
                <Button 
                    variant="ghost" 
                    className="w-full justify-between h-auto py-3 px-3 hover:bg-slate-50 text-slate-700 mb-2 border-b border-slate-100 rounded-none pb-3"
                    onClick={() => {
                        setLocation('/admin');
                        setOpen(false);
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                            <ShieldCheck size={16} />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-sm font-medium">Admin Dashboard</span>
                            <span className="text-[10px] text-slate-400">User management</span>
                        </div>
                    </div>
                    <ExternalLink size={14} className="text-slate-300" />
                </Button>

                {/* Roadmap */}
                <Button 
                    variant="ghost" 
                    className="w-full justify-between h-auto py-3 px-3 hover:bg-slate-50 text-slate-700"
                    onClick={() => {
                        // Placeholder for Roadmap navigation
                        setOpen(false);
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Map size={16} />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-sm font-medium">Roadmap</span>
                            <span className="text-[10px] text-slate-400">Project milestones</span>
                        </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-300" />
                </Button>

                {/* Ideas */}
                <Button 
                    variant="ghost" 
                    className="w-full justify-between h-auto py-3 px-3 hover:bg-slate-50 text-slate-700"
                    onClick={() => {
                        // Placeholder for Ideas navigation
                        setOpen(false);
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Lightbulb size={16} />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-sm font-medium">Ideas</span>
                            <span className="text-[10px] text-slate-400">Drafts and concepts</span>
                        </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-300" />
                </Button>

                {/* Chats */}
                <Button 
                    variant="ghost" 
                    className="w-full justify-between h-auto py-3 px-3 hover:bg-slate-50 text-slate-700"
                    onClick={() => {
                        setLocation('/chats');
                        setOpen(false);
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                            <MessageSquare size={16} />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-sm font-medium">Chats</span>
                            <span className="text-[10px] text-slate-400">Team conversations</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {blocksWithChats.length > 0 && (
                            <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-blue-100 text-blue-700 hover:bg-blue-100">
                                {blocksWithChats.length}
                            </Badge>
                        )}
                        <ChevronRight size={14} className="text-slate-300" />
                    </div>
                </Button>
            </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
