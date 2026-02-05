import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth, useLogout } from '@/hooks/useAuth';
import { useProjects, useCreateProject, useDeleteProject } from '@/hooks/useProject';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Plus, FolderOpen, Trash2, LogOut, LayoutGrid } from 'lucide-react';

export default function Projects() {
  const { user } = useAuth();
  const { data: projects, isLoading } = useProjects();
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();
  const logout = useLogout();
  const [, setLocation] = useLocation();

  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreate = () => {
    if (!newName.trim()) return;
    createProject.mutate(
      { name: newName.trim(), description: newDesc.trim() },
      {
        onSuccess: (project) => {
          setNewName('');
          setNewDesc('');
          setDialogOpen(false);
          setLocation(`/project/${project.id}`);
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              Of
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-800">OctoFlow</h1>
              <p className="text-xs text-slate-500">{user?.name}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => logout.mutate()}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Projects</h2>
            <p className="text-slate-500 text-sm mt-1">Your product plans and sitemaps</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create new project</DialogTitle>
                <DialogDescription>
                  Give your project a name to get started with your sitemap.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project name</Label>
                  <Input
                    id="project-name"
                    placeholder="My Product"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-desc">Description (optional)</Label>
                  <Input
                    id="project-desc"
                    placeholder="Brief description..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreate} disabled={!newName.trim() || createProject.isPending}>
                  {createProject.isPending ? 'Creating...' : 'Create'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : !projects?.length ? (
          <Card className="border-dashed border-2 border-slate-300 bg-white/50">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <LayoutGrid className="h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-1">No projects yet</h3>
              <p className="text-sm text-slate-400 mb-4">Create your first project to start planning.</p>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="hover:shadow-md transition-shadow cursor-pointer group"
              >
                <CardHeader
                  className="pb-2"
                  onClick={() => setLocation(`/project/${project.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="h-5 w-5 text-blue-500" />
                      <CardTitle className="text-base">{project.name}</CardTitle>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete project?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete "{project.name}" and all its data. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => deleteProject.mutate(project.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <CardDescription className="text-xs line-clamp-2">
                    {project.description || 'No description'}
                  </CardDescription>
                </CardHeader>
                <CardContent
                  className="pt-0"
                  onClick={() => setLocation(`/project/${project.id}`)}
                >
                  <p className="text-xs text-slate-400">
                    Updated {new Date(project.updatedAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
