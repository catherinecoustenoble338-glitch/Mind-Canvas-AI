import { create } from 'zustand';
import { ProjectSlice, createProjectSlice } from './slices/createProjectSlice';
import { TeamSlice, createTeamSlice } from './slices/createTeamSlice';
import { UISlice, createUISlice } from './slices/createUISlice';
import { HistorySlice, createHistorySlice } from './slices/createHistorySlice';

// Re-export types for backward compatibility
export * from './types';

// Combined State Type
export type AppState = ProjectSlice & TeamSlice & UISlice & HistorySlice;

// No longer persisting to localStorage — project data is loaded from the server
// via useProject hook and saved back with auto-save debounce.
export const useAppStore = create<AppState>()((...a) => ({
  ...createProjectSlice(...a),
  ...createTeamSlice(...a),
  ...createUISlice(...a),
  ...createHistorySlice(...a),
}));
