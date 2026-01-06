import React, { memo } from 'react';
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath } from 'reactflow';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAppStore } from '@/store/useAppStore';
import { MoreHorizontal, Spline, Zap, Activity, Minus } from 'lucide-react';

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  animated // Destructure animated prop
}: EdgeProps) => {
  const { updateEdgeData } = useAppStore();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleStyleChange = (type: 'solid' | 'dashed') => {
    updateEdgeData(id, { 
      style: { 
        ...style, 
        strokeDasharray: type === 'dashed' ? '5,5' : undefined 
      } 
    });
  };

  const handleAnimationChange = (type: 'static' | 'dynamic') => {
    updateEdgeData(id, { 
       animated: type === 'dynamic',
    });
  };

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{
          ...style,
          ...(animated ? { animation: 'dashdraw 0.5s linear infinite', strokeDasharray: '5' } : {})
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <DropdownMenu>
            <DropdownMenuTrigger className="bg-white rounded-full p-1 shadow-sm border border-slate-200 hover:border-blue-400 opacity-0 hover:opacity-100 transition-opacity focus:opacity-100">
               <MoreHorizontal size={12} className="text-slate-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
               <div className="px-2 py-1.5 text-xs font-semibold text-slate-500">Edge Style</div>
               
               <DropdownMenuItem onClick={() => handleStyleChange('solid')} className="text-xs gap-2">
                 <Minus size={12} /> Solid
               </DropdownMenuItem>
               <DropdownMenuItem onClick={() => handleStyleChange('dashed')} className="text-xs gap-2">
                 <MoreHorizontal size={12} /> Dashed
               </DropdownMenuItem>
               
               <div className="h-[1px] bg-slate-100 my-1"></div>
               <div className="px-2 py-1.5 text-xs font-semibold text-slate-500">Animation</div>

               <DropdownMenuItem onClick={() => handleAnimationChange('static')} className="text-xs gap-2">
                 <Minus size={12} /> Static
               </DropdownMenuItem>
               <DropdownMenuItem onClick={() => handleAnimationChange('dynamic')} className="text-xs gap-2">
                 <Activity size={12} /> Dynamic
               </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default memo(CustomEdge);
