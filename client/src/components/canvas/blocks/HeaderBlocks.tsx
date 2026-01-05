import React from 'react';
import { cn } from '@/lib/utils';
import { Line, Box, BlockVisualProps } from './utils';

// --- GREEN GROUP (Headers, Titles, Nav) ---

export const HeaderBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "min-h-[40px] py-1", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper className="mt-3">
        <div className="flex justify-end items-center h-full w-full">
          <div className="flex gap-1 items-center">
            <div className="w-1.5 h-1.5 rounded-full border border-block-stroke"></div>
            <div className="w-1.5 h-1.5 rounded-full border border-block-stroke"></div>
            <Line w="w-4" h="h-1" />
          </div>
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const TitleBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "min-h-[48px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper className="mt-4">
        <Line w="w-1/2" h="h-1" />
      </ContentWrapper>
    )}
  </div>
);

export const FeaturesGreenBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[60px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper className="mt-1">
        <div className="flex justify-between h-full w-full gap-2 items-center">
          <div className="flex-1 flex gap-1 items-center border-b border-block-stroke/20 pb-2">
            <div className="w-1.5 h-1.5 border border-block-stroke rounded-full"></div>
            <Line w="w-full" h="h-1" />
          </div>
          <div className="flex-1 flex gap-1 items-center border-b border-block-stroke/20 pb-2">
            <div className="w-1.5 h-1.5 border border-block-stroke rounded-full"></div>
            <Line w="w-full" h="h-1" />
          </div>
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const TableBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[70px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper>
        <div className="flex flex-col gap-1.5 w-full">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full border border-block-stroke"></div>
              <div className="w-full h-px border-t border-dashed border-block-stroke/40"></div>
              <div className="w-full h-px border-t border-dashed border-block-stroke/40"></div>
              <div className="w-full h-px border-t border-dashed border-block-stroke/40"></div>
            </div>
          ))}
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const BulletsBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[70px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper>
        <div className="flex flex-col gap-1.5 w-full pl-1">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-2 items-center">
              <div className="w-1 h-1 border border-block-stroke rounded-full"></div>
              <Line w="w-full" h="h-px" />
              <div className="w-2 h-px bg-block-stroke/30"></div>
            </div>
          ))}
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const MobileTopBarBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[40px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper className="mt-3">
        <div className="flex justify-between items-center h-full w-full">
          <div className="text-[8px] text-block-stroke">{'<'}</div>
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const NoLogoNavigationBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "min-h-[40px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper className="mt-4">
        <div className="flex justify-start gap-2 w-full pt-1">
          <Line w="w-8" h="h-1" />
          <Line w="w-8" h="h-1" />
          <Line w="w-8" h="h-1" />
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const ArticlesBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[70px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper>
        <div className="flex gap-1.5 h-full w-full">
          <div className="flex-1 flex flex-col gap-1">
            <Box w="w-full" h="h-full" />
            <Line w="w-full" h="h-0.5" />
            <Line w="w-2/3" h="h-0.5" />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <Box w="w-full" h="h-full" />
            <Line w="w-full" h="h-0.5" />
            <Line w="w-2/3" h="h-0.5" />
          </div>
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const ProfileBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[60px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper className="mt-4">
        <div className="flex items-center gap-3 w-full">
          <div className="w-8 h-8 rounded-full border border-block-stroke flex items-center justify-center">
            <div className="w-3 h-3 border-2 border-block-stroke/40 rounded-full mb-1"></div>
          </div>
          <div className="flex-1 border-b border-block-stroke/20 pb-1">
            <div className="flex gap-1 mt-1">
              <Line w="w-full" h="h-1" />
              <Line w="w-2/3" h="h-1" />
            </div>
          </div>
        </div>
      </ContentWrapper>
    )}
  </div>
);
