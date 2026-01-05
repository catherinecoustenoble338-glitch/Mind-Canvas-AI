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

                {/* Admin */}
                <Button 
                    variant="ghost" 
                    className="w-full justify-between h-auto py-3 px-3 hover:bg-slate-50 text-slate-700"
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
            </div>

            <div className="border-t border-slate-100 p-2">
                <div className="px-2 py-1.5 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Recent Chats</span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 h-4 bg-blue-50 text-blue-600">
                        {blocksWithChats.length}
                    </Badge>
                </div>
                
                <div className="space-y-1 mt-1 max-h-[200px] overflow-y-auto pr-1">
                    {blocksWithChats.length === 0 ? (
                        <div className="text-center py-4 text-xs text-slate-400 border border-dashed border-slate-100 rounded">
                            No active chats
                        </div>
                    ) : (
                        blocksWithChats.slice(0, 3).map((chat) => (
                            <div 
                                key={chat.blockId}
                                className="flex items-start gap-2 p-2 rounded hover:bg-slate-50 cursor-pointer transition-colors group"
                                onClick={() => handleChatClick(chat.blockId)}
                            >
                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[9px] font-bold text-blue-600 shrink-0 mt-0.5">
                                    {chat.sender === 'user' ? 'ME' : 'AI'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-xs font-medium text-slate-700 truncate max-w-[120px]">
                                            {chat.blockLabel}
                                        </span>
                                        <span className="text-[9px] text-slate-400 shrink-0">
                                            {formatDistanceToNow(chat.timestamp, { addSuffix: false }).replace('about ', '')}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 line-clamp-1 group-hover:text-slate-700">
                                        {chat.lastMessage}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                    {blocksWithChats.length > 3 && (
                        <Button variant="link" size="sm" className="w-full h-6 text-[10px] text-slate-400">
                            View all {blocksWithChats.length} chats
                        </Button>
                    )}
                </div>
            </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
