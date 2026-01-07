import React, { memo } from 'react';
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath } from 'reactflow';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { useAppStore } from '@/store/useAppStore';
import { MoreHorizontal, Spline, Zap, Activity, Minus, Palette, BarChart2 } from 'lucide-react';

const COLORS = [
  { name: 'Slate', value: '#CACACA' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Amber', value: '#F59E0B' },
];

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
  animated 
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

  const handleStyleChange = (type: 'solid' | 'dashed' | 'barcode') => {
    let strokeDasharray;
    let strokeWidth = style.strokeWidth || 2;

    if (type === 'dashed') strokeDasharray = '5,5';
    else if (type === 'barcode') {
        strokeDasharray = '10,5'; // Thicker dashes resembling barcode
        strokeWidth = 4;
    } else {
        strokeDasharray = undefined;
        strokeWidth = 2;
    }

    updateEdgeData(id, { 
      style: { 
        ...style, 
        strokeWidth,
        strokeDasharray 
      } 
    });
  };

  const handleColorChange = (color: string) => {
    // Ensure we preserve the marker type, defaulting to arrowclosed if missing
    const currentMarker = typeof markerEnd === 'object' ? markerEnd : { type: 'arrowclosed' };
    
    updateEdgeData(id, { 
      style: { 
        ...style, 
        stroke: color
      },
      markerEnd: {
        ...currentMarker,
        type: currentMarker.type || 'arrowclosed', // Explicitly ensure type exists
        color: color
      } as any
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
          ...(animated ? { animation: 'dashdraw 0.5s linear infinite', strokeDasharray: style.strokeDasharray || '5' } : {})
        }}
      />
      {/* Hide controls for Primary edges as requested ("Without possibility to edit this arrow on canvas") */}
      {!data?.isPrimary && (
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
            <DropdownMenuTrigger className="bg-white rounded-full p-1.5 shadow-md border border-slate-200 hover:border-blue-400 opacity-0 hover:opacity-100 transition-opacity focus:opacity-100 text-slate-500 hover:text-slate-800">
               <MoreHorizontal size={14} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
               <DropdownMenuLabel className="text-xs text-slate-500 uppercase tracking-wider">Style</DropdownMenuLabel>
               
               <DropdownMenuItem onClick={() => handleStyleChange('solid')} className="text-xs gap-2 cursor-pointer">
                 <Minus size={14} /> Solid (Classic)
               </DropdownMenuItem>
               <DropdownMenuItem onClick={() => handleStyleChange('dashed')} className="text-xs gap-2 cursor-pointer">
                 <MoreHorizontal size={14} /> Dashed
               </DropdownMenuItem>
               <DropdownMenuItem onClick={() => handleStyleChange('barcode')} className="text-xs gap-2 cursor-pointer">
                 <BarChart2 size={14} className="rotate-90" /> Barcode
               </DropdownMenuItem>
               
               <DropdownMenuSeparator />
               <DropdownMenuLabel className="text-xs text-slate-500 uppercase tracking-wider">Color</DropdownMenuLabel>
               
               <div className="grid grid-cols-6 gap-1 p-2">
                  {COLORS.map(c => (
                      <button
                        key={c.name}
                        className="w-5 h-5 rounded-full border border-slate-100 hover:scale-110 transition-transform ring-1 ring-transparent hover:ring-slate-300"
                        style={{ backgroundColor: c.value }}
                        title={c.name}
                        onClick={() => handleColorChange(c.value)}
                      />
                  ))}
               </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </EdgeLabelRenderer>
      )}
    </>
  );
};

export default memo(CustomEdge);
