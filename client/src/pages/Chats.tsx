import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useAppStore } from '@/store/useAppStore';
import { 
  MessageSquare, 
  Search, 
  MoreHorizontal, 
  Phone, 
  Video, 
  Send, 
  Paperclip, 
  Image as ImageIcon,
  Smile,
  ChevronLeft,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export default function Chats() {
  const [, setLocation] = useLocation();
  const { nodes, addBlockChatMessage } = useAppStore();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');

  // Extract chats from all blocks that have messages
  const chats = React.useMemo(() => {
    const allChats: { 
        id: string; // combining node and block id for uniqueness
        nodeId: string;
        blockId: string;
        title: string;
        subtitle: string;
        lastMessage: any;
        messages: any[];
        avatarColor: string;
    }[] = [];

    nodes.forEach(node => {
        node.data.blocks.forEach(block => {
            // Block Chats
            if (block.chatMessages && block.chatMessages.length > 0) {
                const lastMsg = block.chatMessages[block.chatMessages.length - 1];
                allChats.push({
                    id: `${node.id}-${block.id}`,
                    nodeId: node.id,
                    blockId: block.id,
                    taskId: undefined,
                    title: block.label || block.type,
                    subtitle: `${node.data.label} (Block)`,
                    lastMessage: lastMsg,
                    messages: block.chatMessages,
                    avatarColor: 'bg-blue-100 text-blue-600'
                });
            }

            // Task Chats
            if (block.tasks && block.tasks.length > 0) {
                block.tasks.forEach(task => {
                    if (task.chatMessages && task.chatMessages.length > 0) {
                        const lastMsg = task.chatMessages[task.chatMessages.length - 1];
                        allChats.push({
                            id: `${node.id}-${block.id}-${task.id}`,
                            nodeId: node.id,
                            blockId: block.id,
                            taskId: task.id,
                            title: task.title,
                            subtitle: `${block.label} (Task)`,
                            lastMessage: lastMsg,
                            messages: task.chatMessages,
                            avatarColor: 'bg-emerald-100 text-emerald-600'
                        });
                    }
                });
            }
        });
    });

    return allChats.sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp);
  }, [nodes]);

  // If no chat is selected, select the first one
  React.useEffect(() => {
    if (!selectedChatId && chats.length > 0) {
      setSelectedChatId(chats[0].id);
    }
  }, [chats, selectedChatId]);

  const activeChat = chats.find(c => c.id === selectedChatId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChat) return;

    if (activeChat.taskId) {
        // Send to Task
        // We need a store action for this or reuse something?
        // We added addTaskChatMessage in the slice
        // But we need to expose it in the component if it's not already
        // Wait, I need to check useAppStore export.
        // I added addTaskChatMessage to slice, but need to make sure it's available here.
        // It is available via useAppStore().
        useAppStore.getState().addTaskChatMessage(activeChat.nodeId, activeChat.blockId, activeChat.taskId, {
            text: messageInput,
            sender: 'user',
        });
    } else {
        // Send to Block
        addBlockChatMessage(activeChat.nodeId, activeChat.blockId, {
            text: messageInput,
            sender: 'user',
        });
    }
    
    setMessageInput('');
  };

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* Sidebar / Chat List */}
      <div className={`w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50 ${selectedChatId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => setLocation('/')} className="-ml-2">
                    <ArrowLeft size={18} className="text-slate-500" />
                </Button>
                <h2 className="font-bold text-lg text-slate-800">Messages</h2>
            </div>
            <Button variant="ghost" size="icon" className="text-slate-500">
                <MoreHorizontal size={18} />
            </Button>
        </div>
        
        <div className="p-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Search messages..." className="pl-9 bg-white" />
            </div>
        </div>

        <ScrollArea className="flex-1">
            <div className="px-3 pb-3 space-y-1">
                {chats.length === 0 ? (
                    <div className="text-center py-10 px-4 text-slate-400">
                        <MessageSquare size={32} className="mx-auto mb-3 opacity-20" />
                        <p className="text-sm">No conversations yet.</p>
                        <p className="text-xs mt-1">Start a discussion on any block in the board.</p>
                    </div>
                ) : (
                    chats.map(chat => (
                        <button
                            key={chat.id}
                            onClick={() => setSelectedChatId(chat.id)}
                            className={`w-full text-left p-3 rounded-lg flex gap-3 transition-colors ${
                                selectedChatId === chat.id 
                                    ? 'bg-white shadow-sm ring-1 ring-slate-200' 
                                    : 'hover:bg-slate-200/50'
                            }`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${chat.avatarColor}`}>
                                {chat.title.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <span className="font-semibold text-sm text-slate-900 truncate pr-2">
                                        {chat.title}
                                    </span>
                                    <span className="text-[10px] text-slate-400 shrink-0">
                                        {formatDistanceToNow(chat.lastMessage.timestamp, { addSuffix: false })}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-slate-500 truncate mr-2">
                                        <span className="font-medium text-slate-400 mr-1">{chat.lastMessage.sender === 'user' ? 'You:' : ''}</span>
                                        {chat.lastMessage.text}
                                    </p>
                                    {/* Unread indicator mockup */}
                                    {/* <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0"></div> */}
                                </div>
                                <div className="mt-1">
                                    <Badge variant="secondary" className="text-[9px] h-4 px-1 py-0 font-normal text-slate-500 bg-slate-100">
                                        {chat.subtitle}
                                    </Badge>
                                </div>
                            </div>
                        </button>
                    ))
                )}
            </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col bg-white ${!selectedChatId ? 'hidden md:flex' : 'flex'}`}>
        {activeChat ? (
            <>
                {/* Header */}
                <div className="h-16 border-b border-slate-200 flex items-center justify-between px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="md:hidden -ml-2 text-slate-500" 
                            onClick={() => setSelectedChatId(null)}
                        >
                            <ChevronLeft size={20} />
                        </Button>
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${activeChat.avatarColor}`}>
                             {activeChat.title.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-sm">{activeChat.title}</h3>
                            <p className="text-xs text-slate-500">{activeChat.subtitle}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                            <Phone size={18} />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                            <Video size={18} />
                        </Button>
                        <div className="w-px h-6 bg-slate-200 mx-1"></div>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                            <MoreHorizontal size={18} />
                        </Button>
                    </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4 sm:p-6 bg-slate-50/30">
                    <div className="space-y-4 max-w-3xl mx-auto">
                        <div className="flex justify-center my-4">
                            <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-1 rounded-full uppercase tracking-wider font-semibold">
                                Today
                            </span>
                        </div>
                        
                        {activeChat.messages.map((msg, idx) => (
                            <div 
                                key={idx} 
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex items-end gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold border ${
                                        msg.sender === 'user' 
                                            ? 'bg-blue-600 text-white border-blue-600' 
                                            : 'bg-white text-slate-600 border-slate-200'
                                    }`}>
                                        {msg.sender === 'user' ? 'ME' : 'AI'}
                                    </div>
                                    <div className={`p-3 rounded-2xl text-sm ${
                                        msg.sender === 'user' 
                                            ? 'bg-blue-600 text-white rounded-br-none' 
                                            : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
                                    }`}>
                                        <p>{msg.text}</p>
                                        <span className={`text-[10px] block mt-1 opacity-70 ${
                                            msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'
                                        }`}>
                                            {formatDistanceToNow(msg.timestamp, { addSuffix: true })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 border-t border-slate-200 bg-white">
                    <div className="max-w-3xl mx-auto">
                        <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
                             <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl flex items-center p-2 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                                <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-slate-600 rounded-full shrink-0">
                                    <Paperclip size={18} />
                                </Button>
                                <Input 
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="Type a message..." 
                                    className="border-none bg-transparent shadow-none focus-visible:ring-0 h-9 py-0" 
                                />
                                <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-slate-600 rounded-full shrink-0">
                                    <Smile size={18} />
                                </Button>
                             </div>
                             <Button 
                                type="submit" 
                                size="icon" 
                                disabled={!messageInput.trim()}
                                className="h-11 w-11 rounded-full bg-blue-600 hover:bg-blue-700 shadow-md shrink-0"
                             >
                                <Send size={18} className="ml-0.5" />
                             </Button>
                        </form>
                    </div>
                </div>
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare size={32} className="text-slate-300" />
                </div>
                <h3 className="text-lg font-medium text-slate-700">Select a conversation</h3>
                <p className="max-w-xs text-center text-sm mt-2">Choose a chat from the sidebar to view messages and collaborate with your team.</p>
            </div>
        )}
      </div>
    </div>
  );
}
