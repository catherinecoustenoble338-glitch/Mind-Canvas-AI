/**
 * Shared types used by both client and server.
 * Client-specific types (reactflow Node/Edge wrappers) stay in client/src/store/types.ts
 */

// ── Wireframe Block Types ─────────────────────────────────────────
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
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TeamRole = 'admin' | 'editor' | 'viewer';
export type MemberStatus = 'active' | 'invited';

// ── Chat ──────────────────────────────────────────────────────────
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'system';
  timestamp: number;
  attachments?: string[];
}

// ── Tasks ─────────────────────────────────────────────────────────
export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  assignee?: string;
  reviewer?: string;
  startDate?: number;
  endDate?: number;
  chatMessages: ChatMessage[];
  priority?: TaskPriority;
}

// ── Blocks ────────────────────────────────────────────────────────
export interface BlockItem {
  id: string;
  type: WireframeType;
  label?: string;
  description?: string;
  chatMessages?: ChatMessage[];
  vfp?: string;
  features?: string;
  assignee?: string;
  tasks?: Task[];
}

// ── Pages (Nodes) ─────────────────────────────────────────────────
export interface BlockData {
  label: string;
  status: PageStatus;
  blocks: BlockItem[];
  description?: string;
  icons?: string[];
  vfp?: string;
  features?: string;
  assignee?: string;
}

// ── Canvas Serialization (what gets stored in DB) ─────────────────
export interface SerializedNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: BlockData;
  measured?: { width: number; height: number };
}

export interface SerializedEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  style?: Record<string, string | number>;
  markerEnd?: Record<string, string>;
  data?: Record<string, unknown>;
}

export interface CanvasData {
  nodes: SerializedNode[];
  edges: SerializedEdge[];
}

// ── Team ──────────────────────────────────────────────────────────
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  avatar?: string;
  status: MemberStatus;
}

// ── API Response Types ────────────────────────────────────────────
export interface SafeUser {
  id: string;
  username: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface ProjectResponse {
  id: string;
  userId: string;
  name: string;
  description: string;
  canvasData: CanvasData;
  createdAt: string;
  updatedAt: string;
}
