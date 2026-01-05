import React from 'react';
import { cn } from '@/lib/utils';
import { WireframeType } from '@/store/useAppStore';

// Common helper components for block internals
export const Line = ({ w, h = "h-1", bg = "bg-transparent border border-block-stroke", rounded = "rounded-full", className = "" }: any) => (
  <div className={`${w} ${h} ${bg} ${rounded} ${className}`}></div>
);

export const Box = ({ w, h, bg = "bg-transparent", border = "border border-block-stroke", rounded = "rounded-md", className = "" }: any) => (
  <div className={`${w} ${h} ${bg} ${border} ${rounded} ${className}`}></div>
);

export interface BlockVisualProps {
  type: WireframeType;
  className?: string;
  label?: string;
  baseClassName?: string;
  BlockLabel?: React.FC;
  ContentWrapper?: React.FC<{ children: React.ReactNode, className?: string }>;
}
