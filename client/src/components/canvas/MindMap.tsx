import React, { useCallback, useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  ReactFlowProvider,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  Panel,
  OnSelectionChangeParams,
  useReactFlow
} from 'reactflow';
import { useAppStore } from '@/store/useAppStore';
import CustomBlockNode from './BlockNode';
import { SettingsDialog } from './SettingsDialog';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Maximize, ZoomIn, ZoomOut, LayoutTemplate } from 'lucide-react';
import 'reactflow/dist/style.css';

const nodeTypes = {
  block: CustomBlockNode,
};

function CustomControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { layoutNodes } = useAppStore();

  return (
    <Panel position="bottom-left" className="flex flex-col gap-2 ml-4 mb-4 md:mb-4 mb-20">
      <div className="flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 md:h-8 md:w-8 rounded-none border-b border-slate-100 hover:bg-slate-50 text-slate-600"
          onClick={() => zoomIn()}
          title="Zoom In"
        >
          <Plus size={20} className="md:w-4 md:h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 md:h-8 md:w-8 rounded-none border-b border-slate-100 hover:bg-slate-50 text-slate-600"
          onClick={() => zoomOut()}
          title="Zoom Out"
        >
          <Minus size={20} className="md:w-4 md:h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 md:h-8 md:w-8 rounded-none hover:bg-slate-50 text-slate-600"
          onClick={() => fitView()}
          title="Fit View"
        >
          <Maximize size={18} className="md:w-3.5 md:h-3.5" />
        </Button>
      </div>
      
      <div className="flex gap-2">
         {/* Settings Button */}
         <div className="bg-white rounded-lg shadow-sm">
            <SettingsDialog />
         </div>

         {/* Layout Button */}
         <div className="bg-white rounded-lg shadow-sm">
             <Button 
               variant="ghost" 
               size="icon" 
               className="h-10 w-10 md:h-8 md:w-8 rounded bg-white border border-slate-200 shadow-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50"
               onClick={layoutNodes}
               title="Auto Align Pages"
             >
                <LayoutTemplate size={20} className="md:w-4 md:h-4" />
             </Button>
         </div>
      </div>
    </Panel>
  );
}

function MindMapContent() {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect,
    setSelectedNode,
    setSidebarOpen
  } = useAppStore();

  const handleSelectionChange = useCallback(({ nodes }: OnSelectionChangeParams) => {
    if (nodes.length > 0) {
      setSelectedNode(nodes[0].id);
    } else {
      setSelectedNode(null);
    }
  }, [setSelectedNode]);

  const onPaneClick = useCallback(() => {
     setSidebarOpen(false);
  }, [setSidebarOpen]);

  // Using a soft gray background color with dots for a technical drawing feel
  return (
    <div className="w-full h-full bg-slate-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onSelectionChange={handleSelectionChange}
        onPaneClick={onPaneClick}
        fitView
        className="bg-slate-50"
        minZoom={0.2}
        maxZoom={2}
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={24} 
          size={2} 
          color="hsl(215.4 16.3% 85%)" 
        />
        <CustomControls />
      </ReactFlow>
    </div>
  );
}

export default function MindMap() {
  return (
    <MindMapContent />
  );
}
