import { StateCreator } from 'zustand';
import { BlockNode, BlockItem, WireframeType, BlockData, ChatMessage, Task } from '../types';
import { Edge, NodeChange, EdgeChange, Connection, addEdge, applyNodeChanges, applyEdgeChanges, Node } from 'reactflow';
import { getLayoutedElements } from '@/lib/graph-layout';

export interface ProjectSlice {
  nodes: BlockNode[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  
  addNode: (position: { x: number, y: number }) => void;
  addBlockToNode: (nodeId: string, type: WireframeType, insertAfterBlockId?: string | null) => void;
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
  addIconToNode: (nodeId: string, icon: string) => void;
  removeIconFromNode: (nodeId: string, icon: string) => void;
  layoutNodes: () => void;
  updateEdgeData: (id: string, data: Partial<Edge>) => void;
  
  // Task Management
  addTask: (nodeId: string, blockId: string, task: Omit<Task, 'id' | 'chatMessages'>) => void;
  updateTask: (nodeId: string, blockId: string, taskId: string, updates: Partial<Task>) => void;
  removeTask: (nodeId: string, blockId: string, taskId: string) => void;
  addTaskChatMessage: (nodeId: string, blockId: string, taskId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
}

export const createProjectSlice: StateCreator<ProjectSlice, [], [], ProjectSlice> = (set, get: any) => ({
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
            ],
            tasks: [
                { id: 't1', title: 'Design Logo', status: 'done', priority: 'high', chatMessages: [], startDate: Date.now() - 100000000, endDate: Date.now() - 90000000 },
                { id: 't2', title: 'Implement Responsive Menu', status: 'done', priority: 'medium', chatMessages: [], startDate: Date.now() - 80000000, endDate: Date.now() - 70000000 }
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
    { 
      id: 'e1-2', 
      source: '1', 
      target: '2', 
      animated: false, 
      style: { stroke: '#74859A', strokeWidth: 4 }, 
      markerEnd: { type: 'arrowclosed' as any, color: '#74859A' },
      data: { isPrimary: true }
    },
    { 
      id: 'e1-3', 
      source: '1', 
      target: '3', 
      animated: true, 
      style: { stroke: '#CACACA', strokeWidth: 2, strokeDasharray: '5,5' }, 
      markerEnd: { type: 'arrowclosed' as any, color: '#CACACA' } 
      // Secondary edge
    },
  ],

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
    get().pushToHistory?.('Connected Nodes');
    set({
      edges: addEdge({ ...connection, animated: false, style: { stroke: '#CACACA', strokeWidth: 2 }, markerEnd: { type: 'arrowclosed' as any, color: '#CACACA' } }, get().edges),
    });
  },

  addNode: (position) => {
    get().pushToHistory?.('Added Page');
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
    
    // Check showDetails via get() - assuming it's merged
    const { showDetails } = get();
    const { nodes: layoutedNodes } = getLayoutedElements([...get().nodes, newNode], get().edges, 'TB', showDetails);
    set({ nodes: layoutedNodes });
  },

  addBlockToNode: (nodeId, type, insertAfterBlockId = null) => {
    get().pushToHistory?.(`Added Block: ${type}`);
    const node = get().nodes.find((n: any) => n.id === nodeId);
    if (node) {
      const newBlock: BlockItem = { 
        id: Math.random().toString(36).substr(2, 9), 
        type,
        label: type.replace(/_/g, ' '),
        description: '',
        chatMessages: []
      };
      
      const updatedNodes = get().nodes.map((n: any) => {
        if (n.id === nodeId) {
          let updatedBlocks = [...n.data.blocks];
          if (insertAfterBlockId) {
            const index = updatedBlocks.findIndex(b => b.id === insertAfterBlockId);
            if (index !== -1) {
              updatedBlocks.splice(index + 1, 0, newBlock);
            } else {
              updatedBlocks.push(newBlock);
            }
          } else {
            updatedBlocks.push(newBlock);
          }
          return { ...n, data: { ...n.data, blocks: updatedBlocks } };
        }
        return n;
      });
      
      const { showDetails } = get();
      const { nodes: layoutedNodes } = getLayoutedElements(updatedNodes, get().edges, 'TB', showDetails);
      
      set({ nodes: layoutedNodes });
    }
  },

  removeBlockFromNode: (nodeId, blockId) => {
    get().pushToHistory?.('Removed Block');
    const node = get().nodes.find((n: any) => n.id === nodeId);
    if (node) {
      get().updateNodeData(nodeId, { blocks: node.data.blocks.filter((b: any) => b.id !== blockId) });
    }
  },

  updateBlockLabel: (nodeId, blockId, label) => {
    get().pushToHistory?.('Updated Block Label');
    const node = get().nodes.find((n: any) => n.id === nodeId);
    if (node) {
      const updatedBlocks = node.data.blocks.map((b: any) => 
        b.id === blockId ? { ...b, label } : b
      );
      get().updateNodeData(nodeId, { blocks: updatedBlocks });
    }
  },

  updateBlockDescription: (nodeId, blockId, description) => {
    get().pushToHistory?.('Updated Block Description');
    const node = get().nodes.find((n: any) => n.id === nodeId);
    if (node) {
      const updatedBlocks = node.data.blocks.map((b: any) => 
        b.id === blockId ? { ...b, description } : b
      );
      get().updateNodeData(nodeId, { blocks: updatedBlocks });
    }
  },

  updateBlockVFP: (nodeId, blockId, vfp) => {
    get().pushToHistory?.('Updated Block VFP');
    const node = get().nodes.find((n: any) => n.id === nodeId);
    if (node) {
      const updatedBlocks = node.data.blocks.map((b: any) => 
        b.id === blockId ? { ...b, vfp } : b
      );
      get().updateNodeData(nodeId, { blocks: updatedBlocks });
    }
  },

  updateBlockFeatures: (nodeId, blockId, features) => {
    get().pushToHistory?.('Updated Block Features');
    const node = get().nodes.find((n: any) => n.id === nodeId);
    if (node) {
      const updatedBlocks = node.data.blocks.map((b: any) => 
        b.id === blockId ? { ...b, features } : b
      );
      get().updateNodeData(nodeId, { blocks: updatedBlocks });
    }
  },

  updatePageVFP: (nodeId, vfp) => {
    get().pushToHistory?.('Updated Page VFP');
    get().updateNodeData(nodeId, { vfp });
  },

  updatePageFeatures: (nodeId, features) => {
    get().pushToHistory?.('Updated Page Features');
    get().updateNodeData(nodeId, { features });
  },

  addBlockChatMessage: (nodeId, blockId, message) => {
    get().pushToHistory?.('Added Comment');
    const node = get().nodes.find((n: any) => n.id === nodeId);
    if (node) {
      const updatedBlocks = node.data.blocks.map((b: any) => {
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
    get().pushToHistory?.('Reordered Blocks');
    get().updateNodeData(nodeId, { blocks: newBlocks });
  },

  updateNodeData: (id, data) => {
    set({
      nodes: get().nodes.map((node: any) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, ...data } };
        }
        return node;
      }),
    });
  },

