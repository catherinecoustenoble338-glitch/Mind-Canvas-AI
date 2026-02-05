import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ProjectResponse } from "@shared/types";

/** Looser canvas type for mutation inputs (accepts reactflow types that JSON-serialize correctly) */
type CanvasInput = { nodes: unknown[]; edges: unknown[] };

export function useProjects() {
  return useQuery<ProjectResponse[]>({
    queryKey: ["/api/projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    },
  });
}

export function useProject(id: string | undefined) {
  return useQuery<ProjectResponse>({
    queryKey: ["/api/projects", id],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${id}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch project");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useCreateProject() {
  return useMutation({
    mutationFn: async (data: {
      name: string;
      description?: string;
      canvasData?: CanvasInput;
    }) => {
      const res = await apiRequest("POST", "/api/projects", data);
      return res.json() as Promise<ProjectResponse>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
  });
}

export function useSaveProject() {
  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string;
      name?: string;
      description?: string;
      canvasData?: CanvasInput;
    }) => {
      const res = await apiRequest("PUT", `/api/projects/${id}`, data);
      return res.json() as Promise<ProjectResponse>;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["/api/projects", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
  });
}

export function useDeleteProject() {
  return useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
  });
}
