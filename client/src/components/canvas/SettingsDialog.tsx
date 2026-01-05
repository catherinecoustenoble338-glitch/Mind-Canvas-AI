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
      <DialogContent className="sm:max-w-[800px] h-[600px] p-0 flex flex-col overflow-hidden gap-0">
        <div className="flex h-full">
          {/* Left Sidebar Tabs */}
          <Tabs defaultValue="profile" orientation="vertical" className="flex w-full h-full">
            <div className="w-[200px] border-r border-slate-100 bg-slate-50/50 p-2 flex flex-col gap-1">
               <div className="px-3 py-2 mb-2">
                  <h2 className="text-sm font-bold text-slate-800">Settings</h2>
               </div>
               
               <TabsList className="flex flex-col h-auto bg-transparent gap-1 items-stretch p-0">
                  <TabsTrigger value="profile" className="justify-start gap-2 px-3 py-2 h-9 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">
                     <User size={14} /> Profile
                  </TabsTrigger>
                  <TabsTrigger value="projects" className="justify-start gap-2 px-3 py-2 h-9 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">
                     <Folder size={14} /> Projects
                  </TabsTrigger>
                  <TabsTrigger value="library" className="justify-start gap-2 px-3 py-2 h-9 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">
                     <LayoutGrid size={14} /> Block Library
                  </TabsTrigger>
                  <TabsTrigger value="chats" className="justify-start gap-2 px-3 py-2 h-9 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm w-full">
                     <div className="flex justify-between items-center w-full">
                        <span className="flex items-center gap-2"><MessageSquare size={14} /> Chats</span>
                        <Badge variant="secondary" className="h-4 px-1 text-[9px] min-w-[16px] justify-center bg-blue-100 text-blue-700">3</Badge>
                     </div>
                  </TabsTrigger>
                  <TabsTrigger value="services" className="justify-start gap-2 px-3 py-2 h-9 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm w-full">
                     <div className="flex justify-between items-center w-full">
                        <span className="flex items-center gap-2"><Zap size={14} /> Services</span>
                        <Badge variant="secondary" className="h-4 px-1 text-[9px] min-w-[16px] justify-center bg-blue-100 text-blue-700">1</Badge>
                     </div>
                  </TabsTrigger>
                  <TabsTrigger value="design" className="justify-start gap-2 px-3 py-2 h-9 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm w-full">
                     <div className="flex justify-between items-center w-full">
                        <span className="flex items-center gap-2"><Palette size={14} /> Design</span>
                        <Badge variant="secondary" className="h-4 px-1 text-[9px] min-w-[16px] justify-center bg-blue-100 text-blue-700">5</Badge>
                     </div>
                  </TabsTrigger>
               </TabsList>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-white h-full overflow-hidden flex flex-col">
               
               {/* Profile Tab */}
               <TabsContent value="profile" className="flex-1 m-0 p-6 space-y-6 overflow-auto">
                  <div className="space-y-1">
                     <h3 className="text-lg font-semibold text-slate-800">My Profile</h3>
                     <p className="text-xs text-slate-500">Manage your account settings and preferences.</p>
                  </div>
                  <div className="space-y-4 max-w-sm">
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
               <TabsContent value="projects" className="flex-1 m-0 p-6 space-y-6 overflow-auto">
                  <div className="space-y-1">
                     <h3 className="text-lg font-semibold text-slate-800">My Projects</h3>
                     <p className="text-xs text-slate-500">Manage and switch between your projects.</p>
                  </div>
                  <div className="space-y-2">
                     {projects.map(project => (
                        <div key={project.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                           <div className="flex flex-col gap-0.5">
                              <span className="font-medium text-sm text-slate-800">{project.name}</span>
                              <span className="text-[10px] text-slate-400">Last saved {project.lastSaved}</span>
                           </div>
                           <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                                 <LinkIcon size={12} /> Copy Link
                              </Button>
                              <Button variant="outline" size="sm" className="h-7 text-xs">Open</Button>
                           </div>
                        </div>
                     ))}
                  </div>
               </TabsContent>

               {/* Block Library Tab */}
               <TabsContent value="library" className="flex-1 m-0 p-6 space-y-6 overflow-auto">
                  <div className="flex items-center justify-between">
                     <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-slate-800">Block Library</h3>
                        <p className="text-xs text-slate-500">Manage custom blocks and uploaded designs.</p>
                     </div>
                     <Button size="sm" className="h-8 gap-1 bg-blue-600 hover:bg-blue-700">
                        <Upload size={12} /> Upload Block
                     </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
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
               <TabsContent value="chats" className="flex-1 m-0 p-6 space-y-6 overflow-auto">
                  <div className="space-y-1">
                     <h3 className="text-lg font-semibold text-slate-800">Recent Chats</h3>
                     <p className="text-xs text-slate-500">Messages from collaborators and system.</p>
                  </div>
                  <div className="space-y-2">
                     {[1,2,3].map(i => (
                        <div key={i} className="flex items-start gap-3 p-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer">
                           <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">U{i}</div>
                           <div className="flex-1">
                              <div className="flex justify-between">
                                 <span className="font-medium text-sm text-slate-800">User {i}</span>
                                 <span className="text-[10px] text-slate-400">10:2{i} AM</span>
                              </div>
                              <p className="text-xs text-slate-500 mt-1 line-clamp-1">Updated the header design based on feedback...</p>
                           </div>
                           <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                        </div>
                     ))}
                  </div>
               </TabsContent>

               {/* Services Tab */}
               <TabsContent value="services" className="flex-1 m-0 p-6 space-y-6 overflow-auto">
                  <div className="flex items-center justify-between">
                     <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-slate-800">Services</h3>
                        <p className="text-xs text-slate-500">Connected integrations and APIs.</p>
                     </div>
                     <Button size="sm" variant="outline" className="h-8 gap-1">
                        <Plus size={12} /> Add Service
                     </Button>
                  </div>
                  <div className="space-y-2">
                     {services.map(service => (
                        <div key={service.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center border border-slate-200">
                                 <Zap size={16} className="text-slate-400" />
                              </div>
                              <span className="font-medium text-sm text-slate-700">{service.name}</span>
                           </div>
                           <div className="flex items-center gap-3">
                              <Badge variant={service.status === 'Connected' ? 'default' : 'outline'} className={service.status === 'Connected' ? "bg-emerald-500 hover:bg-emerald-600 text-[10px]" : "text-slate-400 text-[10px]"}>
                                 {service.status}
                              </Badge>
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400">
                                 <MoreHorizontal size={14} />
                              </Button>
                           </div>
                        </div>
                     ))}
                  </div>
               </TabsContent>

               {/* Design Tab */}
               <TabsContent value="design" className="flex-1 m-0 p-6 space-y-6 overflow-auto">
                  <div className="space-y-1">
                     <h3 className="text-lg font-semibold text-slate-800">Design System</h3>
                     <p className="text-xs text-slate-500">Global styles and design tokens.</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
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
