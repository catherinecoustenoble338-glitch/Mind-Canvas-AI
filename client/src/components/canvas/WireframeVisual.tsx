import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { WireframeType } from '@/store/useAppStore';

interface WireframeVisualProps {
  type: WireframeType;
  className?: string;
  label?: string; // Add label prop to display text inside blocks
}

export function WireframeVisual({ type, className, label }: WireframeVisualProps) {
  // Base classes - now simpler, matching the reference style of solid colored blocks
  // The reference shows blocks are mostly solid colored bars with white text/lines inside
  const base = "w-full overflow-hidden relative flex flex-col p-2 min-h-[32px] justify-center";
  
  // Helper for text label inside the block (white text)
  const BlockLabel = () => (
    <span className="text-white text-[10px] font-medium leading-none mb-1 truncate block opacity-95">
      {label || type.replace(/_/g, ' ')}
    </span>
  );

  // Helper for generic lines
  const Line = ({ w, h = "h-1", bg = "bg-white/40", rounded = "rounded-full", className = "" }: any) => (
    <div className={`${w} ${h} ${bg} ${rounded} ${className}`}></div>
  );
  
  // Helper for generic box
  const Box = ({ w, h, bg = "bg-white/30", border = "", rounded = "rounded-sm", className = "" }: any) => (
    <div className={`${w} ${h} ${bg} ${border} ${rounded} ${className}`}></div>
  );

  switch (type) {
    // --- BLUE GROUP (Content, Media) ---
    case 'text_video':
       return (
         <div className={cn(base, "bg-[#3B82F6]", className)}>
            <BlockLabel />
            <div className="flex gap-2 items-center mt-1">
               <div className="flex-1 space-y-1">
                  <Line w="w-full" h="h-0.5" />
                  <Line w="w-3/4" h="h-0.5" />
               </div>
               <div className="w-6 h-4 bg-white/30 rounded-sm flex items-center justify-center">
                  <div className="w-0 h-0 border-t-[2px] border-t-transparent border-l-[3px] border-l-white border-b-[2px] border-b-transparent ml-0.5"></div>
               </div>
            </div>
         </div>
       );
    case 'text':
    case 'text_image_blue':
      return (
         <div className={cn(base, "bg-[#3B82F6]", className)}>
            <BlockLabel />
            <div className="space-y-1 mt-0.5">
               <Line w="w-full" h="h-0.5" />
               <Line w="w-2/3" h="h-0.5" />
            </div>
         </div>
       );
    case 'two_col_images':
       return (
         <div className={cn(base, "bg-[#60A5FA]", className)}>
            <BlockLabel />
            <div className="flex gap-1 mt-1 h-3">
               <Box w="flex-1" h="h-full" />
               <Box w="flex-1" h="h-full" />
            </div>
         </div>
       );
    case 'two_col_images_text':
        return (
          <div className={cn(base, "bg-[#60A5FA]", className)}>
              <BlockLabel />
              <div className="flex gap-1 mt-1 h-3">
                 <div className="flex-1 bg-white/20 rounded-sm p-0.5 flex flex-col justify-end">
                    <Line w="w-full" h="h-0.5" />
                 </div>
                 <div className="flex-1 bg-white/20 rounded-sm p-0.5 flex flex-col justify-end">
                    <Line w="w-full" h="h-0.5" />
                 </div>
              </div>
          </div>
        );
    case 'images':
       return (
         <div className={cn(base, "bg-[#3B82F6]", className)}>
            <BlockLabel />
            <div className="flex gap-1 mt-1 h-3">
               <Box w="flex-1" h="h-full" />
               <Box w="flex-1" h="h-full" />
               <Box w="flex-1" h="h-full" />
            </div>
         </div>
       );
    case 'map':
       return (
         <div className={cn(base, "bg-[#3B82F6]", className)}>
            <BlockLabel />
            <div className="mt-1 h-4 relative bg-white/20 rounded-sm overflow-hidden grid grid-cols-3 gap-px">
               <div className="col-span-2 bg-white/10"></div>
               <div className="bg-white/10"></div>
            </div>
         </div>
       );
    case 'left_text_on_image':
       return (
         <div className={cn(base, "bg-[#3B82F6]", className)}>
            <BlockLabel />
            <div className="mt-1 h-4 w-full bg-white/20 rounded-sm flex items-center px-1">
               <Line w="w-1/2" h="h-0.5" />
            </div>
         </div>
       );
    case 'vanilla_img_placeholder':
        return (
            <div className={cn(base, "bg-[#60A5FA]", className)}>
               <div className="flex items-center gap-2">
                   <div className="w-4 h-3 bg-white/30 rounded-sm"></div>
                   <BlockLabel />
               </div>
            </div>
        );
     case 'slider':
        return (
           <div className={cn(base, "bg-[#3B82F6]", className)}>
              <div className="flex justify-between items-center">
                 <BlockLabel />
                 <div className="flex gap-0.5">
                    <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                    <div className="w-1 h-1 bg-white/30 rounded-full"></div>
                 </div>
              </div>
           </div>
        );
     case 'slider_2_column':
        return (
           <div className={cn(base, "bg-[#3B82F6]", className)}>
              <BlockLabel />
              <div className="flex gap-1 mt-1 h-3">
                 <Box w="flex-1" h="h-full" />
                 <Box w="flex-1" h="h-full" />
              </div>
           </div>
        );

    // --- RED GROUP (Features, CTA, Cards) ---
    case 'features':
      return (
        <div className={cn(base, "bg-[#F43F5E]", className)}>
          <BlockLabel />
          <div className="flex gap-1 mt-1">
            <div className="flex-1 flex flex-col gap-0.5"><div className="w-1 h-1 bg-white/50 rounded-full"></div><Line w="w-full" h="h-0.5" /></div>
            <div className="flex-1 flex flex-col gap-0.5"><div className="w-1 h-1 bg-white/50 rounded-full"></div><Line w="w-full" h="h-0.5" /></div>
            <div className="flex-1 flex flex-col gap-0.5"><div className="w-1 h-1 bg-white/50 rounded-full"></div><Line w="w-full" h="h-0.5" /></div>
          </div>
        </div>
      );
    case 'cta':
      return (
        <div className={cn(base, "bg-[#EF4444]", className)}>
           <BlockLabel />
           <div className="mt-1 flex justify-center">
              <Line w="w-1/3" h="h-1.5" rounded="rounded-sm" bg="bg-white/40" />
           </div>
        </div>
      );
    case 'cta_image':
       return (
         <div className={cn(base, "bg-[#EF4444]", className)}>
            <div className="flex justify-between items-center">
               <BlockLabel />
               <Box w="w-4" h="h-3" />
            </div>
         </div>
       );
    case 'cards':
    case 'cards_red':
       return (
         <div className={cn(base, "bg-[#EF4444]", className)}>
            <BlockLabel />
            <div className="flex gap-1 mt-1 h-3">
               <Box w="flex-1" h="h-full" />
               <Box w="flex-1" h="h-full" />
               <Box w="flex-1" h="h-full" />
            </div>
         </div>
       );
    case 'slider_cards':
       return (
         <div className={cn(base, "bg-[#EF4444]", className)}>
             <BlockLabel />
             <div className="grid grid-cols-2 gap-1 mt-1 h-3">
                 <Box w="col-span-2" h="h-1.5" />
                 <Box w="flex-1" h="h-full" />
             </div>
         </div>
       );
    case 'buttons_left_aligned':
       return (
          <div className={cn(base, "bg-[#EF4444]", className)}>
             <BlockLabel />
             <div className="mt-1 flex gap-1">
                <Line w="w-4" h="h-1.5" rounded="rounded-sm" />
                <Line w="w-4" h="h-1.5" rounded="rounded-sm" bg="border border-white/40" />
             </div>
          </div>
       );
    case 'hero_arrows':
        return (
            <div className={cn(base, "bg-[#F59E0B]", className)}> {/* Adjusted to Orange/Yellow from ref */}
                <div className="flex justify-between items-center px-1">
                    <div className="text-[6px] text-white/60">{'<'}</div>
                    <div className="text-center">
                       <BlockLabel />
                       <div className="flex gap-0.5 justify-center mt-0.5">
                          <div className="w-0.5 h-0.5 bg-white/50 rounded-full"></div>
                          <div className="w-0.5 h-0.5 bg-white/50 rounded-full"></div>
                       </div>
                    </div>
                    <div className="text-[6px] text-white/60">{'>'}</div>
                </div>
            </div>
        );

    // --- GREEN GROUP (Headers, Titles, Nav) ---
    case 'header':
    case 'interface_header':
      return (
        <div className={cn(base, "bg-[#10B981] min-h-[28px]", className)}>
           <div className="flex justify-between items-center">
              <BlockLabel />
              <div className="flex gap-0.5">
                <Line w="w-2" h="h-0.5" />
                <Line w="w-2" h="h-0.5" />
              </div>
           </div>
        </div>
      );
    case 'title':
       return (
          <div className={cn(base, "bg-[#10B981]", className)}>
             <BlockLabel />
             <Line w="w-1/2" h="h-0.5" className="mt-0.5" />
          </div>
       );
    case 'features_green':
       return (
         <div className={cn(base, "bg-[#10B981]", className)}>
            <BlockLabel />
            <div className="flex justify-between mt-1">
               <div className="flex gap-0.5 items-center"><div className="w-1 h-1 bg-white/50 rounded-sm"></div><Line w="w-3" h="h-0.5" /></div>
               <div className="flex gap-0.5 items-center"><div className="w-1 h-1 bg-white/50 rounded-sm"></div><Line w="w-3" h="h-0.5" /></div>
            </div>
         </div>
       );
    case 'table':
       return (
         <div className={cn(base, "bg-[#3B82F6]", className)}>
            <BlockLabel />
            <div className="flex flex-col gap-1 mt-1 opacity-50">
               <div className="w-full h-px border-t border-dashed border-white"></div>
               <div className="w-full h-px border-t border-dashed border-white"></div>
            </div>
         </div>
       );
    case 'bullets':
       return (
          <div className={cn(base, "bg-[#3B82F6]", className)}>
             <BlockLabel />
             <div className="flex flex-col gap-0.5 mt-1">
                {[1,2].map(i => (
                   <div key={i} className="flex gap-1 items-center">
                      <div className="w-0.5 h-0.5 bg-white/50 rounded-full"></div>
                      <Line w="w-full" h="h-0.5" />
                   </div>
                ))}
             </div>
          </div>
       );
    case 'mobile_top_bar':
       return (
          <div className={cn(base, "bg-[#FBBF24]", className)}>
             <div className="flex justify-between items-center">
                <div className="text-[6px] text-white/60">{'<'}</div>
                <BlockLabel />
             </div>
          </div>
       );
    case 'no_logo_navigation':
       return (
          <div className={cn(base, "bg-[#10B981] min-h-[28px]", className)}>
             <div className="flex justify-center gap-2">
                <BlockLabel />
             </div>
          </div>
       );
    case 'articles':
       return (
          <div className={cn(base, "bg-[#3B82F6]", className)}>
             <BlockLabel />
             <div className="flex gap-1 mt-1 h-3">
                <Box w="flex-1" h="h-full" />
                <Box w="flex-1" h="h-full" />
                <Box w="flex-1" h="h-full" />
             </div>
          </div>
       );
    case 'profile':
       return (
          <div className={cn(base, "bg-[#3B82F6]", className)}>
             <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-white/20"></div>
                <BlockLabel />
             </div>
          </div>
       );

    // --- PURPLE GROUP (Dividers, Footer) ---
    case 'divider':
      return (
        <div className={cn(base, "bg-[#A855F7] min-h-[24px]", className)}>
           <div className="w-full border-t border-dashed border-white/40"></div>
        </div>
      );
    case 'footer':
    case 'footer_green':
       return (
         <div className={cn(base, (className && className.includes('green')) ? "bg-[#10B981]" : "bg-[#64748B]", "min-h-[32px]", className)}> {/* Default footer gray/slate */}
            <div className="flex justify-between items-end">
               <BlockLabel />
               <div className="flex gap-0.5">
                  <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                  <div className="w-1 h-1 bg-white/40 rounded-full"></div>
               </div>
            </div>
         </div>
       );
    case 'loading':
       return (
          <div className={cn(base, "bg-[#A855F7]", className)}>
             <div className="flex justify-center items-center gap-2">
                <div className="w-2 h-2 border border-white/50 border-t-transparent rounded-full animate-spin"></div>
                <BlockLabel />
             </div>
          </div>
       );
    case 'audio':
       return (
          <div className={cn(base, "bg-[#3B82F6]", className)}>
             <div className="flex justify-center items-end gap-0.5 h-3">
                {[...Array(8)].map((_, i) => (
                   <div key={i} className="w-0.5 bg-white/40" style={{ height: Math.random() * 8 + 2 + 'px' }}></div>
                ))}
             </div>
          </div>
       );
    case 'post_thread':
       return (
          <div className={cn(base, "bg-[#3B82F6]", className)}>
             <BlockLabel />
             <div className="ml-1 pl-1 border-l border-white/20 mt-1 space-y-0.5">
                <Line w="w-full" h="h-0.5" />
                <Line w="w-3/4" h="h-0.5" />
             </div>
          </div>
       );

    // --- ORANGE GROUP (Forms) ---
    case 'form':
      return (
        <div className={cn(base, "bg-[#FBBF24]", className)}>
           <BlockLabel />
           <div className="flex gap-1 mt-1">
             <Box w="flex-1" h="h-2" border="border border-white/30" />
             <Box w="flex-1" h="h-2" border="border border-white/30" />
           </div>
        </div>
      );
    case 'sign_in':
       return (
         <div className={cn(base, "bg-[#FBBF24]", className)}>
            <div className="flex items-center gap-2">
               <BlockLabel />
               <Box w="w-4" h="h-2" border="border border-white/30" />
            </div>
         </div>
       );
    case 'text_sidebar_form':
       return (
          <div className={cn(base, "bg-[#FBBF24]", className)}>
             <div className="flex gap-1">
                <div className="flex-1">
                   <BlockLabel />
                </div>
                <div className="w-6 h-4 border border-white/20 rounded-sm"></div>
             </div>
          </div>
       );
    case 'radiobuttons':
       return (
          <div className={cn(base, "bg-[#FBBF24] min-h-[28px]", className)}>
             <div className="flex gap-2 items-center">
                <div className="w-1.5 h-1.5 rounded-full border border-white/50 bg-white/20"></div>
                <BlockLabel />
             </div>
          </div>
       );
    case 'text_form':
       return (
          <div className={cn(base, "bg-[#FBBF24]", className)}>
             <BlockLabel />
             <div className="flex gap-1 mt-1">
                <Box w="flex-1" h="h-2" border="border border-white/30" />
                <Box w="w-4" h="h-2" bg="bg-white/30" />
             </div>
          </div>
       );
    case 'toggles':
       return (
          <div className={cn(base, "bg-[#FBBF24] min-h-[28px]", className)}>
             <div className="flex justify-between items-center">
                <BlockLabel />
                <div className="w-4 h-1.5 bg-white/20 rounded-full relative">
                   <div className="absolute right-0 top-0 w-2 h-1.5 bg-white/50 rounded-full"></div>
                </div>
             </div>
          </div>
       );
    case 'hamburger':
       return (
          <div className={cn(base, "bg-[#FBBF24] min-h-[28px]", className)}>
             <div className="flex justify-center items-center gap-2">
                <BlockLabel />
                <div className="space-y-0.5">
                   <Line w="w-2" h="h-px" />
                   <Line w="w-2" h="h-px" />
                </div>
             </div>
          </div>
       );
    case 'upload_button':
       return (
          <div className={cn(base, "bg-[#FBBF24] min-h-[28px]", className)}>
             <div className="flex justify-center items-center gap-1">
                <div className="w-3 h-3 rounded-full border border-white/40 flex items-center justify-center">
                   <div className="w-1.5 h-1.5 border-t border-l border-white/60 transform rotate-45 mt-0.5"></div>
                </div>
                <BlockLabel />
             </div>
          </div>
       );
    case 'next':
       return (
          <div className={cn(base, "bg-[#FBBF24] min-h-[28px]", className)}>
             <div className="flex justify-between items-center">
                <BlockLabel />
                <div className="text-[6px] text-white/50">{'>'}</div>
             </div>
          </div>
       );
    case 'table_row':
       return (
          <div className={cn(base, "bg-[#3B82F6] min-h-[24px]", className)}>
             <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-white/40"></div>
                <div className="flex-1 border-b border-dashed border-white/30"></div>
             </div>
          </div>
       );
       

    // --- CYAN/LIGHT BLUE GROUP (Steps, Charts, Maps) ---
    case 'steps':
      return (
        <div className={cn(base, "bg-[#3B82F6]", className)}>
           <BlockLabel />
           <div className="flex justify-center gap-1 mt-1">
              {[1,2,3].map(i => (
                 <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
              ))}
           </div>
        </div>
      );
    case 'faq':
    case 'accordion':
      return (
        <div className={cn(base, "bg-[#3B82F6]", className)}>
           <BlockLabel />
           <div className="mt-1 space-y-1">
              <div className="flex justify-between items-center border-b border-white/10 pb-0.5">
                 <Line w="w-1/2" h="h-0.5" />
                 <div className="text-[6px] text-white/50">v</div>
              </div>
           </div>
        </div>
      );
    case 'chart':
       return (
         <div className={cn(base, "bg-[#3B82F6]", className)}>
            <BlockLabel />
            <div className="flex items-end gap-0.5 h-3 mt-1">
               <div className="flex-1 h-1/3 bg-white/20 rounded-t-sm"></div>
               <div className="flex-1 h-2/3 bg-white/20 rounded-t-sm border border-white/30 border-b-0"></div>
               <div className="flex-1 h-1/2 bg-white/20 rounded-t-sm"></div>
            </div>
         </div>
       );
    case 'timeline':
       return (
          <div className={cn(base, "bg-[#3B82F6]", className)}>
             <div className="flex items-center gap-2">
                <div className="flex flex-col items-center">
                   <div className="w-1.5 h-1.5 rounded-full border border-white/40"></div>
                   <div className="w-px h-2 bg-white/30"></div>
                </div>
                <BlockLabel />
             </div>
          </div>
       );
    case 'pagination':
       return (
          <div className={cn(base, "bg-[#10B981] min-h-[28px]", className)}>
             <div className="flex justify-between items-center">
                <div className="text-[6px] text-white/50">{'<'}</div>
                <div className="flex gap-0.5">
                   <div className="w-1 h-1 rounded-full bg-white/50"></div>
                   <div className="w-1 h-1 rounded-full bg-white/20"></div>
                </div>
                <div className="text-[6px] text-white/50">{'>'}</div>
             </div>
          </div>
       );
    case 'map_contacts':
       return (
          <div className={cn(base, "bg-[#3B82F6]", className)}>
             <div className="flex gap-1">
                <Box w="w-4" h="h-4" border="border border-white/20" />
                <div>
                   <BlockLabel />
                   <Line w="w-full" h="h-0.5" className="mt-0.5" />
                </div>
             </div>
          </div>
       );
    case 'table_of_contents':
       return (
          <div className={cn(base, "bg-[#3B82F6] min-h-[28px]", className)}>
             <div className="flex justify-between items-center">
                <BlockLabel />
                <div className="space-y-0.5">
                   <div className="w-1 h-0.5 bg-white/40"></div>
                   <div className="w-1 h-0.5 bg-white/40"></div>
                </div>
             </div>
          </div>
       );
    case 'invoice':
       return (
          <div className={cn(base, "bg-[#3B82F6]", className)}>
             <div className="flex justify-between items-center">
                <BlockLabel />
                <Line w="w-2" h="h-0.5" />
             </div>
             <div className="w-full border-t border-white/20 mt-1"></div>
          </div>
       );
    case 'checklist':
       return (
          <div className={cn(base, "bg-[#3B82F6] min-h-[28px]", className)}>
             <div className="flex items-center gap-1">
                <div className="text-[6px] text-white/50">✓</div>
                <BlockLabel />
             </div>
          </div>
       );
    case 'plans':
       return (
          <div className={cn(base, "bg-[#3B82F6]", className)}>
             <BlockLabel />
             <div className="flex gap-1 mt-1 h-3">
                <Box w="flex-1" h="h-full" border="border border-white/20" />
                <Box w="flex-1" h="h-full" border="border border-white/20" />
             </div>
          </div>
       );
    case 'catalog':
       return (
          <div className={cn(base, "bg-[#3B82F6]", className)}>
             <BlockLabel />
             <div className="flex gap-1 items-center mt-1">
                 <Box w="w-3" h="h-2" border="border border-white/20" />
                 <Box w="w-3" h="h-2" border="border border-white/20" />
                 <Box w="w-3" h="h-2" border="border border-white/20" />
             </div>
          </div>
       );
    case 'carousel':
        return (
            <div className={cn(base, "bg-[#3B82F6]", className)}>
                <div className="flex gap-1 items-center justify-between">
                    <div className="text-[6px] text-white/50">{'<'}</div>
                    <BlockLabel />
                    <div className="text-[6px] text-white/50">{'>'}</div>
                </div>
            </div>
        );

    default:
      return (
        <div className={cn(base, "bg-slate-200 min-h-[32px] items-center text-center", className)}>
           <span className="text-[8px] text-slate-500">{type}</span>
        </div>
      );
  }
}

export default memo(WireframeVisual);
