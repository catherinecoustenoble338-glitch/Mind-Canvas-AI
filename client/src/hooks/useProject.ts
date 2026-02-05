import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  canvasData: { nodes: unknown[]; edges: unknown[] };
  createdAt: string;
  updatedAt: string;
}

export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ["/api/projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    },
  });
}

export function useProject(id: string | undefined) {
  return useQuery<Project>({
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
      canvasData?: { nodes: unknown[]; edges: unknown[] };
    }) => {
      const res = await apiRequest("POST", "/api/projects", data);
      return res.json() as Promise<Project>;
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
      canvasData?: { nodes: unknown[]; edges: unknown[] };
    }) => {
      const res = await apiRequest("PUT", `/api/projects/${id}`, data);
      return res.json() as Promise<Project>;
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
