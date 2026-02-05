import { StateCreator } from 'zustand';
import type { BlockNode } from '../types';
import type { Edge } from 'reactflow';
import { generateId } from '@/lib/id';

// ── Types ─────────────────────────────────────────────────────────
interface CanvasSnapshot {
  nodes: BlockNode[];
  edges: Edge[];
}

export interface HistoryLogEntry {
  id: string;
  action: string;
  timestamp: number;
  type: 'action' | 'snapshot';
  snapshotData?: CanvasSnapshot;
}

export interface HistorySlice {
  past: CanvasSnapshot[];
  future: CanvasSnapshot[];
  historyLog: HistoryLogEntry[];
  undo: () => void;
  redo: () => void;
  pushToHistory: (actionLabel: string) => void;
  createSnapshot: (label: string) => void;
  restoreSnapshot: (snapshotId: string) => void;
}

// Slices access other slices via the merged AppState.
// We declare a minimal interface for the cross-slice data we need.
interface WithCanvas {
  nodes: BlockNode[];
  edges: Edge[];
}

function cloneCanvas(state: WithCanvas): CanvasSnapshot {
  return structuredClone({ nodes: state.nodes, edges: state.edges });
}

function logEntry(action: string, type: 'action' | 'snapshot' = 'action', snapshotData?: CanvasSnapshot): HistoryLogEntry {
  return { id: generateId(), action, timestamp: Date.now(), type, snapshotData };
}

const MAX_HISTORY = 50;

// ── Slice ─────────────────────────────────────────────────────────
export const createHistorySlice: StateCreator<
  HistorySlice & WithCanvas,
  [],
  [],
  HistorySlice
> = (set, get) => ({
  past: [],
  future: [],
  historyLog: [],

  pushToHistory: (actionLabel) => {
    const snapshot = cloneCanvas(get());
    set((s) => ({
      past: [...s.past, snapshot],
      future: [],
      historyLog: [logEntry(actionLabel), ...s.historyLog].slice(0, MAX_HISTORY),
    }));
  },

  createSnapshot: (label) => {
    const snapshot = cloneCanvas(get());
    set((s) => ({
      historyLog: [logEntry(label, 'snapshot', snapshot), ...s.historyLog],
    }));
  },

  restoreSnapshot: (snapshotId) => {
    const entry = get().historyLog.find((e) => e.id === snapshotId);
    if (!entry || entry.type !== 'snapshot' || !entry.snapshotData) return;

    get().pushToHistory(`Restored: ${entry.action}`);
    const restored = structuredClone(entry.snapshotData);
    set({ nodes: restored.nodes, edges: restored.edges } as Partial<HistorySlice & WithCanvas>);
  },

  undo: () => {
    const { past, future } = get();
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    const current = cloneCanvas(get());

    set({
      past: past.slice(0, -1),
      future: [current, ...future],
      nodes: previous.nodes,
      edges: previous.edges,
      historyLog: [logEntry('Undo'), ...get().historyLog].slice(0, MAX_HISTORY),
    } as Partial<HistorySlice & WithCanvas>);
  },

  redo: () => {
    const { past, future } = get();
    if (future.length === 0) return;

    const next = future[0];
    const current = cloneCanvas(get());

    set({
      past: [...past, current],
      future: future.slice(1),
      nodes: next.nodes,
      edges: next.edges,
      historyLog: [logEntry('Redo'), ...get().historyLog].slice(0, MAX_HISTORY),
    } as Partial<HistorySlice & WithCanvas>);
  },
});
