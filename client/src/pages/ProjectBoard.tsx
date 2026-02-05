import React, { useEffect, useRef, useCallback } from 'react';
import { useParams, useLocation } from 'wouter';
import { useProject, useSaveProject } from '@/hooks/useProject';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore, type BlockNode } from '@/store/useAppStore';
import type { Edge } from 'reactflow';
import Board from './Board';

export default function ProjectBoard() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: project, isLoading: projectLoading, error } = useProject(id);
  const saveProject = useSaveProject();
  const [, setLocation] = useLocation();

  const loadProjectData = useAppStore((s) => s.loadProjectData);
  const nodes = useAppStore((s) => s.nodes);
  const edges = useAppStore((s) => s.edges);

  const hasLoadedRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string>('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation('/login');
    }
  }, [authLoading, isAuthenticated, setLocation]);

  // Load project data into store when project loads
  useEffect(() => {
    if (project && !hasLoadedRef.current) {
      const canvas = project.canvasData as { nodes: BlockNode[]; edges: Edge[] } | null;
      if (canvas && Array.isArray(canvas.nodes)) {
        loadProjectData(canvas.nodes, canvas.edges);
      } else {
        loadProjectData([], []);
      }
      hasLoadedRef.current = true;
      lastSavedRef.current = JSON.stringify({ nodes: canvas?.nodes || [], edges: canvas?.edges || [] });
    }
  }, [project, loadProjectData]);

  // Reset load flag when project id changes
  useEffect(() => {
    hasLoadedRef.current = false;
  }, [id]);

  // Auto-save with debounce (2 seconds after last change)
  const doSave = useCallback(() => {
    if (!id || !hasLoadedRef.current) return;
    const current = JSON.stringify({ nodes, edges });
    if (current === lastSavedRef.current) return;
    lastSavedRef.current = current;
    saveProject.mutate({ id, canvasData: { nodes, edges } });
  }, [id, nodes, edges, saveProject]);

  useEffect(() => {
    if (!hasLoadedRef.current) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(doSave, 2000);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [nodes, edges, doSave]);

  // Save on unmount
  useEffect(() => {
    return () => {
      doSave();
    };
  }, [doSave]);

  if (authLoading || projectLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <h2 className="text-xl font-semibold text-slate-700">Project not found</h2>
        <button
          className="text-blue-600 hover:underline"
          onClick={() => setLocation('/projects')}
        >
          Back to projects
        </button>
      </div>
    );
  }

  return <Board />;
}
