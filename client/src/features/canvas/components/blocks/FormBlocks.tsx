import React from 'react';
import { cn } from '@/lib/utils';
import { Line, Box, BlockVisualProps } from './utils';

// --- ORANGE GROUP (Forms) ---

export const FormBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[70px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper>
        <div className="flex gap-2 mt-2 w-full">
          <div className="flex-1 border border-block-stroke rounded-md h-4"></div>
          <div className="flex-1 border border-block-stroke rounded-md h-4"></div>
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const SignInBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[50px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper className="mt-3">
        <div className="flex items-center justify-end gap-2 w-full border border-block-stroke/30 p-1 rounded-md">
          <div className="flex gap-1">
            <Box w="w-4" h="h-2" />
            <div className="w-4 h-2 bg-block-stroke/20 rounded-sm"></div>
          </div>
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const TextSidebarFormBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[70px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper>
        <div className="flex gap-2 h-full w-full">
          <div className="flex-1 flex flex-col justify-center">
            <Line w="w-full" h="h-1" className="mt-1" />
            <Line w="w-full" h="h-1" className="mt-1" />
            <div className="w-full h-2 border border-block-stroke rounded-md mt-1"></div>
          </div>
          <div className="w-8 h-full border border-block-stroke rounded-md flex flex-col items-center pt-1 gap-1">
            <div className="w-4 h-2 bg-block-stroke/10 rounded-sm"></div>
          </div>
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const RadioButtonsBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "min-h-[40px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper className="mt-3">
        <div className="flex gap-4 items-center w-full">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full border border-block-stroke flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-block-stroke rounded-full"></div>
            </div>
            <Line w="w-4" h="h-px" />
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full border border-block-stroke"></div>
            <Line w="w-4" h="h-px" />
          </div>
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const TextFormBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[70px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper>
        <div className="flex flex-col gap-2 w-full">
          <Line w="w-full" h="h-1" />
          <div className="flex gap-2">
            <Box w="flex-1" h="h-4" />
            <div className="w-8 h-4 bg-block-stroke/20 rounded-md border border-block-stroke/30"></div>
          </div>
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const TogglesBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "min-h-[40px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper className="mt-3">
        <div className="flex justify-end items-center px-1 w-full border-b border-block-stroke/10 pb-1">
          <div className="w-5 h-3 border border-block-stroke rounded-full relative">
            <div className="absolute right-0 top-0 w-3 h-3 bg-block-stroke rounded-full shadow-sm border border-block-stroke transform -translate-y-px translate-x-px"></div>
          </div>
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const HamburgerBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "min-h-[40px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper className="mt-4">
        <div className="w-full pt-1">
          <div className="flex justify-start items-center gap-2 w-full">
            <div className="space-y-0.5">
              <Line w="w-3" h="h-0.5" />
              <Line w="w-3" h="h-0.5" />
              <Line w="w-3" h="h-0.5" />
            </div>
            <Line w="w-full" h="h-1" />
          </div>
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const UploadButtonBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "min-h-[40px] justify-center items-center", className)}>
    {ContentWrapper && (
      <ContentWrapper className="mt-0">
        <div className="flex justify-center items-center gap-2 w-full border border-dashed border-block-stroke rounded-md p-1">
          <div className="w-4 h-4 rounded-full border border-block-stroke/40 flex items-center justify-center">
            <div className="w-2 h-2 border-t border-l border-block-stroke/60 transform rotate-45 mt-0.5"></div>
          </div>
          <span className="text-[8px] text-block-stroke font-medium">Upload</span>
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const NextBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "min-h-[32px] justify-center", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper className="mt-3">
        <div className="flex justify-end items-center px-2 w-full bg-block-stroke/10 rounded-md h-4">
          <div className="text-[8px] text-block-stroke">→</div>
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const TableRowBlock = ({ baseClassName, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "min-h-[32px]", className)}>
    {ContentWrapper && (
      <ContentWrapper className="mt-0">
        <div className="flex items-center gap-2 px-1 w-full border-b border-block-stroke/20 pb-1 h-full">
          <div className="w-1.5 h-1.5 rounded-full border border-block-stroke"></div>
          <div className="flex-1 flex gap-2">
            <Line w="w-1/3" h="h-1" />
            <Line w="w-1/3" h="h-1" />
            <Line w="w-1/3" h="h-1" />
          </div>
        </div>
      </ContentWrapper>
    )}
  </div>
);
