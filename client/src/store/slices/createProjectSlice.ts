import { StateCreator } from 'zustand';
import type { BlockNode, BlockItem, WireframeType, BlockData, ChatMessage, Task } from '../types';
import { Edge, NodeChange, EdgeChange, Connection, addEdge, applyNodeChanges, applyEdgeChanges, MarkerType } from 'reactflow';
import { getLayoutedElements } from '@/lib/graph-layout';
import { generateId } from '@/lib/id';

// ── Cross-slice interfaces ────────────────────────────────────────
interface WithHistory {
  pushToHistory: (actionLabel: string) => void;
}

interface WithUI {
  showDetails: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────

/** Find a node by ID in an array of nodes */
function findNode(nodes: BlockNode[], nodeId: string): BlockNode | undefined {
  return nodes.find((n) => n.id === nodeId);
}

/** Map blocks within a specific node, leaving other nodes untouched */
function mapBlocksInNode(
  nodes: BlockNode[],
  nodeId: string,
  mapper: (block: BlockItem) => BlockItem,
): BlockNode[] {
  return nodes.map((n) =>
    n.id === nodeId
      ? { ...n, data: { ...n.data, blocks: n.data.blocks.map(mapper) } }
      : n,
  );
}

/** Update a single block field by blockId within a node */
function updateBlockField(
  nodes: BlockNode[],
  nodeId: string,
  blockId: string,
  updates: Partial<BlockItem>,
): BlockNode[] {
  return mapBlocksInNode(nodes, nodeId, (b) =>
    b.id === blockId ? { ...b, ...updates } : b,
  );
}

/** Create a new ChatMessage with auto-generated id and timestamp */
function createChatMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage {
  return { id: generateId(), timestamp: Date.now(), ...message };
}

/** Default edge style for primary connections */
const PRIMARY_EDGE_STYLE = {
  animated: false,
  style: { stroke: '#74859A', strokeWidth: 4 },
  markerEnd: { type: MarkerType.ArrowClosed, color: '#74859A' },
  data: { isPrimary: true },
};

/** Default edge style for secondary connections */
const SECONDARY_EDGE_STYLE = {
  animated: false,
  style: { stroke: '#CACACA', strokeWidth: 2 },
  markerEnd: { type: MarkerType.ArrowClosed, color: '#CACACA' },
};

// ── Slice Interface ───────────────────────────────────────────────
export interface ProjectSlice {
  nodes: BlockNode[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  loadProjectData: (nodes: BlockNode[], edges: Edge[]) => void;

  addNode: (position: { x: number; y: number }) => void;
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

// ── Default data (shown when no project loaded yet) ───────────────
const DEFAULT_NODES: BlockNode[] = [
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
            { id: 'cm3', text: 'Looks great now!', sender: 'user', timestamp: Date.now() - 85000000 },
          ],
          tasks: [
            { id: 't1', title: 'Design Logo', status: 'done', priority: 'high', chatMessages: [], startDate: Date.now() - 100000000, endDate: Date.now() - 90000000 },
            { id: 't2', title: 'Implement Responsive Menu', status: 'done', priority: 'medium', chatMessages: [], startDate: Date.now() - 80000000, endDate: Date.now() - 70000000 },
          ],
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
            { id: 'cm5', text: 'Orange might conflict with the error state. What about a darker blue?', sender: 'system', timestamp: Date.now() - 60000 },
          ],
        },
        { id: 'b5', type: 'footer', label: 'Footer', description: 'Standard footer with sitemap links' },
      ],
      description: 'Main landing page structure.',
      icons: ['React', 'Vite'],
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
        { id: 'b4', type: 'footer', label: 'Footer' },
      ],
      description: 'Pricing tiers and comparison.',
      icons: ['Stripe'],
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
        { id: 'r1', type: 'timeline', label: 'Q1: Core Messaging', description: 'Basic text exchange and UI', vfp: 'Users can exchange text messages on blocks', features: '- Message bubbles\n- Timestamps\n- Sender avatars\n- History persistence' },
        { id: 'r2', type: 'upload_button', label: 'Q2: Media Support', description: 'File upload and previews', vfp: 'Contextual feedback via screenshots/files', features: '- Drag & drop upload\n- Image previews\n- PDF viewer integration\n- File size limits' },
        { id: 'r3', type: 'profile', label: 'Q3: Team Features', description: 'Mentions and notifications', vfp: 'Team members are notified of relevant feedback', features: '- @mention autocomplete\n- In-app notification center\n- Email digests\n- Read receipts' },
      ],
    },
  },
];

