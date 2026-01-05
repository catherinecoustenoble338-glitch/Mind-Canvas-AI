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

export interface BlockItem {
  id: string;
  type: WireframeType;
  label?: string; // Ability to name each block
}

export interface BlockData {
  label: string;
  status: PageStatus;
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
  updateBlockLabel: (nodeId: string, blockId: string, label: string) => void;
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
        status: 'done',
        blocks: [
          { id: 'b1', type: 'interface_header', label: 'Main Nav' },
          { id: 'b2', type: 'hero_arrows', label: 'Hero Section' },
          { id: 'b3', type: 'features', label: 'Key Features' },
          { id: 'b4', type: 'cta_image', label: 'Sign Up Call' },
          { id: 'b5', type: 'footer', label: 'Footer' }
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
           { id: 'b1', type: 'interface_header', label: 'Nav' },
           { id: 'b2', type: 'plans', label: 'Pricing Tiers' },
           { id: 'b3', type: 'faq', label: 'Common Questions' },
           { id: 'b4', type: 'footer', label: 'Footer' }
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
        status: 'idea',
        blocks: [{ id: Math.random().toString(36).substr(2, 9), type: 'interface_header', label: 'Header' }],
        description: 'New page description...',
        icons: []
      },
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  addBlockToNode: (nodeId, type) => {
    const node = get().nodes.find(n => n.id === nodeId);
    if (node) {
      const newBlock: BlockItem = { 
        id: Math.random().toString(36).substr(2, 9), 
        type,
        label: type.replace(/_/g, ' ') // Default label from type
      };
      get().updateNodeData(nodeId, { blocks: [...node.data.blocks, newBlock] });
    }
  },

  removeBlockFromNode: (nodeId, blockId) => {
    const node = get().nodes.find(n => n.id === nodeId);
    if (node) {
      get().updateNodeData(nodeId, { blocks: node.data.blocks.filter(b => b.id !== blockId) });
    }
  },

  updateBlockLabel: (nodeId, blockId, label) => {
    const node = get().nodes.find(n => n.id === nodeId);
    if (node) {
      const updatedBlocks = node.data.blocks.map(b => 
        b.id === blockId ? { ...b, label } : b
      );
      get().updateNodeData(nodeId, { blocks: updatedBlocks });
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
