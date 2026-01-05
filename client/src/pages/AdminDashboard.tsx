import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  Users, 
  Settings, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Trash2, 
  Edit,
  Shield,
  LogOut,
  LayoutDashboard,
  Bell,
  CheckCircle2,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { adminUsers, removeAdminUser, updateAdminUser, addAdminUser } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Add User Dialog State
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'editor' as const });

  // Filter users
  const filteredUsers = adminUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      addAdminUser(newUser);
      setIsAddUserOpen(false);
      setNewUser({ name: '', email: '', role: 'editor' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col h-auto md:h-screen sticky top-0 hidden md:flex">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/50">
            Of
          </div>
          <span className="text-white font-bold text-lg">OctoFlow Admin</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-slate-800 hover:text-white transition-colors" onClick={() => setLocation('/admin')}>
            <LayoutDashboard size={18} /> Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 bg-slate-800 text-white font-medium" onClick={() => setLocation('/admin')}>
            <Users size={18} /> Users
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-slate-800 hover:text-white transition-colors">
            <Settings size={18} /> Settings
          </Button>
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
              AD
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">Admin User</span>
              <span className="text-xs text-slate-500">admin@octoflow.com</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
            onClick={() => setLocation('/')}
          >
            <LogOut size={16} className="mr-2" /> Back to App
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Only show header on mobile since sidebar is hidden */}
        <header className="bg-white border-b border-slate-200 h-16 flex md:hidden items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">Of</div>
             <h1 className="text-lg font-bold text-slate-800">Admin</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setLocation('/')}>
             Back to App
          </Button>
        </header>

        <header className="bg-white border-b border-slate-200 h-16 hidden md:flex items-center justify-between px-6 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-800">User Management</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700">
              <Bell size={18} />
            </Button>
            <div className="h-8 w-px bg-slate-200"></div>
            <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsAddUserOpen(true)}>
              <Plus size={16} className="mr-2" /> Add User
            </Button>
          </div>
        </header>

        <div className="p-6 max-w-7xl mx-auto">
          {/* User Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search users..." 
                  className="pl-9 bg-slate-50 border-slate-200" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                 <Button variant="outline" size="sm" className="text-slate-600">Filter</Button>
                 <Button variant="outline" size="sm" className="text-slate-600">Export</Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-400 italic">
                        No users found matching "{searchTerm}"
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs uppercase border border-slate-200">
                              {user.name.substring(0, 2)}
                            </div>
                            <div>
                              <div className="font-medium text-slate-900">{user.name}</div>
                              <div className="text-xs text-slate-400">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className={`font-normal capitalize ${
                            user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            user.role === 'editor' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                            <span className={`capitalize ${user.status === 'active' ? 'text-emerald-700' : 'text-amber-700'}`}>
                              {user.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => updateAdminUser(user.id, { role: 'admin' })}>
                                <Shield className="mr-2 h-4 w-4" /> Make Admin
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateAdminUser(user.id, { role: 'editor' })}>
                                <Edit className="mr-2 h-4 w-4" /> Change Role
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onClick={() => removeAdminUser(user.id)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>Showing {filteredUsers.length} of {adminUsers.length} users</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled className="h-8">Previous</Button>
                <Button variant="outline" size="sm" disabled className="h-8">Next</Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account manually. They will receive an email to set their password.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <select 
                id="role"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
              >
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddUser}>Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
