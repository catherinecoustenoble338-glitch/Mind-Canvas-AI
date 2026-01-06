import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ProjectSlice, createProjectSlice } from './slices/createProjectSlice';
import { TeamSlice, createTeamSlice } from './slices/createTeamSlice';
import { UISlice, createUISlice } from './slices/createUISlice';
import { HistorySlice, createHistorySlice } from './slices/createHistorySlice';

// Re-export types for backward compatibility
export * from './types';

// Combined State Type
export type AppState = ProjectSlice & TeamSlice & UISlice & HistorySlice;

export const useAppStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createProjectSlice(...a),
      ...createTeamSlice(...a),
      ...createUISlice(...a),
      ...createHistorySlice(...a),
    }),
    {
      name: 'octoflow-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({
        // Only persist project data and team settings, skip UI state that might be transient (except viewMode)
        nodes: state.nodes,
        edges: state.edges,
        teamMembers: state.teamMembers,
        adminUsers: state.adminUsers,
        viewMode: state.viewMode,
        // Don't persist history stacks to keep storage light, or persist if robust undo needed across reloads
        // Let's persist past/future for robustness
        past: state.past,
        future: state.future,
        historyLog: state.historyLog,
      }),
    }
  )
);
