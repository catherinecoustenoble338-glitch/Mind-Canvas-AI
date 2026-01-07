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
import CustomBlockNode from './components/BlockNode';
import CustomEdge from './components/CustomEdge';
import { NavigationPopup } from '../navigation/components/NavigationPopup';
import { SettingsDialog } from './components/SettingsDialog';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Maximize, ZoomIn, ZoomOut, LayoutTemplate, FileText, Layers, Undo2, Redo2, Code } from 'lucide-react';
import 'reactflow/dist/style.css';
import { cn } from '@/lib/utils';

const nodeTypes = {
  block: CustomBlockNode,
};

const edgeTypes = {
  default: CustomEdge,
};

function CustomControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { layoutNodes, undo, redo, past, future, showDetails, toggleDetails } = useAppStore();

  return (
    <Panel position="bottom-right" className="flex flex-col gap-3 mr-4 mb-4 md:mb-4 mb-20 items-end">
      <div className="flex flex-col gap-3 items-end">
          {/* History Controls */}
          <div className="flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-12 w-12 md:h-9 md:w-9 rounded-none border-b border-slate-100 hover:bg-slate-50 text-slate-600 disabled:opacity-30"
              onClick={undo}
              disabled={past.length === 0}
              title="Undo"
            >
              <Undo2 size={24} className="md:w-4 md:h-4 md:hidden" />
              <Undo2 size={18} className="hidden md:block" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-12 w-12 md:h-9 md:w-9 rounded-none hover:bg-slate-50 text-slate-600 disabled:opacity-30"
              onClick={redo}
              disabled={future.length === 0}
              title="Redo"
            >
              <Redo2 size={24} className="md:w-4 md:h-4 md:hidden" />
              <Redo2 size={18} className="hidden md:block" />
            </Button>
          </div>

          {/* Zoom Controls - Larger touch targets on mobile */}
          <div className="flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-12 w-12 md:h-9 md:w-9 rounded-none border-b border-slate-100 hover:bg-slate-50 text-slate-600"
              onClick={() => zoomIn()}
              title="Zoom In"
            >
              <Plus size={24} className="md:w-4 md:h-4 md:hidden" />
              <Plus size={18} className="hidden md:block" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-12 w-12 md:h-9 md:w-9 rounded-none border-b border-slate-100 hover:bg-slate-50 text-slate-600"
              onClick={() => zoomOut()}
              title="Zoom Out"
            >
              <Minus size={24} className="md:w-4 md:h-4 md:hidden" />
              <Minus size={18} className="hidden md:block" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-12 w-12 md:h-9 md:w-9 rounded-none hover:bg-slate-50 text-slate-600"
              onClick={() => fitView()}
              title="Fit View"
            >
              <Maximize size={20} className="md:w-4 md:h-4 md:hidden" />
              <Maximize size={18} className="hidden md:block" />
            </Button>
          </div>
          
          {/* Bottom Bar Controls Group - Now vertical */}
          <div className="flex flex-col gap-3 items-center">
             {/* Layout Button */}
             <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                 <Button 
                   variant="ghost" 
                   size="icon" 
                   className="h-12 w-12 md:h-9 md:w-9 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                   onClick={layoutNodes}
                   title="Auto Align Pages"
                 >
                    <LayoutTemplate size={24} className="md:w-[18px] md:h-[18px] md:hidden" />
                    <LayoutTemplate size={18} className="hidden md:block" />
                 </Button>
             </div>

             {/* Details Toggle Button (Caps Lock Style) */}
             <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                 <Button 
                   variant="ghost" 
                   size="icon" 
                   className={cn(
                     "h-12 w-12 md:h-9 md:w-9 rounded-lg transition-all relative",
                     showDetails 
                       ? "bg-slate-100 text-slate-900 ring-2 ring-emerald-500/50" 
                       : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                   )}
                   onClick={toggleDetails}
                   title="Toggle Details View"
                 >
                    <FileText size={24} className="md:w-[18px] md:h-[18px] md:hidden" />
                    <FileText size={18} className="hidden md:block" />
                    
                    {/* Green Indicator */}
                    <span className={cn(
                      "absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 shadow-sm transition-all duration-300",
                      showDetails ? "opacity-100 scale-100" : "opacity-0 scale-0"
                    )} />
                 </Button>
             </div>

             {/* Dev Tools Button (Export/Save) */}
             <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                <SettingsDialog 
                    trigger={
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-12 w-12 md:h-9 md:w-9 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                            title="Developer Tools (Export/Save)"
                        >
                            <Code size={24} className="md:w-[18px] md:h-[18px] md:hidden" />
                            <Code size={18} className="hidden md:block" />
                        </Button>
                    }
                    initialTab="dev"
                />
             </div>

             {/* Settings Button */}
             <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                <SettingsDialog />
             </div>

             {/* Navigation Popup (Pop Pub) */}
             <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                <NavigationPopup />
             </div>
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
        edgeTypes={edgeTypes}
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
