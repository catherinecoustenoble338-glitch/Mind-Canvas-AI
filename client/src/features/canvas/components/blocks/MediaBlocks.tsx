import React from 'react';
import { cn } from '@/lib/utils';
import { Line, Box, BlockVisualProps } from './utils';

// --- BLUE GROUP (Content, Media) ---

export const TextVideoBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[80px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper>
        <div className="flex gap-2 items-center flex-1 w-full h-full">
          <div className="flex-1 space-y-1.5">
            <Line w="w-full" h="h-1" />
            <Line w="w-full" h="h-1" />
            <Line w="w-3/4" h="h-1" />
          </div>
          <div className="w-10 h-8 bg-transparent rounded-md flex items-center justify-center border border-block-stroke">
            <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[5px] border-l-block-stroke border-b-[3px] border-b-transparent ml-0.5"></div>
          </div>
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const TextBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[64px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper>
        <div className="space-y-1.5 w-full">
          <Line w="w-full" h="h-1" />
          <Line w="w-full" h="h-1" />
          <Line w="w-2/3" h="h-1" />
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const TwoColImagesBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[70px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper>
        <div className="flex gap-2 h-full w-full">
          <Box w="flex-1" h="h-full" />
          <Box w="flex-1" h="h-full" />
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const TwoColImagesTextBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[80px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper>
        <div className="flex gap-2 h-full w-full">
          <div className="flex-1 rounded-md p-1 flex flex-col justify-end border border-block-stroke h-full">
            <Line w="w-full" h="h-1" />
            <Line w="w-2/3" h="h-1" className="mt-1" />
          </div>
          <div className="flex-1 rounded-md p-1 flex flex-col justify-end border border-block-stroke h-full">
            <Line w="w-full" h="h-1" />
            <Line w="w-2/3" h="h-1" className="mt-1" />
          </div>
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const ImagesBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[70px]", className)}>
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

export const MapBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[80px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper>
        <div className="flex-1 w-full relative rounded-md overflow-hidden border border-block-stroke h-full bg-block-stroke/20">
          <div className="absolute inset-0 flex flex-col gap-2 p-1 opacity-40">
            <div className="w-full h-1 bg-block-stroke/30 rotate-12 transform origin-top-left"></div>
            <div className="w-full h-1 bg-block-stroke/30 -rotate-6 transform origin-bottom-right mt-4"></div>
            <div className="absolute top-0 right-1/3 h-full w-1 bg-block-stroke/30"></div>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-3 h-3 bg-slate-300 rounded-full border-2 border-slate-600 z-10 relative"></div>
              <div className="w-0.5 h-2 bg-slate-600 absolute top-2 left-1/2 transform -translate-x-1/2"></div>
            </div>
          </div>
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const LeftTextOnImageBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[80px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper>
        <div className="flex-1 w-full rounded-md flex items-center px-2 border border-block-stroke relative overflow-hidden h-full">
          <div className="absolute inset-0 bg-block-stroke/5 z-0"></div>
          <div className="space-y-1 w-1/2 z-10">
            <Line w="w-full" h="h-1" />
            <Line w="w-2/3" h="h-1" />
          </div>
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const VanillaImgPlaceholderBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[80px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper>
        <div className="flex flex-col items-center justify-center gap-2 w-full h-full flex-1">
          <div className="w-8 h-6 border border-block-stroke rounded-md relative overflow-hidden">
            <div className="absolute bottom-0 w-full h-2 bg-block-stroke/20 transform -rotate-6 scale-110"></div>
            <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-block-stroke/40"></div>
          </div>
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const SliderBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[50px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper className="mt-4">
        <div className="flex justify-between items-center w-full h-full">
          <div className="text-[8px] text-block-stroke px-1">{'<'}</div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex gap-1 justify-center">
              <div className="w-1 h-1 bg-block-stroke rounded-full"></div>
              <div className="w-1 h-1 border border-block-stroke rounded-full"></div>
              <div className="w-1 h-1 border border-block-stroke rounded-full"></div>
            </div>
          </div>
          <div className="text-[8px] text-block-stroke px-1">{'>'}</div>
        </div>
      </ContentWrapper>
    )}
  </div>
);

export const Slider2ColumnBlock = ({ baseClassName, BlockLabel, ContentWrapper, className }: BlockVisualProps) => (
  <div className={cn(baseClassName, "h-[70px]", className)}>
    {BlockLabel && <BlockLabel />}
    {ContentWrapper && (
      <ContentWrapper>
        <div className="flex gap-2 h-full w-full">
          <div className="flex-1 rounded-md border border-block-stroke flex items-center pl-1">
            <div className="text-[8px] text-block-stroke">{'<'}</div>
          </div>
          <div className="flex-1 rounded-md border border-block-stroke flex items-center justify-end pr-1">
            <div className="text-[8px] text-block-stroke">{'>'}</div>
          </div>
        </div>
      </ContentWrapper>
    )}
  </div>
);
