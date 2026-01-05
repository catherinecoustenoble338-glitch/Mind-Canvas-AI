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
const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB', showDetails = false) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 240; // Block width (200px) + reduced spacing
  const nodeHeight = showDetails ? 1200 : 600; // Increased height when details are shown

  dagreGraph.setGraph({ rankdir: direction, align: 'DL', ranksep: 50, nodesep: 20 }); // Increased spacing for details view

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    
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

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar?: string;
  status: 'active' | 'invited';
}

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
  historyLog: { id: string, action: string, timestamp: number, type: 'action' | 'snapshot', snapshotData?: { nodes: BlockNode[], edges: Edge[] } }[];
  undo: () => void;
  redo: () => void;
  pushToHistory: (actionLabel: string) => void;
  createSnapshot: (label: string) => void;
  restoreSnapshot: (snapshotId: string) => void;

  // Team Management (Project Level)
  teamMembers: TeamMember[];
  addTeamMember: (member: Omit<TeamMember, 'id' | 'status'>) => void;
  removeTeamMember: (id: string) => void;
  updateTeamMemberRole: (id: string, role: 'admin' | 'editor' | 'viewer') => void;

  // System Admin (Global Users)
  adminUsers: TeamMember[];
  addAdminUser: (user: Omit<TeamMember, 'id' | 'status'>) => void;
  removeAdminUser: (id: string) => void;
  updateAdminUser: (id: string, updates: Partial<TeamMember>) => void;

  // Dialog Navigation
  activeBlockId: string | null;
  setActiveBlockId: (id: string | null) => void;
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
          { 
            id: 'b1', 
            type: 'interface_header', 
            label: 'Main Nav', 
            description: 'Main navigation header with logo and links',
            chatMessages: [
                { id: 'cm1', text: 'Can we make the logo bigger?', sender: 'user', timestamp: Date.now() - 86400000 },
                { id: 'cm2', text: 'Sure, I have updated it to 32px height.', sender: 'system', timestamp: Date.now() - 86000000 },
                { id: 'cm3', text: 'Looks great now!', sender: 'user', timestamp: Date.now() - 85000000 }
            ]
          },
          { id: 'b2', type: 'hero_arrows', label: 'Hero Section', description: 'Hero section with carousel and call to action' },
          { id: 'b3', type: 'features', label: 'Key Features', description: 'Grid of 3 key product features' },
          { 
              id: 'b4', 
              type: 'cta_image', 
              label: 'Sign Up Call', 
              description: 'Large image with sign up form side-by-side',
              chatMessages: [
                  { id: 'cm4', text: 'Should we change the button color to orange?', sender: 'user', timestamp: Date.now() - 120000 },
                  { id: 'cm5', text: 'Orange might conflict with the error state. What about a darker blue?', sender: 'system', timestamp: Date.now() - 60000 }
              ]
          },
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
    {
      id: '3',
      type: 'block',
      position: { x: 600, y: 0 },
      data: {
        label: 'Chat Feature Roadmap',
        status: 'idea',
        vfp: 'Complete collaboration suite for team feedback',
        features: '- Real-time messaging\n- File attachments\n- @mentions\n- Email notifications',
        blocks: [
          { 
            id: 'r1', 
            type: 'timeline', 
            label: 'Q1: Core Messaging', 
            description: 'Basic text exchange and UI',
            vfp: 'Users can exchange text messages on blocks',
            features: '- Message bubbles\n- Timestamps\n- Sender avatars\n- History persistence'
          },
          { 
            id: 'r2', 
            type: 'upload_button', 
            label: 'Q2: Media Support', 
            description: 'File upload and previews',
            vfp: 'Contextual feedback via screenshots/files',
            features: '- Drag & drop upload\n- Image previews\n- PDF viewer integration\n- File size limits'
          },
          { 
            id: 'r3', 
            type: 'profile', 
            label: 'Q3: Team Features', 
            description: 'Mentions and notifications',
            vfp: 'Team members are notified of relevant feedback',
            features: '- @mention autocomplete\n- In-app notification center\n- Email digests\n- Read receipts'
          }
        ]
      }
    },
  ],
  edges: [
    { id: 'e1-2', source: '1', target: '2', animated: false, style: { stroke: '#CACACA', strokeWidth: 2 }, markerEnd: { type: 'arrowclosed' as any, color: '#CACACA' } },
    { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#CACACA', strokeWidth: 2, strokeDasharray: '5,5' }, markerEnd: { type: 'arrowclosed' as any, color: '#CACACA' } },
  ],
  viewMode: 'visual',
  showDetails: false,
  selectedNodeId: null,

  // History State
  past: [],
  future: [],
  historyLog: [],

  // Team State (Project Level)
  teamMembers: [
      { id: 'tm1', name: 'Alex Designer', email: 'alex@octoflow.com', role: 'admin', status: 'active' },
      { id: 'tm2', name: 'Sarah PM', email: 'sarah@client.com', role: 'editor', status: 'active' },
      { id: 'tm3', name: 'Mike Dev', email: 'mike@agency.com', role: 'viewer', status: 'invited' },
  ],

  // Admin State (Global System)
  adminUsers: [
      { id: 'u1', name: 'Admin User', email: 'admin@octoflow.com', role: 'admin', status: 'active' },
      { id: 'u2', name: 'John Employee', email: 'john@octoflow.com', role: 'editor', status: 'active' },
      { id: 'u3', name: 'Jane Employee', email: 'jane@octoflow.com', role: 'editor', status: 'active' },
      { id: 'u4', name: 'Guest User', email: 'guest@external.com', role: 'viewer', status: 'active' },
  ],

  addTeamMember: (member) => {
      get().pushToHistory(`Added Team Member: ${member.name}`);
      const newMember: TeamMember = {
          ...member,
          id: Math.random().toString(36).substr(2, 9),
          status: 'invited'
      };
      set({ teamMembers: [...get().teamMembers, newMember] });
  },

  removeTeamMember: (id) => {
      get().pushToHistory('Removed Team Member');
      set({ teamMembers: get().teamMembers.filter(m => m.id !== id) });
  },

  updateTeamMemberRole: (id, role) => {
      get().pushToHistory(`Updated Role: ${role}`);
      set({
          teamMembers: get().teamMembers.map(m => 
              m.id === id ? { ...m, role } : m
          )
      });
  },

  addAdminUser: (user) => {
      get().pushToHistory(`Admin: Added User ${user.name}`);
      const newUser: TeamMember = {
          ...user,
          id: Math.random().toString(36).substr(2, 9),
          status: 'active'
      };
      set({ adminUsers: [...get().adminUsers, newUser] });
  },

  removeAdminUser: (id) => {
      get().pushToHistory('Admin: Removed User');
      set({ adminUsers: get().adminUsers.filter(u => u.id !== id) });
  },

  updateAdminUser: (id, updates) => {
      get().pushToHistory('Admin: Updated User');
      set({
          adminUsers: get().adminUsers.map(u => 
              u.id === id ? { ...u, ...updates } : u
          )
      });
  },

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
        }, ...historyLog] // No limit on snapshots effectively, or separate limit? For now keeping in same array but maybe not slicing it out if we want them to persist longer? For now simplicity: keep in same log but careful with slicing if log gets long. Let's just slice to 50 for mixed list for now.
        // Actually, user wants snapshots to be distinct "checkpoints". Slicing snapshots out would be bad.
        // Let's NOT slice snapshots, but slice actions.
        // Revised logic: Filter actions > 50, keep all snapshots.
    });
  },

  restoreSnapshot: (snapshotId: string) => {
    const { historyLog } = get();
    const snapshot = historyLog.find(log => log.id === snapshotId);
    
    if (snapshot && snapshot.type === 'snapshot' && snapshot.snapshotData) {
        // Push current state to undo history before restoring? Usually yes.
        get().pushToHistory(`Restored: ${snapshot.action}`);
        
        set({
            nodes: JSON.parse(JSON.stringify(snapshot.snapshotData.nodes)),
            edges: JSON.parse(JSON.stringify(snapshot.snapshotData.edges)),
            // We don't clear future/past necessarily, but pushing to history handles the continuity.
        });
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
      historyLog: [{ 
          id: Math.random().toString(36).substr(2, 9),
          action: 'Redo', 
          timestamp: Date.now(), 
          type: 'action' as const
      }, ...historyLog].slice(0, 50)
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
    
    const { showDetails } = get();
    const { nodes: layoutedNodes } = getLayoutedElements([...get().nodes, newNode], get().edges, 'TB', showDetails);
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
      const { showDetails } = get();
      const { nodes: layoutedNodes } = getLayoutedElements(updatedNodes, get().edges, 'TB', showDetails);
      
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
    const { showDetails } = get();
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(updatedNodes, updatedEdges, 'TB', showDetails);

    set({
      nodes: layoutedNodes,
      edges: layoutedEdges
    });
  },

  setViewMode: (mode) => set({ viewMode: mode }),
  toggleDetails: () => {
    const newShowDetails = !get().showDetails;
    set({ showDetails: newShowDetails });
    // Re-layout when toggling details
    const { nodes, edges } = get();
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, 'TB', newShowDetails);
    set({ nodes: layoutedNodes, edges: layoutedEdges });
  },
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

  activeBlockId: null,
  setActiveBlockId: (id) => set({ activeBlockId: id }),

  layoutNodes: () => {
    get().pushToHistory('Auto Layout');
    const { nodes, edges, showDetails } = get();
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, 'TB', showDetails);
    set({ nodes: layoutedNodes, edges: layoutedEdges });
  }
}));