  addChildNode: (parentId) => {
    get().pushToHistory?.('Added Child Page');
    const parentNode = get().nodes.find((n: any) => n.id === parentId);
    if (!parentNode) return;

    // Create new node slightly below parent
    const newNodeId = Math.random().toString(36).substr(2, 9);
    const newNode: BlockNode = {
      id: newNodeId,
      type: 'block',
      position: { x: parentNode.position.x, y: parentNode.position.y + 200 },
      data: {
        label: 'New Child Page',
        status: 'idea',
        blocks: [{ id: Math.random().toString(36).substr(2, 9), type: 'interface_header', label: 'Header' }],
        description: 'Child page description...',
        icons: []
      },
    };

    // Add connection
    const newEdge: Edge = {
      id: `e${parentId}-${newNodeId}`,
      source: parentId,
      target: newNodeId,
      animated: false,
      style: { stroke: '#74859A', strokeWidth: 4 },
      markerEnd: { type: 'arrowclosed' as any, color: '#74859A' },
      data: { isPrimary: true }
    };

    const updatedNodes = [...get().nodes, newNode];
    const updatedEdges = [...get().edges, newEdge];
    
    const { showDetails } = get();
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(updatedNodes, updatedEdges, 'TB', showDetails);
    
    set({ nodes: layoutedNodes, edges: layoutedEdges });
  },

