import { StateCreator } from 'zustand';

export interface UISlice {
  viewMode: 'visual' | 'brief';
  showDetails: boolean;
  selectedNodeId: string | null;
  sidebarOpen: boolean;
  activeBlockId: string | null;
  insertAfterBlockId: string | null;

  setViewMode: (mode: 'visual' | 'brief') => void;
  toggleDetails: () => void;
  setSelectedNode: (id: string | null) => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveBlockId: (id: string | null) => void;
  setInsertAfterBlockId: (id: string | null) => void;
}

export const createUISlice: StateCreator<UISlice> = (set, get) => ({
  viewMode: 'visual',
  showDetails: false,
  selectedNodeId: null,
  sidebarOpen: true,
  activeBlockId: null,
  insertAfterBlockId: null,

  setViewMode: (mode) => set({ viewMode: mode }),
  toggleDetails: () => set((state) => ({ showDetails: !state.showDetails })),
  setSelectedNode: (id) => set({ selectedNodeId: id }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActiveBlockId: (id) => set({ activeBlockId: id }),
  setInsertAfterBlockId: (id) => set({ insertAfterBlockId: id }),
});
