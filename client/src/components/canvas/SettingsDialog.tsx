import React, { useState } from 'react';
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
  MessageSquare, 
  Zap, 
  Palette, 
  MoreHorizontal,
  Link as LinkIcon,
  Trash2,
  Upload,
  Plus
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function SettingsDialog() {
  const [open, setOpen] = useState(false);

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
        <Button variant="ghost" size="icon" className="h-8 w-8 bg-white border border-slate-200 shadow-sm rounded text-slate-600 hover:text-slate-900 hover:bg-slate-50">
          <Settings size={16} />
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
                      <TabsTrigger value="library" className="justify-start gap-2 px-3 py-2 h-9 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-slate-200/60 shrink-0">
                         <LayoutGrid size={14} /> Library
                      </TabsTrigger>
                      <TabsTrigger value="chats" className="justify-start gap-2 px-3 py-2 h-9 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-slate-200/60 w-full shrink-0">
                         <div className="flex justify-between items-center w-full gap-2">
                            <span className="flex items-center gap-2"><MessageSquare size={14} /> Chats</span>
                            <Badge variant="secondary" className="h-4 px-1 text-[9px] min-w-[16px] justify-center bg-blue-100 text-blue-700 hidden sm:flex">3</Badge>
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
                   </TabsList>
               </ScrollArea>
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
                     {[1,2,3].map(i => (
                        <div key={i} className="flex items-start gap-3 p-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer">
                           <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">U{i}</div>
                           <div className="flex-1 min-w-0">
                              <div className="flex justify-between">
                                 <span className="font-medium text-sm text-slate-800 truncate">User {i}</span>
                                 <span className="text-[10px] text-slate-400 shrink-0">10:2{i} AM</span>
                              </div>
                              <p className="text-xs text-slate-500 mt-1 line-clamp-1">Updated the header design based on feedback...</p>
                           </div>
                           <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                        </div>
                     ))}
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

            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
