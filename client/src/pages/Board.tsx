import React from 'react';
import MindMap from '@/components/canvas/MindMap';
import { Sidebar } from '@/components/canvas/Sidebar';
import { ReactFlowProvider } from 'reactflow';

export default function Board() {
  return (
    <ReactFlowProvider>
      <div className="w-screen h-screen overflow-hidden flex bg-slate-50">
        <Sidebar />
        <div className="flex-1 h-full relative">
          <MindMap />
        </div>
      </div>
    </ReactFlowProvider>
  );
}
