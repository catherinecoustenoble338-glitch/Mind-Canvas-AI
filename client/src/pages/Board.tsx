import React, { useState } from 'react';
import MindMap from '@/features/canvas/MindMap';
import { Sidebar } from '@/features/canvas/components/Sidebar';
import { ReactFlowProvider } from 'reactflow';
import { Button } from '@/components/ui/button';
import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function Board() {
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  return (
    <ReactFlowProvider>
      <div className="w-screen h-screen overflow-hidden flex bg-slate-50 relative">
        {/* Mobile Backdrop */}
        <div 
            className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300 ${
                sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar with Drawer behavior on mobile, Push behavior on desktop */}
        <div 
            className={`
                h-full bg-white shadow-xl z-40 border-r border-slate-200
                /* Mobile: Absolute drawer */
                absolute top-0 left-0 transition-transform duration-300 ease-in-out
                w-[85vw] max-w-[320px]
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                
                /* Desktop: Relative collapsible */
                md:relative md:transform-none md:transition-all
                ${sidebarOpen ? 'md:w-[320px] md:opacity-100' : 'md:w-0 md:opacity-0 md:overflow-hidden'}
            `}
        >
            <div className="w-full h-full min-w-[320px]">
                <Sidebar />
            </div>
        </div>

        <div className="flex-1 h-full relative">
          <MindMap />
        </div>
      </div>
    </ReactFlowProvider>
  );
}
