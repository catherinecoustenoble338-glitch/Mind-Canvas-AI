import React from 'react';
import { cn } from '@/lib/utils';
import { Line, Box, BlockVisualProps } from './utils';

// --- RED GROUP (Features, CTA, Cards) ---

export const FeaturesBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[80px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper>
        <div className="flex gap-2 h-full items-end w-full">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex-1 flex flex-col gap-1 items-center">
              <div className="w-2 h-2 border border-block-stroke rounded-full mb-1"></div>
              <Line w="w-full" h="h-px" />
              <Line w="w-2/3" h="h-px" />
            </div>
          ))}
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const CtaBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[70px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper>
        <div className="flex flex-col items-center justify-center w-full h-full gap-1">
          <Line w="w-1/2" h="h-1" />
          <div className="w-1/3 h-2 border border-block-stroke rounded-md mt-1"></div>
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const CtaImageBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[70px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper>
        <div className="flex justify-between items-center h-full w-full">
          <div className="flex flex-col justify-center flex-1 pr-2">
            <Line w="w-full" h="h-1" />
            <Line w="w-1/2" h="h-1" className="mt-1" />
          </div>
          <Box w="w-12" h="h-8" />
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const CardsBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[80px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper>
        <div className="flex gap-2 h-full w-full">
          <Box w="flex-1" h="h-full" />
          <Box w="flex-1" h="h-full" />
          <Box w="flex-1" h="h-full" />
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const SliderCardsBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[80px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper>
        <div className="grid grid-cols-2 gap-1 h-full w-full">
          <Box w="col-span-2" h="h-3" />
          <Box w="flex-1" h="h-full" />
          <Box w="flex-1" h="h-full" />
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const ButtonsLeftAlignedBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[50px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper className="mt-4">
        <div className="flex gap-2 w-full items-center">
          <div className="h-3 px-2 border border-block-stroke rounded-full flex items-center justify-center">
            <div className="w-2 h-1 bg-block-stroke/40 rounded-sm"></div>
          </div>
          <div className="h-3 px-2 border border-block-stroke rounded-full flex items-center justify-center">
            <div className="w-2 h-1 border border-block-stroke rounded-sm"></div>
          </div>
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const HeroArrowsBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[90px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper>
        <div className="flex justify-between items-center px-1 h-full w-full">
          <div className="text-[8px] text-block-stroke/60">{'<'}</div>
          <div className="text-center w-full px-2 flex flex-col items-center">
            <div className="w-3/4 h-8 border border-block-stroke rounded-md mt-1 flex items-center justify-center">
              <div className="w-4 h-4 border border-block-stroke/30 rounded-full"></div>
            </div>
            <div className="flex gap-1 justify-center mt-2">
              <div className="w-1.5 h-1.5 bg-block-stroke rounded-full"></div>
              <div className="w-1.5 h-1.5 border border-block-stroke rounded-full"></div>
            </div>
          </div>
          <div className="text-[8px] text-block-stroke/60">{'>'}</div>
        </div>
      </ContentWrapper>
    )}
  </div>
);
