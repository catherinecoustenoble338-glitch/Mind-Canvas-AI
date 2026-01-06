import { Node, Edge } from 'reactflow';

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
  label?: string; 
  description?: string;
  chatMessages?: ChatMessage[];
  vfp?: string; 
  features?: string; 
  assignee?: string; 
}

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

export type BlockNode = Node<BlockData>;
