import React from 'react';
import { cn } from '@/lib/utils';
import { WireframeType } from '@/store/useAppStore';

interface LineProps {
  w: string;
  h?: string;
  bg?: string;
  rounded?: string;
  className?: string;
}

interface BoxProps {
  w: string;
  h: string;
  bg?: string;
  border?: string;
  rounded?: string;
  className?: string;
}

// Common helper components for block internals
export const Line = ({ w, h = "h-1", bg = "bg-block-stroke", rounded = "rounded-full", className = "" }: LineProps) => (
  <div className={`${w} ${h} ${bg} ${rounded} ${className}`}></div>
);

export const Box = ({ w, h, bg = "bg-block-stroke/30", border = "", rounded = "rounded-md", className = "" }: BoxProps) => (
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
