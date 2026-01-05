import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { WireframeType } from '@/store/useAppStore';

interface WireframeVisualProps {
  type: WireframeType;
  className?: string;
}

export function WireframeVisual({ type, className }: WireframeVisualProps) {
  // Base classes for the card container
  const base = "w-full overflow-hidden relative border border-slate-100/50";
  
  // Specific style configurations based on Octopus.do palette and shapes
  // Blue: Generic, Images, Video
  // Red: Feature, Alert, CTA
  // Green: Title, Header
  // Purple: Divider, Footer
  // Orange: Form, Input
  // Cyan: Map, Slider

  switch (type) {
    // --- HEADERS & TITLES (Green/Teal) ---
    case 'header':
      return (
        <div className={cn(base, "h-[40px] bg-emerald-400 flex items-center justify-between px-2", className)}>
           <div className="w-8 h-1.5 bg-white/40 rounded-full"></div>
           <div className="flex gap-1">
             <div className="w-4 h-1 bg-white/40 rounded-full"></div>
             <div className="w-4 h-1 bg-white/40 rounded-full"></div>
           </div>
        </div>
      );
    case 'divider':
      return (
        <div className={cn(base, "h-[30px] bg-purple-400 flex items-center justify-center px-2", className)}>
           <div className="w-full border-t border-dashed border-white/50"></div>
        </div>
      );
    
    // --- HERO SECTIONS (Blue/Cyan) ---
    case 'hero':
      return (
        <div className={cn(base, "h-[80px] bg-blue-500 flex flex-col items-center justify-center gap-1.5 p-2", className)}>
          <div className="w-3/4 h-2 bg-white/30 rounded-full"></div>
          <div className="w-1/2 h-1.5 bg-white/20 rounded-full"></div>
          <div className="flex gap-1 mt-1">
             <div className="w-6 h-2 bg-white/40 rounded-sm"></div>
             <div className="w-6 h-2 border border-white/30 rounded-sm"></div>
          </div>
        </div>
      );
    case 'hero_arrows':
      return (
         <div className={cn(base, "h-[80px] bg-sky-400 flex items-center justify-between px-2", className)}>
            <div className="text-white/50 text-[10px]">{'<'}</div>
            <div className="flex flex-col items-center gap-1 flex-1">
               <div className="w-12 h-8 bg-white/20 rounded-sm"></div>
               <div className="w-10 h-1 bg-white/30 rounded-full"></div>
            </div>
            <div className="text-white/50 text-[10px]">{'>'}</div>
         </div>
      );

    // --- CONTENT & FEATURES (Red/Pink/Blue) ---
    case 'features':
      return (
        <div className={cn(base, "h-[80px] bg-rose-400 p-2 flex flex-col gap-2", className)}>
          <div className="w-1/3 h-1.5 bg-white/40 rounded-full mb-1"></div>
          <div className="flex gap-1 h-full">
            {[1,2,3].map(i => (
              <div key={i} className="flex-1 flex flex-col gap-1">
                <div className="w-3 h-3 rounded-full bg-white/30 self-center"></div>
                <div className="w-full h-1 bg-white/20 rounded-full"></div>
                <div className="w-2/3 h-1 bg-white/20 rounded-full self-center"></div>
              </div>
            ))}
          </div>
        </div>
      );
    case 'cards':
      return (
        <div className={cn(base, "h-[80px] bg-red-400 p-2 grid grid-cols-2 gap-1", className)}>
           {[1,2,3].map(i => (
             <div key={i} className={cn("bg-white/20 rounded-sm border border-white/10", i===3 ? "col-span-2 h-1/2" : "")}></div>
           ))}
        </div>
      );
    case 'cta':
      return (
        <div className={cn(base, "h-[60px] bg-red-500 flex flex-col items-center justify-center gap-2", className)}>
           <div className="w-1/2 h-1.5 bg-white/40 rounded-full"></div>
           <div className="w-1/4 h-3 bg-white/30 rounded-sm"></div>
        </div>
      );
    
    // --- TEXT & MEDIA (Blue/Indigo) ---
    case 'text':
      return (
         <div className={cn(base, "h-[60px] bg-blue-500 p-2 flex flex-col gap-1.5 justify-center", className)}>
            <div className="w-full h-1 bg-white/30 rounded-full"></div>
            <div className="w-full h-1 bg-white/30 rounded-full"></div>
            <div className="w-3/4 h-1 bg-white/30 rounded-full"></div>
            <div className="w-1/2 h-1 bg-white/30 rounded-full"></div>
         </div>
      );
    case 'text_image':
      return (
        <div className={cn(base, "h-[60px] bg-indigo-500 p-1 flex gap-2 items-center", className)}>
           <div className="flex-1 space-y-1">
              <div className="w-full h-1 bg-white/30 rounded-full"></div>
              <div className="w-2/3 h-1 bg-white/30 rounded-full"></div>
           </div>
           <div className="w-10 h-8 bg-white/20 border border-white/10 rounded-sm"></div>
        </div>
      );
    case 'two_col_images':
       return (
         <div className={cn(base, "h-[60px] bg-blue-400 p-1 flex gap-1", className)}>
            <div className="flex-1 bg-white/20 rounded-sm border border-white/10 flex flex-col justify-end p-0.5">
               <div className="w-full h-0.5 bg-white/40 rounded-full mb-0.5"></div>
            </div>
            <div className="flex-1 bg-white/20 rounded-sm border border-white/10 flex flex-col justify-end p-0.5">
               <div className="w-full h-0.5 bg-white/40 rounded-full mb-0.5"></div>
            </div>
         </div>
       );
    
    // --- FORMS & INPUTS (Orange/Yellow) ---
    case 'form':
      return (
        <div className={cn(base, "h-[80px] bg-orange-300 p-2 flex flex-col justify-center gap-1.5", className)}>
           <div className="flex gap-1">
             <div className="flex-1 h-3 border border-white/40 rounded-sm"></div>
             <div className="flex-1 h-3 border border-white/40 rounded-sm"></div>
           </div>
           <div className="w-full h-3 border border-white/40 rounded-sm"></div>
           <div className="w-1/3 h-3 bg-white/40 rounded-sm self-end mt-1"></div>
        </div>
      );
    case 'signup':
    case 'login':
       return (
         <div className={cn(base, "h-[60px] bg-amber-400 flex items-center justify-center p-2", className)}>
            <div className="w-3/4 border border-white/40 rounded-sm h-full flex flex-col items-center justify-center gap-1">
               <div className="w-1/2 h-1 bg-white/30 rounded-full"></div>
               <div className="w-2/3 h-2 bg-white/30 rounded-sm"></div>
            </div>
         </div>
       );

    // --- LISTS & STEPS (Blue/Light Blue) ---
    case 'steps':
      return (
        <div className={cn(base, "h-[50px] bg-sky-500 flex items-center justify-center gap-1", className)}>
           {[1,2,3].map(i => (
             <React.Fragment key={i}>
               <div className="w-2 h-2 rounded-full bg-white/40 flex items-center justify-center text-[4px] text-white">✓</div>
               {i !== 3 && <div className="w-4 h-0.5 bg-white/30"></div>}
             </React.Fragment>
           ))}
        </div>
      );
    case 'faq':
      return (
        <div className={cn(base, "h-[60px] bg-sky-600 p-2 flex flex-col gap-1", className)}>
           {[1,2,3].map(i => (
             <div key={i} className="flex justify-between items-center border-b border-white/10 pb-0.5">
                <div className="w-2/3 h-1 bg-white/30 rounded-full"></div>
                <div className="text-[6px] text-white/50">v</div>
             </div>
           ))}
        </div>
      );

    // --- MEDIA (Gallery, Video) ---
    case 'gallery':
      return (
        <div className={cn(base, "h-[60px] bg-blue-400 p-1 flex gap-1", className)}>
           <div className="flex-1 bg-white/20 rounded-sm"></div>
           <div className="flex-1 bg-white/20 rounded-sm"></div>
           <div className="flex-1 bg-white/20 rounded-sm"></div>
        </div>
      );
    case 'video':
      return (
        <div className={cn(base, "h-[80px] bg-blue-500 flex items-center justify-center", className)}>
           <div className="w-full h-full p-2">
              <div className="w-full h-full border border-white/20 rounded-sm flex items-center justify-center bg-white/5">
                 <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-white/60 border-b-[4px] border-b-transparent ml-0.5"></div>
              </div>
           </div>
        </div>
      );
    
    // --- DATA & TABLES (Blue/Cyan) ---
    case 'pricing':
      return (
         <div className={cn(base, "h-[80px] bg-blue-400 p-1.5 flex gap-1 items-end", className)}>
            <div className="flex-1 h-3/4 border border-white/20 rounded-sm flex flex-col items-center pt-1">
               <div className="w-2/3 h-0.5 bg-white/40"></div>
            </div>
            <div className="flex-1 h-full border border-white/30 bg-white/10 rounded-sm flex flex-col items-center pt-1">
               <div className="w-2/3 h-0.5 bg-white/60"></div>
            </div>
            <div className="flex-1 h-3/4 border border-white/20 rounded-sm flex flex-col items-center pt-1">
               <div className="w-2/3 h-0.5 bg-white/40"></div>
            </div>
         </div>
      );
    case 'table':
      return (
         <div className={cn(base, "h-[60px] bg-blue-500 p-2 flex flex-col gap-1", className)}>
            <div className="w-full h-1 bg-white/40 rounded-full mb-1"></div>
            {[1,2,3].map(i => (
               <div key={i} className="flex gap-1">
                  <div className="w-1/4 h-0.5 bg-white/20"></div>
                  <div className="w-1/4 h-0.5 bg-white/20"></div>
                  <div className="w-1/4 h-0.5 bg-white/20"></div>
                  <div className="w-1/4 h-0.5 bg-white/20"></div>
               </div>
            ))}
         </div>
      );

    // --- FOOTER (Purple) ---
    case 'footer':
      return (
        <div className={cn(base, "h-[40px] bg-purple-500 flex items-end justify-between p-2", className)}>
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

    default:
      return (
        <div className={cn(base, "h-[40px] bg-slate-200 flex items-center justify-center text-[8px] text-slate-400", className)}>
           {type}
        </div>
      );
  }
}

export default memo(WireframeVisual);
