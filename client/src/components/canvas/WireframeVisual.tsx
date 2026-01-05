import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { WireframeType } from '@/store/useAppStore';

interface WireframeVisualProps {
  type: WireframeType;
  className?: string;
}

export function WireframeVisual({ type, className }: WireframeVisualProps) {
  const base = "w-full overflow-hidden relative border border-white/10";
  
  // Helper for generic lines
  const Line = ({ w, h = "h-1", bg = "bg-white/30", rounded = "rounded-full" }: any) => (
    <div className={`${w} ${h} ${bg} ${rounded}`}></div>
  );
  
  // Helper for generic box
  const Box = ({ w, h, bg = "bg-white/20", border = "", rounded = "rounded-sm" }: any) => (
    <div className={`${w} ${h} ${bg} ${border} ${rounded}`}></div>
  );

  switch (type) {
    // --- BLUE GROUP (Generic, Content, Media) ---
    case 'text_video':
       return (
         <div className={cn(base, "h-[60px] bg-blue-500 p-2 flex gap-2 items-center", className)}>
            <div className="flex-1 space-y-1">
               <Line w="w-full" />
               <Line w="w-3/4" />
            </div>
            <div className="w-8 h-6 bg-white/20 rounded-sm flex items-center justify-center">
               <div className="border-l-[4px] border-l-white/60 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent ml-0.5"></div>
            </div>
         </div>
       );
    case 'text':
    case 'text_image_blue':
      return (
         <div className={cn(base, "h-[60px] bg-blue-500 p-2 flex flex-col justify-center gap-1.5", className)}>
            <Line w="w-full" />
            <Line w="w-full" />
            <Line w="w-3/4" />
            <Line w="w-1/2" />
         </div>
      );
    case 'two_col_images':
       return (
         <div className={cn(base, "h-[60px] bg-blue-400 p-1 flex gap-1", className)}>
            <Box w="flex-1" h="h-full" />
            <Box w="flex-1" h="h-full" />
         </div>
       );
    case 'two_col_images_text':
        return (
          <div className={cn(base, "h-[60px] bg-blue-400 p-1 flex gap-1", className)}>
              <div className="flex-1 border border-white/20 rounded-sm p-1 flex flex-col justify-end">
                  <Line w="w-full" h="h-0.5" />
              </div>
              <div className="flex-1 border border-white/20 rounded-sm p-1 flex flex-col justify-end">
                  <Line w="w-full" h="h-0.5" />
              </div>
          </div>
        );
    case 'images':
       return (
         <div className={cn(base, "h-[60px] bg-blue-500 p-1 flex gap-1", className)}>
            <Box w="flex-1" h="h-full" />
            <Box w="flex-1" h="h-full" />
            <Box w="flex-1" h="h-full" />
         </div>
       );
    case 'map':
       return (
         <div className={cn(base, "h-[60px] bg-blue-500 p-1 relative", className)}>
            <div className="absolute inset-2 border border-white/20 grid grid-cols-3 grid-rows-2 gap-px">
               <div className="row-span-2 col-span-2 bg-white/10 flex items-center justify-center">
                  <div className="w-2 h-3 bg-white/40 rounded-full rounded-bl-none transform -rotate-45"></div>
               </div>
               <div className="bg-white/5"></div>
               <div className="bg-white/5"></div>
            </div>
         </div>
       );
    case 'left_text_on_image':
       return (
         <div className={cn(base, "h-[60px] bg-blue-500 p-2 flex items-center", className)}>
            <div className="w-full h-full border border-white/30 rounded-sm flex items-center p-2">
               <div className="space-y-1 w-1/2">
                  <Line w="w-full" />
                  <Line w="w-2/3" />
               </div>
            </div>
         </div>
       );
    case 'vanilla_img_placeholder':
        return (
            <div className={cn(base, "h-[60px] bg-blue-400 p-2 flex items-center justify-center", className)}>
                <div className="w-6 h-4 bg-white/20 rounded-sm relative overflow-hidden">
                   <div className="absolute bottom-0 left-0 w-full h-2 bg-white/20 transform rotate-12 origin-bottom-left"></div>
                </div>
            </div>
        );
     case 'slider':
        return (
           <div className={cn(base, "h-[40px] bg-blue-500 p-2 flex items-center justify-between", className)}>
              <div className="text-[6px] text-white/50">{'<'}</div>
               <div className="w-4 h-1 bg-white/40 rounded-full"></div>
              <div className="text-[6px] text-white/50">{'>'}</div>
           </div>
        );
     case 'slider_2_column':
        return (
           <div className={cn(base, "h-[60px] bg-blue-500 p-1 flex gap-1", className)}>
              <div className="flex-1 border border-white/20 rounded-sm flex items-center px-1">
                 <div className="text-[6px] text-white/50">{'<'}</div>
              </div>
              <div className="flex-1 border border-white/20 rounded-sm flex items-center justify-end px-1">
                 <div className="text-[6px] text-white/50">{'>'}</div>
              </div>
           </div>
        );

    // --- RED GROUP (Features, CTA, Cards) ---
    case 'features':
      return (
        <div className={cn(base, "h-[60px] bg-rose-400 p-2 flex flex-col gap-2", className)}>
          <Line w="w-1/3" h="h-1" />
          <div className="flex gap-1 h-full items-end">
            <div className="flex-1 flex flex-col items-center gap-0.5"><div className="w-1.5 h-1.5 bg-white/40 rounded-full mb-0.5"></div><Line w="w-full" h="h-0.5" /></div>
            <div className="flex-1 flex flex-col items-center gap-0.5"><div className="w-1.5 h-1.5 bg-white/40 rounded-full mb-0.5"></div><Line w="w-full" h="h-0.5" /></div>
            <div className="flex-1 flex flex-col items-center gap-0.5"><div className="w-1.5 h-1.5 bg-white/40 rounded-full mb-0.5"></div><Line w="w-full" h="h-0.5" /></div>
          </div>
        </div>
      );
    case 'cta':
      return (
        <div className={cn(base, "h-[60px] bg-red-400 flex flex-col items-center justify-center gap-2", className)}>
           <Line w="w-1/2" h="h-1.5" />
           <Line w="w-1/4" h="h-2" rounded="rounded-sm" />
        </div>
      );
    case 'cta_image':
       return (
         <div className={cn(base, "h-[60px] bg-red-400 p-2 flex gap-2 items-center", className)}>
            <div className="flex-1 space-y-1">
               <Line w="w-full" />
               <Line w="w-1/2" h="h-2" rounded="rounded-sm" />
            </div>
            <Box w="w-10" h="h-8" border="border border-white/20" />
         </div>
       );
    case 'cards':
    case 'cards_red':
       return (
         <div className={cn(base, "h-[60px] bg-red-400 p-1.5 flex gap-1", className)}>
            <Box w="flex-1" h="h-full" border="border border-white/20" />
            <Box w="flex-1" h="h-full" border="border border-white/20" />
            <Box w="flex-1" h="h-full" border="border border-white/20" />
         </div>
       );
    case 'slider_cards':
       return (
         <div className={cn(base, "h-[60px] bg-red-400 p-1.5 grid grid-cols-2 gap-1", className)}>
             <div className="col-span-2 h-1/2 border border-white/20 rounded-sm"></div>
             <div className="h-full border border-white/20 rounded-sm"></div>
             <div className="h-full border border-white/20 rounded-sm"></div>
         </div>
       );
    case 'buttons_left_aligned':
       return (
          <div className={cn(base, "h-[40px] bg-red-400 flex items-center px-2 gap-2", className)}>
             <Line w="w-8" h="h-3" rounded="rounded-full" />
             <div className="w-6 h-3 border border-white/30 rounded-full"></div>
          </div>
       );
    case 'hero_arrows':
        return (
            <div className={cn(base, "h-[80px] bg-sky-500 flex items-center justify-between px-2", className)}>
                <div className="text-white/50 text-[8px]">{'<'}</div>
                <div className="w-3/4 h-1/2 bg-white/10 rounded-sm border border-white/20"></div>
                <div className="text-white/50 text-[8px]">{'>'}</div>
            </div>
        );

    // --- GREEN GROUP (Headers, Titles, Nav) ---
    case 'header':
    case 'interface_header':
      return (
        <div className={cn(base, "h-[30px] bg-emerald-400 flex items-center justify-between px-2", className)}>
           <Line w="w-6" h="h-1.5" />
           <div className="flex gap-1">
             <Line w="w-3" h="h-1" />
             <Line w="w-3" h="h-1" />
           </div>
        </div>
      );
    case 'title':
       return (
          <div className={cn(base, "h-[40px] bg-emerald-400 flex items-center justify-center", className)}>
             <Line w="w-1/2" h="h-1.5" />
          </div>
       );
    case 'features_green':
       return (
         <div className={cn(base, "h-[40px] bg-emerald-400 p-1 flex justify-between items-center", className)}>
            <div className="flex gap-1">
               <div className="w-1 h-1 bg-white/40 rounded-sm"></div>
               <Line w="w-4" h="h-1" />
            </div>
            <div className="flex gap-1">
               <div className="w-1 h-1 bg-white/40 rounded-sm"></div>
               <Line w="w-4" h="h-1" />
            </div>
         </div>
       );
    case 'table':
       return (
         <div className={cn(base, "h-[60px] bg-blue-500 p-2 flex flex-col gap-1", className)}>
            <Line w="w-full" h="h-1" />
            <div className="flex flex-col gap-1 mt-1">
               <div className="w-full h-px border-t border-dashed border-white/30"></div>
               <div className="w-full h-px border-t border-dashed border-white/30"></div>
               <div className="w-full h-px border-t border-dashed border-white/30"></div>
            </div>
         </div>
       );
    case 'bullets':
       return (
          <div className={cn(base, "h-[60px] bg-blue-500 p-2 flex flex-col gap-1.5", className)}>
             {[1,2,3].map(i => (
                <div key={i} className="flex gap-1 items-center">
                   <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                   <Line w="w-full" h="h-0.5" />
                </div>
             ))}
          </div>
       );
    case 'mobile_top_bar':
       return (
          <div className={cn(base, "h-[30px] bg-orange-300 flex items-center justify-between px-2", className)}>
             <div className="text-[6px] text-white/50">{'<'}</div>
             <Line w="w-1/3" h="h-1" />
          </div>
       );
    case 'no_logo_navigation':
       return (
          <div className={cn(base, "h-[30px] bg-emerald-400 flex items-center justify-center px-2 gap-2", className)}>
             <Line w="w-4" h="h-1" />
             <Line w="w-4" h="h-1" />
             <Line w="w-4" h="h-1" />
          </div>
       );
    case 'articles':
       return (
          <div className={cn(base, "h-[60px] bg-blue-500 p-1.5 flex gap-1", className)}>
             {[1,2,3].map(i => (
                <div key={i} className="flex-1 flex flex-col gap-1">
                   <Box w="w-full" h="h-2/3" border="border border-white/20" />
                   <Line w="w-full" h="h-0.5" />
                </div>
             ))}
          </div>
       );
    case 'profile':
       return (
          <div className={cn(base, "h-[40px] bg-blue-500 flex items-center p-2 gap-2", className)}>
             <div className="w-6 h-6 border border-white/30 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white/30 rounded-full"></div>
             </div>
             <div className="flex-1 space-y-1">
                <Line w="w-full" h="h-1" />
                <Line w="w-2/3" h="h-1" />
             </div>
          </div>
       );

    // --- PURPLE GROUP (Dividers, Footer) ---
    case 'divider':
      return (
        <div className={cn(base, "h-[40px] bg-purple-400 flex items-center justify-center px-2", className)}>
           <div className="w-full border-t border-dashed border-white/50"></div>
        </div>
      );
    case 'footer':
    case 'footer_green':
       return (
         <div className={cn(base, (className && className.includes('green')) ? "bg-emerald-400" : "bg-purple-400", "h-[40px] flex items-end justify-between p-2", className)}>
            <div className="flex flex-col gap-0.5">
               <div className="w-2 h-2 rounded-full bg-white/30 mb-0.5"></div>
            </div>
            <div className="flex gap-1">
               <div className="w-2 h-0.5 bg-white/30"></div>
               <div className="w-2 h-0.5 bg-white/30"></div>
               <div className="w-2 h-0.5 bg-white/30"></div>
            </div>
         </div>
       );
    case 'loading':
       return (
          <div className={cn(base, "h-[60px] bg-purple-400 flex items-center justify-center", className)}>
             <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div>
          </div>
       );
    case 'audio':
       return (
          <div className={cn(base, "h-[40px] bg-blue-500 flex items-center justify-center gap-0.5 px-2", className)}>
             {[...Array(10)].map((_, i) => (
                <div key={i} className="w-0.5 bg-white/40" style={{ height: Math.random() * 10 + 5 + 'px' }}></div>
             ))}
          </div>
       );
    case 'post_thread':
       return (
          <div className={cn(base, "h-[60px] bg-blue-500 p-2 space-y-2", className)}>
             <div className="flex gap-1 items-center">
                <div className="w-1.5 h-1.5 bg-white/40 rounded-full"></div>
                <Line w="w-2/3" h="h-1" />
             </div>
             <div className="ml-2 pl-2 border-l border-white/20 space-y-1">
                <Line w="w-full" h="h-0.5" />
                <Line w="w-full" h="h-0.5" />
             </div>
          </div>
       );

    // --- ORANGE GROUP (Forms) ---
    case 'form':
      return (
        <div className={cn(base, "h-[60px] bg-orange-300 p-2 flex flex-col justify-center gap-1.5", className)}>
           <div className="flex gap-1">
             <Box w="flex-1" h="h-3" border="border border-white/40" />
             <Box w="flex-1" h="h-3" border="border border-white/40" />
           </div>
        </div>
      );
    case 'sign_in':
       return (
         <div className={cn(base, "h-[40px] bg-orange-300 flex items-center justify-center p-2 gap-2", className)}>
            <Box w="flex-1" h="h-full" border="border border-white/40" />
            <Box w="w-8" h="h-full" bg="bg-white/40" />
         </div>
       );
    case 'text_sidebar_form':
       return (
          <div className={cn(base, "h-[60px] bg-orange-300 p-1 flex gap-1", className)}>
             <div className="flex-1 space-y-1 pt-1">
                <Line w="w-full" h="h-0.5" />
                <Line w="w-full" h="h-0.5" />
                <Line w="w-2/3" h="h-0.5" />
             </div>
             <div className="w-8 h-full border border-white/30 rounded-sm flex flex-col justify-center gap-1 p-0.5">
                <Box w="w-full" h="h-2" border="border border-white/40" />
                <Box w="w-full" h="h-2" bg="bg-white/40" />
             </div>
          </div>
       );
    case 'radiobuttons':
       return (
          <div className={cn(base, "h-[40px] bg-orange-300 flex items-center px-2 gap-2", className)}>
             <div className="w-2 h-2 rounded-full border border-white/40 bg-white/20"></div>
             <Line w="w-8" h="h-0.5" />
             <div className="w-2 h-2 rounded-full border border-white/40"></div>
             <Line w="w-8" h="h-0.5" />
          </div>
       );
    case 'text_form':
       return (
          <div className={cn(base, "h-[60px] bg-orange-300 p-2 space-y-2", className)}>
             <div className="space-y-1">
               <Line w="w-full" h="h-0.5" />
               <Line w="w-2/3" h="h-0.5" />
             </div>
             <div className="flex gap-1">
                <Box w="flex-1" h="h-3" border="border border-white/30" />
                <Box w="w-8" h="h-3" bg="bg-white/30" />
             </div>
          </div>
       );
    case 'toggles':
       return (
          <div className={cn(base, "h-[30px] bg-orange-300 flex items-center px-2 justify-between", className)}>
             <div className="flex gap-1 items-center">
               <div className="w-2 h-2 rounded-full bg-white/40"></div>
               <div className="w-4 h-1 bg-white/20 rounded-full"></div>
             </div>
             <div className="w-6 h-2 bg-white/20 rounded-full relative">
                <div className="absolute right-0 top-0 w-3 h-2 bg-white/50 rounded-full"></div>
             </div>
          </div>
       );
    case 'hamburger':
       return (
          <div className={cn(base, "h-[40px] bg-orange-300 flex items-center justify-center", className)}>
             <div className="space-y-0.5">
                <Line w="w-4" h="h-0.5" />
                <Line w="w-4" h="h-0.5" />
                <Line w="w-4" h="h-0.5" />
             </div>
          </div>
       );
    case 'upload_button':
       return (
          <div className={cn(base, "h-[40px] bg-orange-300 flex items-center justify-center", className)}>
             <div className="w-6 h-6 rounded-full border border-white/40 flex items-center justify-center">
                <div className="w-2 h-2 border-t border-l border-white/60 transform rotate-45 mt-1"></div>
             </div>
          </div>
       );
    case 'next':
       return (
          <div className={cn(base, "h-[30px] bg-orange-300 flex items-center justify-between px-2", className)}>
             <div className="text-[6px] text-white/50">Next</div>
             <div className="text-[6px] text-white/50">{'>'}</div>
          </div>
       );
    case 'table_row':
       return (
          <div className={cn(base, "h-[30px] bg-blue-500 flex items-center px-2 gap-2", className)}>
             <div className="w-1 h-1 rounded-full bg-white/40"></div>
             <div className="flex-1 border-b border-dashed border-white/30"></div>
          </div>
       );
       

    // --- CYAN/LIGHT BLUE GROUP (Steps, Charts, Maps) ---
    case 'steps':
      return (
        <div className={cn(base, "h-[50px] bg-blue-500 flex items-center justify-center gap-1", className)}>
           {[1,2,3].map(i => (
             <React.Fragment key={i}>
               <div className="w-2 h-2 rounded-full bg-white/40 flex items-center justify-center text-[4px] text-white">✓</div>
               {i !== 3 && <div className="w-4 h-0.5 bg-white/30"></div>}
             </React.Fragment>
           ))}
        </div>
      );
    case 'faq':
    case 'accordion':
      return (
        <div className={cn(base, "h-[60px] bg-blue-500 p-2 flex flex-col gap-1", className)}>
           {[1,2,3].map(i => (
             <div key={i} className="flex justify-between items-center border-b border-white/10 pb-0.5">
                <Line w="w-2/3" h="h-0.5" />
                <div className="text-[6px] text-white/50">v</div>
             </div>
           ))}
        </div>
      );
    case 'chart':
       return (
         <div className={cn(base, "h-[60px] bg-blue-500 p-2 flex items-end gap-0.5", className)}>
            <div className="flex-1 h-1/3 bg-white/20 rounded-t-sm"></div>
            <div className="flex-1 h-2/3 bg-white/20 rounded-t-sm border border-white/30 border-b-0"></div>
            <div className="flex-1 h-1/2 bg-white/20 rounded-t-sm"></div>
         </div>
       );
    case 'timeline':
       return (
          <div className={cn(base, "h-[60px] bg-blue-500 flex items-center justify-center gap-1", className)}>
             <div className="flex flex-col items-center gap-0.5">
                <div className="w-2 h-2 rounded-full border border-white/40"></div>
                <div className="w-px h-4 bg-white/30"></div>
             </div>
             <div className="w-8 h-px bg-white/30"></div>
             <div className="flex flex-col items-center gap-0.5">
                <div className="w-2 h-2 rounded-full bg-white/40"></div>
             </div>
          </div>
       );
    case 'pagination':
       return (
          <div className={cn(base, "h-[30px] bg-emerald-400 flex items-center px-2 gap-1", className)}>
             <div className="text-[6px] text-white/50">{'<'}</div>
             <div className="w-1 h-1 rounded-full bg-white/50"></div>
             <div className="w-1 h-1 rounded-full bg-white/20"></div>
             <div className="w-1 h-1 rounded-full bg-white/20"></div>
             <div className="text-[6px] text-white/50">{'>'}</div>
          </div>
       );
    case 'map_contacts':
       return (
          <div className={cn(base, "h-[60px] bg-blue-500 p-1 flex gap-1", className)}>
             <Box w="w-1/3" h="h-full" border="border border-white/20" />
             <div className="flex-1 space-y-1 pt-1">
                <Line w="w-full" h="h-0.5" />
                <Line w="w-full" h="h-0.5" />
                <Line w="w-2/3" h="h-0.5" />
             </div>
          </div>
       );
    case 'table_of_contents':
       return (
          <div className={cn(base, "h-[30px] bg-blue-500 flex items-center justify-between px-2", className)}>
             <Line w="w-1/2" h="h-1" />
             <div className="space-y-0.5">
                <div className="w-1 h-0.5 bg-white/40"></div>
                <div className="w-1 h-0.5 bg-white/40"></div>
                <div className="w-1 h-0.5 bg-white/40"></div>
             </div>
          </div>
       );
    case 'invoice':
       return (
          <div className={cn(base, "h-[60px] bg-blue-500 p-1 flex flex-col gap-1", className)}>
             <div className="flex justify-between">
                <Line w="w-1/3" h="h-0.5" />
                <Line w="w-1/4" h="h-0.5" />
             </div>
             <div className="w-full border-t border-white/20 mt-1"></div>
             <div className="flex gap-2 mt-1">
                <div className="w-full border-r border-white/20 h-4"></div>
             </div>
          </div>
       );
    case 'checklist':
       return (
          <div className={cn(base, "h-[30px] bg-blue-500 flex items-center px-2 gap-2", className)}>
             <div className="text-[6px] text-white/50">✓</div>
             <Line w="w-1/2" h="h-0.5" />
             <div className="w-2 h-2 border border-white/30 rounded-sm ml-auto"></div>
          </div>
       );
    case 'plans':
       return (
          <div className={cn(base, "h-[60px] bg-blue-500 p-1 flex gap-1", className)}>
             <Box w="flex-1" h="h-full" border="border border-white/20" />
             <Box w="flex-1" h="h-full" border="border border-white/20" />
             <Box w="flex-1" h="h-full" border="border border-white/20" />
          </div>
       );
    case 'catalog':
       return (
          <div className={cn(base, "h-[60px] bg-blue-500 p-1 flex flex-col gap-1", className)}>
             <div className="flex gap-1 items-center">
                 <div className="space-y-0.5">
                    <div className="w-2 h-0.5 bg-white/40"></div>
                    <div className="w-2 h-0.5 bg-white/40"></div>
                 </div>
                 <Box w="w-4" h="h-3" border="border border-white/20" />
                 <Box w="w-4" h="h-3" border="border border-white/20" />
                 <Box w="w-4" h="h-3" border="border border-white/20" />
             </div>
          </div>
       );
    case 'carousel':
        return (
            <div className={cn(base, "h-[60px] bg-blue-500 p-1 flex gap-1 items-center", className)}>
                <div className="text-[6px] text-white/50">{'<'}</div>
                <Box w="flex-1" h="h-full" border="border border-white/20" />
                <Box w="flex-1" h="h-full" border="border border-white/20" />
                <div className="text-[6px] text-white/50">{'>'}</div>
            </div>
        );

    default:
      return (
        <div className={cn(base, "h-[40px] bg-slate-200 flex items-center justify-center text-[8px] text-slate-400", className)}>
           {type}
        </div>
      );
  }
}

export default memo(WireframeVisual);
