import React from 'react';
import { cn } from '@/lib/utils';
import { BlockType } from '@/store/useAppStore';

interface WireframeVisualProps {
  type: BlockType;
  className?: string;
}

export function WireframeVisual({ type, className }: WireframeVisualProps) {
  const baseClass = "w-full h-full bg-white rounded-md border border-slate-100 flex flex-col p-2 gap-1 overflow-hidden";

  switch (type) {
    case 'hero':
      return (
        <div className={cn(baseClass, className)}>
          <div className="w-full h-1/2 bg-slate-100 rounded-sm mb-1"></div>
          <div className="w-3/4 h-2 bg-slate-200 rounded-full mx-auto mt-2"></div>
          <div className="w-1/2 h-2 bg-slate-100 rounded-full mx-auto"></div>
          <div className="flex justify-center gap-2 mt-2">
            <div className="w-8 h-3 bg-blue-100 rounded-sm"></div>
            <div className="w-8 h-3 bg-slate-100 rounded-sm"></div>
          </div>
        </div>
      );
    case 'features':
      return (
        <div className={cn(baseClass, className)}>
          <div className="w-1/2 h-2 bg-slate-200 rounded-full mx-auto mb-2"></div>
          <div className="grid grid-cols-2 gap-2 h-full">
             {[1,2,3,4].map(i => (
               <div key={i} className="bg-slate-50 rounded-sm p-1 flex flex-col items-center justify-center gap-1">
                 <div className="w-3 h-3 rounded-full bg-blue-100"></div>
                 <div className="w-8 h-1 bg-slate-200 rounded-full"></div>
                 <div className="w-6 h-1 bg-slate-100 rounded-full"></div>
               </div>
             ))}
          </div>
        </div>
      );
    case 'text':
      return (
        <div className={cn(baseClass, "justify-center px-4", className)}>
           <div className="w-full h-2 bg-slate-200 rounded-full mb-2"></div>
           <div className="w-full h-1 bg-slate-100 rounded-full"></div>
           <div className="w-5/6 h-1 bg-slate-100 rounded-full"></div>
           <div className="w-4/6 h-1 bg-slate-100 rounded-full"></div>
           <div className="w-full h-1 bg-slate-100 rounded-full mt-2"></div>
           <div className="w-3/4 h-1 bg-slate-100 rounded-full"></div>
        </div>
      );
    case 'gallery':
      return (
        <div className={cn(baseClass, className)}>
           <div className="w-1/3 h-2 bg-slate-200 rounded-full mb-2"></div>
           <div className="flex gap-2 overflow-hidden h-full">
              {[1,2,3].map(i => (
                <div key={i} className="flex-1 bg-slate-100 rounded-sm h-full relative">
                   <div className="absolute inset-0 m-auto w-4 h-4 rounded-full bg-slate-200/50"></div>
                </div>
              ))}
           </div>
        </div>
      );
    case 'form':
      return (
         <div className={cn(baseClass, "items-center justify-center", className)}>
            <div className="w-1/2 h-2 bg-slate-200 rounded-full mb-4"></div>
            <div className="w-3/4 h-6 bg-slate-50 border border-slate-100 rounded-sm mb-2"></div>
            <div className="w-3/4 h-6 bg-slate-50 border border-slate-100 rounded-sm mb-2"></div>
            <div className="w-1/4 h-6 bg-blue-500 rounded-sm mt-1"></div>
         </div>
      );
    case 'video':
      return (
        <div className={cn(baseClass, "items-center justify-center bg-slate-50", className)}>
           <div className="w-12 h-12 rounded-full border-2 border-slate-300 flex items-center justify-center">
             <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-slate-400 border-b-[6px] border-b-transparent ml-1"></div>
           </div>
        </div>
      );
    case 'footer':
      return (
        <div className={cn(baseClass, "justify-end bg-slate-50", className)}>
           <div className="flex justify-between items-end pb-2 px-2">
             <div className="flex flex-col gap-1">
               <div className="w-10 h-1 bg-slate-300 rounded-full"></div>
               <div className="w-8 h-1 bg-slate-200 rounded-full"></div>
             </div>
             <div className="flex gap-2">
                <div className="w-4 h-1 bg-slate-200 rounded-full"></div>
                <div className="w-4 h-1 bg-slate-200 rounded-full"></div>
                <div className="w-4 h-1 bg-slate-200 rounded-full"></div>
             </div>
           </div>
        </div>
      );
    case 'pricing':
       return (
         <div className={cn(baseClass, "flex-row gap-2 p-3 items-center", className)}>
            {[1,2,3].map(i => (
              <div key={i} className={cn("flex-1 h-full rounded-sm border border-slate-100 flex flex-col items-center pt-2 gap-1", i===2 ? "bg-blue-50 border-blue-100 scale-110 shadow-sm" : "bg-white")}>
                <div className="w-6 h-1 bg-slate-200 rounded-full"></div>
                <div className="w-4 h-3 bg-slate-100 rounded-sm my-1"></div>
                <div className="w-full border-t border-slate-50 mt-1"></div>
                <div className="w-5 h-1 bg-slate-100 rounded-full"></div>
                <div className="w-5 h-1 bg-slate-100 rounded-full"></div>
              </div>
            ))}
         </div>
       );
    default:
      return null;
  }
}
