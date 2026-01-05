import { create } from 'zustand';
import { 
  Connection, 
  Edge, 
  EdgeChange, 
  Node, 
  NodeChange, 
  addEdge, 
  OnNodesChange, 
  OnEdgesChange, 
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges
} from 'reactflow';

export type WireframeType = 
  | 'hero' | 'features' | 'text' | 'gallery' | 'form' | 'video' | 'footer' | 'pricing'
  | 'header' | 'cards' | 'cta' | 'map' | 'chart' | 'slider' | 'table' | 'testimonials'
  | 'signup' | 'login' | 'faq' | 'team' | 'steps' | 'tabs' | 'timeline' | 'divider'
  | 'hero_arrows' | 'text_image' | 'two_col_images' | 'article' | 'profile' | 'pagination';

export interface BlockItem {
  id: string;
  type: WireframeType;
}

export interface BlockData {
  label: string;
  blocks: BlockItem[];
  description?: string;
  icons?: string[]; // List of service names/icons
}

export type BlockNode = Node<BlockData>;

interface AppState {
  nodes: BlockNode[];
  edges: Edge[];
  viewMode: 'visual' | 'brief';
  selectedNodeId: string | null;

  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  
  addNode: (position: { x: number, y: number }) => void;
  addBlockToNode: (nodeId: string, type: WireframeType) => void;
  removeBlockFromNode: (nodeId: string, blockId: string) => void;
  updateNodeData: (id: string, data: Partial<BlockData>) => void;
  setViewMode: (mode: 'visual' | 'brief') => void;
  setSelectedNode: (id: string | null) => void;
  addIconToNode: (nodeId: string, icon: string) => void;
  removeIconFromNode: (nodeId: string, icon: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  nodes: [
    {
      id: '1',
      type: 'block',
      position: { x: 250, y: 0 },
      data: { 
        label: 'Home Page', 
        blocks: [
          { id: 'b1', type: 'header' },
          { id: 'b2', type: 'hero' },
          { id: 'b3', type: 'features' },
          { id: 'b4', type: 'cta' },
          { id: 'b5', type: 'footer' }
        ],
        description: 'Main landing page structure.',
        icons: ['React', 'Vite']
      },
    },
    {
      id: '2',
      type: 'block',
      position: { x: 100, y: 500 },
      data: { 
        label: 'Pricing Page', 
        blocks: [
           { id: 'b1', type: 'header' },
           { id: 'b2', type: 'pricing' },
           { id: 'b3', type: 'faq' },
           { id: 'b4', type: 'footer' }
        ],
        description: 'Pricing tiers and comparison.',
        icons: ['Stripe']
      },
    },
  ],
  edges: [
    { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: 'var(--color-border)' } },
  ],
  viewMode: 'visual',
  selectedNodeId: null,

  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge({ ...connection, animated: true, style: { stroke: 'var(--color-border)' } }, get().edges),
    });
  },

  addNode: (position) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNode: BlockNode = {
      id,
      type: 'block',
      position,
      data: {
        label: 'New Page',
        blocks: [{ id: Math.random().toString(36).substr(2, 9), type: 'header' }],
        description: 'New page description...',
        icons: []
      },
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  addBlockToNode: (nodeId, type) => {
    const node = get().nodes.find(n => n.id === nodeId);
    if (node) {
      const newBlock: BlockItem = { id: Math.random().toString(36).substr(2, 9), type };
      get().updateNodeData(nodeId, { blocks: [...node.data.blocks, newBlock] });
    }
  },

  removeBlockFromNode: (nodeId, blockId) => {
    const node = get().nodes.find(n => n.id === nodeId);
    if (node) {
      get().updateNodeData(nodeId, { blocks: node.data.blocks.filter(b => b.id !== blockId) });
    }
  },

  updateNodeData: (id, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
      ),
    });
  },

  setViewMode: (mode) => set({ viewMode: mode }),
  setSelectedNode: (id) => set({ selectedNodeId: id }),

  addIconToNode: (nodeId, icon) => {
    const node = get().nodes.find(n => n.id === nodeId);
    if (node) {
      const currentIcons = node.data.icons || [];
      if (!currentIcons.includes(icon)) {
        get().updateNodeData(nodeId, { icons: [...currentIcons, icon] });
      }
    }
  },

  removeIconFromNode: (nodeId, icon) => {
    const node = get().nodes.find(n => n.id === nodeId);
    if (node) {
      const currentIcons = node.data.icons || [];
      get().updateNodeData(nodeId, { icons: currentIcons.filter(i => i !== icon) });
    }
  },
}));
