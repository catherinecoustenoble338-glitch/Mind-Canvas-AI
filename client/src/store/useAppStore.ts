import { create } from 'zustand';
import dagre from 'dagre';
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

// Helper for Auto Layout using Dagre
const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 300; // Block width + spacing
  const nodeHeight = 600; // Average block height + spacing

  dagreGraph.setGraph({ rankdir: direction, align: 'DL', ranksep: 100, nodesep: 25 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    
    // Slight randomization or adjustment could be added here if needed, but dagre gives absolute pos
    // We want to preserve the reference to avoid full React re-renders if pos hasn't changed much, 
    // but simplified for now:
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export type WireframeType = 
  // Blue Group (Content, Media, Generic)
  | 'text_video' | 'two_col_images_text' | 'text_image' | 'vanilla_img_placeholder'
  | 'left_text_on_image' | 'text' | 'slider_2_column' | 'two_col_images'
  | 'text_image_blue' | 'images' | 'map' | 'slider'
  
  // Red Group (Features, CTA, Cards)
  | 'features' | 'cta' | 'cta_image' | 'features_list' | 'cards' | 'buttons_left_aligned'
  | 'slider_cards' | 'hero_arrows' | 'cards_red'

  // Green Group (Headers, Navigation)
  | 'title' | 'interface_header' | 'header' | 'footer_green'
  | 'table' | 'bullets' | 'mobile_top_bar' | 'no_logo_navigation'
  | 'articles' | 'profile' | 'features_green'
  
  // Purple Group (Dividers, Footer, Loading)
  | 'divider' | 'footer' | 'loading' | 'audio' | 'post_thread'
  
  // Orange Group (Forms, Input)
  | 'form' | 'sign_in' | 'text_sidebar_form' | 'upload_button' | 'next' 
  | 'radiobuttons' | 'text_form' | 'toggles' | 'hamburger' | 'table_row'
  
  // Cyan/Light Blue (Maps, Charts, Steps)
  | 'steps' | 'chart' | 'timeline' | 'pagination' | 'catalog' | 'accordion' | 'faq' 
  | 'map_contacts' | 'table_of_contents' | 'invoice' | 'rating' | 'checklist'
  | 'plans' | 'carousel';

export type PageStatus = 'idea' | 'in_progress' | 'review' | 'done' | 'error';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'system';
  timestamp: number;
  attachments?: string[];
}

export interface BlockItem {
  id: string;
  type: WireframeType;
  label?: string; // Ability to name each block
  description?: string;
  chatMessages?: ChatMessage[];
  vfp?: string; // Valuable Final Product
  features?: string; // Bullet list of features
}

export interface BlockData {
  label: string;
  status: PageStatus;
  blocks: BlockItem[];
  description?: string;
  icons?: string[]; // List of service names/icons
  vfp?: string; // Valuable Final Product for Page
  features?: string; // Bullet list of features for Page
}

export type BlockNode = Node<BlockData>;

interface AppState {
  nodes: BlockNode[];
  edges: Edge[];
  viewMode: 'visual' | 'brief';
  showDetails: boolean; // Toggle for "Caps Lock" details mode
  selectedNodeId: string | null;

  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  
  addNode: (position: { x: number, y: number }) => void;
  addBlockToNode: (nodeId: string, type: WireframeType) => void;
  removeBlockFromNode: (nodeId: string, blockId: string) => void;
  updateBlockLabel: (nodeId: string, blockId: string, label: string) => void;
  updateBlockDescription: (nodeId: string, blockId: string, description: string) => void;
  updateBlockVFP: (nodeId: string, blockId: string, vfp: string) => void;
  updateBlockFeatures: (nodeId: string, blockId: string, features: string) => void;
  updatePageVFP: (nodeId: string, vfp: string) => void;
  updatePageFeatures: (nodeId: string, features: string) => void;
  addBlockChatMessage: (nodeId: string, blockId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  reorderBlocks: (nodeId: string, newBlocks: BlockItem[]) => void;
  updateNodeData: (id: string, data: Partial<BlockData>) => void;
  addChildNode: (parentId: string) => void;
  removeNode: (nodeId: string) => void;
  setViewMode: (mode: 'visual' | 'brief') => void;
  toggleDetails: () => void;
  setSelectedNode: (id: string | null) => void;
  addIconToNode: (nodeId: string, icon: string) => void;
  removeIconFromNode: (nodeId: string, icon: string) => void;
  
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  layoutNodes: () => void;

  // History & Logging
  past: { nodes: BlockNode[], edges: Edge[] }[];
  future: { nodes: BlockNode[], edges: Edge[] }[];
  historyLog: { action: string, timestamp: number }[];
  undo: () => void;
  redo: () => void;
  pushToHistory: (actionLabel: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  nodes: [
    {
      id: '1',
      type: 'block',
      position: { x: 250, y: 0 },
      data: { 
        label: 'Home Page', 
        status: 'done',
        blocks: [
          { id: 'b1', type: 'interface_header', label: 'Main Nav', description: 'Main navigation header with logo and links' },
          { id: 'b2', type: 'hero_arrows', label: 'Hero Section', description: 'Hero section with carousel and call to action' },
          { id: 'b3', type: 'features', label: 'Key Features', description: 'Grid of 3 key product features' },
          { id: 'b4', type: 'cta_image', label: 'Sign Up Call', description: 'Large image with sign up form side-by-side' },
          { id: 'b5', type: 'footer', label: 'Footer', description: 'Standard footer with sitemap links' }
        ],
        description: 'Main landing page structure.',
        icons: ['React', 'Vite']
      },
    },
    {
      id: '2',
      type: 'block',
      position: { x: 100, y: 600 },
      data: { 
        label: 'Pricing Page', 
        status: 'in_progress',
        blocks: [
           { id: 'b1', type: 'interface_header', label: 'Nav', description: 'Simplified navigation' },
           { id: 'b2', type: 'plans', label: 'Pricing Tiers', description: 'Comparison of Free, Pro, and Enterprise plans' },
           { id: 'b3', type: 'faq', label: 'Common Questions', description: 'Accordion list of frequently asked questions' },
           { id: 'b4', type: 'footer', label: 'Footer' }
        ],
        description: 'Pricing tiers and comparison.',
        icons: ['Stripe']
      },
    },
  ],
  edges: [
    { id: 'e1-2', source: '1', target: '2', animated: false, style: { stroke: '#CACACA', strokeWidth: 2 }, markerEnd: { type: 'arrowclosed' as any, color: '#CACACA' } },
  ],
  viewMode: 'visual',
  showDetails: false,
  selectedNodeId: null,

  // History State
  past: [],
  future: [],
  historyLog: [],

  pushToHistory: (actionLabel: string) => {
    const { nodes, edges, past, historyLog } = get();
    // Deep clone to avoid reference issues
    const currentState = { 
        nodes: JSON.parse(JSON.stringify(nodes)), 
        edges: JSON.parse(JSON.stringify(edges)) 
    };
    
    set({
        past: [...past, currentState],
        future: [], // Clear future on new action
        historyLog: [{ action: actionLabel, timestamp: Date.now() }, ...historyLog].slice(0, 50) // Keep last 50 logs
    });
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
      historyLog: [{ action: 'Undo', timestamp: Date.now() }, ...historyLog].slice(0, 50)
    });
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
      historyLog: [{ action: 'Redo', timestamp: Date.now() }, ...historyLog].slice(0, 50)
    });
  },

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
    get().pushToHistory('Connected Nodes');
    set({
      edges: addEdge({ ...connection, animated: true, style: { stroke: '#CACACA', strokeWidth: 2 }, markerEnd: { type: 'arrowclosed' as any, color: '#CACACA' } }, get().edges),
    });
  },

  addNode: (position) => {
    get().pushToHistory('Added Page');
    const id = Math.random().toString(36).substr(2, 9);
    const newNode: BlockNode = {
      id,
      type: 'block',
      position,
      data: {
        label: 'New Page',
        status: 'idea',
        blocks: [{ id: Math.random().toString(36).substr(2, 9), type: 'interface_header', label: 'Header' }],
        description: 'New page description...',
        icons: []
      },
    };
    
    const { nodes: layoutedNodes } = getLayoutedElements([...get().nodes, newNode], get().edges);
    set({ nodes: layoutedNodes });
  },

  addBlockToNode: (nodeId, type) => {
    get().pushToHistory(`Added Block: ${type}`);
    const node = get().nodes.find(n => n.id === nodeId);
    if (node) {
      const newBlock: BlockItem = { 
        id: Math.random().toString(36).substr(2, 9), 
        type,
        label: type.replace(/_/g, ' '), // Default label from type
        description: '',
        chatMessages: []
      };
      
      // Update blocks first
      const updatedNodes = get().nodes.map(n => 
        n.id === nodeId ? { ...n, data: { ...n.data, blocks: [...n.data.blocks, newBlock] } } : n
      );
      
      // Then re-layout because block height might change effective size (though we use fixed size for dagre for now to keep it simple)
      // Actually, dagre uses fixed size in my config above, so just adding a block INSIDE a node doesn't change graph topology
      // But user requested "When creating a new block or changing another... arrange automatically"
      // If adding a block makes the node taller, we might want to adjust layout if we were calculating height dynamically.
      // For now, let's trigger layout just in case we switch to dynamic height later.
      const { nodes: layoutedNodes } = getLayoutedElements(updatedNodes, get().edges);
      
      set({ nodes: layoutedNodes });
    }
  },

  removeBlockFromNode: (nodeId, blockId) => {
    get().pushToHistory('Removed Block');
    const node = get().nodes.find(n => n.id === nodeId);
    if (node) {
      get().updateNodeData(nodeId, { blocks: node.data.blocks.filter(b => b.id !== blockId) });
    }
  },

  updateBlockLabel: (nodeId, blockId, label) => {
    get().pushToHistory('Updated Block Label');
    const node = get().nodes.find(n => n.id === nodeId);
    if (node) {
      const updatedBlocks = node.data.blocks.map(b => 
        b.id === blockId ? { ...b, label } : b
      );
      get().updateNodeData(nodeId, { blocks: updatedBlocks });
    }
  },

  updateBlockDescription: (nodeId, blockId, description) => {
    get().pushToHistory('Updated Block Description');
    const node = get().nodes.find(n => n.id === nodeId);
    if (node) {
      const updatedBlocks = node.data.blocks.map(b => 
        b.id === blockId ? { ...b, description } : b
      );
      get().updateNodeData(nodeId, { blocks: updatedBlocks });
    }
  },

  updateBlockVFP: (nodeId, blockId, vfp) => {
    get().pushToHistory('Updated Block VFP');
    const node = get().nodes.find(n => n.id === nodeId);
    if (node) {
      const updatedBlocks = node.data.blocks.map(b => 
        b.id === blockId ? { ...b, vfp } : b
      );
      get().updateNodeData(nodeId, { blocks: updatedBlocks });
    }
  },

  updateBlockFeatures: (nodeId, blockId, features) => {
    get().pushToHistory('Updated Block Features');
    const node = get().nodes.find(n => n.id === nodeId);
    if (node) {
      const updatedBlocks = node.data.blocks.map(b => 
        b.id === blockId ? { ...b, features } : b
      );
      get().updateNodeData(nodeId, { blocks: updatedBlocks });
    }
  },

  updatePageVFP: (nodeId, vfp) => {
    get().pushToHistory('Updated Page VFP');
    get().updateNodeData(nodeId, { vfp });
  },

  updatePageFeatures: (nodeId, features) => {
    get().pushToHistory('Updated Page Features');
    get().updateNodeData(nodeId, { features });
  },

  addBlockChatMessage: (nodeId, blockId, message) => {
    get().pushToHistory('Added Comment');
    const node = get().nodes.find(n => n.id === nodeId);
    if (node) {
      const updatedBlocks = node.data.blocks.map(b => {
        if (b.id === blockId) {
          const newMessage: ChatMessage = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
            ...message
          };
          return { ...b, chatMessages: [...(b.chatMessages || []), newMessage] };
        }
        return b;
      });
      get().updateNodeData(nodeId, { blocks: updatedBlocks });
    }
  },

  reorderBlocks: (nodeId, newBlocks) => {
    get().pushToHistory('Reordered Blocks');
    get().updateNodeData(nodeId, { blocks: newBlocks });
  },

  updateNodeData: (id, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
      ),
    });
  },

  addChildNode: (parentId) => {
    get().pushToHistory('Added Child Page');
    const parentNode = get().nodes.find(n => n.id === parentId);
    if (!parentNode) return;

    const newId = Math.random().toString(36).substr(2, 9);
    // Initial position (will be fixed by layout)
    const position = {
      x: parentNode.position.x,
      y: parentNode.position.y + 400 
    };

    const newNode: BlockNode = {
      id: newId,
      type: 'block',
      position,
      data: {
        label: 'New Page',
        status: 'idea',
        blocks: [{ id: Math.random().toString(36).substr(2, 9), type: 'interface_header', label: 'Header' }],
        description: 'New page...',
        icons: []
      },
    };

    const newEdge: Edge = {
      id: `e${parentId}-${newId}`,
      source: parentId,
      target: newId,
      animated: false,
      type: 'default',
      markerEnd: { type: 'arrowclosed' as any, color: '#CACACA' },
      style: { stroke: '#CACACA', strokeWidth: 2 } 
    };

    const updatedNodes = [...get().nodes, newNode];
    const updatedEdges = [...get().edges, newEdge];
    
    // Apply Auto Layout
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(updatedNodes, updatedEdges);

    set({
      nodes: layoutedNodes,
      edges: layoutedEdges
    });
  },

  setViewMode: (mode) => set({ viewMode: mode }),
  toggleDetails: () => set((state) => ({ showDetails: !state.showDetails })),
  setSelectedNode: (id) => set({ selectedNodeId: id }),

  addIconToNode: (nodeId, icon) => {
    get().pushToHistory('Added Icon');
    const node = get().nodes.find(n => n.id === nodeId);
    if (node) {
      const currentIcons = node.data.icons || [];
      if (!currentIcons.includes(icon)) {
        get().updateNodeData(nodeId, { icons: [...currentIcons, icon] });
      }
    }
  },

  removeIconFromNode: (nodeId, icon) => {
    get().pushToHistory('Removed Icon');
    const node = get().nodes.find(n => n.id === nodeId);
    if (node) {
      const currentIcons = node.data.icons || [];
      get().updateNodeData(nodeId, { icons: currentIcons.filter(i => i !== icon) });
    }
  },

  removeNode: (nodeId: string) => {
      get().pushToHistory('Removed Page');
      set({
          nodes: get().nodes.filter(n => n.id !== nodeId),
          edges: get().edges.filter(e => e.source !== nodeId && e.target !== nodeId)
      });
  },

  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  layoutNodes: () => {
    get().pushToHistory('Auto Layout');
    const { nodes, edges } = get();
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges);
    set({ nodes: layoutedNodes, edges: layoutedEdges });
  }
}));
