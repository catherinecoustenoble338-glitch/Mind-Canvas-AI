import React, { useState, useMemo } from 'react';
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
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Settings, 
  User, 
  Folder, 
  LayoutGrid, 
  Users,
  MessageSquare, 
  Zap, 
  Palette, 
  MoreHorizontal,
  Link as LinkIcon,
  Trash2,
  Upload,
  Plus,
  History,
  Undo2,
  Redo2,
  FileText,
  Filter,
  Save,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAppStore, BlockItem } from '@/store/useAppStore';
import { formatDistanceToNow } from 'date-fns';
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

export function SettingsDialog() {
  const [open, setOpen] = useState(false);
  const { historyLog, nodes, setActiveBlockId, createSnapshot, restoreSnapshot, teamMembers, addTeamMember, removeTeamMember, updateTeamMemberRole } = useAppStore();
  const [showSnapshotsOnly, setShowSnapshotsOnly] = useState(false);
  const [snapshotLabel, setSnapshotLabel] = useState('');
  
  // Team State
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'admin' | 'editor' | 'viewer'>('editor');

  const filteredHistory = showSnapshotsOnly 
    ? historyLog.filter(log => log.type === 'snapshot') 
    : historyLog;

  const handleCreateSnapshot = () => {
      const label = snapshotLabel.trim() || `Snapshot ${new Date().toLocaleTimeString()}`;
      createSnapshot(label);
      setSnapshotLabel('');
  };

  // Aggregate all blocks with chat messages
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
                    unread: true // In a real app we'd track read state
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

  // Mock Data
  const projects = [
    { id: 1, name: 'E-commerce Redesign', lastSaved: '2 mins ago' },
    { id: 2, name: 'Landing Page v2', lastSaved: '2 hours ago' },
    { id: 3, name: 'Admin Dashboard', lastSaved: '1 day ago' },
  ];

  const customBlocks = [
    { id: 1, name: 'Custom Hero', type: 'Hero' },
    { id: 2, name: 'Pricing Table Dark', type: 'Pricing' },
    { id: 3, name: 'Admin Sidebar', type: 'Sidebar' },
  ];

  const services = [
    { id: 1, name: 'Stripe', status: 'Connected' },
    { id: 2, name: 'Supabase', status: 'Connected' },
    { id: 3, name: 'Resend', status: 'Disconnected' },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-12 w-12 md:h-9 md:w-9 bg-white border border-slate-200 shadow-sm rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50">
          <Settings size={18} className="md:w-[18px] md:h-[18px]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full h-full sm:max-w-[800px] sm:h-[600px] p-0 flex flex-col overflow-hidden gap-0 bg-white sm:rounded-lg rounded-none border-none sm:border">
        <div className="flex flex-col sm:flex-row h-full">
          {/* Mobile Header / Desktop Sidebar */}
          <Tabs defaultValue="profile" orientation="vertical" className="flex flex-col sm:flex-row w-full h-full">
            <div className="w-full sm:w-[200px] border-b sm:border-b-0 sm:border-r border-slate-100 bg-slate-50/50 p-2 flex flex-col gap-1 shrink-0">
               <div className="px-3 py-2 mb-2 flex justify-between items-center sm:block">
                  <h2 className="text-sm font-bold text-slate-800">Settings</h2>
                  {/* Close button is handled by DialogContent automatically */}
               </div>
               
               {/* Scrollable horizontal nav on mobile, Vertical on desktop */}
               <div className="w-full sm:h-auto overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                   <TabsList className="flex flex-row sm:flex-col h-auto bg-transparent gap-1 items-stretch p-0 w-max sm:w-full justify-start px-2 sm:px-0">
                      <TabsTrigger value="profile" className="justify-start gap-2 px-3 py-2 h-9 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-slate-200/60 shrink-0">
                         <User size={14} /> Profile
                      </TabsTrigger>
                      <TabsTrigger value="projects" className="justify-start gap-2 px-3 py-2 h-9 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-slate-200/60 shrink-0">
                         <Folder size={14} /> Projects
                      </TabsTrigger>
                      <TabsTrigger value="team" className="justify-start gap-2 px-3 py-2 h-9 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-slate-200/60 shrink-0">
                         <Users size={14} /> Team
                      </TabsTrigger>
                      <TabsTrigger value="library" className="justify-start gap-2 px-3 py-2 h-9 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-slate-200/60 shrink-0">
                         <LayoutGrid size={14} /> Library
                      </TabsTrigger>
                      <TabsTrigger value="chats" className="justify-start gap-2 px-3 py-2 h-9 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-slate-200/60 w-full shrink-0">
                         <div className="flex justify-between items-center w-full gap-2">
                            <span className="flex items-center gap-2"><MessageSquare size={14} /> Chats</span>
                            {blocksWithChats.length > 0 && (
                                <Badge variant="secondary" className="h-4 px-1 text-[9px] min-w-[16px] justify-center bg-blue-100 text-blue-700 hidden sm:flex">
                                    {blocksWithChats.length}
                                </Badge>
                            )}
                         </div>
                      </TabsTrigger>
                      <TabsTrigger value="services" className="justify-start gap-2 px-3 py-2 h-9 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-slate-200/60 w-full shrink-0">
                         <div className="flex justify-between items-center w-full gap-2">
                            <span className="flex items-center gap-2"><Zap size={14} /> Services</span>
                            <Badge variant="secondary" className="h-4 px-1 text-[9px] min-w-[16px] justify-center bg-blue-100 text-blue-700 hidden sm:flex">1</Badge>
                         </div>
                      </TabsTrigger>
                      <TabsTrigger value="design" className="justify-start gap-2 px-3 py-2 h-9 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-slate-200/60 w-full shrink-0">
                         <div className="flex justify-between items-center w-full gap-2">
                            <span className="flex items-center gap-2"><Palette size={14} /> Design</span>
                            <Badge variant="secondary" className="h-4 px-1 text-[9px] min-w-[16px] justify-center bg-blue-100 text-blue-700 hidden sm:flex">5</Badge>
                         </div>
                      </TabsTrigger>
                      <TabsTrigger value="history" className="justify-start gap-2 px-3 py-2 h-9 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-slate-200/60 w-full shrink-0">
                         <div className="flex justify-between items-center w-full gap-2">
                            <span className="flex items-center gap-2"><History size={14} /> History</span>
                            <Badge variant="secondary" className="h-4 px-1 text-[9px] min-w-[16px] justify-center bg-blue-100 text-blue-700 hidden sm:flex">{historyLog.length}</Badge>
                         </div>
                      </TabsTrigger>
                   </TabsList>
               </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-white h-full overflow-hidden flex flex-col w-full">
               
               {/* Profile Tab */}
               <TabsContent value="profile" className="flex-1 m-0 p-4 sm:p-6 space-y-6 overflow-auto w-full">
                  <div className="space-y-1">
                     <h3 className="text-lg font-semibold text-slate-800">My Profile</h3>
                     <p className="text-xs text-slate-500">Manage your account settings and preferences.</p>
                  </div>
                  <div className="space-y-4 max-w-sm w-full">
                     <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="m@example.com" defaultValue="user@octoflow.com" />
                     </div>
                     <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" defaultValue="********" />
                     </div>
                     <Button className="w-full bg-blue-600 hover:bg-blue-700">Update Profile</Button>
                  </div>
               </TabsContent>

               {/* Projects Tab */}
               <TabsContent value="projects" className="flex-1 m-0 p-4 sm:p-6 space-y-6 overflow-auto w-full">
                  <div className="space-y-1">
                     <h3 className="text-lg font-semibold text-slate-800">My Projects</h3>
                     <p className="text-xs text-slate-500">Manage and switch between your projects.</p>
                  </div>
                  <div className="space-y-2">
                     {projects.map(project => (
                        <div key={project.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors gap-3 sm:gap-0">
                           <div className="flex flex-col gap-0.5">
                              <span className="font-medium text-sm text-slate-800">{project.name}</span>
                              <span className="text-[10px] text-slate-400">Last saved {project.lastSaved}</span>
                           </div>
                           <div className="flex gap-2 w-full sm:w-auto">
                              <Button variant="outline" size="sm" className="h-8 sm:h-7 text-xs gap-1 flex-1 sm:flex-none">
                                 <LinkIcon size={12} /> Copy Link
                              </Button>
                              <Button variant="outline" size="sm" className="h-8 sm:h-7 text-xs flex-1 sm:flex-none">Open</Button>
                           </div>
                        </div>
                     ))}
                  </div>
               </TabsContent>

               {/* Team Tab */}
               <TabsContent value="team" className="flex-1 m-0 p-4 sm:p-6 space-y-6 overflow-auto w-full">
                  <div className="flex items-center justify-between">
                     <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-slate-800">Team Members</h3>
                        <p className="text-xs text-slate-500">Manage access and roles for your project.</p>
                     </div>
                  </div>

                  {/* Add Member Form */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex flex-col sm:flex-row gap-3 items-end sm:items-center mt-4">
                      <div className="grid gap-1.5 flex-1 w-full">
                          <Label htmlFor="new-member-email" className="text-xs">Email Address</Label>
                          <Input 
                              id="new-member-email" 
                              placeholder="colleague@example.com" 
                              className="h-9 bg-white"
                              value={newMemberEmail}
                              onChange={(e) => setNewMemberEmail(e.target.value)}
                          />
                      </div>
                      <div className="grid gap-1.5 w-full sm:w-[140px]">
                           <Label htmlFor="new-member-role" className="text-xs">Role</Label>
                           <select 
                                id="new-member-role"
                                className="h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                value={newMemberRole}
                                onChange={(e) => setNewMemberRole(e.target.value as any)}
                           >
                               <option value="admin">Admin</option>
                               <option value="editor">Editor</option>
                               <option value="viewer">Viewer</option>
                           </select>
                      </div>
                      <Button 
                          className="h-9 bg-blue-600 hover:bg-blue-700 shrink-0 w-full sm:w-auto"
                          onClick={() => {
                              if (newMemberEmail) {
                                  addTeamMember({
                                      name: newMemberEmail.split('@')[0], // Simple name extraction
                                      email: newMemberEmail,
                                      role: newMemberRole
                                  });
                                  setNewMemberEmail('');
                              }
                          }}
                      >
                          Invite
                      </Button>
                  </div>

                  <div className="space-y-3 mt-4">
                     {teamMembers.map(member => (
                        <div key={member.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors group">
                           <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0 border border-blue-200 uppercase">
                                 {member.name.substring(0, 2)}
                              </div>
                              <div className="flex flex-col">
                                 <div className="flex items-center gap-2">
                                     <span className="font-medium text-sm text-slate-800">{member.name}</span>
                                     {member.status === 'invited' && <Badge variant="outline" className="text-[9px] h-4 px-1 bg-yellow-50 text-yellow-600 border-yellow-200">Pending</Badge>}
                                 </div>
                                 <span className="text-xs text-slate-400">{member.email}</span>
                              </div>
                           </div>
                           
                           <div className="flex items-center gap-3">
                              <select 
                                  className="h-7 text-xs rounded border border-slate-200 bg-white px-2 py-0 focus:outline-none focus:border-blue-300"
                                  value={member.role}
                                  onChange={(e) => updateTeamMemberRole(member.id, e.target.value as any)}
                              >
                                  <option value="admin">Admin</option>
                                  <option value="editor">Editor</option>
                                  <option value="viewer">Viewer</option>
                              </select>
                              
                              <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => removeTeamMember(member.id)}
                              >
                                  <Trash2 size={14} />
                              </Button>
                           </div>
                        </div>
                     ))}
                  </div>
               </TabsContent>

               {/* Block Library Tab */}
               <TabsContent value="library" className="flex-1 m-0 p-4 sm:p-6 space-y-6 overflow-auto w-full">
                  <div className="flex items-center justify-between">
                     <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-slate-800">Block Library</h3>
                        <p className="text-xs text-slate-500">Manage custom blocks and uploaded designs.</p>
                     </div>
                     <Button size="sm" className="h-8 gap-1 bg-blue-600 hover:bg-blue-700 shrink-0">
                        <Upload size={12} /> <span className="hidden sm:inline">Upload Block</span><span className="sm:hidden">Upload</span>
                     </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {customBlocks.map(block => (
                        <div key={block.id} className="border border-slate-200 rounded-lg p-3 flex flex-col gap-3 group relative">
                           <div className="aspect-video bg-slate-100 rounded flex items-center justify-center text-slate-400 text-xs">
                              Preview
                           </div>
                           <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                 <span className="font-medium text-sm text-slate-700">{block.name}</span>
                                 <span className="text-[10px] text-slate-400">{block.type}</span>
                              </div>
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-red-500">
                                 <Trash2 size={12} />
                              </Button>
                           </div>
                        </div>
                     ))}
                  </div>
               </TabsContent>

               {/* Chats Tab */}
               <TabsContent value="chats" className="flex-1 m-0 p-4 sm:p-6 space-y-6 overflow-auto w-full">
                  <div className="space-y-1">
                     <h3 className="text-lg font-semibold text-slate-800">Recent Chats</h3>
                     <p className="text-xs text-slate-500">Messages from collaborators and system.</p>
                  </div>
                  <div className="space-y-2">
                     {blocksWithChats.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 text-sm border border-dashed border-slate-200 rounded-lg">
                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <MessageSquare size={20} className="text-slate-300" />
                            </div>
                            <p>No active conversations yet.</p>
                            <p className="text-xs text-slate-400 mt-1">Start a discussion in any block's details panel.</p>
                        </div>
                     ) : (
                        blocksWithChats.map((chat) => (
                            <div 
                                key={chat.blockId} 
                                className="flex items-start gap-3 p-3 border border-slate-100 rounded-lg bg-white hover:bg-blue-50/50 hover:border-blue-100 cursor-pointer transition-all group"
                                onClick={() => handleChatClick(chat.blockId)}
                            >
                               <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0 border border-blue-200">
                                  {chat.sender === 'user' ? 'ME' : 'AI'}
                               </div>
                               <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-baseline mb-0.5">
                                     <span className="font-semibold text-sm text-slate-800 truncate flex items-center gap-1.5">
                                        {chat.blockLabel}
                                        <span className="text-[10px] font-normal text-slate-400 px-1.5 py-0.5 bg-slate-100 rounded-full truncate max-w-[100px]">
                                            {chat.nodeLabel}
                                        </span>
                                     </span>
                                     <span className="text-[10px] text-slate-400 shrink-0">
                                        {formatDistanceToNow(chat.timestamp, { addSuffix: true })}
                                     </span>
                                  </div>
                                  <p className="text-xs text-slate-600 line-clamp-1 group-hover:text-slate-800">
                                     {chat.lastMessage}
                                  </p>
                               </div>
                               <div className="self-center opacity-0 group-hover:opacity-100 text-blue-400 transition-opacity">
                                  <ChevronRight size={16} />
                               </div>
                            </div>
                         ))
                     )}
                  </div>
               </TabsContent>

               {/* Services Tab - Renamed to Page Tags/Services Management */}
               <TabsContent value="services" className="flex-1 m-0 p-4 sm:p-6 space-y-6 overflow-auto w-full">
                  <div className="flex items-center justify-between">
                     <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-slate-800">Page Tags & Services</h3>
                        <p className="text-xs text-slate-500">Manage the list of technologies and services available to tag your pages.</p>
                     </div>
                     <Button size="sm" variant="outline" className="h-8 gap-1 shrink-0">
                        <Plus size={12} /> <span className="hidden sm:inline">Add Tag</span><span className="sm:hidden">Add</span>
                     </Button>
                  </div>
                  
                  <div className="grid gap-2">
                     <div className="p-3 border border-slate-100 rounded-lg bg-blue-50/50">
                        <p className="text-xs text-blue-600">
                           These tags appear in the "Page Properties" panel when you select a page. Use them to indicate which services or technologies are used on a specific page.
                        </p>
                     </div>

                     <div className="space-y-2 mt-2">
                        {[
                           { name: 'Stripe', category: 'Payments' },
                           { name: 'Supabase', category: 'Database' },
                           { name: 'React', category: 'Frontend' },
                           { name: 'Vite', category: 'Build Tool' },
                           { name: 'Tailwind', category: 'Styling' },
                           { name: 'Firebase', category: 'Backend' },
                           { name: 'AWS', category: 'Infrastructure' },
                        ].map((tag, i) => (
                           <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors group">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded bg-white flex items-center justify-center border border-slate-200 shrink-0">
                                    <img 
                                       src={`https://cdn.simpleicons.org/${tag.name.toLowerCase().replace(/\s+/g, '')}`} 
                                       className="w-4 h-4 opacity-70" 
                                       alt={tag.name}
                                       onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn.simpleicons.org/juejin'; }} // Fallback
                                    />
                                 </div>
                                 <div className="flex flex-col">
                                     <span className="font-medium text-sm text-slate-700">{tag.name}</span>
                                     <span className="text-[10px] text-slate-400">{tag.category}</span>
                                 </div>
                              </div>
                              <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                 <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-blue-500">
                                    <MoreHorizontal size={14} />
                                 </Button>
                                 <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-red-500">
                                    <Trash2 size={14} />
                                 </Button>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </TabsContent>

               {/* Design Tab */}
               <TabsContent value="design" className="flex-1 m-0 p-4 sm:p-6 space-y-6 overflow-auto w-full">
                  <div className="space-y-1">
                     <h3 className="text-lg font-semibold text-slate-800">Design System</h3>
                     <p className="text-xs text-slate-500">Global styles and design tokens.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase text-slate-400">Colors</h4>
                        <div className="flex flex-wrap gap-2">
                           <div className="w-8 h-8 rounded bg-blue-500 shadow-sm"></div>
                           <div className="w-8 h-8 rounded bg-emerald-500 shadow-sm"></div>
                           <div className="w-8 h-8 rounded bg-purple-500 shadow-sm"></div>
                           <div className="w-8 h-8 rounded bg-slate-800 shadow-sm"></div>
                           <div className="w-8 h-8 rounded bg-slate-500 shadow-sm"></div>
                        </div>
                     </div>
                     <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase text-slate-400">Typography</h4>
                        <div className="space-y-1">
                           <div className="text-2xl font-bold text-slate-800">Heading 1</div>
                           <div className="text-xl font-bold text-slate-800">Heading 2</div>
                           <div className="text-base font-medium text-slate-700">Body Text</div>
                           <div className="text-xs text-slate-500">Caption Text</div>
                        </div>
                     </div>
                  </div>
               </TabsContent>

               {/* History Tab */}
               <TabsContent value="history" className="flex-1 m-0 p-4 sm:p-6 space-y-6 overflow-auto w-full">
                  <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                         <div className="space-y-1">
                            <h3 className="text-lg font-semibold text-slate-800">Action History</h3>
                            <p className="text-xs text-slate-500">Track changes and manage version snapshots.</p>
                         </div>
                         <Button 
                            variant={showSnapshotsOnly ? "secondary" : "outline"}
                            size="sm" 
                            onClick={() => setShowSnapshotsOnly(!showSnapshotsOnly)}
                            className="gap-2"
                         >
                            <Filter size={14} />
                            {showSnapshotsOnly ? 'All Actions' : 'Snapshots Only'}
                         </Button>
                      </div>

                      {/* Create Snapshot Controls */}
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex gap-2">
                          <Input 
                             placeholder="Snapshot name (e.g., 'Before big refactor')" 
                             className="h-9 text-xs bg-white"
                             value={snapshotLabel}
                             onChange={(e) => setSnapshotLabel(e.target.value)}
                          />
                          <Button size="sm" onClick={handleCreateSnapshot} className="h-9 bg-slate-800 hover:bg-slate-900 gap-2 shrink-0">
                              <Save size={14} /> Save Snapshot
                          </Button>
                      </div>
                  </div>

                  <div className="space-y-2 mt-2">
                     {filteredHistory.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 text-sm border border-dashed border-slate-200 rounded-lg">
                           {showSnapshotsOnly ? "No snapshots saved yet." : "No actions recorded yet."}
                        </div>
                     ) : (
                        filteredHistory.map((log) => (
                           <div key={log.id} className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${log.type === 'snapshot' ? 'bg-amber-50/50 border-amber-100 hover:bg-amber-50' : 'bg-white border-slate-100 hover:bg-slate-50'}`}>
                              <div className="flex items-center gap-3">
                                 <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                     log.type === 'snapshot' ? 'bg-amber-100 text-amber-600' :
                                     log.action === 'Undo' ? 'bg-orange-100 text-orange-600' : 
                                     log.action === 'Redo' ? 'bg-green-100 text-green-600' : 
                                     'bg-blue-100 text-blue-600'
                                 }`}>
                                    {log.type === 'snapshot' ? <Save size={14} /> :
                                     log.action === 'Undo' ? <Undo2 size={14} /> : 
                                     log.action === 'Redo' ? <Redo2 size={14} /> : 
                                     <History size={14} />}
                                 </div>
                                 <div className="flex flex-col">
                                    <span className={`font-medium text-sm ${log.type === 'snapshot' ? 'text-amber-900' : 'text-slate-800'}`}>
                                        {log.action}
                                        {log.type === 'snapshot' && <Badge variant="outline" className="ml-2 h-4 text-[9px] bg-amber-100 text-amber-700 border-amber-200">SNAPSHOT</Badge>}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                       {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                                    </span>
                                 </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                  <div className="text-[10px] font-mono text-slate-300 hidden sm:block">
                                     {new Date(log.timestamp).toLocaleTimeString()}
                                  </div>
                                  
                                  {log.type === 'snapshot' && (
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-slate-500 hover:text-amber-700 hover:bg-amber-100/50">
                                                <RotateCcw size={12} /> Restore
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle className="flex items-center gap-2">
                                                    <AlertTriangle className="text-amber-500" size={20} />
                                                    Restore Snapshot?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to restore <strong>"{log.action}"</strong>?<br/><br/>
                                                    <span className="text-red-500 font-medium">Warning: Current unsaved changes will be lost.</span><br/>
                                                    This action will revert your entire board to this state.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction 
                                                    className="bg-amber-600 hover:bg-amber-700"
                                                    onClick={() => {
                                                        restoreSnapshot(log.id);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    Yes, Restore Version
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                  )}
                              </div>
                           </div>
                        ))
                     )}
                  </div>
               </TabsContent>

            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