  removeNode: (nodeId) => {
    get().pushToHistory?.('Removed Page');
    set({
      nodes: get().nodes.filter((n: any) => n.id !== nodeId),
      edges: get().edges.filter((e: any) => e.source !== nodeId && e.target !== nodeId),
    });
  },

  addIconToNode: (nodeId, icon) => {
    get().pushToHistory?.('Added Icon');
    const node = get().nodes.find((n: any) => n.id === nodeId);
    if (node) {
      const currentIcons = node.data.icons || [];
      if (!currentIcons.includes(icon)) {
        get().updateNodeData(nodeId, { icons: [...currentIcons, icon] });
      }
    }
  },

  removeIconFromNode: (nodeId, icon) => {
    get().pushToHistory?.('Removed Icon');
    const node = get().nodes.find((n: any) => n.id === nodeId);
    if (node) {
      const currentIcons = node.data.icons || [];
      get().updateNodeData(nodeId, { icons: currentIcons.filter((i: string) => i !== icon) });
    }
  },

  layoutNodes: () => {
    get().pushToHistory?.('Auto Layout');
    const { nodes, edges, showDetails } = get();
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges,
      'TB',
      showDetails
    );
    set({ nodes: layoutedNodes, edges: layoutedEdges });
  },

  updateEdgeData: (id, data) => {
    set({
      edges: get().edges.map((edge: any) => {
        if (edge.id === id) {
          return { ...edge, ...data };
        }
        return edge;
      }),
    });
  },

  addTask: (nodeId, blockId, task) => {
    get().pushToHistory?.('Added Task');
    const node = get().nodes.find((n: any) => n.id === nodeId);
    if (node) {
      const updatedBlocks = node.data.blocks.map((b: any) => {
        if (b.id === blockId) {
            const newTask: Task = {
                id: Math.random().toString(36).substr(2, 9),
                chatMessages: [],
                ...task
            };
            return { ...b, tasks: [...(b.tasks || []), newTask] };
        }
        return b;
      });
      get().updateNodeData(nodeId, { blocks: updatedBlocks });
    }
  },

  updateTask: (nodeId, blockId, taskId, updates) => {
    get().pushToHistory?.('Updated Task');
    const node = get().nodes.find((n: any) => n.id === nodeId);
    if (node) {
      const updatedBlocks = node.data.blocks.map((b: any) => {
        if (b.id === blockId) {
            const updatedTasks = b.tasks?.map((t: Task) => t.id === taskId ? { ...t, ...updates } : t) || [];
            return { ...b, tasks: updatedTasks };
        }
        return b;
      });
      get().updateNodeData(nodeId, { blocks: updatedBlocks });
    }
  },

  removeTask: (nodeId, blockId, taskId) => {
    get().pushToHistory?.('Removed Task');
    const node = get().nodes.find((n: any) => n.id === nodeId);
    if (node) {
      const updatedBlocks = node.data.blocks.map((b: any) => {
        if (b.id === blockId) {
            return { ...b, tasks: b.tasks?.filter((t: Task) => t.id !== taskId) || [] };
        }
        return b;
      });
      get().updateNodeData(nodeId, { blocks: updatedBlocks });
    }
  },

  addTaskChatMessage: (nodeId, blockId, taskId, message) => {
    get().pushToHistory?.('Added Task Comment');
    const node = get().nodes.find((n: any) => n.id === nodeId);
    if (node) {
      const updatedBlocks = node.data.blocks.map((b: any) => {
        if (b.id === blockId) {
            const updatedTasks = b.tasks?.map((t: Task) => {
                if (t.id === taskId) {
                    const newMessage: ChatMessage = {
                        id: Math.random().toString(36).substr(2, 9),
                        timestamp: Date.now(),
                        ...message
                    };
                    return { ...t, chatMessages: [...(t.chatMessages || []), newMessage] };
                }
                return t;
            }) || [];
            return { ...b, tasks: updatedTasks };
        }
        return b;
      });
      get().updateNodeData(nodeId, { blocks: updatedBlocks });
    }
  },
});
