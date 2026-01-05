import React, { useState } from 'react';
import MindMap from '@/components/canvas/MindMap';
import { Sidebar } from '@/components/canvas/Sidebar';
import { ReactFlowProvider } from 'reactflow';
import { Button } from '@/components/ui/button';
import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function Board() {
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  return (
    <ReactFlowProvider>
      <div className="w-screen h-screen overflow-hidden flex bg-slate-50 relative">
        {/* Toggle Button */}
        <div className="absolute top-4 left-4 z-50">
            <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 bg-white shadow-sm border-slate-200 text-slate-600 hover:text-slate-900"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                {sidebarOpen ? <PanelLeftClose size={16} /> : <Menu size={16} />}
            </Button>
        </div>

        {/* Sidebar with visibility transition - Responsive adjustments */}
        <div 
            className={`h-full absolute md:relative transition-all duration-300 ease-in-out overflow-hidden border-r border-slate-200 bg-white shadow-xl z-40 ${
                sidebarOpen ? 'w-full md:w-[320px] opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-full'
            }`}
        >
            <div className="w-full md:w-[320px] h-full">
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
