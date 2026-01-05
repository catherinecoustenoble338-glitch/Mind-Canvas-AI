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
    <Panel position="bottom-left" className="flex flex-col gap-2 ml-4 mb-4">
      <div className="flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-none border-b border-slate-100 hover:bg-slate-50 text-slate-600"
          onClick={() => zoomIn()}
          title="Zoom In"
        >
          <Plus size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-none border-b border-slate-100 hover:bg-slate-50 text-slate-600"
          onClick={() => zoomOut()}
          title="Zoom Out"
        >
          <Minus size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-none hover:bg-slate-50 text-slate-600"
          onClick={() => fitView()}
          title="Fit View"
        >
          <Maximize size={14} />
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
               className="h-8 w-8 rounded bg-white border border-slate-200 shadow-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50"
               onClick={layoutNodes}
               title="Auto Align Pages"
             >
                <LayoutTemplate size={16} />
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

  // Using the requested gray background color #818181
  return (
    <div className="w-full h-full bg-[#818181]">
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
        className="bg-[#818181]"
        minZoom={0.2}
        maxZoom={2}
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={24} 
          size={2} 
          color="#9ca3af" // slate-400 slightly lighter than bg for visibility
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
