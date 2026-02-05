import { Node } from 'reactflow';

// Re-export all shared types so existing imports don't break
export type {
  WireframeType,
  PageStatus,
  TaskStatus,
  TaskPriority,
  TeamRole,
  MemberStatus,
  ChatMessage,
  Task,
  BlockItem,
  BlockData,
  SerializedNode,
  SerializedEdge,
  CanvasData,
  TeamMember,
  SafeUser,
  ProjectResponse,
} from '@shared/types';

// Import for local use
import type { BlockData } from '@shared/types';

// Client-only: reactflow Node wrapper
export type BlockNode = Node<BlockData>;
