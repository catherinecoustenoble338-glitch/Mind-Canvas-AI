import { Node, Edge } from 'reactflow';
import dagre from 'dagre';

// Helper for Auto Layout using Dagre
export const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB', showDetails = false) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Standard width
  const nodeWidth = showDetails ? 440 : 240; 

  // SIGNIFICANTLY Increased separation to prevent overlapping and ensure consistent gaps
  // ranksep: Vertical distance between levels
  // nodesep: Horizontal distance between nodes
  dagreGraph.setGraph({ 
      rankdir: direction, 
      ranksep: 150, // Standardized spacing for both modes to fix layout inconsistency
      nodesep: showDetails ? 100 : 80 // Slightly increased horizontal separation for classic mode
  });

  nodes.forEach((node) => {
    // Dynamic height calculation is critical for correct spacing
    // We must estimate the height VERY accurately or slightly overestimate
    // Header ~60px + Padding ~20px + Footer ~20px = ~100px base
    // Block Item: ~40px (Visual) or ~100px (Details)
    
    const blocksCount = node.data.blocks?.length || 0;
    const blockHeight = showDetails ? 120 : 60; // Increased estimate for classic mode
    const baseHeight = 120; // Header + Container padding
    
    const estimatedHeight = baseHeight + (blocksCount * blockHeight);
    
    dagreGraph.setNode(node.id, { width: nodeWidth, height: estimatedHeight });
  });

  // Filter edges for layout hierarchy - only use "Primary" edges (tree structure)
  const primaryEdges = edges.filter(e => e.data?.isPrimary);
  const edgesToLayout = primaryEdges.length > 0 ? primaryEdges : edges;

  edgesToLayout.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target, { weight: 10 });
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeWithPosition.height / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};
