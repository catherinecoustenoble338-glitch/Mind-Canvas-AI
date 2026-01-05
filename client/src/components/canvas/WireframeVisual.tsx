import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { WireframeType } from '@/store/useAppStore';

interface WireframeVisualProps {
  type: WireframeType;
  className?: string;
  label?: string; // Add label prop to display text inside blocks
}

export function WireframeVisual({ type, className, label }: WireframeVisualProps) {
  // Base classes
  // Using specific grey #818181 for background
  const base = "w-full overflow-hidden relative flex flex-col p-3 min-h-[48px] justify-start items-start transition-all bg-[#818181] rounded-sm";
  
  // Helper for text label inside the block - FDFDFD text color
  const BlockLabel = () => (
    <span className={cn(
      "absolute top-2 left-2 z-20 text-[#FDFDFD] text-[10px] font-medium leading-tight mb-2 truncate block opacity-90 shadow-sm text-left max-w-[90%] tracking-wide font-apple-system"
    )} style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      {label || type.replace(/_/g, ' ')}
    </span>
  );

  // Helper to add spacing at top to prevent overlap with absolute label
  const ContentWrapper = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("mt-5 w-full flex-1", className)}>
      {children}
    </div>
  );

  // Helper for generic lines - CACACA border color
  const Line = ({ w, h = "h-1", bg = "bg-transparent border border-[#CACACA]", rounded = "rounded-sm", className = "" }: any) => (
    <div className={`${w} ${h} ${bg} ${rounded} ${className}`}></div>
  );
  
  // Helper for generic box - CACACA border color
  const Box = ({ w, h, bg = "bg-transparent", border = "border border-[#CACACA]", rounded = "rounded-sm", className = "" }: any) => (
    <div className={`${w} ${h} ${bg} ${border} ${rounded} ${className}`}></div>
  );

  switch (type) {
    // --- BLUE GROUP (Content, Media) ---
    case 'text_video':
       return (
         <div className={cn(base, "h-[80px]", className)}>
            <BlockLabel />
            <ContentWrapper>
              <div className="flex gap-2 items-center flex-1 w-full h-full">
                 <div className="flex-1 space-y-1.5">
                    <Line w="w-full" h="h-1" />
                    <Line w="w-full" h="h-1" />
                    <Line w="w-3/4" h="h-1" />
                 </div>
                 <div className="w-10 h-8 bg-transparent rounded-sm flex items-center justify-center border border-white/50">
                    <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[5px] border-l-white/80 border-b-[3px] border-b-transparent ml-0.5"></div>
                 </div>
              </div>
            </ContentWrapper>
         </div>
       );
    case 'text':
    case 'text_image_blue':
      return (
         <div className={cn(base, "h-[64px]", className)}>
            <BlockLabel />
            <ContentWrapper>
              <div className="space-y-1.5 w-full">
                 <Line w="w-full" h="h-1" />
                 <Line w="w-full" h="h-1" />
                 <Line w="w-2/3" h="h-1" />
              </div>
            </ContentWrapper>
         </div>
       );
    case 'two_col_images':
       return (
         <div className={cn(base, "h-[70px]", className)}>
            <BlockLabel />
            <ContentWrapper>
              <div className="flex gap-2 h-full w-full">
                 <Box w="flex-1" h="h-full" />
                 <Box w="flex-1" h="h-full" />
              </div>
            </ContentWrapper>
         </div>
       );
    case 'two_col_images_text':
        return (
          <div className={cn(base, "h-[80px]", className)}>
              <BlockLabel />
              <ContentWrapper>
                <div className="flex gap-2 h-full w-full">
                   <div className="flex-1 rounded-sm p-1 flex flex-col justify-end border border-white/50 h-full">
                      <Line w="w-full" h="h-1" />
                      <Line w="w-2/3" h="h-1" className="mt-1" />
                   </div>
                   <div className="flex-1 rounded-sm p-1 flex flex-col justify-end border border-white/50 h-full">
                      <Line w="w-full" h="h-1" />
                      <Line w="w-2/3" h="h-1" className="mt-1" />
                   </div>
                </div>
              </ContentWrapper>
          </div>
        );
    case 'images':
       return (
         <div className={cn(base, "h-[70px]", className)}>
            <BlockLabel />
            <ContentWrapper>
              <div className="flex gap-2 h-full w-full">
                 <Box w="flex-1" h="h-full" />
                 <Box w="flex-1" h="h-full" />
                 <Box w="flex-1" h="h-full" />
              </div>
            </ContentWrapper>
         </div>
       );
    case 'map':
       return (
         <div className={cn(base, "h-[80px]", className)}>
            <BlockLabel />
            <ContentWrapper>
              <div className="flex-1 w-full relative rounded-sm overflow-hidden border border-white/50 h-full bg-slate-400/20">
                 {/* Better Map Representation - Streets */}
                 <div className="absolute inset-0 flex flex-col gap-2 p-1 opacity-40">
                    <div className="w-full h-1 bg-white/30 rotate-12 transform origin-top-left"></div>
                    <div className="w-full h-1 bg-white/30 -rotate-6 transform origin-bottom-right mt-4"></div>
                    <div className="absolute top-0 right-1/3 h-full w-1 bg-white/30"></div>
                 </div>
                 {/* Map Pin */}
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                        <div className="w-3 h-3 bg-slate-300 rounded-full border-2 border-slate-600 z-10 relative"></div>
                        <div className="w-0.5 h-2 bg-slate-600 absolute top-2 left-1/2 transform -translate-x-1/2"></div>
                    </div>
                 </div>
              </div>
            </ContentWrapper>
         </div>
       );
    case 'left_text_on_image':
       return (
         <div className={cn(base, "h-[80px]", className)}>
            <BlockLabel />
            <ContentWrapper>
              <div className="flex-1 w-full rounded-sm flex items-center px-2 border border-white/50 relative overflow-hidden h-full">
                 {/* Image background hint */}
                 <div className="absolute inset-0 bg-white/5 z-0"></div>
                 <div className="space-y-1 w-1/2 z-10">
                   <Line w="w-full" h="h-1" />
                   <Line w="w-2/3" h="h-1" />
                 </div>
              </div>
            </ContentWrapper>
         </div>
       );
    case 'vanilla_img_placeholder':
        return (
            <div className={cn(base, "h-[80px]", className)}>
               <BlockLabel />
               <ContentWrapper>
                 <div className="flex flex-col items-center justify-center gap-2 w-full h-full flex-1">
                     <div className="w-8 h-6 border border-white/50 rounded-sm relative overflow-hidden">
                        <div className="absolute bottom-0 w-full h-2 bg-white/20 transform -rotate-6 scale-110"></div>
                        <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-white/40"></div>
                     </div>
                 </div>
               </ContentWrapper>
            </div>
        );
     case 'slider':
        return (
           <div className={cn(base, "h-[50px]", className)}>
              <BlockLabel />
              <ContentWrapper className="mt-4">
                <div className="flex justify-between items-center w-full h-full">
                   <div className="text-[8px] text-white/50 px-1">{'<'}</div>
                   <div className="flex-1 flex flex-col justify-center">
                      <div className="flex gap-1 justify-center">
                          <div className="w-1 h-1 bg-white/80 rounded-full"></div>
                          <div className="w-1 h-1 border border-white/50 rounded-full"></div>
                          <div className="w-1 h-1 border border-white/50 rounded-full"></div>
                      </div>
                   </div>
                   <div className="text-[8px] text-white/50 px-1">{'>'}</div>
                </div>
              </ContentWrapper>
           </div>
        );
     case 'slider_2_column':
        return (
           <div className={cn(base, "h-[70px]", className)}>
              <BlockLabel />
              <ContentWrapper>
                <div className="flex gap-2 h-full w-full">
                   <div className="flex-1 rounded-sm border border-white/50 flex items-center pl-1">
                      <div className="text-[8px] text-white/50">{'<'}</div>
                   </div>
                   <div className="flex-1 rounded-sm border border-white/50 flex items-center justify-end pr-1">
                      <div className="text-[8px] text-white/50">{'>'}</div>
                   </div>
                </div>
              </ContentWrapper>
           </div>
        );

    // --- RED GROUP (Features, CTA, Cards) ---
    case 'features':
      return (
        <div className={cn(base, "h-[80px]", className)}>
          <BlockLabel />
          <ContentWrapper>
            <div className="flex gap-2 h-full items-end w-full">
              <div className="flex-1 flex flex-col gap-1 items-center">
                  <div className="w-2 h-2 border border-white/60 rounded-full mb-1"></div>
                  <Line w="w-full" h="h-px" />
                  <Line w="w-2/3" h="h-px" />
              </div>
              <div className="flex-1 flex flex-col gap-1 items-center">
                  <div className="w-2 h-2 border border-white/60 rounded-full mb-1"></div>
                  <Line w="w-full" h="h-px" />
                  <Line w="w-2/3" h="h-px" />
              </div>
              <div className="flex-1 flex flex-col gap-1 items-center">
                  <div className="w-2 h-2 border border-white/60 rounded-full mb-1"></div>
                  <Line w="w-full" h="h-px" />
                  <Line w="w-2/3" h="h-px" />
              </div>
            </div>
          </ContentWrapper>
        </div>
      );
    case 'cta':
      return (
        <div className={cn(base, "h-[70px]", className)}>
           <BlockLabel />
           <ContentWrapper>
             <div className="flex flex-col items-center justify-center w-full h-full gap-1">
                <Line w="w-1/2" h="h-1" />
                <div className="w-1/3 h-2 border border-white/50 rounded-sm mt-1"></div>
             </div>
           </ContentWrapper>
        </div>
      );
    case 'cta_image':
       return (
         <div className={cn(base, "h-[70px]", className)}>
            <BlockLabel />
            <ContentWrapper>
              <div className="flex justify-between items-center h-full w-full">
                 <div className="flex flex-col justify-center flex-1 pr-2">
                    <Line w="w-full" h="h-1" />
                    <Line w="w-1/2" h="h-1" className="mt-1" />
                 </div>
                 <Box w="w-12" h="h-8" />
              </div>
            </ContentWrapper>
         </div>
       );
    case 'cards':
    case 'cards_red':
       return (
         <div className={cn(base, "h-[80px]", className)}>
            <BlockLabel />
            <ContentWrapper>
              <div className="flex gap-2 h-full w-full">
                 <Box w="flex-1" h="h-full" />
                 <Box w="flex-1" h="h-full" />
                 <Box w="flex-1" h="h-full" />
              </div>
            </ContentWrapper>
         </div>
       );
    case 'slider_cards':
       return (
         <div className={cn(base, "h-[80px]", className)}>
             <BlockLabel />
             <ContentWrapper>
               <div className="grid grid-cols-2 gap-1 h-full w-full">
                   <Box w="col-span-2" h="h-3" />
                   <Box w="flex-1" h="h-full" />
                   <Box w="flex-1" h="h-full" />
               </div>
             </ContentWrapper>
         </div>
       );
    case 'buttons_left_aligned':
       return (
          <div className={cn(base, "h-[50px]", className)}>
             <BlockLabel />
             <ContentWrapper className="mt-4">
               <div className="flex gap-2 w-full items-center">
                  <div className="h-3 px-2 border border-white/60 rounded-full flex items-center justify-center">
                      <div className="w-2 h-1 bg-white/40"></div>
                  </div>
                  <div className="h-3 px-2 border border-white/60 rounded-full flex items-center justify-center">
                      <div className="w-2 h-1 border border-white/40"></div>
                  </div>
               </div>
             </ContentWrapper>
          </div>
       );
    case 'hero_arrows':
        return (
            <div className={cn(base, "h-[90px]", className)}> 
                <BlockLabel />
                <ContentWrapper>
                  <div className="flex justify-between items-center px-1 h-full w-full">
                      <div className="text-[8px] text-white/60">{'<'}</div>
                      <div className="text-center w-full px-2 flex flex-col items-center">
                         <div className="w-3/4 h-8 border border-white/50 rounded-sm mt-1 flex items-center justify-center">
                             <div className="w-4 h-4 border border-white/30 rounded-full"></div>
                         </div>
                         <div className="flex gap-1 justify-center mt-2">
                            <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                            <div className="w-1 h-1 border border-white/30 rounded-full"></div>
                         </div>
                      </div>
                      <div className="text-[8px] text-white/60">{'>'}</div>
                  </div>
                </ContentWrapper>
            </div>
        );

    // --- GREEN GROUP (Headers, Titles, Nav) ---
    case 'header':
    case 'interface_header':
      return (
        <div className={cn(base, "min-h-[40px] py-1", className)}>
           <BlockLabel />
           <ContentWrapper className="mt-3">
             <div className="flex justify-end items-center h-full w-full">
                <div className="flex gap-1 items-center">
                  <div className="w-1 h-1 rounded-full border border-white/50"></div>
                  <div className="w-1 h-1 rounded-full border border-white/50"></div>
                  <Line w="w-4" h="h-1" />
                </div>
             </div>
           </ContentWrapper>
        </div>
      );
    case 'title':
       return (
          <div className={cn(base, "min-h-[48px]", className)}>
             <BlockLabel />
             <ContentWrapper className="mt-4">
               <Line w="w-1/2" h="h-1" />
             </ContentWrapper>
          </div>
       );
    case 'features_green':
       return (
         <div className={cn(base, "h-[60px]", className)}>
            <BlockLabel />
            <ContentWrapper className="mt-1">
              <div className="flex justify-between h-full w-full gap-2 items-center">
                 <div className="flex-1 flex gap-1 items-center border-b border-white/20 pb-2">
                     <div className="w-1.5 h-1.5 border border-white/50 rounded-sm"></div>
                     <Line w="w-full" h="h-1" />
                 </div>
                 <div className="flex-1 flex gap-1 items-center border-b border-white/20 pb-2">
                     <div className="w-1.5 h-1.5 border border-white/50 rounded-sm"></div>
                     <Line w="w-full" h="h-1" />
                 </div>
              </div>
            </ContentWrapper>
         </div>
       );
    case 'table':
       return (
         <div className={cn(base, "h-[70px]", className)}>
            <BlockLabel />
            <ContentWrapper>
              <div className="flex flex-col gap-1.5 w-full">
                 <div className="flex items-center gap-2">
                     <div className="w-1 h-1 rounded-full border border-white/50"></div>
                     <div className="w-full h-px border-t border-dashed border-white/40"></div>
                     <div className="w-full h-px border-t border-dashed border-white/40"></div>
                     <div className="w-full h-px border-t border-dashed border-white/40"></div>
                 </div>
                 <div className="flex items-center gap-2">
                     <div className="w-1 h-1 rounded-full border border-white/50"></div>
                     <div className="w-full h-px border-t border-dashed border-white/40"></div>
                     <div className="w-full h-px border-t border-dashed border-white/40"></div>
                     <div className="w-full h-px border-t border-dashed border-white/40"></div>
                 </div>
                 <div className="flex items-center gap-2">
                     <div className="w-1 h-1 rounded-full border border-white/50"></div>
                     <div className="w-full h-px border-t border-dashed border-white/40"></div>
                     <div className="w-full h-px border-t border-dashed border-white/40"></div>
                     <div className="w-full h-px border-t border-dashed border-white/40"></div>
                 </div>
              </div>
            </ContentWrapper>
         </div>
       );
    case 'bullets':
       return (
          <div className={cn(base, "h-[70px]", className)}>
             <BlockLabel />
             <ContentWrapper>
               <div className="flex flex-col gap-1.5 w-full pl-1">
                  {[1,2,3].map(i => (
                     <div key={i} className="flex gap-2 items-center">
                        <div className="w-1 h-1 border border-white/50 rounded-full"></div>
                        <Line w="w-full" h="h-px" />
                        <div className="w-2 h-px bg-white/30"></div>
                     </div>
                  ))}
               </div>
             </ContentWrapper>
          </div>
       );
    case 'mobile_top_bar':
       return (
          <div className={cn(base, "h-[40px]", className)}>
             <BlockLabel />
             <ContentWrapper className="mt-3">
               <div className="flex justify-between items-center h-full w-full">
                  <div className="text-[8px] text-white/60">{'<'}</div>
               </div>
             </ContentWrapper>
          </div>
       );
    case 'no_logo_navigation':
       return (
          <div className={cn(base, "min-h-[40px]", className)}>
             <BlockLabel />
             <ContentWrapper className="mt-4">
               <div className="flex justify-start gap-2 w-full pt-1">
                  <Line w="w-8" h="h-1" />
                  <Line w="w-8" h="h-1" />
                  <Line w="w-8" h="h-1" />
               </div>
             </ContentWrapper>
          </div>
       );
    case 'articles':
       return (
          <div className={cn(base, "h-[70px]", className)}>
             <BlockLabel />
             <ContentWrapper>
               <div className="flex gap-1.5 h-full w-full">
                  <div className="flex-1 flex flex-col gap-1">
                     <Box w="w-full" h="h-full" />
                     <Line w="w-full" h="h-0.5" />
                     <Line w="w-2/3" h="h-0.5" />
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                     <Box w="w-full" h="h-full" />
                     <Line w="w-full" h="h-0.5" />
                     <Line w="w-2/3" h="h-0.5" />
                  </div>
               </div>
             </ContentWrapper>
          </div>
       );
    case 'profile':
       return (
          <div className={cn(base, "h-[60px]", className)}>
             <BlockLabel />
             <ContentWrapper className="mt-4">
               <div className="flex items-center gap-3 w-full">
                  <div className="w-8 h-8 rounded-full border border-white/50 flex items-center justify-center">
                      <div className="w-3 h-3 border-2 border-white/40 rounded-full mb-1"></div>
                  </div>
                  <div className="flex-1 border-b border-white/20 pb-1">
                     <div className="flex gap-1 mt-1">
                        <Line w="w-full" h="h-1" />
                        <Line w="w-2/3" h="h-1" />
                     </div>
                  </div>
               </div>
             </ContentWrapper>
          </div>
       );

    // --- PURPLE GROUP (Dividers, Footer) ---
    case 'divider':
      return (
        <div className={cn(base, "min-h-[32px] py-1", className)}>
           {/* No label for simple divider usually, or keep it small */}
           <BlockLabel /> 
           <ContentWrapper className="mt-3">
             <div className="w-full border-t border-dashed border-white/40 h-full flex items-center"></div>
           </ContentWrapper>
        </div>
      );
    case 'footer':
    case 'footer_green':
       return (
         <div className={cn(base, "min-h-[48px]", className)}>
            <BlockLabel />
            <ContentWrapper className="mt-4">
              <div className="flex justify-between items-end h-full w-full">
                 <div className="flex flex-col">
                   <div className="flex gap-1 items-center mb-1">
                       <div className="w-1 h-1 rounded-full bg-white/50"></div>
                       <div className="w-1 h-1 rounded-full border border-white/30"></div>
                   </div>
                 </div>
                 <div className="flex flex-col gap-1 items-end">
                    <Line w="w-8" h="h-0.5" />
                    <Line w="w-8" h="h-0.5" />
                    <Line w="w-8" h="h-0.5" />
                 </div>
              </div>
            </ContentWrapper>
         </div>
       );
    case 'loading':
       return (
          <div className={cn(base, "h-[60px]", className)}>
             <BlockLabel />
             <ContentWrapper>
               <div className="flex flex-col justify-center items-center gap-2 w-full h-full">
                  <div className="w-4 h-4 border border-white/50 border-t-transparent rounded-full animate-spin"></div>
               </div>
             </ContentWrapper>
          </div>
       );
    case 'audio':
       return (
          <div className={cn(base, "h-[50px]", className)}>
             <BlockLabel />
             <ContentWrapper className="mt-3">
               <div className="flex justify-center items-center gap-0.5 h-full w-full">
                  {[...Array(20)].map((_, i) => (
                     <div key={i} className="w-0.5 bg-white/40 rounded-full" style={{ height: Math.max(4, Math.random() * 20) + 'px' }}></div>
                  ))}
               </div>
             </ContentWrapper>
          </div>
       );
    case 'post_thread':
       return (
          <div className={cn(base, "h-[70px]", className)}>
             <BlockLabel />
             <ContentWrapper>
               <div className="ml-1 pl-2 border-l border-white/30 mt-1 space-y-2 w-full">
                  <div className="flex gap-2">
                      <div className="w-1 h-1 rounded-full bg-white/50 mt-1"></div>
                      <div className="flex-1 space-y-1">
                          <Line w="w-full" h="h-1" />
                          <Line w="w-3/4" h="h-1" />
                      </div>
                  </div>
               </div>
             </ContentWrapper>
          </div>
       );

    // --- ORANGE GROUP (Forms) ---
    case 'form':
      return (
        <div className={cn(base, "h-[70px]", className)}>
           <BlockLabel />
           <ContentWrapper>
             <div className="flex gap-2 mt-2 w-full">
               <div className="flex-1 border border-white/50 rounded-sm h-4"></div>
               <div className="flex-1 border border-white/50 rounded-sm h-4"></div>
             </div>
           </ContentWrapper>
        </div>
      );
    case 'sign_in':
       return (
         <div className={cn(base, "h-[50px]", className)}>
            <BlockLabel />
            <ContentWrapper className="mt-3">
              <div className="flex items-center justify-end gap-2 w-full border border-white/30 p-1 rounded-sm">
                 <div className="flex gap-1">
                     <Box w="w-4" h="h-2" />
                     <div className="w-4 h-2 bg-white/20 rounded-sm"></div>
                 </div>
              </div>
            </ContentWrapper>
         </div>
       );
    case 'text_sidebar_form':
       return (
          <div className={cn(base, "h-[70px]", className)}>
             <BlockLabel />
             <ContentWrapper>
               <div className="flex gap-2 h-full w-full">
                  <div className="flex-1 flex flex-col justify-center">
                     <Line w="w-full" h="h-1" className="mt-1" />
                     <Line w="w-full" h="h-1" className="mt-1" />
                     <div className="w-full h-2 border border-white/50 rounded-sm mt-1"></div>
                  </div>
                  <div className="w-8 h-full border border-white/50 rounded-sm flex flex-col items-center pt-1 gap-1">
                      <div className="w-4 h-2 bg-white/10 rounded-sm"></div>
                  </div>
               </div>
             </ContentWrapper>
          </div>
       );
    case 'radiobuttons':
       return (
          <div className={cn(base, "min-h-[40px]", className)}>
             <BlockLabel />
             <ContentWrapper className="mt-3">
               <div className="flex gap-4 items-center w-full">
                  <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full border border-white/50 flex items-center justify-center">
                          <div className="w-1 h-1 bg-white/80 rounded-full"></div>
                      </div>
                      <Line w="w-4" h="h-px" />
                  </div>
                  <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full border border-white/50"></div>
                      <Line w="w-4" h="h-px" />
                  </div>
               </div>
             </ContentWrapper>
          </div>
       );
    case 'text_form':
       return (
          <div className={cn(base, "h-[70px]", className)}>
             <BlockLabel />
             <ContentWrapper>
               <div className="flex flex-col gap-2 w-full">
                  <Line w="w-full" h="h-1" />
                  <div className="flex gap-2">
                      <Box w="flex-1" h="h-4" />
                      <div className="w-8 h-4 bg-white/20 rounded-sm border border-white/30"></div>
                  </div>
               </div>
             </ContentWrapper>
          </div>
       );
    case 'toggles':
       return (
          <div className={cn(base, "min-h-[40px]", className)}>
             <BlockLabel />
             <ContentWrapper className="mt-3">
               <div className="flex justify-end items-center px-1 w-full border-b border-white/10 pb-1">
                  <div className="w-5 h-2.5 border border-white/50 rounded-full relative">
                     <div className="absolute right-0 top-0 w-2.5 h-2.5 bg-white/80 rounded-full shadow-sm border border-white/50 transform -translate-y-px translate-x-px"></div>
                  </div>
               </div>
             </ContentWrapper>
          </div>
       );
    case 'hamburger':
       return (
          <div className={cn(base, "min-h-[40px]", className)}>
             <BlockLabel />
             <ContentWrapper className="mt-4">
               <div className="w-full pt-1">
                   <div className="flex justify-start items-center gap-2 w-full">
                      <div className="space-y-0.5">
                         <Line w="w-3" h="h-0.5" />
                         <Line w="w-3" h="h-0.5" />
                         <Line w="w-3" h="h-0.5" />
                      </div>
                      <Line w="w-full" h="h-1" />
                   </div>
               </div>
             </ContentWrapper>
          </div>
       );
    case 'upload_button':
       return (
          <div className={cn(base, "min-h-[40px] justify-center items-center", className)}>
             <ContentWrapper className="mt-0">
               <div className="flex justify-center items-center gap-2 w-full border border-dashed border-white/50 rounded-sm p-1">
                  <div className="w-4 h-4 rounded-full border border-white/40 flex items-center justify-center">
                     <div className="w-2 h-2 border-t border-l border-white/60 transform rotate-45 mt-0.5"></div>
                  </div>
                  <span className="text-[8px] text-white/80 font-medium">Upload</span>
               </div>
             </ContentWrapper>
          </div>
       );
    case 'next':
       return (
          <div className={cn(base, "min-h-[32px] justify-center", className)}>
             <BlockLabel />
             <ContentWrapper className="mt-3">
               <div className="flex justify-end items-center px-2 w-full bg-white/10 rounded-sm h-4">
                  <div className="text-[8px] text-white/50">→</div>
               </div>
             </ContentWrapper>
          </div>
       );
    case 'table_row':
       return (
          <div className={cn(base, "min-h-[32px]", className)}>
             <ContentWrapper className="mt-0">
               <div className="flex items-center gap-2 px-1 w-full border-b border-white/20 pb-1 h-full">
                  <div className="w-1.5 h-1.5 rounded-full border border-white/50"></div>
                  <div className="flex-1 flex gap-2">
                      <Line w="w-1/3" h="h-1" />
                      <Line w="w-1/3" h="h-1" />
                      <Line w="w-1/3" h="h-1" />
                  </div>
               </div>
             </ContentWrapper>
          </div>
       );
       

    // --- CYAN/LIGHT BLUE GROUP (Steps, Charts, Maps) ---
    case 'steps':
      return (
        <div className={cn(base, "h-[60px]", className)}>
           <BlockLabel />
           <ContentWrapper>
             <div className="flex justify-center gap-1 mt-2 w-full">
                {[1,2,3].map(i => (
                   <div key={i} className="flex items-center flex-1">
                      <div className="flex flex-col items-center w-full">
                          <div className="w-3 h-3 rounded-full border border-white/50 flex items-center justify-center bg-white/10">
                             <span className="text-[6px] text-white font-mono">{i}</span>
                          </div>
                          <Line w="w-full" h="h-px" className="mt-1" />
                      </div>
                   </div>
                ))}
             </div>
           </ContentWrapper>
        </div>
      );
    case 'faq':
    case 'accordion':
      return (
        <div className={cn(base, "h-[70px]", className)}>
           <BlockLabel />
           <ContentWrapper>
             <div className="space-y-1 w-full overflow-hidden">
                <div className="flex justify-between items-center border border-white/30 rounded-sm p-1">
                   <Line w="w-2/3" h="h-1" />
                   <div className="text-[6px] text-white/50">v</div>
                </div>
                <div className="flex justify-between items-center border border-white/30 rounded-sm p-1">
                   <Line w="w-2/3" h="h-1" />
                   <div className="text-[6px] text-white/50">v</div>
                </div>
             </div>
           </ContentWrapper>
        </div>
      );
    case 'chart':
       return (
         <div className={cn(base, "h-[70px]", className)}>
            <BlockLabel />
            <ContentWrapper>
              <div className="flex items-end gap-1 h-6 mt-1 w-full border-l border-b border-white/30 p-1">
                 <div className="w-1/4 h-1/3 border border-white/50 border-b-0"></div>
                 <div className="w-1/4 h-2/3 border border-white/50 border-b-0 bg-white/10"></div>
                 <div className="w-1/4 h-1/2 border border-white/50 border-b-0"></div>
                 <div className="w-1/4 h-full border border-white/50 border-b-0 bg-white/10"></div>
              </div>
            </ContentWrapper>
         </div>
       );
    case 'timeline':
       return (
          <div className={cn(base, "h-[60px]", className)}>
             <BlockLabel />
             <ContentWrapper>
               <div className="flex items-center gap-2 px-1 w-full mt-1 overflow-hidden h-full">
                  <div className="flex flex-col items-center h-full">
                     <div className="w-2 h-2 rounded-full border border-white/50"></div>
                     <div className="w-px flex-1 bg-white/30 min-h-[20px]"></div>
                     <div className="w-2 h-2 rounded-full border border-white/50"></div>
                  </div>
                  <div className="flex-1 space-y-3">
                      <Line w="w-full" h="h-1" />
                      <Line w="w-2/3" h="h-1" />
                  </div>
               </div>
             </ContentWrapper>
          </div>
       );
    case 'pagination':
       return (
          <div className={cn(base, "min-h-[32px]", className)}>
             <ContentWrapper className="mt-0">
               <div className="flex justify-center items-center gap-2 w-full h-full pt-1">
                  <div className="text-[6px] text-white/50 border border-white/30 px-1 rounded-sm">{'<'}</div>
                  <div className="flex gap-1">
                     <div className="w-1.5 h-1.5 rounded-sm bg-white/50"></div>
                     <div className="w-1.5 h-1.5 rounded-sm border border-white/30"></div>
                     <div className="w-1.5 h-1.5 rounded-sm border border-white/30"></div>
                  </div>
                  <div className="text-[6px] text-white/50 border border-white/30 px-1 rounded-sm">{'>'}</div>
               </div>
             </ContentWrapper>
          </div>
       );
    case 'map_contacts':
       return (
          <div className={cn(base, "h-[70px]", className)}>
             <BlockLabel />
             <ContentWrapper>
               <div className="flex gap-2 h-full w-full">
                  <div className="w-10 h-full border border-white/30 flex items-center justify-center bg-white/5 relative overflow-hidden">
                      <div className="w-3 h-4 border-2 border-white/40 rounded-full rounded-bl-none transform -rotate-45"></div>
                  </div>
                  <div className="flex-1 py-1 flex flex-col justify-center">
                     <Line w="w-full" h="h-1" className="mt-1" />
                     <Line w="w-2/3" h="h-1" className="mt-1" />
                     <div className="flex gap-1 mt-2">
                        <div className="w-3 h-3 border border-white/30 rounded-full"></div>
                        <div className="w-3 h-3 border border-white/30 rounded-full"></div>
                     </div>
                  </div>
               </div>
             </ContentWrapper>
          </div>
       );
    case 'table_of_contents':
       return (
          <div className={cn(base, "min-h-[32px]", className)}>
             <BlockLabel />
             <ContentWrapper className="mt-3">
               <div className="flex justify-end items-start px-1 w-full">
                  <div className="space-y-1">
                     <div className="flex gap-1 justify-end">
                         <Line w="w-4" h="h-px" />
                         <div className="w-1 h-1 rounded-full border border-white/50"></div>
                     </div>
                     <div className="flex gap-1 justify-end">
                         <Line w="w-4" h="h-px" />
                         <div className="w-1 h-1 rounded-full border border-white/50"></div>
                     </div>
                  </div>
               </div>
             </ContentWrapper>
          </div>
       );
    case 'invoice':
       return (
          <div className={cn(base, "h-[60px]", className)}>
             <BlockLabel />
             <ContentWrapper className="mt-3">
               <div className="flex justify-end items-center w-full border-b border-white/20 pb-1">
                  <Line w="w-4" h="h-1" />
               </div>
               <div className="mt-1 w-full flex flex-col gap-1 h-full">
                   <div className="flex gap-1 w-full">
                       <div className="flex-1 border-b border-white/20 h-4"></div>
                       <div className="flex-1 border-b border-white/20 h-4"></div>
                       <div className="flex-1 border-b border-white/20 h-4"></div>
                   </div>
                   <div className="flex justify-end w-full">
                        <Line w="w-1/3" h="h-1" />
                   </div>
               </div>
             </ContentWrapper>
          </div>
       );
    case 'checklist':
       return (
          <div className={cn(base, "min-h-[32px]", className)}>
             <BlockLabel />
             <ContentWrapper className="mt-3">
               <div className="flex items-center gap-2 px-1 w-full border border-white/30 rounded-sm p-1">
                  <div className="w-3 h-3 border border-white/50 rounded-sm flex items-center justify-center">
                      <div className="text-[6px] text-white/80">✓</div>
                  </div>
               </div>
             </ContentWrapper>
          </div>
       );
    case 'plans':
       return (
          <div className={cn(base, "h-[70px]", className)}>
             <BlockLabel />
             <ContentWrapper>
               <div className="flex gap-1 h-full w-full">
                  <div className="flex-1 border border-white/40 rounded-sm flex flex-col items-center p-1">
                      <div className="w-full h-2 bg-white/10 mb-1"></div>
                      <Line w="w-1/2" h="h-1" />
                  </div>
                  <div className="flex-1 border border-white/40 rounded-sm flex flex-col items-center p-1">
                      <div className="w-full h-2 bg-white/10 mb-1"></div>
                      <Line w="w-1/2" h="h-1" />
                  </div>
               </div>
             </ContentWrapper>
          </div>
       );
    case 'catalog':
       return (
          <div className={cn(base, "h-[70px]", className)}>
             <BlockLabel />
             <ContentWrapper>
               <div className="flex gap-1 items-center w-full h-full">
                   <Box w="flex-1" h="h-6" />
                   <Box w="flex-1" h="h-6" />
                   <Box w="flex-1" h="h-6" />
               </div>
             </ContentWrapper>
          </div>
       );
    case 'carousel':
        return (
            <div className={cn(base, "h-[60px]", className)}>
                <BlockLabel />
                <ContentWrapper className="mt-4">
                  <div className="flex gap-1 items-center justify-between w-full h-full">
                      <div className="w-4 h-full border border-white/20 flex items-center justify-center bg-white/5">
                          <div className="text-[6px] text-white/50">{'<'}</div>
                      </div>
                      <div className="flex-1 h-full mx-1 border border-white/20 flex items-center justify-center">
                      </div>
                      <div className="w-4 h-full border border-white/20 flex items-center justify-center bg-white/5">
                          <div className="text-[6px] text-white/50">{'>'}</div>
                      </div>
                  </div>
                </ContentWrapper>
            </div>
        );

    default:
      return (
        <div className={cn(base, "bg-slate-500 min-h-[40px] items-center text-center", className)}>
           <span className="text-[9px] text-slate-300 font-medium font-apple-system">{type}</span>
        </div>
      );
  }
}

export default memo(WireframeVisual);
