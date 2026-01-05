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
  OnSelectionChangeParams
} from 'reactflow';
import { useAppStore } from '@/store/useAppStore';
import CustomBlockNode from './BlockNode';
import 'reactflow/dist/style.css';

const nodeTypes = {
  block: CustomBlockNode,
};

function MindMapContent() {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect,
    setSelectedNode
  } = useAppStore();

  const handleSelectionChange = useCallback(({ nodes }: OnSelectionChangeParams) => {
    if (nodes.length > 0) {
      setSelectedNode(nodes[0].id);
    } else {
      setSelectedNode(null);
    }
  }, [setSelectedNode]);

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
        <Controls showInteractive={false} className="!bg-white !shadow-lg !border-slate-100 !rounded-xl overflow-hidden" />
      </ReactFlow>
    </div>
  );
}

export default function MindMap() {
  return (
    <ReactFlowProvider>
      <MindMapContent />
    </ReactFlowProvider>
  );
}
