import React from 'react';
import { cn } from '@/lib/utils';
import { Line, Box, BlockVisualProps } from './utils';

// --- PURPLE GROUP (Dividers, Footer, Loading) ---

export const DividerBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "min-h-[32px] py-1", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper className="mt-3">
        <div className="w-full border-t border-dashed border-block-stroke/40 h-full flex items-center"></div>
      </ContentWrapper>
    )}
  </div>
);

export const FooterBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "min-h-[48px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper className="mt-4">
        <div className="flex justify-between items-end h-full w-full">
          <div className="flex flex-col">
            <div className="flex gap-1 items-center mb-1">
              <div className="w-1 h-1 rounded-full bg-block-stroke"></div>
              <div className="w-1 h-1 rounded-full border border-block-stroke"></div>
            </div>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <Line w="w-8" h="h-0.5" />
            <Line w="w-8" h="h-0.5" />
            <Line w="w-8" h="h-0.5" />
          </div>
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const LoadingBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[60px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper>
        <div className="flex flex-col justify-center items-center gap-2 w-full h-full">
          <div className="w-4 h-4 border border-block-stroke border-t-transparent rounded-full animate-spin"></div>
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const AudioBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[50px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper className="mt-3">
        <div className="flex justify-center items-center gap-0.5 h-full w-full">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="w-0.5 bg-block-stroke/40 rounded-full" style={{ height: Math.max(4, Math.random() * 20) + 'px' }}></div>
          ))}
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const PostThreadBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[70px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper>
        <div className="ml-1 pl-2 border-l border-l-block-stroke/30 mt-1 space-y-2 w-full">
          <div className="flex gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-block-stroke mt-1"></div>
            <div className="flex-1 space-y-1">
              <Line w="w-full" h="h-1" />
              <Line w="w-3/4" h="h-1" />
            </div>
          </div>
        </div>
      </ContentWrapper>
    )}
  </div>
);