const DEFAULT_EDGES: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', ...PRIMARY_EDGE_STYLE },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    animated: true,
    style: { stroke: '#CACACA', strokeWidth: 2, strokeDasharray: '5,5' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#CACACA' },
  },
];

// ── Slice Implementation ──────────────────────────────────────────
export const createProjectSlice: StateCreator<
  ProjectSlice & WithHistory & WithUI,
  [],
  [],
  ProjectSlice
> = (set, get) => ({
  nodes: DEFAULT_NODES,
  edges: DEFAULT_EDGES,

  loadProjectData: (nodes, edges) => {
    set({ nodes, edges });
  },

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection) => {
    get().pushToHistory('Connected Nodes');
    set({ edges: addEdge({ ...connection, ...SECONDARY_EDGE_STYLE }, get().edges) });
  },

  // ── Node operations ─────────────────────────────────────────────

  addNode: (position) => {
    get().pushToHistory('Added Page');
    const newNode: BlockNode = {
      id: generateId(),
      type: 'block',
      position,
      data: {
        label: 'New Page',
        status: 'idea',
        blocks: [{ id: generateId(), type: 'interface_header', label: 'Header' }],
        description: 'New page description...',
        icons: [],
      },
    };

    const { showDetails } = get();
    const { nodes: layoutedNodes } = getLayoutedElements([...get().nodes, newNode], get().edges, 'TB', showDetails);
    set({ nodes: layoutedNodes });
  },

  addChildNode: (parentId) => {
    get().pushToHistory('Added Child Page');
    const parentNode = findNode(get().nodes, parentId);
    if (!parentNode) return;

    const newNodeId = generateId();
    const newNode: BlockNode = {
      id: newNodeId,
      type: 'block',
      position: { x: parentNode.position.x, y: parentNode.position.y + 200 },
      data: {
        label: 'New Child Page',
        status: 'idea',
        blocks: [{ id: generateId(), type: 'interface_header', label: 'Header' }],
        description: 'Child page description...',
        icons: [],
      },
    };

    const newEdge: Edge = {
      id: `e${parentId}-${newNodeId}`,
      source: parentId,
      target: newNodeId,
      ...PRIMARY_EDGE_STYLE,
    };

    const updatedNodes = [...get().nodes, newNode];
    const updatedEdges = [...get().edges, newEdge];
    const { showDetails } = get();
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(updatedNodes, updatedEdges, 'TB', showDetails);
    set({ nodes: layoutedNodes, edges: layoutedEdges });
  },

  removeNode: (nodeId) => {
    get().pushToHistory('Removed Page');
    set({
      nodes: get().nodes.filter((n) => n.id !== nodeId),
      edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
    });
  },

  updateNodeData: (id, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node,
      ),
    });
  },

  // ── Block operations ────────────────────────────────────────────

  addBlockToNode: (nodeId, type, insertAfterBlockId = null) => {
    get().pushToHistory(`Added Block: ${type}`);
    const node = findNode(get().nodes, nodeId);
    if (!node) return;

    const newBlock: BlockItem = {
      id: generateId(),
      type,
      label: type.replace(/_/g, ' '),
      description: '',
      chatMessages: [],
    };

    const updatedNodes = get().nodes.map((n) => {
      if (n.id !== nodeId) return n;
      const updatedBlocks = [...n.data.blocks];
      if (insertAfterBlockId) {
        const index = updatedBlocks.findIndex((b) => b.id === insertAfterBlockId);
        if (index !== -1) {
          updatedBlocks.splice(index + 1, 0, newBlock);
        } else {
          updatedBlocks.push(newBlock);
        }
      } else {
        updatedBlocks.push(newBlock);
      }
      return { ...n, data: { ...n.data, blocks: updatedBlocks } };
    });

    const { showDetails } = get();
    const { nodes: layoutedNodes } = getLayoutedElements(updatedNodes, get().edges, 'TB', showDetails);
    set({ nodes: layoutedNodes });
  },

  removeBlockFromNode: (nodeId, blockId) => {
    get().pushToHistory('Removed Block');
    const node = findNode(get().nodes, nodeId);
    if (!node) return;
    get().updateNodeData(nodeId, { blocks: node.data.blocks.filter((b) => b.id !== blockId) });
  },

  updateBlockLabel: (nodeId, blockId, label) => {
    get().pushToHistory('Updated Block Label');
    set({ nodes: updateBlockField(get().nodes, nodeId, blockId, { label }) });
  },

  updateBlockDescription: (nodeId, blockId, description) => {
    get().pushToHistory('Updated Block Description');
    set({ nodes: updateBlockField(get().nodes, nodeId, blockId, { description }) });
  },

  updateBlockVFP: (nodeId, blockId, vfp) => {
    get().pushToHistory('Updated Block VFP');
    set({ nodes: updateBlockField(get().nodes, nodeId, blockId, { vfp }) });
  },

  updateBlockFeatures: (nodeId, blockId, features) => {
    get().pushToHistory('Updated Block Features');
    set({ nodes: updateBlockField(get().nodes, nodeId, blockId, { features }) });
  },

  reorderBlocks: (nodeId, newBlocks) => {
    get().pushToHistory('Reordered Blocks');
    get().updateNodeData(nodeId, { blocks: newBlocks });
  },

  // ── Page-level operations ───────────────────────────────────────

  updatePageVFP: (nodeId, vfp) => {
    get().pushToHistory('Updated Page VFP');
    get().updateNodeData(nodeId, { vfp });
  },

  updatePageFeatures: (nodeId, features) => {
    get().pushToHistory('Updated Page Features');
    get().updateNodeData(nodeId, { features });
  },

  addIconToNode: (nodeId, icon) => {
    get().pushToHistory('Added Icon');
    const node = findNode(get().nodes, nodeId);
    if (!node) return;
    const currentIcons = node.data.icons || [];
    if (!currentIcons.includes(icon)) {
      get().updateNodeData(nodeId, { icons: [...currentIcons, icon] });
    }
  },

  removeIconFromNode: (nodeId, icon) => {
    get().pushToHistory('Removed Icon');
    const node = findNode(get().nodes, nodeId);
    if (!node) return;
    get().updateNodeData(nodeId, { icons: (node.data.icons || []).filter((i) => i !== icon) });
  },

  // ── Chat operations ─────────────────────────────────────────────

  addBlockChatMessage: (nodeId, blockId, message) => {
    get().pushToHistory('Added Comment');
    set({
      nodes: mapBlocksInNode(get().nodes, nodeId, (b) =>
        b.id === blockId
          ? { ...b, chatMessages: [...(b.chatMessages || []), createChatMessage(message)] }
          : b,
      ),
    });
  },

  // ── Task operations ─────────────────────────────────────────────

  addTask: (nodeId, blockId, task) => {
    get().pushToHistory('Added Task');
    const newTask: Task = { id: generateId(), chatMessages: [], ...task };
    set({
      nodes: mapBlocksInNode(get().nodes, nodeId, (b) =>
        b.id === blockId ? { ...b, tasks: [...(b.tasks || []), newTask] } : b,
      ),
    });
  },

  updateTask: (nodeId, blockId, taskId, updates) => {
    get().pushToHistory('Updated Task');
    set({
      nodes: mapBlocksInNode(get().nodes, nodeId, (b) =>
        b.id === blockId
          ? { ...b, tasks: (b.tasks || []).map((t) => (t.id === taskId ? { ...t, ...updates } : t)) }
          : b,
      ),
    });
  },

  removeTask: (nodeId, blockId, taskId) => {
    get().pushToHistory('Removed Task');
    set({
      nodes: mapBlocksInNode(get().nodes, nodeId, (b) =>
        b.id === blockId ? { ...b, tasks: (b.tasks || []).filter((t) => t.id !== taskId) } : b,
      ),
    });
  },

  addTaskChatMessage: (nodeId, blockId, taskId, message) => {
    get().pushToHistory('Added Task Comment');
    set({
      nodes: mapBlocksInNode(get().nodes, nodeId, (b) =>
        b.id === blockId
          ? {
              ...b,
              tasks: (b.tasks || []).map((t) =>
                t.id === taskId
                  ? { ...t, chatMessages: [...(t.chatMessages || []), createChatMessage(message)] }
                  : t,
              ),
            }
          : b,
      ),
    });
  },

  // ── Layout & Edge operations ────────────────────────────────────

  layoutNodes: () => {
    get().pushToHistory('Auto Layout');
    const { nodes, edges, showDetails } = get();
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, 'TB', showDetails);
    set({ nodes: layoutedNodes, edges: layoutedEdges });
  },

  updateEdgeData: (id, data) => {
    set({
      edges: get().edges.map((edge) => (edge.id === id ? { ...edge, ...data } : edge)),
    });
  },
});
