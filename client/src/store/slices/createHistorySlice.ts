import { StateCreator } from 'zustand';
import { BlockNode } from '../types';
import { Edge } from 'reactflow';

export interface HistorySlice {
  past: { nodes: BlockNode[], edges: Edge[] }[];
  future: { nodes: BlockNode[], edges: Edge[] }[];
  historyLog: { id: string, action: string, timestamp: number, type: 'action' | 'snapshot', snapshotData?: { nodes: BlockNode[], edges: Edge[] } }[];
  undo: () => void;
  redo: () => void;
  pushToHistory: (actionLabel: string) => void;
  createSnapshot: (label: string) => void;
  restoreSnapshot: (snapshotId: string) => void;
}

export const createHistorySlice: StateCreator<HistorySlice, [], [], HistorySlice> = (set, get: any) => ({
  past: [],
  future: [],
  historyLog: [],

  pushToHistory: (actionLabel: string) => {
    const { nodes, edges } = get();
    const { past, historyLog } = get();
    // Deep clone to avoid reference issues
    const currentState = { 
        nodes: JSON.parse(JSON.stringify(nodes)), 
        edges: JSON.parse(JSON.stringify(edges)) 
    };
    
    set({
        past: [...past, currentState],
        future: [], // Clear future on new action
        historyLog: [{ 
            id: Math.random().toString(36).substr(2, 9),
            action: actionLabel, 
            timestamp: Date.now(),
            type: 'action' as const
        }, ...historyLog].slice(0, 50) // Keep last 50 logs
    });
  },

  createSnapshot: (label: string) => {
    const { nodes, edges, historyLog } = get();
    const snapshotData = { 
        nodes: JSON.parse(JSON.stringify(nodes)), 
        edges: JSON.parse(JSON.stringify(edges)) 
    };

    set({
        historyLog: [{ 
            id: Math.random().toString(36).substr(2, 9),
            action: label, 
            timestamp: Date.now(),
            type: 'snapshot' as const,
            snapshotData
        }, ...historyLog] 
    });
  },

  restoreSnapshot: (snapshotId: string) => {
    const { historyLog } = get();
    const snapshot = historyLog.find((log: any) => log.id === snapshotId);
    
    if (snapshot && snapshot.type === 'snapshot' && snapshot.snapshotData) {
        get().pushToHistory(`Restored: ${snapshot.action}`);
        
        set({
            nodes: JSON.parse(JSON.stringify(snapshot.snapshotData.nodes)),
            edges: JSON.parse(JSON.stringify(snapshot.snapshotData.edges)),
        } as any);
    }
  },

  undo: () => {
    const { past, future, nodes, edges, historyLog } = get();
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    
    // Current state becomes future
    const currentState = { 
        nodes: JSON.parse(JSON.stringify(nodes)), 
        edges: JSON.parse(JSON.stringify(edges)) 
    };

    set({
      past: newPast,
      future: [currentState, ...future],
      nodes: previous.nodes,
      edges: previous.edges,
      historyLog: [{ 
          id: Math.random().toString(36).substr(2, 9),
          action: 'Undo', 
          timestamp: Date.now(),
          type: 'action' as const
      }, ...historyLog].slice(0, 50)
    } as any);
  },

  redo: () => {
    const { past, future, nodes, edges, historyLog } = get();
    if (future.length === 0) return;

    const next = future[0];
    const newFuture = future.slice(1);
    
    // Current state becomes past
    const currentState = { 
        nodes: JSON.parse(JSON.stringify(nodes)), 
        edges: JSON.parse(JSON.stringify(edges)) 
    };

    set({
      past: [...past, currentState],
      future: newFuture,
      nodes: next.nodes,
      edges: next.edges,
      historyLog: [{ 
          id: Math.random().toString(36).substr(2, 9),
          action: 'Redo', 
          timestamp: Date.now(), 
          type: 'action' as const
      }, ...historyLog].slice(0, 50)
    } as any);
  },
});
